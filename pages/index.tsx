import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutHome from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction } from '../libs/enums/common.enum';

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
				<FeaturedCars 
					initialInput={{
						page: 1,
						limit: 8,
						sort: 'propertyLikes',
						direction: Direction.DESC,
						search: {},
					}}
				/>
				<PopularCars 
					initialInput={{
						page: 1,
						limit: 7,
						sort: 'propertyViews',
						direction: Direction.DESC,
						search: {
							isForSale: true,
						},
					}}
				/>
				<Advertisement />
				<RentalCars 
					initialInput={{
						page: 1,
						limit: 7,
						sort: 'createdAt',
						direction: Direction.DESC,
						search: {
							isForRent: true,
						},
					}}
				/>
				<TopDealers /> {/* ✅ YANGI */}
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<RentalCars 
					initialInput={{
						page: 1,
						limit: 7,
						sort: 'createdAt',
						direction: Direction.DESC,
						search: {
							isForRent: true,
						},
					}}
				/>
				<FeaturedCars 
					initialInput={{
						page: 1,
						limit: 8,
						sort: 'propertyLikes',
						direction: Direction.DESC,
						search: {},
					}}
				/>
				<PopularCars 
					initialInput={{
						page: 1,
						limit: 7,
						sort: 'propertyViews',
						direction: Direction.DESC,
						search: {
							isForSale: true,
						},
					}}
				/>
				<Advertisement />
				<TopDealers /> {/* ✅ YANGI */}
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutHome(Home);