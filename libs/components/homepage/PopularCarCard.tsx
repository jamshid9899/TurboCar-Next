import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularCarCardProps {
	property: Property;
	likePropertyHandler: any;
}

const PopularCarCard = (props: PopularCarCardProps) => {
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

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => pushDetailHandler(property._id)}
				>
					{property?.propertyRank && property?.propertyRank >= 50 ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}
					<div className={'price'}>${property.propertyPrice?.toLocaleString()}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(property._id)}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyTransmission}
					</p>
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
						<p>{property?.isForRent ? 'rent' : 'sale'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews || 0}</Typography>
							{likePropertyHandler && (
								<>
									<IconButton 
										color={'default'} 
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
					{property && property?.propertyRank >= 50 ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}
					<div className={'price'}>${property.propertyPrice?.toLocaleString()}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(property._id)}>
						{property?.propertyBrand} {property.propertyTitle}
					</strong>
					<p className={'desc'}>
						{property?.propertyYear} · {property?.propertyTransmission}
					</p>
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
						<p>{property?.isForRent ? 'rent' : 'sale'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews || 0}</Typography>
							{likePropertyHandler && (
								<>
									<IconButton 
										color={'default'} 
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
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularCarCard;