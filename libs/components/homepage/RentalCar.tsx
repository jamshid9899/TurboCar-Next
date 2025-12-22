import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
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

interface RentalCarsProps {
	initialInput: PropertiesInquiry;
}

const RentalCars = (props: RentalCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
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
					<Stack className={'card-box'}>
						{rentalCars.map((property: Property) => {
							return (
								<RentalCarCard 
									key={property._id} 
									property={property} 
									likePropertyHandler={likePropertyHandler} 
								/>
							);
						})}
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

						{/* Stats Row */}
						<div className={'stats-row'}>
							<div className={'stat-item'}>
								<span className={'stat-number'}>500+</span>
								<span className={'stat-label'}>Cars</span>
							</div>
							<div className={'stat-divider'}>|</div>
							<div className={'stat-item'}>
								<span className={'stat-number'}>24/7</span>
								<span className={'stat-label'}>Support</span>
							</div>
							<div className={'stat-divider'}>|</div>
							<div className={'stat-item'}>
								<span className={'stat-number'}>4.9★</span>
								<span className={'stat-label'}>Rating</span>
							</div>
						</div>
					</Stack>
					<Stack className={'card-box'}>
						{rentalCars.map((property: Property) => {
							return (
								<RentalCarCard 
									key={property._id} 
									property={property} 
									likePropertyHandler={likePropertyHandler} 
								/>
							);
						})}
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
		direction: Direction.DESC,
		search: {
			isForRent: true,
		},
	},
};

export default RentalCars;