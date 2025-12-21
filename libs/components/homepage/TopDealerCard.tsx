import React from 'react';
import { Stack, Box, Typography, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { Member } from '../../types/member/member';
import { useRouter } from 'next/router';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopDealerCardProps {
	dealer: Member;
	subscribeHandler?: (id: string) => void;
	unsubscribeHandler?: (id: string) => void;
}

const TopDealerCard = (props: TopDealerCardProps) => {
	const { dealer, subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushAgentDetail = async (id: string) => {
		await router.push({
			pathname: '/agent/detail',
			query: { agentId: id },
		});
	};

	const handleFollowClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing) {
			if (unsubscribeHandler) unsubscribeHandler(dealer._id);
		} else {
			if (subscribeHandler) subscribeHandler(dealer._id);
		}
	};

	if (device === 'mobile') {
		return <div>DEALER CARD MOBILE</div>;
	} else {
		return (
			<Stack className="dealer-card" onClick={() => pushAgentDetail(dealer._id)}>
				<Box
					component={'div'}
					className="dealer-img"
					style={{
						backgroundImage: `url(${dealer?.memberImage ? `${REACT_APP_API_URL}/${dealer.memberImage}` : '/img/profile/defaultUser.svg'})`,
					}}
				/>
				<Stack className="dealer-info">
					<Typography className="dealer-name">{dealer?.memberNick || dealer?.memberFullName}</Typography>
					<Stack className="dealer-stats">
						<Stack className="stat">
							<img src="/img/icons/car.svg" alt="" />
							<span>{dealer?.memberProperties || 0} Cars</span>
						</Stack>
						<Stack className="stat">
							<LocationOnIcon />
							<span>{dealer?.memberAddress || 'Spain'}</span>
						</Stack>
					</Stack>
					{dealer?.memberPhone && (
						<Stack className="dealer-phone">
							<CallIcon />
							<span>{dealer.memberPhone}</span>
						</Stack>
					)}
					<Stack className="dealer-rating">
						<img src="/img/icons/star.svg" alt="" />
						<span>{dealer?.memberRank || 0} Rating</span>
					</Stack>
					{user?._id !== dealer?._id && (subscribeHandler || unsubscribeHandler) && (
						<Button
							variant={dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? 'outlined' : 'contained'}
							sx={{
								marginTop: '12px',
								background: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? 'transparent' : '#f17742',
								color: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? '#f17742' : '#ffffff',
								borderColor: '#f17742',
								textTransform: 'uppercase',
								fontWeight: 600,
								'&:hover': {
									background: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? 'rgba(241, 119, 66, 0.1)' : '#f17742',
									borderColor: '#f17742',
								},
							}}
							onClick={handleFollowClick}
						>
							{dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? 'Following' : 'Follow'}
						</Button>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default TopDealerCard;