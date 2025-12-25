import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArticleIcon from '@mui/icons-material/Article';
import MoodIcon from '@mui/icons-material/Mood';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory, BOARD_ARTICLE_CATEGORY_CONFIG } from '../../libs/enums/board-article.enum';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { Direction } from '../../libs/enums/common.enum';
import { likeBoardArticleHandler } from '../../libs/utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(() => {
		const input: BoardArticlesInquiry = {
			page: 1,
			limit: 6,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				articleCategory: (articleCategory as BoardArticleCategory) || BoardArticleCategory.FREE,
			},
		};
		return input;
	});
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const {
		loading: getBoardArticlesLoading,
		data: getBoardArticlesData,
		error: getBoardArticlesError,
		refetch: getBoardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		skip: !searchCommunity?.search?.articleCategory,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list || []);
			setTotalCount(data?.getBoardArticles?.metaCounter?.[0]?.total || data?.getBoardArticles?.totalCount || 0);
		},
	});
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	/** LIFECYCLES **/
	// Initialize default category if not in URL
	useEffect(() => {
		if (!query?.articleCategory) {
			const defaultCategory = BoardArticleCategory.FREE;
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: defaultCategory },
				},
				undefined,
				{ shallow: true },
			);
			setSearchCommunity({
				...searchCommunity,
				page: 1,
				search: { articleCategory: defaultCategory },
			});
		}
	}, []);

	// Update searchCommunity when URL query changes
	useEffect(() => {
		if (query?.articleCategory) {
			const category = query.articleCategory as BoardArticleCategory;
			setSearchCommunity((prev) => ({
				...prev,
				page: 1,
				search: { articleCategory: category },
			}));
		}
	}, [query?.articleCategory]);

	// Update state when data changes
	useEffect(() => {
		if (getBoardArticlesData?.getBoardArticles) {
			setBoardArticles(getBoardArticlesData.getBoardArticles.list || []);
			setTotalCount(getBoardArticlesData.getBoardArticles.metaCounter?.[0]?.total || 0);
		} else {
			setBoardArticles([]);
			setTotalCount(0);
		}
	}, [getBoardArticlesData]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		const category = value as BoardArticleCategory;
		const newSearch: BoardArticlesInquiry = {
			...searchCommunity,
			page: 1,
			search: { articleCategory: category },
		};
		setSearchCommunity(newSearch);
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			undefined,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity((prev) => ({
			...prev,
			page: value,
		}));
	};

	const likeArticleHandler = async (user: any, id: string) => {
		await likeBoardArticleHandler(user, id, likeTargetBoardArticle, getBoardArticlesRefetch);
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<div id="community-list-page">
					<div className="container">
						<TabContext value={searchCommunity.search.articleCategory || BoardArticleCategory.FREE}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className={'image-info'}>
									<img src={'/img/logo/turbocar_1.svg'} alt="TurboCar" />
									<Stack className={'community-name'}>
										<Typography className={'name'}>TurboCar Community</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="lab API tabs example"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
								>
									{Object.values(BoardArticleCategory).map((category) => {
										const config = BOARD_ARTICLE_CATEGORY_CONFIG[category];
										const IconComponent = 
											category === BoardArticleCategory.FREE ? ChatBubbleOutlineIcon :
											category === BoardArticleCategory.RECOMMEND ? DirectionsCarIcon :
											category === BoardArticleCategory.NEWS ? ArticleIcon :
											MoodIcon;
										
										return (
											<Tab
												key={category}
												value={category}
												icon={<IconComponent sx={{ fontSize: '20px', marginRight: '8px' }} />}
												iconPosition="start"
												label={config.label}
												className={`tab-button ${searchCommunity.search.articleCategory === category ? 'active' : ''}`}
											/>
										);
									})}
								</TabList>
							</Stack>
							<Stack className="right-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">
												{BOARD_ARTICLE_CATEGORY_CONFIG[searchCommunity.search.articleCategory]?.title || 'COMMUNITY'}
											</Typography>
											<Typography className="sub-title">
												{BOARD_ARTICLE_CATEGORY_CONFIG[searchCommunity.search.articleCategory]?.subtitle || 'Join the car community'}
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											Write
										</Button>
									</Stack>
									
									{/* Section Header Card */}
									<Stack className="section-header-card">
										{searchCommunity.search.articleCategory === BoardArticleCategory.FREE && (
											<ChatBubbleOutlineIcon sx={{ fontSize: '20px', color: '#FF6B00', marginRight: '8px' }} />
										)}
										{searchCommunity.search.articleCategory === BoardArticleCategory.RECOMMEND && (
											<DirectionsCarIcon sx={{ fontSize: '20px', color: '#FF6B00', marginRight: '8px' }} />
										)}
										{searchCommunity.search.articleCategory === BoardArticleCategory.NEWS && (
											<ArticleIcon sx={{ fontSize: '20px', color: '#FF6B00', marginRight: '8px' }} />
										)}
										{searchCommunity.search.articleCategory === BoardArticleCategory.HUMOR && (
											<MoodIcon sx={{ fontSize: '20px', color: '#FF6B00', marginRight: '8px' }} />
										)}
										<Typography className="section-header-text">
											{BOARD_ARTICLE_CATEGORY_CONFIG[searchCommunity.search.articleCategory]?.label || 'Community'}
										</Typography>
									</Stack>

									<TabPanel value={BoardArticleCategory.FREE}>
										<Stack className="list-box">
											{getBoardArticlesLoading ? (
												<Stack className={'no-data'}>
													<p>Loading articles...</p>
												</Stack>
											) : getBoardArticlesError ? (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>Error loading articles: {getBoardArticlesError.message}</p>
												</Stack>
											) : boardArticles?.length > 0 ? (
												boardArticles.map((boardArticle: BoardArticle) => {
													return <CommunityCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No articles found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.RECOMMEND}>
										<Stack className="list-box">
											{getBoardArticlesLoading ? (
												<Stack className={'no-data'}>
													<p>Loading articles...</p>
												</Stack>
											) : getBoardArticlesError ? (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>Error loading articles: {getBoardArticlesError.message}</p>
												</Stack>
											) : boardArticles?.length > 0 ? (
												boardArticles.map((boardArticle: BoardArticle) => {
													return <CommunityCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No articles found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.NEWS}>
										<Stack className="list-box">
											{getBoardArticlesLoading ? (
												<Stack className={'no-data'}>
													<p>Loading articles...</p>
												</Stack>
											) : getBoardArticlesError ? (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>Error loading articles: {getBoardArticlesError.message}</p>
												</Stack>
											) : boardArticles?.length > 0 ? (
												boardArticles.map((boardArticle: BoardArticle) => {
													return <CommunityCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No articles found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.HUMOR}>
										<Stack className="list-box">
											{getBoardArticlesLoading ? (
												<Stack className={'no-data'}>
													<p>Loading articles...</p>
												</Stack>
											) : getBoardArticlesError ? (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>Error loading articles: {getBoardArticlesError.message}</p>
												</Stack>
											) : boardArticles?.length > 0 ? (
												boardArticles.map((boardArticle: BoardArticle) => {
													return <CommunityCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No articles found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
								</Stack>
							</Stack>
						</Stack>
					</TabContext>

						{(boardArticles.length > 0 || totalCount > 0) && (
							<Stack className="pagination-config">
								{Math.ceil(totalCount / searchCommunity.limit) > 1 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(totalCount / searchCommunity.limit)}
											page={searchCommunity.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
								<Stack className="total-result">
									<Typography>
										Total {totalCount} article{totalCount !== 1 ? 's' : ''} available
									</Typography>
								</Stack>
							</Stack>
						)}
					</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			articleCategory: BoardArticleCategory.FREE,
		},
	},
};

export default withLayoutBasic(Community);
