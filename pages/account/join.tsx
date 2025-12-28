import React, { useCallback, useState, useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack, Radio, RadioGroup } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import { SUBSCRIBE_NEWSLETTER } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/store';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** APOLLO REQUESTS **/
	const [subscribeNewsletter] = useMutation(SUBSCRIBE_NEWSLETTER);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const value = e.target.value;
		handleInput('type', value);
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			
			// Check if user has pending newsletter subscription
			const pendingEmail = localStorage.getItem('pendingNewsletterEmail');
			if (pendingEmail && router.query.action === 'subscribe') {
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
			
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router.query.action, router.query.referrer, subscribeNewsletter]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			
			// Check if user has pending newsletter subscription
			const pendingEmail = localStorage.getItem('pendingNewsletterEmail');
			if (pendingEmail && router.query.action === 'subscribe') {
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
			
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router.query.action, router.query.referrer, subscribeNewsletter]);

	console.log('+input: ', input);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
					<Stack className={'left'}>
						<div className={'info'}>
							{loginView ? (
								<>
									<span className={'welcome-title'}>Welcome back, Driver 👋</span>
									<p>
										{router.query.action === 'subscribe' 
											? 'Login to subscribe to our newsletter and get the latest car deals'
											: 'Get back on the road in seconds'
										}
									</p>
								</>
							) : (
								<>
									<span className={'signup-title'}>Start Your Engine</span>
									<p>
										{router.query.action === 'subscribe' 
											? 'Sign up to subscribe to our newsletter and get the latest car deals'
											: 'Join thousands of car lovers and drivers'
										}
									</p>
								</>
							)}
						</div>
						<div className={'input-wrap'}>
								<div className={'input-box'}>
									<span>Nickname</span>
									<input
										type="text"
										placeholder={'Enter Nickname'}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								<div className={'input-box'}>
									<span>Password</span>
									<input
										type="text"
										placeholder={'Enter Password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>
								{!loginView && (
									<div className={'input-box'}>
										<span>Phone</span>
										<input
											type="text"
											placeholder={'Enter Phone'}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
										/>
									</div>
								)}
							</div>
							<div className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>I want to be registered as:</span>
										<div>
											<RadioGroup
												value={input?.type || 'USER'}
												onChange={checkUserTypeHandler}
												row
												sx={{ gap: '20px' }}
											>
												<FormControlLabel
													value="USER"
													control={<Radio size="small" />}
													label="User"
												/>
												<FormControlLabel
													value="AGENT"
													control={<Radio size="small" />}
													label="Agent"
												/>
											</RadioGroup>
										</div>
									</div>
								)}

								{loginView && (
								<div className={'remember-info'}>
									<FormGroup>
											<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
									</FormGroup>
										<a>Lost your password?</a>
								</div>
								)}

								{loginView ? (
									<Button
										variant="contained"
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
										disabled={input.nick == '' || input.password == ''}
										onClick={doLogin}
									>
										LOGIN
									</Button>
								) : (
									<Button
										variant="contained"
										disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
										onClick={doSignUp}
										endIcon={<img src="/img/icons/rightup.svg" alt="" />}
									>
										SIGNUP
									</Button>
								)}
							</div>
							<div className={'ask-info'}>
								{loginView ? (
									<p>
										Not registered yet?
										<b
											onClick={() => {
												viewChangeHandler(false);
											}}
										>
											SIGNUP
										</b>
									</p>
								) : (
									<p>
										Have account?
										<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
									</p>
								)}
							</div>
						</Stack>
						<Stack className={'right'}></Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
