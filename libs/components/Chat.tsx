import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, IconButton, CircularProgress } from '@mui/material';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useSubscription, useMutation, useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { SUBSCRIBE_CHAT_MESSAGES } from '../../apollo/user/subscription';
import { SEND_CHAT_MESSAGE, GET_CHAT_MESSAGES } from '../../apollo/user/mutation';
import { sweetErrorHandling } from '../../libs/sweetAlert';

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<any[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const textInput = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Support chat receiver ID (can be a system/admin user ID)
	const SUPPORT_RECEIVER_ID = 'support'; // Update this based on your backend support user ID

	/** APOLLO REQUESTS **/
	// Subscribe to real-time chat messages
	const { data: subscriptionData, error: subscriptionError } = useSubscription(SUBSCRIBE_CHAT_MESSAGES, {
		skip: !user?._id || !open, // Only subscribe when user is logged in and chat is open
		onError: (error) => {
			console.error('Chat subscription error:', error);
			setIsConnected(false);
		},
		onData: ({ data }) => {
			if (data?.data?.subscribeChatMessages) {
				setIsConnected(true);
			}
		},
	});

	// Load initial chat messages
	const { data: messagesData, loading: messagesLoading, refetch: refetchMessages } = useQuery(GET_CHAT_MESSAGES, {
		skip: !user?._id || !open,
		variables: {
			input: {
				receiverId: SUPPORT_RECEIVER_ID,
				page: 1,
				limit: 50,
			},
		},
		fetchPolicy: 'network-only',
	});

	// Send message mutation
	const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_CHAT_MESSAGE, {
		onError: async (error) => {
			await sweetErrorHandling(error);
		},
	});

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => {
			if (!prevState) {
				setUnreadCount(0); // Reset unread count when opening
				// Refetch messages when opening chat
				if (user?._id) {
					refetchMessages();
				}
			}
			return !prevState;
		});
	};

	const getInputMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		setMessage(text);
	};

	const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onClickHandler();
		}
	};

	const onClickHandler = async () => {
		const trimmedMessage = message.trim();
		if (!trimmedMessage || !user?._id || sendingMessage) return;

		// Optimistically add user message to UI
		const optimisticMessage = {
			_id: `temp-${Date.now()}`,
			text: trimmedMessage,
			isMe: true,
			timestamp: new Date(),
			senderData: {
				_id: user._id,
				memberNick: user.memberNick,
				memberFullName: user.memberFullName,
				memberImage: user.memberImage,
			},
		};
		setMessagesList((prev) => [...prev, optimisticMessage]);
		setMessage('');

		// Clear input field
		if (textInput.current) {
			textInput.current.value = '';
			textInput.current.focus();
		}

		try {
			// Send message to backend
			await sendMessage({
				variables: {
					input: {
						messageContent: trimmedMessage,
						receiverId: SUPPORT_RECEIVER_ID,
					},
				},
			});

			// Refetch messages to get the server response
			await refetchMessages();
		} catch (err: any) {
			// Remove optimistic message on error
			setMessagesList((prev) => prev.filter((msg) => msg._id !== optimisticMessage._id));
			await sweetErrorHandling(err);
		}
	};

	/** LIFECYCLES **/
	// Update messages list when subscription receives new data
	useEffect(() => {
		if (subscriptionData?.subscribeChatMessages) {
			const newMessage = subscriptionData.subscribeChatMessages;
			// Check if message is for current user
			if (newMessage.receiverId === user?._id || newMessage.senderId === user?._id) {
				const formattedMessage = {
					_id: newMessage._id,
					text: newMessage.messageContent,
					isMe: newMessage.senderId === user?._id,
					timestamp: new Date(newMessage.createdAt),
					senderData: newMessage.senderData,
				};

				// Check if message already exists to avoid duplicates
				setMessagesList((prev) => {
					const exists = prev.some((msg) => msg._id === formattedMessage._id);
					if (exists) return prev;
					return [...prev, formattedMessage];
				});

				// Update unread count if chat is closed
				if (!open && !formattedMessage.isMe) {
					setUnreadCount((prev) => prev + 1);
				}
			}
		}
	}, [subscriptionData, user?._id, open]);

	// Load initial messages from query
	useEffect(() => {
		if (messagesData?.getChatMessages?.list) {
			const formattedMessages = messagesData.getChatMessages.list.map((msg: any) => ({
				_id: msg._id,
				text: msg.messageContent,
				isMe: msg.senderId === user?._id,
				timestamp: new Date(msg.createdAt),
				senderData: msg.senderData,
			}));
			setMessagesList(formattedMessages);
		}
	}, [messagesData, user?._id]);

	// Monitor subscription connection status
	useEffect(() => {
		if (subscriptionError) {
			setIsConnected(false);
		} else if (subscriptionData) {
			setIsConnected(true);
		}
	}, [subscriptionError, subscriptionData]);

	// Don't render chat if user is not logged in
	if (!user?._id) {
		return null;
	}

	return (
		<Stack className="chatting">
			{/* Chat Button - Bottom Right */}
			<button className="chat-button" onClick={handleOpenChat}>
				<Badge badgeContent={unreadCount > 0 ? unreadCount : 0} color="error" max={99}>
					<DirectionsCarIcon sx={{ fontSize: '28px', color: unreadCount > 0 ? '#FF6B00' : '#181a20' }} />
				</Badge>
			</button>

			{/* Chat Frame */}
			<Stack className={`chat-frame ${open ? 'open' : ''}`} ref={chatContentRef}>
				{/* Header with Orange Gradient */}
				<Box className={'chat-top'} component={'div'}>
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<DirectionsCarIcon sx={{ color: '#fff', fontSize: '24px' }} />
						<Box component="span" sx={{ fontFamily: 'Poppins', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
							TurboCar Yordam
						</Box>
					</Stack>
					<IconButton
						onClick={() => setOpen(false)}
						sx={{
							color: '#fff',
							padding: '4px',
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
							},
						}}
					>
						<CloseIcon sx={{ fontSize: '20px' }} />
					</IconButton>
				</Box>

				{/* Chat Content */}
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							{/* Connection Status Indicator */}
							{!isConnected && open && (
								<Box sx={{ textAlign: 'center', p: 1, fontSize: '12px', color: '#999' }}>
									Connecting to support...
								</Box>
							)}

							{/* Loading Indicator */}
							{messagesLoading && (
								<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
									<CircularProgress size={24} />
								</Box>
							)}

							{/* Welcome Message - Only show if no messages and not loading */}
							{!messagesLoading && messagesList.length === 0 && (
								<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '16px 0px' }} component={'div'}>
									<Avatar
										sx={{
											width: 32,
											height: 32,
											bgcolor: '#FF6B00',
											marginRight: '8px',
										}}
									>
										<DirectionsCarIcon sx={{ fontSize: '18px', color: '#fff' }} />
									</Avatar>
									<div className={'msg-left'}>
										Welcome to TurboCar! How can we help you find your perfect car?
									</div>
								</Box>
							)}

							{/* Messages */}
							{messagesList.map((msg: any) => (
								<Box
									key={msg._id || `msg-${Date.now()}-${Math.random()}`}
									flexDirection={'row'}
									style={{ display: 'flex' }}
									alignItems={msg.isMe ? 'flex-end' : 'flex-start'}
									justifyContent={msg.isMe ? 'flex-end' : 'flex-start'}
									sx={{ m: '10px 0px' }}
									component={'div'}
								>
									{!msg.isMe && (
										<Avatar
											sx={{
												width: 32,
												height: 32,
												bgcolor: '#FF6B00',
												marginRight: '8px',
											}}
											src={msg.senderData?.memberImage}
										>
											{!msg.senderData?.memberImage && (
												<DirectionsCarIcon sx={{ fontSize: '18px', color: '#fff' }} />
											)}
										</Avatar>
									)}
									<div className={msg.isMe ? 'msg-right' : 'msg-left'}>{msg.text}</div>
								</Box>
							))}
						</Stack>
					</ScrollableFeed>
				</Box>

				{/* Input Section */}
				<Box className={'chat-bott'} component={'div'}>
					<input
						ref={textInput}
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={sendingMessage ? 'Sending...' : 'Type message...'}
						value={message}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
						disabled={sendingMessage || !isConnected}
					/>
					<button
						className={'send-msg-btn'}
						onClick={onClickHandler}
						disabled={sendingMessage || !message.trim() || !isConnected}
					>
						{sendingMessage ? (
							<CircularProgress size={20} sx={{ color: '#fff' }} />
						) : (
							<DirectionsCarIcon sx={{ fontSize: '20px', color: '#fff' }} />
						)}
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;