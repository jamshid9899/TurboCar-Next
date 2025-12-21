import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			const savedLocale = localStorage.getItem('locale');
			setLang(savedLocale);
		}
	}, [router]);

	useEffect(() => {
		if (router.locale) {
			setLang(router.locale);
		}
	}, [router.locale]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			const newLocale = e.currentTarget.id || e.target.id;
			setLang(newLocale);
			localStorage.setItem('locale', newLocale);
			setAnchorEl2(null);
			await i18n.changeLanguage(newLocale);
			await router.push(router.asPath, router.asPath, { locale: newLocale });
		},
		[router, i18n],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 8,
			marginTop: theme.spacing(0.5),
			minWidth: 180,
			maxWidth: 200,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			zIndex: 1000,
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				display: 'flex',
				alignItems: 'center',
				gap: '8px',
				padding: '8px 16px',
				'& .img-flag': {
					width: '24px',
					height: '17px',
					borderRadius: '2px',
					flexShrink: 0,
					objectFit: 'cover',
				},
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/property?mode=rent'}>
					<div>{t('Rent')}</div>
				</Link>
				<Link href={'/property?mode=buy'}>
					<div>{t('Buy')}</div>
				</Link>
				<Link href={'/agent'}>
					<div>{t('Dealers')}</div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div>{t('Community')}</div>
				</Link>
				<Link href={'/cs'}>
					<div>{t('CS')}</div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-navbar'}>
				<Stack className={`top-navbar-main ${colorChange ? 'scrolled' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'} direction="row" alignItems="center" justifyContent="space-between">
						{/* Logo */}
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/turbocar_1.svg" alt="TurboCar" />
							</Link>
						</Box>

						{/* Navigation Links */}
						<Box component={'div'} className={'nav-links'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''}>{t('Home')}</div>
							</Link>
							<Link href={'/property?mode=rent'}>
								<div className={router.pathname === '/property' && router.query.mode === 'rent' ? 'active' : ''}>{t('Rent')}</div>
							</Link>
							<Link href={'/property?mode=buy'}>
								<div className={router.pathname === '/property' && router.query.mode === 'buy' ? 'active' : ''}>{t('Buy')}</div>
							</Link>
							<Link href={'/agent'}>
								<div className={router.pathname === '/agent' ? 'active' : ''}>{t('Dealers')}</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div className={router.pathname === '/mypage' ? 'active' : ''}>{t('My Page')}</div>
								</Link>
							)}
							<Link href={'/community?articleCategory=FREE'}>
								<div className={router.pathname === '/community' ? 'active' : ''}>{t('Community')}</div>
							</Link>
							<Link href={'/cs'}>
								<div className={router.pathname === '/cs' ? 'active' : ''}>{t('CS')}</div>
							</Link>
						</Box>

						{/* User & Language */}
						<Box component={'div'} className={'user-actions'}>
							{user?._id ? (
								<>
									{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<Button
								disableRipple
								className="btn-lang"
								onClick={langClick}
								endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
							>
								<Box component={'div'} className={'flag'}>
									{lang !== null ? (
										<img src={`/img/flag/lang${lang}.png`} alt={'flag'} />
									) : (
										<img src={`/img/flag/langen.png`} alt={'flag'} />
									)}
								</Box>
							</Button>

							<StyledMenu 
								anchorEl={anchorEl2} 
								open={drop} 
								onClose={langClose}
								MenuListProps={{
									'aria-labelledby': 'language-button',
								}}
								sx={{ 
									'& .MuiPaper-root': {
										overflow: 'visible',
									}
								}}
							>
								<MenuItem disableRipple onClick={langChoice} id="en">
									<img className="img-flag" src={'/img/flag/langen.png'} alt={'English'} />
									<span>{t('English')}</span>
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="es">
									<img className="img-flag" src={'/img/flag/langes.png'} alt={'Spanish'} />
									<span>{t('Spanish')}</span>
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="kr">
									<img className="img-flag" src={'/img/flag/langkr.png'} alt={'Korean'} />
									<span>{t('Korean')}</span>
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="ru">
									<img className="img-flag" src={'/img/flag/langru.png'} alt={'Russian'} />
									<span>{t('Russian')}</span>
								</MenuItem>
							</StyledMenu>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Top;