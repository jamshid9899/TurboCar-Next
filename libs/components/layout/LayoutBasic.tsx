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
import Breadcrumb from '../common/Breadcrumb';
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
				breadcrumb = '';

			switch (router.pathname) {
				case '/property':
					const mode = router.query.mode as string;
					if (mode === 'rent') {
						title = 'Cars for Rent';
						breadcrumb = 'Rent';
					} else if (mode === 'buy') {
						title = 'Cars for Sale';
						breadcrumb = 'Buy';
					} else {
						title = 'Cars';
						breadcrumb = 'Cars';
					}
					desc = mode === 'rent' ? 'Find cars for rent' : mode === 'buy' ? 'Find cars for sale' : 'Browse all cars';
					break;
				case '/property/detail':
					title = 'Car Details';
					breadcrumb = 'Cars / Details';
					desc = 'View car details';
					break;
				case '/agent':
					title = 'Dealers';
					breadcrumb = 'Dealers';
					desc = 'Find trusted car dealers';
					break;
				case '/agent/detail':
					title = 'Dealer Detail';
					breadcrumb = 'Dealers / Detail';
					desc = 'View dealer information';
					break;
				case '/mypage':
					title = 'My Page';
					breadcrumb = 'My Page';
					desc = 'Manage your account';
					break;
				case '/community':
					title = 'Community';
					breadcrumb = 'Community';
					desc = 'Join the car community';
					break;
				case '/community/detail':
					title = 'Community Article';
					breadcrumb = 'Community / Article';
					desc = 'Read community article';
					break;
				case '/cs':
					title = 'Customer Support';
					breadcrumb = 'Customer Support';
					desc = 'Get help and support';
					break;
				case '/account/join':
					title = 'Login / Sign Up';
					breadcrumb = 'Login / Sign Up';
					desc = 'Sign in or create account';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Profile';
					breadcrumb = 'Member Profile';
					desc = 'View member profile';
					break;
				case '/about':
					title = 'About Us';
					breadcrumb = 'About Us';
					desc = 'Learn about TurboCar';
					break;
				default:
					break;
			}

			return { title, desc, breadcrumb };
		}, [router.pathname, router.query.mode]);

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

						<Stack id={'footer'} sx={{ background: '#181a20 !important', backgroundColor: '#181a20 !important' }}>
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

						<Stack id={'main'}>
							{/* Top Breadcrumb */}
							<Breadcrumb title={memoizedValues.title} breadcrumb={memoizedValues.breadcrumb} position="top" />

							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'} sx={{ background: '#181a20 !important', backgroundColor: '#181a20 !important' }}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;