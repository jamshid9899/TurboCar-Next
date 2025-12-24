import React, { useMemo } from 'react';
import { Stack, Box, Typography, IconButton, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { Property } from '../../types/property/property';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { formatterStr } from '../../utils';
import { PropertyCondition, PropertyFuelType, PropertyType, PropertyBrand, PropertyStatus } from '../../enums/property.enum';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import StarIcon from '@mui/icons-material/Star';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler?: (user: any, id: string) => void;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Extract property values to avoid complex type inference issues
	const {
		_id,
		propertyImages,
		isForSale,
		isForRent,
		propertyRank,
		propertyTitle,
		propertyLocation,
		propertyYear,
		propertyMileage,
		propertyFuelType,
		propertyTransmission,
		propertyPrice,
		propertyRentPrice,
		propertyViews,
		propertyLikes,
		memberData,
		propertyCondition,
		propertyType,
		propertyBrand,
		propertyStatus,
		createdAt,
	} = property;

	// Check if car is new (created within last 7 days)
	const isNewArrival = useMemo(() => {
		if (!createdAt) return false;
		const createdDate = new Date(createdAt);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - createdDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 7;
	}, [createdAt]);

	// Check if electric car
	const isElectric = useMemo(() => {
		return propertyFuelType === PropertyFuelType.ELECTRIC || propertyType === PropertyType.ELECTRIC;
	}, [propertyFuelType, propertyType]);

	// Check if premium/luxury brand
	const isPremium = useMemo(() => {
		const luxuryBrands = [
			PropertyBrand.PORSCHE,
			PropertyBrand.FERRARI,
			PropertyBrand.LAMBORGHINI,
			PropertyBrand.BENTLEY,
			PropertyBrand.ROLLS_ROYCE,
			PropertyBrand.ASTON_MARTIN,
			PropertyBrand.MCLAREN,
			PropertyBrand.MASERATI,
			PropertyBrand.BUGATTI,
		];
		return luxuryBrands.includes(propertyBrand);
	}, [propertyBrand]);

	// Get fuel type display text
	const getFuelTypeText = () => {
		switch (propertyFuelType) {
			case PropertyFuelType.GASOLINE:
				return 'Petrol';
			case PropertyFuelType.DIESEL:
				return 'Diesel';
			case PropertyFuelType.ELECTRIC:
				return 'Electric';
			case PropertyFuelType.HYBRID:
				return 'Hybrid';
			case PropertyFuelType.PLUG_IN_HYBRID:
				return 'Plug-in Hybrid';
			default:
				return propertyFuelType || 'N/A';
		}
	};

	// Get transmission display text
	const getTransmissionText = () => {
		switch (propertyTransmission) {
			case 'AUTOMATIC':
				return 'Auto';
			case 'MANUAL':
				return 'Manual';
			case 'CVT':
				return 'CVT';
			default:
				return propertyTransmission || 'N/A';
		}
	};

	/** HANDLERS **/
	const pushPropertyDetail = async (id: string) => {
		await router.push({
			pathname: '/property/detail',
			query: { id: id },
		});
	};

	const handleImageClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		pushPropertyDetail(_id);
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (likePropertyHandler) {
			likePropertyHandler(user, _id);
		}
	};

	const imageUrl = useMemo(() => {
		return propertyImages?.[0] 
			? `${REACT_APP_API_URL}/${propertyImages[0]}` 
			: '/img/banner/default-car.jpg';
	}, [propertyImages]);

	const cardStyle = useMemo<React.CSSProperties>(() => ({
		backgroundImage: `url(${imageUrl})`,
	}), [imageUrl]);

	if (device === 'mobile') {
		return <div>BIG CARD MOBILE</div>;
	} else {
		// @ts-ignore - TypeScript limitation with complex union types in Material-UI Box
		return (
			<Stack className="property-big-card" onClick={(e) => e.stopPropagation()}>
				<div
					className="card-img"
					style={{ ...cardStyle, cursor: 'pointer' }}
					onClick={handleImageClick}
				>
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box className="card-status">
						{isForSale && <span className="sale">🚗 FOR SALE</span>}
						{isForRent && <span className="rent">🚗 FOR RENT</span>}
						{isNewArrival && propertyCondition === PropertyCondition.NEW && (
							<Chip
								label="NEW ARRIVAL"
								size="small"
								sx={{
									height: '24px',
									fontSize: '10px',
									fontWeight: 700,
									backgroundColor: '#10B981',
									color: '#ffffff',
									'& .MuiChip-label': {
										padding: '0 8px',
									},
								}}
							/>
						)}
						{isElectric && (
							<Chip
								icon={<ElectricCarIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
								label="ELECTRIC"
								size="small"
								sx={{
									height: '24px',
									fontSize: '10px',
									fontWeight: 700,
									backgroundColor: '#3B82F6',
									color: '#ffffff',
									'& .MuiChip-label': {
										padding: '0 6px',
									},
								}}
							/>
						)}
						{isPremium && (
							<Chip
								icon={<StarIcon sx={{ fontSize: '14px !important', color: '#FFD700 !important' }} />}
								label="PREMIUM"
								size="small"
								sx={{
									height: '24px',
									fontSize: '10px',
									fontWeight: 700,
									backgroundColor: '#1F2937',
									color: '#FFD700',
									'& .MuiChip-label': {
										padding: '0 6px',
									},
								}}
							/>
						)}
						{propertyStatus === PropertyStatus.SOLD && (
							<Chip
								label="SOLD"
								size="small"
								sx={{
									height: '24px',
									fontSize: '10px',
									fontWeight: 700,
									backgroundColor: '#EF4444',
									color: '#ffffff',
									'& .MuiChip-label': {
										padding: '0 8px',
									},
								}}
							/>
						)}
					</Box>
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box className="card-rank">
						<img src="/img/icons/star.svg" alt="" />
						<span>{propertyRank || 0}</span>
					</Box>
				</div>

				<Stack className="card-info">
					<Stack 
						className="info-top" 
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							pushPropertyDetail(_id);
						}} 
						sx={{ cursor: 'pointer' }}
					>
						<Typography className="car-title">{propertyTitle}</Typography>
						<Typography className="car-location">{propertyLocation}</Typography>
					</Stack>

					<Stack className="info-specs">
						<Stack className="spec">
							<img src="/img/icons/calendar.svg" alt="year" />
							<span>{propertyYear || 'N/A'}</span>
						</Stack>
						<Stack className="spec">
							<img src="/img/icons/speedometer.svg" alt="mileage" />
							<span>{formatterStr(propertyMileage || 0)} km</span>
						</Stack>
						<Stack className="spec">
							<img src="/img/icons/fuel.svg" alt="fuel" />
							<span>{getFuelTypeText()}</span>
						</Stack>
						<Stack className="spec">
							<img src="/img/icons/gear.svg" alt="transmission" />
							<span>{getTransmissionText()}</span>
						</Stack>
					</Stack>

					<Stack className="info-bottom">
						{/* @ts-ignore - TypeScript limitation with complex union types */}
						<Box className="price-box">
							<Typography className="price">€{formatterStr(propertyPrice)}</Typography>
							{isForRent && propertyRentPrice && (
								<Typography className="rent-price">From €{formatterStr(propertyRentPrice)}/day</Typography>
							)}
							{!isForRent && (
								<Typography className="rent-price" sx={{ fontSize: '12px', color: '#717171', marginTop: '2px' }}>
									Starting from
								</Typography>
							)}
						</Box>
						<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
							<Stack className="dealer-info">
								<img
									src={
										memberData?.memberImage
											? `${REACT_APP_API_URL}/${memberData.memberImage}`
											: '/img/profile/defaultUser.svg'
									}
									alt="dealer"
								/>
								<span>{memberData?.memberFullName || memberData?.memberNick || 'Dealer'}</span>
							</Stack>
							<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
								<IconButton color={'default'} sx={{ padding: '4px' }}>
									<RemoveRedEyeIcon sx={{ fontSize: '20px' }} />
								</IconButton>
								<Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
									{propertyViews || 0}
								</Typography>
								{likePropertyHandler && (
									<IconButton
										color={'default'}
										sx={{ padding: '4px' }}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleLikeClick(e);
										}}
									>
										{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon color={'primary'} sx={{ fontSize: '20px' }} />
										) : (
											<FavoriteBorderIcon sx={{ fontSize: '20px' }} />
										)}
									</IconButton>
								)}
								{likePropertyHandler && (
									<Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
										{propertyLikes || 0}
									</Typography>
								)}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PropertyBigCard;