import React from 'react';
import { Stack, Box, Divider, Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularCarCardProps {
	property: Property;
}

const PopularCarCard = (props: PopularCarCardProps) => {
	const { property } = props;
	const device = useDeviceDetect();
	const router = useRouter(); // ✅ FIXED: Added destructuring
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
			<Stack className="popular-car-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					{/* Top Rank Badge */}
					{property?.propertyRank && property?.propertyRank >= 50 && (
						<div className={'status'}>
							<img src="/img/icons/fire.svg" alt="" />
							<span>Hot</span>
						</div>
					)}

					{/* Price */}
					<div className={'price'}>${property.propertyPrice?.toLocaleString()}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Brand + Model */}
					<strong className={'title'}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					
					{/* Year + Transmission */}
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyTransmission}
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
							<EventSeatIcon fontSize="small" />
							<span>{property?.propertySeats} seats</span>
						</div>
					</div>
					
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					
					<div className={'bott'}>
						{/* Sale/Rent */}
						<p>{property?.isForRent ? 'rent' : 'sale'}</p>
						
						{/* Views */}
						<div className="view-like-box">
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-car-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
				>
					{/* Top Rank Badge */}
					{property?.propertyRank && property?.propertyRank >= 50 && (
						<div className={'status'}>
							<img src="/img/icons/fire.svg" alt="" />
							<span>Hot</span>
						</div>
					)}

					{/* Price */}
					<div className={'price'}>${property.propertyPrice?.toLocaleString()}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					{/* Brand + Model */}
					<strong className={'title'}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					
					{/* Year + Transmission */}
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyTransmission}
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
							<EventSeatIcon fontSize="small" />
							<span>{property?.propertySeats} seats</span>
						</div>
					</div>
					
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					
					<div className={'bott'}>
						{/* Sale/Rent */}
						<p>{property?.isForRent ? 'rent' : 'sale'}</p>
						
						{/* Views */}
						<div className="view-like-box">
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularCarCard;