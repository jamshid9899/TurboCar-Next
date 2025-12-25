import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography, Chip, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';

interface RentalCarCardProps {
	property: Property;
	likePropertyHandler: any;
}

const RentalCarCard = (props: RentalCarCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Local state for favorites
	const [isAnimating, setIsAnimating] = useState<boolean>(false);

	// Check if favorited - prioritize backend data (meLiked)
	const isFavorited = property?.meLiked && property?.meLiked[0]?.myFavorite ? true : false;

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		await router.push({
			pathname: '/property/detail',
			query: { id: propertyId },
		});
	};

	const handleRentNow = (e: React.MouseEvent) => {
		e.stopPropagation();
		pushDetailHandler(property._id);
	};

	const handleFavoriteClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Check if user is logged in
		if (!user?._id) {
			sweetMixinErrorAlert('Please login first to like cars');
			return;
		}

		// Animation
		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 300);

		// Call backend handler (this will update backend and refetch data)
		if (likePropertyHandler) {
			await likePropertyHandler(user, property._id);
		}
	};

	const imageCount = property?.propertyImages?.length || 1;

	return (
		<Stack className="rental-card-box">
			{/* Image Section - 60% */}
			<Box
				component={'div'}
				className={'card-img'}
				style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				onClick={() => pushDetailHandler(property._id)}
				role="img"
				aria-label={`${property?.propertyBrand} ${property.propertyTitle} car image`}
			>
				{/* Image Count Indicator - Top Left */}
				<div className={'image-count-badge'}>
					<span>1/{imageCount}</span>
				</div>

				{/* Heart Icon - Top Right */}
				<IconButton 
					className={`heart-icon ${isAnimating ? 'heart-animating' : ''}`}
					size="small"
					onClick={handleFavoriteClick}
				>
					{isFavorited ? (
						<FavoriteIcon />
					) : (
						<FavoriteBorderIcon />
					)}
				</IconButton>

			</Box>

			{/* White Info Section - 40% */}
			<Box component={'div'} className={'card-info'}>
				{/* Price Badge */}
				<div className={'price-badge'}>
					€{property.propertyRentPrice || 0} / day
				</div>

				{/* Car Title */}
				<strong 
					className={'car-title'} 
					onClick={() => pushDetailHandler(property._id)}
					title={`${property?.propertyBrand} ${property.propertyTitle}`}
				>
					{property?.propertyBrand} {property.propertyTitle}
				</strong>

				{/* Car Specs */}
				<div className={'car-specs'}>
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
						<span>{property?.propertySeats} SEATS</span>
					</div>
				</div>

				{/* Bottom Action Bar */}
				<div className={'bottom-action-bar'}>
					{/* Left: Rent/Sale Badge */}
					<Chip
						label={property.isForRent && property.isForSale ? 'Rent / Sale' : property.isForRent ? 'Rent' : property.isForSale ? 'Sale' : 'Popular'}
						size="small"
						className="rent-sale-badge"
					/>
					
					{/* Right: Views and Likes */}
					<div className="view-like-stats">
						<div className="stat-item">
							<VisibilityIcon fontSize="small" />
							<span>{property?.propertyViews || 0}</span>
						</div>
						<div className="stat-item">
							<FavoriteBorderIcon fontSize="small" />
							<span>{property?.propertyLikes || 0}</span>
						</div>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default RentalCarCard;
