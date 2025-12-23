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
					<Stack className="agent-card-content" direction="row">
						{/* Image Section - Left */}
						<Box
							component={'div'}
							className={'agent-img'}
							sx={{
								position: 'relative',
								overflow: 'hidden',
							}}
						>
							<img
								src={getImagePath()}
								alt={agent?.memberFullName || agent?.memberNick || 'Agent'}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
								onError={() => setImageError(true)}
							/>
							{/* Cars Listed Badge */}
							<Box className="cars-badge">
								<DirectionsCarIcon sx={{ fontSize: '14px', mr: 0.5 }} />
								<span>{carsCount} {carsCount === 1 ? 'Car' : 'Cars'} Listed</span>
							</Box>
							{/* Verified Badge */}
							{isVerified && (
								<Box className="verified-badge">
									<VerifiedIcon sx={{ fontSize: '16px' }} />
								</Box>
							)}
							{/* Top Rated Badge */}
							{isTopRated && (
								<Box className="top-rated-badge">
									<StarIcon sx={{ fontSize: '14px', mr: 0.3 }} />
									<span>Top Rated</span>
								</Box>
							)}
						</Box>

						{/* Info Section - Right */}
						<Stack className={'agent-desc'} sx={{ flex: 1 }}>
							<Box component={'div'} className={'agent-info'}>
								<Stack direction="row" alignItems="center" spacing={1} mb={1}>
									<Link
										href={{
											pathname: '/agent/detail',
											query: { agentId: agent?._id },
										}}
										style={{ textDecoration: 'none', color: 'inherit' }}
									>
										<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
									</Link>
								</Stack>
								
								<Stack direction="row" alignItems="center" spacing={1} mb={1}>
									<span className="agent-role">Dealer</span>
									{rating > 0 && (
										<Stack direction="row" alignItems="center" spacing={0.3} className="rating">
											<StarIcon sx={{ fontSize: '16px', color: '#FFB800' }} />
											<Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 600 }}>
												{rating.toFixed(1)}
											</Typography>
										</Stack>
									)}
								</Stack>

								{/* Location - Mock data, can be replaced with actual location */}
								<Stack direction="row" alignItems="center" spacing={0.5} mb={1.5} className="location">
									<LocationOnIcon sx={{ fontSize: '14px', color: '#717171' }} />
									<Typography variant="body2" sx={{ fontSize: '13px', color: '#717171' }}>
										{agent?.memberLocation || 'Madrid, Spain'}
									</Typography>
								</Stack>

								{/* Experience Badge */}
								{carsCount > 0 && (
									<Chip
										label={`${Math.min(10, Math.floor(carsCount / 2) + 1)}+ Years Experience`}
										size="small"
										sx={{
											height: '22px',
											fontSize: '11px',
											fontWeight: 500,
											backgroundColor: '#E3F2FD',
											color: '#1976D2',
											mb: 1.5,
											width: 'fit-content',
										}}
									/>
								)}
							</Box>

							{/* Stats Section */}
							<Box component={'div'} className={'buttons'}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<IconButton color={'default'} size="small">
										<RemoveRedEyeIcon sx={{ fontSize: '18px' }} />
									</IconButton>
									<Typography className="view-cnt">{agent?.memberViews || 0}</Typography>
									
									{likeMemberHandler && (
										<>
											<IconButton 
												color={'default'} 
												size="small"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													likeMemberHandler(user, agent?._id);
												}}
											>
												{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
													<FavoriteIcon color={'primary'} sx={{ fontSize: '18px' }} />
												) : (
													<FavoriteBorderIcon sx={{ fontSize: '18px' }} />
												)}
											</IconButton>
											<Typography className="view-cnt">{agent?.memberLikes || 0}</Typography>
										</>
									)}
									{!likeMemberHandler && (
										<>
											<IconButton color={'default'} size="small">
												{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
													<FavoriteIcon color={'primary'} sx={{ fontSize: '18px' }} />
												) : (
													<FavoriteBorderIcon sx={{ fontSize: '18px' }} />
												)}
											</IconButton>
											<Typography className="view-cnt">{agent?.memberLikes || 0}</Typography>
										</>
									)}
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
