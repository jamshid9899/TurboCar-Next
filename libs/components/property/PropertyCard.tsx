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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import StarIcon from '@mui/icons-material/Star';
import { formatterStr } from '../../utils';
import { PropertyCondition, PropertyFuelType, PropertyType, PropertyBrand, PropertyStatus } from '../../enums/property.enum';

interface PropertyCardProps {
	property: Property;
	likePropertyHandler?: (user: any, id: string) => void;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Check if car is new (created within last 7 days)
	const isNewArrival = useMemo(() => {
		if (!property?.createdAt) return false;
		const createdDate = new Date(property.createdAt);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - createdDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 7;
	}, [property?.createdAt]);

	// Check if electric car
	const isElectric = useMemo(() => {
		return property?.propertyFuelType === PropertyFuelType.ELECTRIC || property?.propertyType === PropertyType.ELECTRIC;
	}, [property?.propertyFuelType, property?.propertyType]);

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
		return property?.propertyBrand && luxuryBrands.includes(property.propertyBrand);
	}, [property?.propertyBrand]);

	// Get fuel type display text
	const getFuelTypeText = () => {
		switch (property?.propertyFuelType) {
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
				return property?.propertyFuelType || 'N/A';
		}
	};

	// Get transmission display text
	const getTransmissionText = () => {
		switch (property?.propertyTransmission) {
			case 'AUTOMATIC':
				return 'Auto';
			case 'MANUAL':
				return 'Manual';
			case 'CVT':
				return 'CVT';
			default:
				return property?.propertyTransmission || 'N/A';
		}
	};

	/** HANDLERS **/
	const pushPropertyDetail = async (id: string) => {
		await router.push({
			pathname: '/property/detail',
			query: { id: id },
		});
	};

	if (device === 'mobile') {
		// Mobile version - simplified card layout
		const imageUrl = property?.propertyImages && property.propertyImages.length > 0 && property.propertyImages[0]
			? `${REACT_APP_API_URL}/${property.propertyImages[0]}` 
			: '/img/banner/default-car.jpg';

		const BoxAny = Box as any;

		return (
			<Stack 
				className="property-card-mobile"
				sx={{
					width: '100%',
					backgroundColor: '#ffffff',
					borderRadius: '12px',
					overflow: 'hidden',
					boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
				}}
			>
				<BoxAny
					onClick={() => pushPropertyDetail(property._id)}
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							pushPropertyDetail(property._id);
						}
					}}
					role="button"
					tabIndex={0}
					aria-label={`View details of ${property?.propertyTitle || 'car'}`}
					style={{
						position: 'relative',
						width: '100%',
						height: '200px',
						cursor: 'pointer',
						backgroundImage: `url(${imageUrl})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
					sx={{
						'&:focus': {
							outline: '2px solid #f17742',
							outlineOffset: '2px',
						},
					}}
				>
					{likePropertyHandler && (
						<IconButton 
							className="like-btn" 
							onClick={(e: any) => {
								e.preventDefault();
								e.stopPropagation();
								if (likePropertyHandler) {
									likePropertyHandler(user, property._id);
								}
							}}
							aria-label={property?.meLiked && property?.meLiked[0]?.myFavorite ? 'Remove from favorites' : 'Add to favorites'}
							aria-pressed={property?.meLiked && property?.meLiked[0]?.myFavorite ? true : false}
							sx={{
								position: 'absolute',
								top: '8px',
								right: '8px',
								zIndex: 100,
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								width: '32px',
								height: '32px',
								'&:focus': {
									outline: '2px solid #f17742',
									outlineOffset: '2px',
								},
							}}
						>
							{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: '#f17742', fontSize: '18px' }} />
							) : (
								<FavoriteBorderIcon style={{ color: '#181a20', fontSize: '18px' }} />
							)}
						</IconButton>
					)}
					<Stack
						className="property-status"
						sx={{
							position: 'absolute',
							top: '8px',
							left: '8px',
							flexDirection: 'row',
							gap: '4px',
						}}
					>
						{property?.isForSale && <Chip label="FOR SALE" size="small" sx={{ backgroundColor: '#EB6753', color: '#ffffff', fontSize: '10px', height: '20px' }} />}
						{property?.isForRent && <Chip label="FOR RENT" size="small" sx={{ backgroundColor: '#F17742', color: '#ffffff', fontSize: '10px', height: '20px' }} />}
					</Stack>
				</BoxAny>

				<Stack sx={{ padding: '12px' }} spacing={1}>
					<Typography 
						variant="h6" 
						sx={{ 
							fontSize: '16px', 
							fontWeight: 700,
							cursor: 'pointer',
						}}
						onClick={() => pushPropertyDetail(property._id)}
					>
						{property?.propertyTitle}
					</Typography>
					<Typography variant="body2" sx={{ color: '#717171', fontSize: '14px' }}>
						{property?.propertyLocation}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: '8px' }}>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							{property?.propertyYear || 'N/A'}
						</Typography>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							•
						</Typography>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							{formatterStr(property?.propertyMileage || 0)} km
						</Typography>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							•
						</Typography>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							{getFuelTypeText()}
						</Typography>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							•
						</Typography>
						<Typography variant="caption" sx={{ color: '#717171' }}>
							{getTransmissionText()}
						</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700 }}>
							€{formatterStr(property?.propertyPrice)}
						</Typography>
						<Stack direction="row" spacing={1} alignItems="center">
							<RemoveRedEyeIcon sx={{ fontSize: '16px', color: '#717171' }} />
							<Typography variant="caption" sx={{ color: '#717171' }}>
								{property?.propertyViews || 0}
							</Typography>
							<FavoriteIcon sx={{ fontSize: '16px', color: '#f17742' }} />
							<Typography variant="caption" sx={{ color: '#717171' }}>
								{property?.propertyLikes || 0}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		const imageUrl = property?.propertyImages && property.propertyImages.length > 0 && property.propertyImages[0]
			? `${REACT_APP_API_URL}/${property.propertyImages[0]}` 
			: '/img/banner/default-car.jpg';
		
		const BoxAny = Box as any;
		
		return (
			<Stack className="property-card">
				<BoxAny
					className="property-img"
					onClick={(e: React.MouseEvent) => {
						// Don't navigate if clicking on like button
						const target = e.target as HTMLElement;
						if (target.closest('.like-btn') || target.closest('.MuiIconButton-root')) {
							return;
						}
						pushPropertyDetail(property._id);
					}}
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							pushPropertyDetail(property._id);
						}
					}}
					role="button"
					tabIndex={0}
					aria-label={`View details of ${property?.propertyTitle || 'car'}`}
					style={{
						position: 'relative',
						width: '100%',
						height: '320px',
						minHeight: '320px',
						cursor: 'pointer',
						overflow: 'hidden',
						borderRadius: '12px 12px 0 0',
						backgroundImage: `url(${imageUrl})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
					sx={{
						'&:focus': {
							outline: '2px solid #f17742',
							outlineOffset: '2px',
						},
					}}
				>
					{likePropertyHandler && (
						<IconButton 
							className="like-btn" 
						onClick={(e: React.MouseEvent) => {
							e.preventDefault();
							e.stopPropagation();
							if (likePropertyHandler) {
								likePropertyHandler(user, property._id);
							}
						}}
							aria-label={property?.meLiked && property?.meLiked[0]?.myFavorite ? 'Remove from favorites' : 'Add to favorites'}
							aria-pressed={property?.meLiked && property?.meLiked[0]?.myFavorite ? true : false}
							sx={{
								position: 'absolute',
								top: '12px',
								right: '12px',
								zIndex: 100,
								pointerEvents: 'auto',
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								backdropFilter: 'blur(10px)',
								width: '36px',
								height: '36px',
								cursor: 'pointer',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 1)',
								},
								'&:focus': {
									outline: '2px solid #f17742',
									outlineOffset: '2px',
								},
							}}
						>
							{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: '#f17742', fontSize: '20px', pointerEvents: 'none' }} />
							) : (
								<FavoriteBorderIcon style={{ color: '#181a20', fontSize: '20px', pointerEvents: 'none' }} />
							)}
						</IconButton>
					)}
					<div className="property-status">
						{property?.isForSale && <span className="sale">🚗 FOR SALE</span>}
						{property?.isForRent && <span className="rent">🚗 FOR RENT</span>}
						{isNewArrival && property?.propertyCondition === PropertyCondition.NEW && (
							<Chip
								label="NEW"
								size="small"
								sx={{
									height: '22px',
									fontSize: '9px',
									fontWeight: 700,
									backgroundColor: '#10B981',
									color: '#ffffff',
									marginLeft: '6px',
									'& .MuiChip-label': {
										padding: '0 6px',
									},
								}}
							/>
						)}
						{isElectric && (
							<Chip
								icon={<ElectricCarIcon sx={{ fontSize: '12px !important', color: '#ffffff !important' }} />}
								label="ELECTRIC"
								size="small"
								sx={{
									height: '22px',
									fontSize: '9px',
									fontWeight: 700,
									backgroundColor: '#3B82F6',
									color: '#ffffff',
									marginLeft: '6px',
									'& .MuiChip-label': {
										padding: '0 4px',
									},
								}}
							/>
						)}
						{isPremium && (
							<Chip
								icon={<StarIcon sx={{ fontSize: '12px !important', color: '#FFD700 !important' }} />}
								label="PREMIUM"
								size="small"
								sx={{
									height: '22px',
									fontSize: '9px',
									fontWeight: 700,
									backgroundColor: '#1F2937',
									color: '#FFD700',
									marginLeft: '6px',
									'& .MuiChip-label': {
										padding: '0 4px',
									},
								}}
							/>
						)}
					</div>
				</BoxAny>

				<Stack className="property-info">
					<Stack 
						className="property-title" 
						onClick={() => pushPropertyDetail(property._id)}
						onKeyDown={(e: React.KeyboardEvent) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								pushPropertyDetail(property._id);
							}
						}}
						role="button"
						tabIndex={0}
						aria-label={`View details of ${property?.propertyTitle || 'car'}`}
						sx={{
							cursor: 'pointer',
							'&:focus': {
								outline: '2px solid #f17742',
								outlineOffset: '2px',
								borderRadius: '4px',
							},
						}}
					>
						<Typography className="title" component="h3">{property?.propertyTitle}</Typography>
						<Typography className="location" component="p">{property?.propertyLocation}</Typography>
					</Stack>

					<Stack className="property-specs">
						<Stack className="spec">
							<CalendarTodayIcon sx={{ fontSize: 18, color: '#717171' }} />
							<span>{property?.propertyYear || 'N/A'}</span>
						</Stack>
						<Stack className="spec">
							<SpeedIcon sx={{ fontSize: 18, color: '#717171' }} />
							<span>{formatterStr(property?.propertyMileage || 0)} km</span>
						</Stack>
						<Stack className="spec">
							<LocalGasStationIcon sx={{ fontSize: 18, color: '#717171' }} />
							<span>{getFuelTypeText()}</span>
						</Stack>
						<Stack className="spec">
							<SettingsIcon sx={{ fontSize: 18, color: '#717171' }} />
							<span>{getTransmissionText()}</span>
						</Stack>
					</Stack>

					<Stack className="property-details">
						<Stack className="detail">
							<span className="label">Brand:</span>
							<span className="value">{property?.propertyBrand}</span>
						</Stack>
						<Stack className="detail">
							<span className="label">Transmission:</span>
							<span className="value">{property?.propertyTransmission}</span>
						</Stack>
					</Stack>

					<Stack className="property-bottom">
						<BoxAny className="property-price">
							<Typography className="price">€{formatterStr(property?.propertyPrice)}</Typography>
							{property?.isForRent && property?.propertyRentPrice && (
								<Typography className="rent-price">€{formatterStr(property.propertyRentPrice)}/day</Typography>
							)}
						</BoxAny>
						<Stack className="property-stats">
							<Stack className="stat">
								<RemoveRedEyeIcon />
								<span>{property?.propertyViews || 0}</span>
							</Stack>
							<Stack className="stat">
								<FavoriteIcon style={{ color: '#f17742' }} />
								<span>{property?.propertyLikes || 0}</span>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default React.memo(PropertyCard);