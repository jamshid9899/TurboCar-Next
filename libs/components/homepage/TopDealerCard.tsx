import React from 'react';
import { Stack, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { Member } from '../../types/member/member';
import { useRouter } from 'next/router';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import VerifiedIcon from '@mui/icons-material/Verified';
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
				>
					{/* Gradient Overlay */}
					<div className="gradient-overlay" />
					
					{/* Verified Badge */}
					<Chip
						icon={<VerifiedIcon />}
						label="Verified Dealer"
						size="small"
						className="verified-badge"
					/>
				</Box>
				<Stack className="dealer-info">
					<Typography className="dealer-name">
						{dealer?.memberNick || dealer?.memberFullName}
					</Typography>
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
							className="follow-btn"
							sx={{
								marginTop: '20px',
								background: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing 
									? 'transparent' 
									: 'linear-gradient(135deg, #f17742 0%, #dc2626 100%)',
								color: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? '#f17742' : '#ffffff',
								borderColor: '#f17742',
								borderWidth: '2px',
								borderStyle: 'solid',
								textTransform: 'uppercase',
								fontWeight: 800,
								fontSize: '14px',
								letterSpacing: '1px',
								padding: '14px 32px',
								borderRadius: '12px',
								boxShadow: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing 
									? '0px 2px 8px rgba(241, 119, 66, 0.15)' 
									: '0px 6px 20px rgba(241, 119, 66, 0.35), 0px 2px 6px rgba(220, 38, 38, 0.2)',
								transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
								position: 'relative',
								overflow: 'hidden',
								'&:hover': {
									background: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing 
										? 'linear-gradient(135deg, rgba(241, 119, 66, 0.15) 0%, rgba(241, 119, 66, 0.05) 100%)'
										: 'linear-gradient(135deg, #dc2626 0%, #f17742 100%)',
									borderColor: '#f17742',
									transform: 'translateY(-4px) scale(1.03)',
									boxShadow: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing 
										? '0px 4px 16px rgba(241, 119, 66, 0.25)' 
										: '0px 12px 32px rgba(241, 119, 66, 0.5), 0px 4px 12px rgba(220, 38, 38, 0.3)',
								},
								'&:active': {
									transform: 'translateY(-2px) scale(1.01)',
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