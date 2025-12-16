import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import PopularCarCard from './PopularCarCard';

interface PopularCarsProps {
	initialInput: PropertiesInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCars, setPopularCars] = useState<Property[]>([]);

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
			if (data?.getProperties?.list) {
				setPopularCars(data.getProperties.list);
			}
		},
	});

	/** HANDLERS **/
	// ✅ ALWAYS SHOW SECTION (even if empty)

	if (device === 'mobile') {
		return (
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular Cars</span>
						<p>Most viewed vehicles</p>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading...
							</Box>
						) : popularCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No popular cars available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'popular-car-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={25}
								modules={[Autoplay]}
							>
								{popularCars.map((car: Property) => {
									return (
										<SwiperSlide key={car._id} className={'popular-car-slide'}>
											<PopularCarCard property={car} />
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
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular Cars</span>
							<p>Most viewed vehicles this week</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property'}>
									<span>See All Cars</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading popular cars...
							</Box>
						) : popularCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No popular cars available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'popular-car-swiper'}
								slidesPerView={'auto'}
								spaceBetween={25}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-popular-next',
									prevEl: '.swiper-popular-prev',
								}}
								pagination={{
									el: '.swiper-popular-pagination',
								}}
							>
								{popularCars.map((car: Property) => {
									return (
										<SwiperSlide key={car._id} className={'popular-car-slide'}>
											<PopularCarCard property={car} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},  
	},
};

export default PopularCars;