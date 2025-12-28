import React, { useState } from 'react';
import { Stack, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import RentalCarCard from './RentalCarCard';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';
import { Direction } from '../../enums/common.enum';
import ScrollAnimation from '../common/ScrollAnimation';
import CategoryFilter from './CategoryFilter';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface RentalCarsProps {
	initialInput: PropertiesInquiry;
}

const RentalCars = (props: RentalCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [rentalCars, setRentalCars] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	
	const { 
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRentalCars(data?.getProperties?.list);
		},
	});

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) {
				await sweetMixinErrorAlert('Please login first');
				return;
			}
			
			await likeTargetProperty({
				variables: { propertyId: id },
			});
			await getPropertiesRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			if (err.message !== Message.NOT_AUTHENTICATED) {
				sweetMixinErrorAlert(err.message).then();
			}
		}
	};

	if (!rentalCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'rental-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Cars for Rent</span>
					</Stack>
					<CategoryFilter />
					<Stack className={'card-box'}>
						<Swiper
							className={'rental-car-swiper'}
							modules={[Autoplay]}
							slidesPerView={1.5}
							centeredSlides={true}
							spaceBetween={15}
							loop={true}
							autoplay={{
								delay: 3500,
								disableOnInteraction: false,
								pauseOnMouseEnter: true,
							}}
							speed={800}
						>
							{rentalCars.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'rental-car-slide'}>
										<RentalCarCard 
											property={property} 
											likePropertyHandler={likePropertyHandler} 
										/>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'rental-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						{/* Premium Overline with Decorative Lines */}
						<div className={'overline-section'}>
							<div className={'decorative-line'}></div>
							<span className={'overline-text'}>PREMIUM RENTALS</span>
							<div className={'decorative-line'}></div>
						</div>

						{/* Main Title with Gradient */}
						<h2 className={'main-title'}>Cars for Rent</h2>

						{/* Subtitle */}
						<p className={'subtitle'}>Discover Your Perfect Ride in Minutes</p>
					</Stack>
					<CategoryFilter />
					<Stack className={'card-box'}>
						{/* Left Arrow */}
						<WestIcon className={'swiper-rental-prev carousel-arrow-left'} />
						
						<Swiper
							className={'rental-car-swiper'}
							modules={[Autoplay, Navigation, Pagination]}
							slidesPerView={4}
							spaceBetween={30}
							loop={true}
							autoplay={{
								delay: 3500,
								disableOnInteraction: false,
								pauseOnMouseEnter: true,
							}}
							speed={800}
							navigation={{
								nextEl: '.swiper-rental-next',
								prevEl: '.swiper-rental-prev',
							}}
							pagination={{
								el: '.swiper-rental-pagination',
								clickable: true,
							}}
							breakpoints={{
								320: {
									slidesPerView: 1,
									spaceBetween: 15,
								},
								640: {
									slidesPerView: 2,
									spaceBetween: 20,
								},
								1024: {
									slidesPerView: 3,
									spaceBetween: 25,
								},
								1280: {
									slidesPerView: 4,
									spaceBetween: 30,
								},
							}}
						>
							{rentalCars.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'rental-car-slide'}>
										<RentalCarCard 
											property={property} 
											likePropertyHandler={likePropertyHandler} 
										/>
									</SwiperSlide>
								);
							})}
						</Swiper>
						
						{/* Right Arrow */}
						<EastIcon className={'swiper-rental-next carousel-arrow-right'} />
						
						{/* Pagination - Bottom center */}
						<div className={'swiper-rental-pagination'}></div>
					</Stack>
					
					{/* See All Cars Button */}
					<Box component="div" className="see-all-button-container">
						<Button 
							className="see-all-button"
							onClick={() => router.push('/property')}
						>
							See All Cars
						</Button>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

RentalCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			isForRent: true,
		},
	},
};

export default RentalCars;