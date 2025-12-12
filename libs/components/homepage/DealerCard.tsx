import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

interface DealerCardProps {
	dealer: Member;
}

const DealerCard = (props: DealerCardProps) => {
	const { dealer } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const dealerImage = dealer?.memberImage
		? `${process.env.REACT_APP_API_URL}/${dealer?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const pushDealerHandler = async () => {
		await router.push({
			pathname: '/member',
			query: { dealerId: dealer?._id },
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className="dealer-card" onClick={pushDealerHandler}>
				{/* Dealer Image */}
				<img src={dealerImage} alt={dealer?.memberNick} />

				{/* Dealer Info */}
				<strong>{dealer?.memberNick}</strong>
				
				{/* Type Badge */}
				<Chip 
					label={dealer?.memberType} 
					size="small"
					color="primary"
					variant="outlined"
				/>

				{/* Stats */}
				<div className="dealer-stats">
					<div className="stat-item">
						<DirectionsCarIcon fontSize="small" />
						<span>{dealer?.memberProperties || 0} cars</span>
					</div>
					<div className="stat-item">
						<StarIcon fontSize="small" style={{ color: '#FFD700' }} />
						<span>{dealer?.memberRank || 0} points</span>
					</div>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="dealer-card" onClick={pushDealerHandler}>
				{/* Dealer Image */}
				<img src={dealerImage} alt={dealer?.memberNick} />

				{/* Dealer Info */}
				<strong>{dealer?.memberNick}</strong>
				
				{/* Type Badge */}
				<Chip 
					label={dealer?.memberType} 
					size="small"
					color="primary"
					variant="outlined"
				/>

				{/* Stats */}
				<div className="dealer-stats">
					<div className="stat-item">
						<DirectionsCarIcon fontSize="small" />
						<Typography variant="body2">
							{dealer?.memberProperties || 0} cars
						</Typography>
					</div>
					<div className="stat-item">
						<StarIcon fontSize="small" style={{ color: '#FFD700' }} />
						<Typography variant="body2">
							{dealer?.memberRank || 0} points
						</Typography>
					</div>
				</div>
			</Stack>
		);
	}
};

export default DealerCard;