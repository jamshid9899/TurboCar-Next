import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Chip, Box } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import SpeedIcon from '@mui/icons-material/Speed';
import moment from 'moment';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler?: (user: any, id: string) => void;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	// Get category icon based on article category
	const getCategoryIcon = () => {
		switch (boardArticle?.articleCategory) {
			case 'RECOMMEND':
				return <DirectionsCarIcon sx={{ fontSize: '24px', color: '#FF6B00' }} />;
			case 'NEWS':
				return <LocalGasStationIcon sx={{ fontSize: '24px', color: '#FF6B00' }} />;
			case 'HUMOR':
				return <SpeedIcon sx={{ fontSize: '24px', color: '#FF6B00' }} />;
			default:
				return <ElectricCarIcon sx={{ fontSize: '24px', color: '#FF6B00' }} />;
		}
	};

	// Get category label
	const getCategoryLabel = () => {
		switch (boardArticle?.articleCategory) {
			case 'RECOMMEND':
				return 'Recommendations';
			case 'NEWS':
				return 'News';
			case 'HUMOR':
				return 'Memes';
			default:
				return 'Discussion';
		}
	};

	// Get relative time
	const getRelativeTime = () => {
		if (!boardArticle?.createdAt) return '';
		return moment(boardArticle.createdAt).fromNow();
	};

	// Get image URL from backend
	const getImageUrl = () => {
		if (boardArticle?.articleImage && boardArticle.articleImage.trim() !== '') {
			return `${REACT_APP_API_URL}/${boardArticle.articleImage}`;
		}
		return null;
	};

	const imageUrl = getImageUrl();

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack
				sx={{ width: '100%' }}
				className="community-forum-card"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
			>
				<Stack className="forum-card-content">
					{/* Left: Image or Category Icon */}
					{imageUrl ? (
						<Box 
							className="article-image"
							component="div"
							sx={{
								width: '80px',
								height: '80px',
								minWidth: '80px',
								borderRadius: '8px',
								overflow: 'hidden',
								background: '#f5f5f5',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<img 
								src={imageUrl} 
								alt={boardArticle?.articleTitle || 'Article image'}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
								onError={(e) => {
									// Fallback to category icon if image fails to load
									const target = e.target as HTMLImageElement;
									target.style.display = 'none';
								}}
							/>
						</Box>
					) : (
						<Stack className="category-icon">
							{getCategoryIcon()}
						</Stack>
					)}

					{/* Middle: Content */}
					<Stack className="card-content" sx={{ flex: 1 }}>
						<Stack className="content-header">
							<Typography className="card-title">{boardArticle?.articleTitle}</Typography>
							<Chip 
								label={getCategoryLabel()} 
								size="small" 
								sx={{ 
									height: '20px',
									fontSize: '11px',
									fontWeight: 600,
									background: 'linear-gradient(135deg, #FF6B00, #FF8E53)',
									color: '#fff',
									'& .MuiChip-label': {
										padding: '0 8px'
									}
								}}
							/>
						</Stack>
						<Stack className="content-meta">
							<Typography
								className="author-name"
								onClick={(e) => {
									e.stopPropagation();
									goMemberPage(boardArticle?.memberData?._id as string);
								}}
							>
								{boardArticle?.memberData?.memberNick || 'Anonymous'}
							</Typography>
							<Typography className="separator">•</Typography>
							<Typography className="time-ago">{getRelativeTime()}</Typography>
						</Stack>
					</Stack>

					{/* Right: Stats */}
					<Stack 
						className="card-stats"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onMouseDown={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<Stack className="stat-item">
							<RemoveRedEyeIcon sx={{ fontSize: '16px', color: '#717171' }} />
							<Typography className="stat-count">{boardArticle?.articleViews || 0}</Typography>
						</Stack>
						<Stack className="stat-item">
							<ChatBubbleOutlineIcon sx={{ fontSize: '16px', color: '#717171' }} />
							<Typography className="stat-count">{boardArticle?.articleComments || 0}</Typography>
						</Stack>
						<Stack className="stat-item">
							<IconButton 
								color={'default'}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									if (likeArticleHandler && boardArticle?._id) {
										likeArticleHandler(user, boardArticle._id);
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								sx={{ 
									padding: '2px',
									'&:hover': {
										backgroundColor: 'rgba(255, 107, 0, 0.1)'
									}
								}}
							>
								{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon sx={{ fontSize: '16px', color: '#FF6B00' }} />
								) : (
									<FavoriteBorderIcon sx={{ fontSize: '16px', color: '#717171' }} />
								)}
							</IconButton>
							<Typography className="stat-count">{boardArticle?.articleLikes || 0}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;
