import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// TurboCar Components
import HeroSection from '../libs/components/homepage/HeroSection';
import FeaturedCars from '../libs/components/homepage/FeaturedCars';
import PopularCars from '../libs/components/homepage/PopularCars';
import CarsByBrand from '../libs/components/homepage/CarsByBrand';
import TopDealers from '../libs/components/homepage/TopDealers';
import RentalCars from '../libs/components/homepage/RentalCars';
import Advertisement from '../libs/components/homepage/Advertisement';
import Testimonials from '../libs/components/homepage/Testimonials';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';

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
				{/* Hero with Search */}
				<HeroSection />
				
				{/* Featured Cars */}
				<FeaturedCars />
				
				{/* Popular Cars */}
				<PopularCars />
				
				{/* Advertisement */}
				<Advertisement />
				
				{/* Rental Cars */}
				<RentalCars />
				
				{/* Top Dealers */}
				<TopDealers />
				
				{/* Testimonials */}
				<Testimonials />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* Hero with Search */}
				<HeroSection />
				
				{/* Featured Cars (Top ranked) */}
				<FeaturedCars />
				
				{/* Popular Cars (Most viewed) */}
				<PopularCars />
				
				{/* Cars by Brand (TOYOTA, BMW, ...) */}
				<CarsByBrand />
				
				{/* Advertisement */}
				<Advertisement />
				
				{/* Rental Cars Available */}
				<RentalCars />
				
				{/* Top Dealers/Agents */}
				<TopDealers />
				
				{/* Customer Testimonials */}
				<Testimonials />
				
				{/* Community Boards (Blog/News) */}
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
