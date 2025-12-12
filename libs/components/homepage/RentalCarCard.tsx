import React from 'react';
import { Stack, Box, Divider, Typography, Chip, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface RentalCarCardProps {
	property: Property;
}

const RentalCarCard = (props: RentalCarCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const pushDetailHandler = async () => {
		await router.push({
			pathname: '/property/detail',
			query: { id: property?._id },
		});
	};

	const handleRentNow = (e: React.MouseEvent) => {
		e.stopPropagation();
		router.push({
			pathname: '/property/detail',
			query: { id: property?._id, action: 'rent' },
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className="rental-car-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					{/* Rent Per Day */}
					<div className={'rent-price'}>
						${property.propertyRentPrice}/day
					</div>
					
					{/* Available Badge */}
					<Chip 
						label="Available for Rent" 
						size="small"
						className="rent-badge"
						color="primary"
					/>
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Brand + Model */}
					<strong className={'title'}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					
					{/* Year + Type */}
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyType}
					</p>
					
					{/* Car Details */}
					<div className={'options'}>
						<div>
							<DirectionsCarIcon fontSize="small" />
							<span>{property?.propertyTransmission}</span>
						</div>
						<div>
							<LocalGasStationIcon fontSize="small" />
							<span>{property?.propertyFuelType}</span>
						</div>
						<div>
							<EventSeatIcon fontSize="small" />
							<span>{property?.propertySeats} seats</span>
						</div>
					</div>
					
					{/* Rental Period */}
					{property?.minimumRentDays && property?.maximumRentDays && (
						<div className={'rental-period'}>
							<CalendarMonthIcon fontSize="small" />
							<span>
								Min: {property.minimumRentDays} day
								{property.minimumRentDays > 1 ? 's' : ''} - 
								Max: {property.maximumRentDays} day
								{property.maximumRentDays > 1 ? 's' : ''}
							</span>
						</div>
					)}
					
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					
					<div className={'bott'}>
						{/* Location */}
						<p>{property?.propertyLocation}</p>
						
						{/* Rent Button */}
						<Button 
							variant="contained" 
							size="small"
							onClick={handleRentNow}
						>
							Rent Now
						</Button>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="rental-car-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					{/* Rent Per Day */}
					<div className={'rent-price'}>
						${property.propertyRentPrice}/day
					</div>
					
					{/* Available Badge */}
					<Chip 
						label="Available for Rent" 
						size="small"
						className="rent-badge"
						color="primary"
					/>
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Brand + Model */}
					<strong className={'title'}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					
					{/* Year + Type */}
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyType}
					</p>
					
					{/* Car Details */}
					<div className={'options'}>
						<div>
							<DirectionsCarIcon fontSize="small" />
							<span>{property?.propertyTransmission}</span>
						</div>
						<div>
							<LocalGasStationIcon fontSize="small" />
							<span>{property?.propertyFuelType}</span>
						</div>
						<div>
							<EventSeatIcon fontSize="small" />
							<span>{property?.propertySeats} seats</span>
						</div>
					</div>
					
					{/* Rental Period */}
					{property?.minimumRentDays && property?.maximumRentDays && (
						<div className={'rental-period'}>
							<CalendarMonthIcon fontSize="small" />
							<span>
								Rent: {property.minimumRentDays}-{property.maximumRentDays} days
							</span>
						</div>
					)}
					
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					
					<div className={'bott'}>
						{/* Location */}
						<p>{property?.propertyLocation}</p>
						
						{/* Rent Button */}
						<Button 
							variant="contained" 
							size="small"
							onClick={handleRentNow}
						>
							Rent Now
						</Button>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default RentalCarCard;