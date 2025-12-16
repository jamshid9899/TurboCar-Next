import React from 'react';
import { Stack, Box, Divider, Typography, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';

interface FeaturedCarCardProps {
	property: Property;
}

const FeaturedCarCard = (props: FeaturedCarCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async () => {
		await router.push({
			pathname: '/property/detail',
			query: { id: property?._id },
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className="featured-car-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					{/* Price Tag */}
					<div className="price-tag">${property?.propertyPrice?.toLocaleString()}</div>
					
					{/* Condition Badge */}
					<Chip 
						label={property?.propertyCondition} 
						size="small"
						className="condition-badge"
						color={property?.propertyCondition === 'NEW' ? 'success' : 'default'}
					/>
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Brand + Model */}
					<strong className={'title'}>
						{property?.propertyBrand} {property?.propertyTitle}
					</strong>
					
					{/* Year + Location */}
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyLocation}
					</p>
					
					{/* Car Details */}
					<div className={'options'}>
						<div>
							<DirectionsCarIcon fontSize="small" />
							<span>{property?.propertyType}</span>
						</div>
						<div>
							<LocalGasStationIcon fontSize="small" />
							<span>{property?.propertyFuelType}</span>
						</div>
						<div>
							<SpeedIcon fontSize="small" />
							<span>{property?.propertyMileage?.toLocaleString()} km</span>
						</div>
					</div>
					
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					
					<div className={'bott'}>
						{/* Sale/Rent Status */}
						<p>
							{property.isForSale ? 'For Sale' : ''} 
							{property.isForSale && property.isForRent && ' / '} 
							{property.isForRent ? 'For Rent' : ''}
						</p>
						
						{/* Views + Likes */}
						<div className="view-like-box">
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} size="small">
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="featured-car-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					{/* Price Tag */}
					<div className="price-tag">${property?.propertyPrice?.toLocaleString()}</div>
					
					{/* Condition Badge */}
					<Chip 
						label={property?.propertyCondition} 
						size="small"
						className="condition-badge"
						color={property?.propertyCondition === 'NEW' ? 'success' : 'default'}
					/>
					
					{/* Top Rank Badge */}
					{property?.propertyRank && property?.propertyRank >= 50 && (
						<div className={'rank-badge'}>
							<img src="/img/icons/star.svg" alt="" />
							<span>Featured</span>
						</div>
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Brand + Model */}
					<strong className={'title'}>
						{property?.propertyBrand} {property?.propertyTitle}
					</strong>
					
					{/* Year + Location */}
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyLocation}
					</p>
					
					{/* Car Details */}
					<div className={'options'}>
						<div>
							<DirectionsCarIcon fontSize="small" />
							<span>{property?.propertyType}</span>
						</div>
						<div>
							<LocalGasStationIcon fontSize="small" />
							<span>{property?.propertyFuelType}</span>
						</div>
						<div>
							<SpeedIcon fontSize="small" />
							<span>{property?.propertyMileage?.toLocaleString()} km</span>
						</div>
					</div>
					
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					
					<div className={'bott'}>
						{/* Sale/Rent Status */}
						<p>
							{property.isForSale ? 'For Sale' : ''} 
							{property.isForSale && property.isForRent && ' / '} 
							{property.isForRent ? 'For Rent' : ''}
						</p>
						
						{/* Views + Likes */}
						<div className="view-like-box">
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} size="small">
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default FeaturedCarCard;
