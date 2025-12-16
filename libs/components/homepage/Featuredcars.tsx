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
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';

interface FeaturedCarsProps {
	initialInput: PropertiesInquiry;
}

const FeaturedCars = (props: FeaturedCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [featuredCars, setFeaturedCars] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading,
		data,
		error,
		refetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			console.log('FEATURED CARS DATA:', data);
			if (data?.getProperties?.list) {
				setFeaturedCars(data.getProperties.list);
			}
		},
	});

	/** HANDLERS **/
	// ✅ ALWAYS SHOW SECTION (even if empty)

	if (device === 'mobile') {
		return (
			<Stack className={'featured-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Featured Cars</span>
						<p>Top ranked vehicles</p>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading...
							</Box>
						) : featuredCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No featured cars available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'featured-car-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{featuredCars.map((car: Property) => {
									return (
										<SwiperSlide key={car._id} className={'featured-car-slide'}>
											<FeaturedCarCard property={car} />
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
							<p>Top ranked vehicles selected by our team</p>
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
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading featured cars...
							</Box>
						) : featuredCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No featured cars available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'featured-car-swiper'}
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
								{featuredCars.map((car: Property) => {
									return (
										<SwiperSlide key={car._id} className={'featured-car-slide'}>
											<FeaturedCarCard property={car} />
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
		sort: 'propertyRank',
		direction: 'DESC',
		search: {},  
	},
};
export default FeaturedCars;