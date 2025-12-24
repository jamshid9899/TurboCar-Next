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
				breadcrumb = '';

			switch (router.pathname) {
				case '/property':
					const mode = router.query.mode as string;
					title = mode === 'rent' ? 'Rent Cars' : mode === 'buy' ? 'Buy Cars' : 'Cars';
					breadcrumb = mode === 'rent' ? 'Rent' : mode === 'buy' ? 'Buy' : 'Cars';
					desc = mode === 'rent' ? 'Find cars for rent' : mode === 'buy' ? 'Find cars for sale' : 'Browse all cars';
					break;
				case '/agent':
					title = 'Dealers';
					breadcrumb = 'Dealers';
					break;
				case '/agent/detail':
					title = 'Dealer Detail';
					breadcrumb = 'Dealers / Dealer Detail';
					break;
				case '/mypage':
					title = 'My Page';
					breadcrumb = 'My Page';
					break;
				case '/community':
					title = 'Community';
					breadcrumb = 'Community';
					break;
				case '/community/detail':
					title = 'Community Article';
					breadcrumb = 'Community / Article';
					break;
				case '/cs':
					title = 'Customer Support';
					breadcrumb = 'Customer Support';
					break;
				case '/account/join':
					title = 'Login / Sign Up';
					breadcrumb = 'Login / Sign Up';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Profile';
					breadcrumb = 'Member Profile';
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
							{/* Simple Page Header - #main ichida */}
							<Stack className={'simple-page-header'}>
								<Stack className={'container'}>
									<h1 className={'page-title'}>{memoizedValues.title}</h1>
									<p className={'breadcrumb'}>
										<a href="/">Home</a>
										{memoizedValues.breadcrumb && (
											<>
												<span>/</span>
												<span>{memoizedValues.breadcrumb}</span>
											</>
										)}
									</p>
								</Stack>
							</Stack>

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