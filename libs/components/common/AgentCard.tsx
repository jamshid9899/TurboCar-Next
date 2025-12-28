import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Chip, Button } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler?: (user: any, id: string) => void;
	subscribeHandler?: (id: string) => void;
	unsubscribeHandler?: (id: string) => void;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler, subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [imageError, setImageError] = useState(false);
	
	const isFollowing = agent?.meFollowed && agent?.meFollowed[0]?.myFollowing;
	const isOwnProfile = user?._id === agent?._id;
	
	const getImagePath = () => {
		if (imageError || !agent?.memberImage || agent.memberImage.trim() === '') {
			return '/img/profile/defaultUser.svg';
		}
		return `${REACT_APP_API_URL}/${agent.memberImage}`;
	};

	// Calculate rating (mock - can be replaced with actual rating data)
	const calculateRating = () => {
		const views = agent?.memberViews || 0;
		const likes = agent?.memberLikes || 0;
		if (views === 0) return 0;
		return Math.min(5, Math.round((likes / views) * 5 * 2) / 2); // 0-5 rating with 0.5 steps
	};

	const rating = calculateRating();
	const carsCount = agent?.memberProperties || 0;
	const isTopRated = rating >= 4.5;
	const isVerified = agent?.memberVerified || false;

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		return (
			<Stack className="agent-general-card">
				<Stack className="agent-card-content" direction="column">
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
						style={{ textDecoration: 'none', color: 'inherit' }}
						aria-label={`View profile of ${(agent?.memberFullName ?? agent?.memberNick) || 'agent'}`}
					>
					{/* Image Section - Top (Hexagonal) */}
					<div
						className={'agent-img'}
						style={{
							position: 'relative',
							overflow: 'visible',
						}}
					>
						<div className="hexagon-wrapper">
							<div className="hexagon">
								<img
									src={getImagePath()}
									alt={agent?.memberFullName || agent?.memberNick || 'Agent'}
									onError={() => setImageError(true)}
								/>
							</div>
						</div>
						{/* Cars Listed Badge */}
						<div className="cars-badge">
							<span>{carsCount} {carsCount === 1 ? 'Car' : 'Cars'}</span>
						</div>
					</div>

					{/* Info Section - Bottom */}
					<Stack className={'agent-desc'}>
						<div className={'agent-info'}>
							<Typography className="agent-name">
								{agent?.memberFullName ?? agent?.memberNick}
							</Typography>
								
								<Stack direction="row" alignItems="center" spacing={1} className="agent-role-row">
									<Typography className="agent-role">Dealer</Typography>
									{/* Stats Section */}
									<Stack direction="row" alignItems="center" spacing={1} className="agent-stats">
										<RemoveRedEyeIcon sx={{ fontSize: '16px', color: '#717171' }} />
										<Typography className="stat-count">{agent?.memberViews || 0}</Typography>
										
										{likeMemberHandler && (
											<>
												<IconButton 
													color={'default'} 
													size="small"
													sx={{ padding: '2px' }}
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														likeMemberHandler(user, agent?._id);
													}}
												>
													{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
														<FavoriteIcon sx={{ fontSize: '16px', color: '#FF6B00' }} />
													) : (
														<FavoriteBorderIcon sx={{ fontSize: '16px', color: '#717171' }} />
													)}
												</IconButton>
												<Typography className="stat-count">{agent?.memberLikes || 0}</Typography>
											</>
										)}
										{!likeMemberHandler && (
											<>
												<FavoriteBorderIcon sx={{ fontSize: '16px', color: '#717171' }} />
												<Typography className="stat-count">{agent?.memberLikes || 0}</Typography>
											</>
										)}
									</Stack>
								</Stack>
							</div>
						</Stack>
					</Link>
					{/* Follow/Unfollow Button - Outside Link */}
					{!isOwnProfile && (subscribeHandler || unsubscribeHandler) && (
						<div
							style={{
								marginTop: '12px',
								width: '100%',
								padding: '0 16px',
								paddingBottom: '16px',
							}}
						>
							{isFollowing ? (
								<Button
									variant="outlined"
									fullWidth
									startIcon={<PersonRemoveIcon />}
									onClick={() => {
										if (unsubscribeHandler) {
											unsubscribeHandler(agent?._id);
										}
									}}
									sx={{
										borderColor: '#FF6B00',
										color: '#FF6B00',
										fontFamily: 'Poppins, sans-serif',
										fontSize: '14px',
										fontWeight: 600,
										textTransform: 'none',
										padding: '8px 16px',
										borderRadius: '8px',
										'&:hover': {
											borderColor: '#FF6B00',
											background: '#FFF5F0',
										},
									}}
								>
									Following
								</Button>
							) : (
								<Button
									variant="contained"
									fullWidth
									startIcon={<PersonAddIcon />}
									onClick={() => {
										if (subscribeHandler) {
											subscribeHandler(agent?._id);
										}
									}}
									sx={{
										background: '#FF6B00',
										color: '#ffffff',
										fontFamily: 'Poppins, sans-serif',
										fontSize: '14px',
										fontWeight: 600,
										textTransform: 'none',
										padding: '8px 16px',
										borderRadius: '8px',
										'&:hover': {
											background: '#E55A00',
										},
									}}
								>
									Follow
								</Button>
							)}
						</div>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default React.memo(AgentCard);
