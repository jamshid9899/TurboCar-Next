import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Browse Cars';
					desc = 'Find your perfect vehicle';
					bgImage = '/img/banner/cars-banner.jpg';
					break;
				case '/agent':
					title = 'Car Dealers';
					desc = 'Trusted dealers across Spain';
					bgImage = '/img/banner/dealers-banner.jpg';
					break;
				case '/agent/detail':
					title = 'Dealer Profile';
					desc = 'Professional car dealer';
					bgImage = '/img/banner/header2.png';
					break;
				case '/mypage':
					title = 'My Page';
					desc = 'Manage your cars and profile';
					bgImage = '/img/banner/header1.svg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Car news and discussions';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/community/detail':
					title = 'Article Detail';
					desc = 'Community post';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/cs':
					title = 'Customer Support';
					desc = 'We are here to help!';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/account/join':
					title = 'Login / Signup';
					desc = 'Join TurboCar today';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Profile';
					desc = 'View member details';
					bgImage = '/img/banner/header1.svg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>TurboCar - {memoizedValues.title}</title>
						<meta name={'title'} content={`TurboCar - ${memoizedValues.title}`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>TurboCar - {memoizedValues.title}</title>
						<meta name={'title'} content={`TurboCar - ${memoizedValues.title}`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{user?._id && <Chat />}

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;