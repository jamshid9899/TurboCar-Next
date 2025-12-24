import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Chip } from '@mui/material';
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
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler?: (user: any, id: string) => void;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [imageError, setImageError] = useState(false);
	
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
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
					style={{ textDecoration: 'none', color: 'inherit' }}
				>
					<Stack className="agent-card-content" direction="column">
						{/* Image Section - Top (Hexagonal) */}
						<Box
							component={'div'}
							className={'agent-img'}
							sx={{
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
							<Box className="cars-badge">
								<span>{carsCount} {carsCount === 1 ? 'Car' : 'Cars'}</span>
							</Box>
						</Box>

						{/* Info Section - Bottom */}
						<Stack className={'agent-desc'}>
							<Box component={'div'} className={'agent-info'}>
								<Link
									href={{
										pathname: '/agent/detail',
										query: { agentId: agent?._id },
									}}
									style={{ textDecoration: 'none', color: 'inherit' }}
								>
									<Typography className="agent-name">
										{agent?.memberFullName ?? agent?.memberNick}
									</Typography>
								</Link>
								
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
							</Box>
						</Stack>
					</Stack>
				</Link>
			</Stack>
		);
	}
};

export default AgentCard;
