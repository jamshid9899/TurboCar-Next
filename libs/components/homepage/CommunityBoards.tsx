import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Direction } from '../../enums/common.enum';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { likeBoardArticleHandler } from '../../utils';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [articles, setArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const [getBoardArticles, { loading, data, error, refetch }] = useLazyQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setArticles(data?.getBoardArticles?.list || []);
		},
	});

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	/** LIFECYCLES **/
	useEffect(() => {
		getBoardArticles({
			variables: {
				input: {
					page: 1,
					limit: 6,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {},
				},
			},
		});
	}, []);

	/** HANDLERS **/
	const likeArticle = async (user: any, id: string) => {
		await likeBoardArticleHandler(user, id, likeTargetBoardArticle, refetch);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY MOBILE</div>;
	} else {
		return (
			<Stack className={'community-boards'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						{/* Premium Overline with Decorative Lines */}
						<div className={'overline-section'}>
							<div className={'decorative-line'}></div>
							<span className={'overline-text'}>COMMUNITY</span>
							<div className={'decorative-line'}></div>
						</div>

						{/* Main Title with Gradient */}
						<h2 className={'main-title'}>Community Hub</h2>

						{/* Subtitle */}
						<p className={'subtitle'}>Latest news and discussions</p>
					</Stack>
					<Stack className={'card-box'}>
						{articles.map((article: BoardArticle) => {
							return <CommunityCard key={article._id} article={article} likeArticleHandler={likeArticle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;