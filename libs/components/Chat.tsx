import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<any[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const textInput = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState<string>('');
	const [open, setOpen] = useState(false);
	const router = useRouter();

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => {
			if (!prevState) {
				setUnreadCount(0); // Reset unread count when opening
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

	const onClickHandler = () => {
		const trimmedMessage = message.trim();
		if (trimmedMessage) {
			// Add user message to messages list
			const newMessage = {
				text: trimmedMessage,
				isMe: true,
				timestamp: new Date(),
			};
			setMessagesList((prev) => [...prev, newMessage]);
			setMessage('');
			
			// Clear input field
			if (textInput.current) {
				textInput.current.value = '';
				textInput.current.focus(); // Keep focus on input
			}
			
			// TODO: Send to backend via WebSocket/API
			// Backend integration needed:
			// 1. Check if backend has chat API endpoint
			// 2. Use WebSocket (process.env.REACT_APP_API_WS) or GraphQL mutation
			// 3. Listen for incoming messages from backend
			
			// For now, simulate auto-reply after 1 second
			setTimeout(() => {
				const autoReply = {
					text: 'Thank you for your message! Our support team will get back to you shortly.',
					isMe: false,
					timestamp: new Date(),
				};
				setMessagesList((prev) => [...prev, autoReply]);
			}, 1000);
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// Chat button always visible when user is logged in
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

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
							{/* Welcome Message - Only show if no messages */}
							{messagesList.length === 0 && (
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
							{messagesList.map((msg: any, index: number) => (
								<Box
									key={index}
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
										>
											<DirectionsCarIcon sx={{ fontSize: '18px', color: '#fff' }} />
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
						placeholder={'Type message...'}
						value={message}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<DirectionsCarIcon sx={{ fontSize: '20px', color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;