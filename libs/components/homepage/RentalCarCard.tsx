import React from 'react';
import { Stack, Box, Divider, Typography, Chip, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface RentalCarCardProps {
	property: Property;
	likePropertyHandler: any;
}

const RentalCarCard = (props: RentalCarCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		await router.push({
			pathname: '/property/detail',
			query: { id: propertyId },
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
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => pushDetailHandler(property._id)}
				>
					{/* Rent Per Day */}
					<div className={'price'}>
						€{property.propertyRentPrice || 0} / day
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
					<strong className={'title'} onClick={() => pushDetailHandler(property._id)}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyType}
					</p>
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
						<p>{property?.propertyLocation}</p>
						<div className="view-like-box">
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews || 0}</Typography>
							{likePropertyHandler && (
								<>
									<IconButton 
										color={'default'} 
										size="small"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											likePropertyHandler(user, property?._id);
										}}
									>
										{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon style={{ color: 'red' }} />
										) : (
											<FavoriteBorderIcon />
										)}
									</IconButton>
									<Typography className="view-cnt">{property?.propertyLikes || 0}</Typography>
								</>
							)}
						</div>
						
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
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => pushDetailHandler(property._id)}
				>
					{/* Rent Per Day */}
					<div className={'price'}>
						€{property.propertyRentPrice || 0} / day
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
					<strong className={'title'} onClick={() => pushDetailHandler(property._id)}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyType}
					</p>
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
						<p>{property?.propertyLocation}</p>
						<div className="view-like-box">
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews || 0}</Typography>
							{likePropertyHandler && (
								<>
									<IconButton 
										color={'default'} 
										size="small"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											likePropertyHandler(user, property?._id);
										}}
									>
										{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon style={{ color: 'red' }} />
										) : (
											<FavoriteBorderIcon />
										)}
									</IconButton>
									<Typography className="view-cnt">{property?.propertyLikes || 0}</Typography>
								</>
							)}
						</div>
						
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
