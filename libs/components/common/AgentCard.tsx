import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
				>
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
								position: 'absolute',
								top: 0,
								left: 0,
							}}
							onError={() => setImageError(true)}
						/>
						<div>{agent?.memberProperties || 0} properties</div>
					</Box>
				</Link>

				<Stack className={'agent-desc'}>
					<Box component={'div'} className={'agent-info'}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: agent?._id },
							}}
						>
							<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
						</Link>
						<span>Agent</span>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{agent?.memberViews || 0}</Typography>
						{likeMemberHandler && (
							<IconButton 
								color={'default'} 
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									likeMemberHandler(user, agent?._id);
								}}
							>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
						)}
						{!likeMemberHandler && (
							<IconButton color={'default'}>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon color={'primary'} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
						)}
						<Typography className="view-cnt">{agent?.memberLikes || 0}</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;
