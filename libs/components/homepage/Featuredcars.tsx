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
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import FeaturedCarCard from './FeaturedCarCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Direction, Message } from '../../enums/common.enum';
import ScrollAnimation from '../common/ScrollAnimation';
import CategoryFilter from './CategoryFilter';

interface FeaturedCarsProps {
	initialInput: PropertiesInquiry;
}

const FeaturedCars = (props: FeaturedCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [featuredCars, setFeaturedCars] = useState<Property[]>([]);

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
			// Backend already sorts by propertyLikes, just use the data as is
			setFeaturedCars(data?.getProperties?.list || []);
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

	if (device === 'mobile') {
		return (
			<Stack className={'featured-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Featured Cars</span>
					</Stack>
					<CategoryFilter />
					<Stack className={'card-box'}>
						{featuredCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Featured Cars Empty
							</Box>
						) : (
							<Swiper
								className={'featured-swiper'}
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
								{featuredCars.map((property: Property) => {
									return (
										<SwiperSlide key={property._id} className={'featured-slide'}>
											<FeaturedCarCard property={property} likePropertyHandler={likePropertyHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'featured-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						{/* Premium Overline with Decorative Lines */}
						<div className={'overline-section'}>
							<div className={'decorative-line'}></div>
							<span className={'overline-text'}>FEATURED SELECTION</span>
							<div className={'decorative-line'}></div>
						</div>

						{/* Main Title with Gradient */}
						<h2 className={'main-title'}>Featured Cars</h2>

						{/* Subtitle */}
						<p className={'subtitle'}>Most liked vehicles</p>
					</Stack>
					<CategoryFilter />
					<Stack className={'card-box'}>
						{featuredCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Featured Cars Empty
							</Box>
						) : (
							<>
								{/* Left Arrow */}
								<WestIcon className={'swiper-featured-prev carousel-arrow-left'} />
								
								<Swiper
									className={'featured-car-swiper'}
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
										nextEl: '.swiper-featured-next',
										prevEl: '.swiper-featured-prev',
									}}
									pagination={{
										el: '.swiper-featured-pagination',
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
									{featuredCars.map((property: Property) => {
										return (
											<SwiperSlide key={property._id} className={'featured-car-slide'}>
												<FeaturedCarCard 
													property={property} 
													likePropertyHandler={likePropertyHandler} 
												/>
											</SwiperSlide>
										);
									})}
								</Swiper>
								
								{/* Right Arrow */}
								<EastIcon className={'swiper-featured-next carousel-arrow-right'} />
								
								{/* Pagination - Bottom center */}
								<div className={'swiper-featured-pagination'}></div>
							</>
						)}
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

FeaturedCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'propertyLikes', // Featured: sort by likes
		direction: Direction.DESC,
		search: {},
	},
};

export default FeaturedCars;