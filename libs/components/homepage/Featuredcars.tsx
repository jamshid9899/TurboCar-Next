import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import FeaturedCarCard from './FeaturedCarCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Direction, Message } from '../../enums/common.enum';

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
			setFeaturedCars(data?.getProperties?.list);
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

	if (!featuredCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'featured-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Featured Cars</span>
					</Stack>
					<Stack className={'card-box'}>
						{featuredCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Featured Cars Empty
							</Box>
						) : (
							<Swiper
								className={'featured-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
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
						<Box component={'div'} className={'left'}>
							<span>Featured Cars</span>
							<p>Explore our top-rated vehicles</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-featured-prev'} />
								<div className={'swiper-featured-pagination'}></div>
								<EastIcon className={'swiper-featured-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{featuredCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Featured Cars Empty
							</Box>
						) : (
							<Swiper
								className={'featured-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-featured-next',
									prevEl: '.swiper-featured-prev',
								}}
								pagination={{
									el: '.swiper-featured-pagination',
								}}
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
	}
};

FeaturedCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'propertyLikes',
		direction: Direction.DESC,
		search: {},
	},
};

export default FeaturedCars;