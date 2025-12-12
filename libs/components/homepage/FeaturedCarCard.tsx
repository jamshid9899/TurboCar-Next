import React from 'react';
import { Stack, Box, Divider, Typography, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

interface FeaturedCarCardProps {
	property: Property;
}

const FeaturedCarCard = ({ property }: FeaturedCarCardProps) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const image = property?.propertyImages?.[0]
		? `${REACT_APP_API_URL}/${property.propertyImages[0]}`
		: '/img/car/default-car.jpg';

	const pushDetailHandler = async () => {
		await router.push({
			pathname: '/property/detail',
			query: { id: property?._id },
		});
	};

	return (
		<Stack className="featured-car-card" onClick={pushDetailHandler}>
			<Box className="card-img" style={{ backgroundImage: `url(${image})` }}>
				<div className="price-tag">
					${property?.propertyPrice?.toLocaleString()}
				</div>

				<Chip
					label={property?.propertyCondition}
					size="small"
					className="condition-badge"
					color={property?.propertyCondition === 'NEW' ? 'success' : 'default'}
				/>

				{property?.propertyRank >= 50 && (
					<div className="rank-badge">
						<img src="/img/icons/star.svg" alt="featured" />
						<span>Featured</span>
					</div>
				)}
			</Box>

			<Box className="info">
				<strong className="title">
					{property?.propertyBrand} {property?.propertyTitle}
				</strong>

				<p className="desc">
					{property?.propertyYear} · {property?.propertyLocation}
				</p>

				<div className="options">
					<div><DirectionsCarIcon fontSize="small" /> {property?.propertyType}</div>
					<div><LocalGasStationIcon fontSize="small" /> {property?.propertyFuelType}</div>
					<div><SpeedIcon fontSize="small" /> {property?.propertyMileage?.toLocaleString()} km</div>
				</div>

				<Divider sx={{ my: 2 }} />

				<div className="bott">
					<p>
						{property?.isForSale && 'For Sale'}
						{property?.isForSale && property?.isForRent && ' / '}
						{property?.isForRent && 'For Rent'}
					</p>

					<div className="view-like-box">
						<IconButton size="small"><RemoveRedEyeIcon /></IconButton>
						<Typography>{property?.propertyViews}</Typography>
						<IconButton size="small">
							<FavoriteIcon
								style={{ color: property?.meLiked?.[0]?.myFavorite ? 'red' : undefined }}
							/>
						</IconButton>
						<Typography>{property?.propertyLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default FeaturedCarCard;
