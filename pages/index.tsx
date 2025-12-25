import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutHome from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction } from '../libs/enums/common.enum';
import { PropertyLocation, PropertyType } from '../libs/enums/property.enum';
import { PropertiesInquiry } from '../libs/types/property/property.input';

// TurboCar Components
import Advertisement from '../libs/components/homepage/Advertisement';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import HeroSection from '../libs/components/homepage/Herosection';
import PopularCars from '../libs/components/homepage/PopularCars';
import RentalCars from '../libs/components/homepage/RentalCar';
import TopDealers from '../libs/components/homepage/TopDealer';
import FeaturedCars from '../libs/components/homepage/Featuredcars';
import AvailableCities from '../libs/components/homepage/AvailableCities';
import HowItWorksContainer from '../libs/components/homepage/HowItWorksContainer';
import PopularCategories from '../libs/components/homepage/PopularCategories';
import ScrollAnimation from '../libs/components/common/ScrollAnimation';


export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [mode, setMode] = useState<'RENT' | 'BUY'>('RENT');
	const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);
	const [selectedType, setSelectedType] = useState<PropertyType | null>(null);

	const handleCityClick = (location: PropertyLocation) => {
		const searchQuery: any = {
			locationList: [location],
			isForSale: mode === 'BUY',
			isForRent: mode === 'RENT',
		};
		
		if (selectedType) {
			searchQuery.typeList = [selectedType];
		}

		router.push({
			pathname: '/property',
			query: {
				input: JSON.stringify({
					page: 1,
					limit: 9,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: searchQuery,
				} as PropertiesInquiry),
			},
		});
	};

	const handleLocationSelect = (location: PropertyLocation) => {
		setSelectedLocation(location);
		handleCityClick(location);
	};

	const handleTypeSelect = (type: PropertyType) => {
		setSelectedType(type);
		if (selectedLocation) {
			handleCityClick(selectedLocation);
		}
	};

	const handleSearch = () => {
		if (selectedLocation) {
			handleCityClick(selectedLocation);
		}
	};

	const handleModeChange = (newMode: 'RENT' | 'BUY') => {
		setMode(newMode);
		if (selectedLocation) {
			handleCityClick(selectedLocation);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<ScrollAnimation animationType="fade-up" duration={0.7}>
					<FeaturedCars 
						initialInput={{
							page: 1,
							limit: 8,
							sort: 'propertyLikes', // Featured: sort by likes
							direction: Direction.DESC,
							search: {},
						}}
					/>
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={100}>
					<PopularCars 
						initialInput={{
							page: 1,
							limit: 7,
							sort: 'propertyViews', // Popular: sort by views
							direction: Direction.DESC,
							search: {
								isForSale: true,
							},
						}}
					/>
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={200}>
					<Advertisement />
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={300}>
					<RentalCars 
						initialInput={{
							page: 1,
							limit: 8,
							sort: 'createdAt',
							direction: Direction.DESC,
							search: {
								isForRent: true,
							},
						}}
					/>
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={400}>
					<TopDealers />
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={500}>
					<CommunityBoards />
				</ScrollAnimation>
				<HowItWorksContainer />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroSection
					mode={mode}
					onModeChange={handleModeChange}
					selectedLocation={selectedLocation}
					onLocationSelect={handleLocationSelect}
					selectedType={selectedType}
					onTypeSelect={handleTypeSelect}
					onSearch={handleSearch}
				/>
				<ScrollAnimation animationType="fade-up" duration={0.7}>
					<AvailableCities
						mode={mode}
						selectedLocation={selectedLocation}
						selectedType={selectedType}
						onCityClick={handleCityClick}
					/>
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={150}>
					<RentalCars 
						initialInput={{
							page: 1,
							limit: 8,
							sort: 'createdAt',
							direction: Direction.DESC,
							search: {
								isForRent: true,
							},
						}}
					/>
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={250}>
					<FeaturedCars 
						initialInput={{
							page: 1,
							limit: 8,
							sort: 'propertyLikes', // Featured: sort by likes
							direction: Direction.DESC,
							search: {},
						}}
					/>
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={300}>
					<PopularCars 
						initialInput={{
							page: 1,
							limit: 7,
							sort: 'propertyViews', // Popular: sort by views
							direction: Direction.DESC,
							search: {
								isForSale: true,
							},
						}}
					/>
				</ScrollAnimation>
				<HowItWorksContainer />
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={400}>
					<Advertisement />
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={500}>
					<TopDealers />
				</ScrollAnimation>
				<ScrollAnimation animationType="fade-up" duration={0.7} delay={600}>
					<CommunityBoards />
				</ScrollAnimation>
			</Stack>
		);
	}
};

export default withLayoutHome(Home);