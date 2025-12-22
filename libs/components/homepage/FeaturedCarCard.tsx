import React, { useState } from 'react';
import { Stack, Box, Chip, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface FeaturedCarCardProps {
	property: Property;
	likePropertyHandler: any;
}

const FeaturedCarCard = (props: FeaturedCarCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Local state for animation
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

	const handleActionClick = (e: React.MouseEvent) => {
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

		// Call backend handler
		if (likePropertyHandler) {
			await likePropertyHandler(user, property._id);
		}
	};

	// Calculate rating (mock data, you can use actual rating from property)
	const rating = 4.5;
	const imageCount = property?.propertyImages?.length || 1;
	
	// Check if car is NEW (from backend propertyCondition)
	const isNew = property?.propertyCondition === 'NEW';
	
	// Check if HOT DEAL (high rank - using propertyRank >= 70 as indicator)
	const isHotDeal = property?.propertyRank && property.propertyRank >= 70;
	
	// Determine status badge text
	const statusBadgeText = property.isForRent ? 'AVAILABLE FOR RENT' : property.isForSale ? 'FOR SALE' : 'FEATURED';
	
	// Determine price display
	const priceDisplay = property.isForRent && property.propertyRentPrice
		? `€${property.propertyRentPrice} / day`
		: property.propertyPrice
		? `From €${property.propertyPrice?.toLocaleString()}`
		: 'Price on request';
	
	// Determine button text
	const buttonText = property.isForRent ? 'RENT NOW' : property.isForSale ? 'BUY NOW' : 'VIEW DETAILS';

	return (
		<Stack className="rental-card-box">
			{/* Image Section - 60% */}
			<Box
				component={'div'}
				className={'card-img'}
				style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				onClick={() => pushDetailHandler(property._id)}
			>
				{/* Image Count Indicator - Top Left */}
				<div className={'image-count-badge'}>
					<span>1/{imageCount}</span>
				</div>
				
				{/* Status Badge - Top Left */}
				<Chip 
					label={statusBadgeText}
					size="small"
					className="available-badge"
				/>
				
				{/* NEW Badge - if created this week */}
				{isNew && (
					<Chip 
						label="NEW"
						size="small"
						className="new-badge"
					/>
				)}
				
				{/* HOT DEAL Badge - if high rank */}
				{isHotDeal && (
					<Chip 
						label="HOT DEAL"
						size="small"
						className="hot-deal-badge"
					/>
				)}

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
					{priceDisplay}
				</div>

				{/* Car Title */}
				<strong className={'car-title'} onClick={() => pushDetailHandler(property._id)}>
					{property?.propertyBrand} {property.propertyTitle}
				</strong>

				{/* Car Desc */}
				<p className={'car-desc'}>
					{property?.propertyYear} - {property?.propertyType}
				</p>

				{/* Rating Stars */}
				<div className={'rating-stars'}>
					<StarIcon className="star-icon" />
					<StarIcon className="star-icon" />
					<StarIcon className="star-icon" />
					<StarIcon className="star-icon" />
					<StarIcon className="star-icon star-half" />
					<span className="rating-text">{rating}</span>
				</div>

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
						label={property.isForRent && property.isForSale ? 'Rent / Sale' : property.isForRent ? 'Rent' : property.isForSale ? 'Sale' : 'Featured'}
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

export default FeaturedCarCard;
