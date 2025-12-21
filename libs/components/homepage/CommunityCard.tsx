import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import moment from 'moment';

interface CommunityCardProps {
	article: BoardArticle;
	likeArticleHandler: (user: any, id: string) => void;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushArticleDetail = async (id: string) => {
		await router.push({
			pathname: '/community/detail',
			query: { articleId: id },
		});
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Stack className="community-card">
				<Box
					className="card-img"
					onClick={() => pushArticleDetail(article._id)}
					style={{
						backgroundImage: `url(${article?.articleImage ? `${REACT_APP_API_URL}/${article.articleImage}` : '/img/banner/default-article.jpg'})`,
					}}
				/>
				<Stack className="card-desc">
					<Box className="card-category">
						<span>{article?.articleCategory}</span>
					</Box>
					<Typography className="card-title" onClick={() => pushArticleDetail(article._id)}>
						{article?.articleTitle}
					</Typography>
					<Typography className="card-subtitle">
						{article?.articleContent?.substring(0, 100)}...
					</Typography>
					<Stack className="card-info">
						<Stack className="author-info">
							<img
								src={
									article?.memberData?.memberImage
										? `${REACT_APP_API_URL}/${article.memberData.memberImage}`
										: '/img/profile/defaultUser.svg'
								}
								alt=""
							/>
							<Stack>
								<span className="author-name">{article?.memberData?.memberNick || 'User'}</span>
								<span className="date">{moment(article?.createdAt).format('MMM DD, YYYY')}</span>
							</Stack>
						</Stack>
						<Stack className="card-stats">
							<Stack className="stat">
								<RemoveRedEyeIcon />
								<span>{article?.articleViews || 0}</span>
							</Stack>
							<Stack className="stat like-btn">
								<IconButton onClick={() => likeArticleHandler(user, article._id)}>
									{article?.meLiked && article?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon style={{ color: 'red' }} />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<span>{article?.articleLikes || 0}</span>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityCard;