import React, { useState } from 'react';
import { Stack, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import PopularCarCard from './PopularCarCard';
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

interface PopularCarsProps {
	initialInput: PropertiesInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [popularCars, setPopularCars] = useState<Property[]>([]);

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
			setPopularCars(data?.getProperties?.list);
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

	if (!popularCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Most Popular Cars</span>
					</Stack>
					<CategoryFilter />
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-car-swiper'}
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
							{popularCars.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'popular-car-slide'}>
										<PopularCarCard property={property} likePropertyHandler={likePropertyHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
						
						{/* Pagination - Bottom center */}
						<div className={'swiper-popular-pagination'}></div>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						{/* Premium Overline with Decorative Lines */}
						<div className={'overline-section'}>
							<div className={'decorative-line'}></div>
							<span className={'overline-text'}>POPULAR SELECTION</span>
							<div className={'decorative-line'}></div>
						</div>

						{/* Main Title with Gradient */}
						<h2 className={'main-title'}>Most Popular Cars</h2>

						{/* Subtitle */}
						<p className={'subtitle'}>Browse the most viewed vehicles</p>
					</Stack>
					<CategoryFilter />
					<Stack className={'card-box'}>
						{/* Left Arrow */}
						<WestIcon className={'swiper-popular-prev carousel-arrow-left'} />
						
						{/* Right Arrow */}
						<EastIcon className={'swiper-popular-next carousel-arrow-right'} />
						
						<Swiper
							className={'popular-car-swiper'}
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
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
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
							{popularCars.map((property: Property, index: number) => {
								return (
									<SwiperSlide key={property._id} className={'popular-car-slide'}>
										<ScrollAnimation 
											animationType="fade-up" 
											duration={0.6} 
											delay={index * 100}
											className="scroll-stagger"
										>
											<PopularCarCard property={property} likePropertyHandler={likePropertyHandler} />
										</ScrollAnimation>
									</SwiperSlide>
								);
							})}
						</Swiper>
						
						{/* Pagination - Bottom center */}
						<div className={'swiper-popular-pagination'}></div>
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

PopularCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'propertyViews', // Popular: sort by views
		direction: Direction.DESC,
		search: {
			isForSale: true,
		},
	},
};

export default PopularCars;
