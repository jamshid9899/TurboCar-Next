import React, { useCallback, useState, useEffect } from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack, Modal, Fade, Backdrop, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { signUp } from '../../auth';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useMutation } from '@apollo/client';
import { SUBSCRIBE_NEWSLETTER } from '../../../apollo/user/mutation';

interface SignupModalProps {
	open: boolean;
	onClose: () => void;
	action?: string; // For newsletter subscription
}

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose, action }) => {
	const router = useRouter();
	const [signupInput, setSignupInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [subscribeNewsletter] = useMutation(SUBSCRIBE_NEWSLETTER);

	// Debug: Check if modal is receiving open prop
	useEffect(() => {
		if (open) {
			console.log('SignupModal opened', { action });
		}
	}, [open, action]);

	/** HANDLERS **/
	const closeSignupModal = useCallback(() => {
		onClose();
		// Restore body scroll
		document.body.style.overflow = 'unset';
		// Reset signup input
		setSignupInput({ nick: '', password: '', phone: '', type: 'USER' });
	}, [onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [open]);

	const handleSignupInput = useCallback((name: any, value: any) => {
		setSignupInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doSignUp = useCallback(async () => {
		console.warn(signupInput);
		try {
			await signUp(signupInput.nick, signupInput.password, signupInput.phone, signupInput.type);
			
			// Check if user has pending newsletter subscription
			const pendingEmail = localStorage.getItem('pendingNewsletterEmail');
			if (pendingEmail && action === 'subscribe') {
				try {
					await subscribeNewsletter({
						variables: {
							input: pendingEmail,
						},
					});
					await sweetTopSmallSuccessAlert('Successfully subscribed to newsletter!', 2000);
					localStorage.removeItem('pendingNewsletterEmail');
				} catch (err) {
					console.error('Error subscribing to newsletter:', err);
				}
			}
			
			// Close modal and redirect
			closeSignupModal();
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [signupInput, action, router, subscribeNewsletter, closeSignupModal]);

	return (
		<Modal
			open={open}
			onClose={closeSignupModal}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 300,
				onClick: closeSignupModal, // Close on backdrop click
			}}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1300, // MUI default modal z-index
				'& .MuiBackdrop-root': {
					backgroundColor: 'rgba(0, 0, 0, 0.6)',
					backdropFilter: 'blur(4px)',
					WebkitBackdropFilter: 'blur(4px)',
				},
			}}
		>
			<Fade 
				in={open} 
				timeout={300}
				style={{
					transform: 'none', // No transform, stay in place
				}}
			>
				<Box 
					className={'signup-modal'}
					onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside modal
					sx={{
						transform: 'none !important', // Prevent any transform animations
					}}
				>
					{/* Close Button */}
					<IconButton
						className={'close-button'}
						onClick={closeSignupModal}
						sx={{
							position: 'absolute',
							top: 16,
							right: 16,
							color: '#666',
							zIndex: 10,
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.05)',
								color: '#181a20',
							},
						}}
					>
						<CloseIcon />
					</IconButton>

					{/* Signup Form */}
					<Stack className={'signup-form'}>
						{/* Logo */}
						<Box className={'logo'}>
							<img src="/img/logo/favicon.svg" alt="TurboCar" />
							<span>TurboCar</span>
							<span className={'speed-badge'}>⚡ Speed</span>
						</Box>

						{/* Title */}
						<Box className={'info'}>
							<span className={'signup-title'}>Start Your Engine</span>
							<p>
								{action === 'subscribe' 
									? 'Sign up to subscribe to our newsletter and get the latest car deals'
									: 'Join thousands of car lovers and drivers'
								}
							</p>
						</Box>

						{/* Input Fields */}
						<Box className={'input-wrap'}>
							<div className={'input-box'}>
								<span>Nickname</span>
								<input
									type="text"
									placeholder={'Enter Nickname'}
									value={signupInput.nick}
									onChange={(e) => handleSignupInput('nick', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
								/>
							</div>
							<div className={'input-box'}>
								<span>Password</span>
								<input
									type="password"
									placeholder={'Enter Password'}
									value={signupInput.password}
									onChange={(e) => handleSignupInput('password', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
								/>
							</div>
							<div className={'input-box'}>
								<span>Phone</span>
								<input
									type="text"
									placeholder={'Enter Phone'}
									value={signupInput.phone}
									onChange={(e) => handleSignupInput('phone', e.target.value)}
									required={true}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
								/>
							</div>
						</Box>

						{/* User Type Selection */}
						<Box className={'register'}>
							<div className={'type-option'}>
								<span className={'text'}>I want to be registered as:</span>
								<div>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name={'USER'}
													onChange={(e) => {
														const checked = e.target.checked;
														if (checked) {
															handleSignupInput('type', 'USER');
														} else {
															handleSignupInput('type', 'USER');
														}
													}}
													checked={signupInput?.type == 'USER'}
												/>
											}
											label="User"
										/>
									</FormGroup>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name={'AGENT'}
													onChange={(e) => {
														const checked = e.target.checked;
														if (checked) {
															handleSignupInput('type', 'AGENT');
														} else {
															handleSignupInput('type', 'USER');
														}
													}}
													checked={signupInput?.type == 'AGENT'}
												/>
											}
											label="Agent"
										/>
									</FormGroup>
								</div>
							</div>

							{/* Signup Button */}
							<Button
								variant="contained"
								disabled={signupInput.nick == '' || signupInput.password == '' || signupInput.phone == '' || signupInput.type == ''}
								onClick={doSignUp}
								endIcon={<img src="/img/icons/rightup.svg" alt="" />}
							>
								SIGNUP
							</Button>
						</Box>

						{/* Login Link */}
						<Box className={'ask-info'}>
							<p>
								Have account?
								<b 
									onClick={() => {
										closeSignupModal();
										router.push('/account/join');
									}}
									style={{ cursor: 'pointer' }}
								> LOGIN</b>
							</p>
						</Box>
					</Stack>
				</Box>
			</Fade>
		</Modal>
	);
};

export default SignupModal;

