import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutHome from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// TurboCar Components
import Advertisement from '../libs/components/homepage/Advertisement';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import HeroSection from '../libs/components/homepage/Herosection';
import PopularCars from '../libs/components/homepage/PopularCars';
import RentalCars from '../libs/components/homepage/RentalCar';
import TopDealers from '../libs/components/homepage/TopDealer';
import FeaturedCars from '../libs/components/homepage/Featuredcars';


export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<FeaturedCars />
				<PopularCars />
				<Advertisement />
				<RentalCars />
				<TopDealers /> {/* ✅ YANGI */}
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<FeaturedCars />
				<PopularCars />
				<Advertisement />
				<RentalCars />
				<TopDealers /> {/* ✅ YANGI */}
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutHome(Home);