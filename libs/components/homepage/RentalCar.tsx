import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import RentalCarCard from './RentalCarCard';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';

interface RentalCarsProps {
	initialInput: PropertiesInquiry;
}

const RentalCars = (props: RentalCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [rentalCars, setRentalCars] = useState<Property[]>([]);

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
			 console.log('RENTAL CARS RESPONSE:', data);
			if (data?.getProperties?.list) {
				console.log('RENTAL CARS LIST:', data.getProperties.list);
				setRentalCars(data.getProperties.list);
			}
		},
	});

	/** HANDLERS **/
	// ✅ ALWAYS SHOW SECTION (even if empty)

	if (device === 'mobile') {
		return (
			<Stack className={'rental-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Available for Rent</span>
						<p>Rent a car today</p>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading...
							</Box>
						) : rentalCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No rental cars available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'rental-car-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={25}
								modules={[Autoplay]}
							>
								{rentalCars.map((car: Property) => {
									return (
										<SwiperSlide key={car._id} className={'rental-car-slide'}>
											<RentalCarCard property={car} />
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
			<Stack className={'rental-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Available for Rent</span>
							<p>Find the perfect car for your next trip</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property?search=rent'}>
									<span>See All Rentals</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading rental cars...
							</Box>
						) : rentalCars.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No rental cars available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'rental-car-swiper'}
								slidesPerView={'auto'}
								spaceBetween={25}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-rental-next',
									prevEl: '.swiper-rental-prev',
								}}
								pagination={{
									el: '.swiper-rental-pagination',
								}}
							>
								{rentalCars.map((car: Property) => {
									return (
										<SwiperSlide key={car._id} className={'rental-car-slide'}>
											<RentalCarCard property={car} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-rental-prev'} />
						<div className={'swiper-rental-pagination'}></div>
						<EastIcon className={'swiper-rental-next'} />
					</Stack>
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
		direction: 'DESC',
		search: {
			isForRent: true,
		},  
	},
};

export default RentalCars;