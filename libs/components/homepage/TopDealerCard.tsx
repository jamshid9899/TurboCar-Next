import React from 'react';
import { Stack, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { Member } from '../../types/member/member';
import { useRouter } from 'next/router';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import VerifiedIcon from '@mui/icons-material/Verified';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
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

	const handleFollowClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		// Check if already following
		const isFollowing = dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing;
		
		if (isFollowing) {
			// Already following, so unsubscribe
			if (unsubscribeHandler) {
				await unsubscribeHandler(dealer._id);
			}
		} else {
			// Not following, so subscribe
			if (subscribeHandler) {
				await subscribeHandler(dealer._id);
			}
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
				</Box>
				<Stack className="dealer-info">
					<Typography className="dealer-name">
						{dealer?.memberNick || dealer?.memberFullName}
					</Typography>
					<Stack className="dealer-stats">
						<Stack className="stat">
							<DirectionsCarIcon />
							<span>{dealer?.memberProperties || 0} Cars</span>
						</Stack>
						{dealer?.memberPhone && (
							<Stack className="stat">
								<CallIcon />
								<span>{dealer.memberPhone}</span>
							</Stack>
						)}
						{dealer?.memberAddress && (
							<Stack className="stat">
								<LocationOnIcon />
								<span>{dealer.memberAddress}</span>
							</Stack>
						)}
					</Stack>
					<Stack className="dealer-rating">
						<VerifiedIcon />
						<span>Verified Dealer</span>
					</Stack>
					{user?._id !== dealer?._id && (subscribeHandler || unsubscribeHandler) && (
						<Button
							variant={dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? 'outlined' : 'contained'}
							className="follow-btn"
							sx={{
								marginTop: '12px',
								background: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing 
									? 'transparent' 
									: 'linear-gradient(135deg, #f17742 0%, #dc2626 100%)',
								color: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing ? '#f17742' : '#ffffff',
								borderColor: '#f17742',
								borderWidth: '2px',
								borderStyle: 'solid',
								textTransform: 'uppercase',
								fontWeight: 700,
								fontSize: '12px',
								letterSpacing: '0.5px',
								padding: '10px 24px',
								borderRadius: '10px',
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
									transform: 'translateY(-2px) scale(1.02)',
									boxShadow: dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing 
										? '0px 3px 12px rgba(241, 119, 66, 0.2)' 
										: '0px 8px 24px rgba(241, 119, 66, 0.4), 0px 3px 8px rgba(220, 38, 38, 0.25)',
								},
								'&:active': {
									transform: 'translateY(-1px) scale(1.01)',
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