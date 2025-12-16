// libs/components/homepage/TopDealerCard.tsx
import React from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StarIcon from '@mui/icons-material/Star';

interface TopDealerCardProps {
	dealer: Member;
}

const TopDealerCard = (props: TopDealerCardProps) => {
	const { dealer } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const dealerImage = dealer?.memberImage
		? `${REACT_APP_API_URL}/${dealer?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const pushDetailHandler = async () => {
		await router.push({
			pathname: '/agent/detail',
			query: { agentId: dealer?._id },
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-dealer-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'dealer-img'}
					style={{ backgroundImage: `url(${dealerImage})` }}
				>
					{/* Rank Badge */}
					{dealer?.memberRank && dealer?.memberRank >= 50 && (
						<div className={'rank-badge'}>
							<StarIcon fontSize="small" />
							<span>Top</span>
						</div>
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'name'}>{dealer?.memberNick}</strong>
					<p className={'type'}>{dealer?.memberType}</p>
					
					<div className={'stats'}>
						<div>
							<DirectionsCarIcon fontSize="small" />
							<span>{dealer?.memberProperties} Cars</span>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-dealer-card" onClick={pushDetailHandler}>
				<Box
					component={'div'}
					className={'dealer-img'}
					style={{ backgroundImage: `url(${dealerImage})` }}
				>
					{/* Rank Badge */}
					{dealer?.memberRank && dealer?.memberRank >= 50 && (
						<div className={'rank-badge'}>
							<StarIcon fontSize="small" />
							<span>Top</span>
						</div>
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'name'}>{dealer?.memberNick}</strong>
					<p className={'type'}>{dealer?.memberType}</p>
					
					<div className={'stats'}>
						<div>
							<DirectionsCarIcon fontSize="small" />
							<span>{dealer?.memberProperties} Cars</span>
						</div>
						<div>
							<StarIcon fontSize="small" />
							<span>{dealer?.memberRank} Points</span>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TopDealerCard;