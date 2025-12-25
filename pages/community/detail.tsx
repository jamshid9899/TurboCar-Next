import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { useMutation, useLazyQuery } from '@apollo/client';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE, CREATE_COMMENT, UPDATE_COMMENT } from '../../apollo/user/mutation';
// import { CREATE_VIEW } from '../../apollo/user/mutation'; // Disabled - not available in backend
import { ViewGroup } from '../../libs/enums/view.enum';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { CommentInput } from '../../libs/types/comment/comment.input';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import { likeBoardArticleHandler } from '../../libs/utils';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/profile/defaultUser.svg');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [getBoardArticle, { refetch: refetchBoardArticle }] = useLazyQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		onCompleted: (data) => {
			if (data?.getBoardArticle) {
				setBoardArticle(data.getBoardArticle);
				// Set member image from backend
				if (data.getBoardArticle.memberData?.memberImage) {
					setMemberImage(`${REACT_APP_API_URL}/${data.getBoardArticle.memberData.memberImage}`);
				} else {
					setMemberImage('/img/profile/defaultUser.svg');
				}
			}
		},
	});
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);
	const [getComments, { refetch: refetchComments }] = useLazyQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		onCompleted: (data) => {
			setComments(data?.getComments?.list || []);
			setTotal(data?.getComments?.metaCounter?.[0]?.total || data?.getComments?.totalCount || 0);
		},
	});
	// const [createView] = useMutation(CREATE_VIEW); // Disabled - not available in backend

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) {
			const newFilter = { ...searchFilter, search: { commentRefId: articleId } };
			setSearchFilter(newFilter);
			getBoardArticle({ variables: { input: articleId } });
			getComments({ variables: { input: newFilter } });
		}
	}, [articleId]);

	// Fetch comments when searchFilter changes
	useEffect(() => {
		if (searchFilter?.search?.commentRefId && articleId) {
			// Ensure commentRefId matches articleId
			const updatedFilter = {
				...searchFilter,
				search: { commentRefId: articleId },
			};
			getComments({ variables: { input: updatedFilter } });
		}
	}, [searchFilter, articleId]);

	// Track view when article is loaded
	// NOTE: createView mutation is disabled as it's not available in backend
	// useEffect(() => {
	// 	if (boardArticle?._id && user?._id) {
	// 		createView({
	// 			variables: {
	// 				input: {
	// 					memberId: user._id,
	// 					viewRefId: boardArticle._id,
	// 					viewGroup: ViewGroup.ARTICLE,
	// 				},
	// 			},
	// 		}).catch((err) => {
	// 			console.error('Error creating view:', err);
	// 		});
	// 	}
	// }, [boardArticle?._id, user?._id, createView]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const creteCommentHandler = async () => {
		try {
			if (!user?._id) {
				await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
				return;
			}
			if (!comment.trim()) {
				await sweetMixinErrorAlert('Comment cannot be empty');
				return;
			}
			if (!articleId) {
				await sweetMixinErrorAlert('Article ID is missing');
				return;
			}

			const input: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentContent: comment.trim(),
				commentRefId: articleId,
				// memberId is optional - backend will use authenticated user
			};

			// Create comment
			await createComment({ 
				variables: { input },
			});

			// Clear comment input immediately
			setComment('');
			setWordsCnt(0);

			// Prepare updated search filter
			const updatedFilter = {
				...searchFilter,
				page: 1, // Reset to first page
				search: { commentRefId: articleId },
			};

			// Refetch comments with updated filter
			const commentsResult = await refetchComments({ 
				variables: { input: updatedFilter },
			});
			
			if (commentsResult?.data?.getComments) {
				const newComments = commentsResult.data.getComments.list || [];
				const newTotal = commentsResult.data.getComments.metaCounter?.[0]?.total || commentsResult.data.getComments.totalCount || 0;
				
				setComments(newComments);
				setTotal(newTotal);
			}

			// Refetch article to update comment count
			if (boardArticle?._id) {
				const articleResult = await refetchBoardArticle({ variables: { input: boardArticle._id } });
				if (articleResult?.data?.getBoardArticle) {
					setBoardArticle(articleResult.data.getBoardArticle);
				}
			}

			await sweetTopSmallSuccessAlert('Comment submitted successfully!', 800);
		} catch (err: any) {
			console.error('ERROR, createCommentHandler:', err);
			const errorMessage = err?.graphQLErrors?.[0]?.message || err?.networkError?.message || err?.message || 'Failed to create comment';
			await sweetMixinErrorAlert(errorMessage);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) {
				await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
				return;
			}

			if (commentStatus === CommentStatus.DELETE) {
				// Delete comment
				const input: CommentUpdate = {
					_id: commentId,
					commentStatus: CommentStatus.DELETE,
				};
				
				await updateComment({ variables: { input } });
				
				// Prepare updated search filter
				const updatedFilter = {
					...searchFilter,
					page: 1,
					search: { commentRefId: articleId },
				};

				// Refetch comments
				await refetchComments({ variables: { input: updatedFilter } });
				
				// Refetch article to update comment count
				if (boardArticle?._id) {
					await refetchBoardArticle({ variables: { input: boardArticle._id } });
				}
				
				await sweetTopSmallSuccessAlert('Comment deleted successfully!', 800);
			} else {
				// Update comment
				if (!updatedComment.trim()) {
					await sweetMixinErrorAlert('Comment cannot be empty');
					return;
				}
				
				const input: CommentUpdate = {
					_id: commentId,
					commentContent: updatedComment.trim(),
				};
				
				await updateComment({ variables: { input } });
				
				// Close backdrop
				setOpenBackdrop(false);
				setUpdatedComment('');
				setUpdatedCommentWordsCnt(0);
				
				// Prepare updated search filter
				const updatedFilter = {
					...searchFilter,
					page: 1,
					search: { commentRefId: articleId },
				};

				// Refetch comments
				const commentsResult = await refetchComments({ variables: { input: updatedFilter } });
				if (commentsResult?.data?.getComments) {
					setComments(commentsResult.data.getComments.list || []);
					setTotal(commentsResult.data.getComments.metaCounter?.[0]?.total || commentsResult.data.getComments.totalCount || 0);
				}
				
				// Refetch article to update comment count
				if (boardArticle?._id) {
					await refetchBoardArticle({ variables: { input: boardArticle._id } });
				}
				
				await sweetTopSmallSuccessAlert('Comment updated successfully!', 800);
			}
		} catch (err: any) {
			console.error('ERROR, updateButtonHandler:', err);
			const errorMessage = err?.graphQLErrors?.[0]?.message || err?.networkError?.message || err?.message || 'Failed to update comment';
			await sweetMixinErrorAlert(errorMessage);
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/profile/defaultUser.svg';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const likeArticleHandler = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!boardArticle?._id) return;
		
		try {
			if (!user?._id) {
				await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
				return;
			}

			setLikeLoading(true);
			
			// Call mutation
			const result = await likeTargetBoardArticle({
				variables: { articleId: boardArticle._id },
			});

			// Update state immediately with the result from mutation
			if (result?.data?.likeTargetBoardArticle) {
				const updatedArticle = result.data.likeTargetBoardArticle;
				setBoardArticle({
					...updatedArticle,
					memberData: boardArticle.memberData, // Preserve memberData if not in response
				});
			}

			// Refetch to ensure we have the latest data with all fields
			const refetchResult = await refetchBoardArticle({ variables: { input: boardArticle._id } });
			if (refetchResult?.data?.getBoardArticle) {
				setBoardArticle(refetchResult.data.getBoardArticle);
				// Update member image if needed
				if (refetchResult.data.getBoardArticle.memberData?.memberImage) {
					setMemberImage(`${REACT_APP_API_URL}/${refetchResult.data.getBoardArticle.memberData.memberImage}`);
				}
			}

			setLikeLoading(false);
		} catch (err: any) {
			console.error('ERROR, likeArticleHandler:', err);
			setLikeLoading(false);
			await sweetMixinErrorAlert(err.message || 'Failed to like article');
		}
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<img src={'/img/logo/turbocar_1.svg'} alt="TurboCar" />
								<Stack className={'community-name'}>
									<Typography className={'name'}>TurboCar Community</Typography>
								</Stack>
							</Stack>
							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
								value={articleCategory}
							>
								<Tab
									value={'FREE'}
									label={'Free'}
									className={`tab-button ${articleCategory === 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={'Recommendations'}
									className={`tab-button ${articleCategory === 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={'News'}
									className={`tab-button ${articleCategory === 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'HUMOR'}
									label={'Memes'}
									className={`tab-button ${articleCategory === 'HUMOR' ? 'active' : ''}`}
								/>
							</Tabs>
						</Stack>
						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">
										{articleCategory === 'FREE' && 'FREE'}
										{articleCategory === 'RECOMMEND' && 'RECOMMENDATIONS'}
										{articleCategory === 'NEWS' && 'NEWS'}
										{articleCategory === 'HUMOR' && 'MEMES'}
									</Typography>
									<Typography className="sub-title">
										{articleCategory === 'FREE' && 'Discuss anything car-related with the community'}
										{articleCategory === 'RECOMMEND' && 'Get recommendations and share your favorite cars'}
										{articleCategory === 'NEWS' && 'Stay updated with the latest automotive news'}
										{articleCategory === 'HUMOR' && 'Share funny car memes and jokes'}
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
							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										<Stack 
											className="content"
											onClick={(e) => {
												// Prevent clicks on article title from bubbling
												e.stopPropagation();
											}}
										>
											<Typography 
												className="content-data"
												onClick={(e) => {
													e.stopPropagation();
												}}
											>
												{boardArticle?.articleTitle}
											</Typography>
											<Stack className="member-info">
												<img
													src={memberImage}
													alt=""
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
												<Stack className="divider"></Stack>
												<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
													{boardArticle?.createdAt}
												</Moment>
											</Stack>
										</Stack>
										<Stack className="info">
											<Stack className="icon-info">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon sx={{ color: '#FF6B00' }} />
												) : (
													<ThumbUpOffAltIcon sx={{ color: '#FF6B00' }} />
												)}
												<Typography className="text">{boardArticle?.articleLikes || 0}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<VisibilityIcon />
												<Typography className="text">{boardArticle?.articleViews}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												{boardArticle?.articleComments && boardArticle?.articleComments > 0 ? (
													<ChatIcon />
												) : (
													<ChatBubbleOutlineRoundedIcon />
												)}

												<Typography className="text">{boardArticle?.articleComments}</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack>
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>
									<Stack 
										className="like-and-dislike"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
									>
										<Stack className="top">
											<Button 
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													likeArticleHandler(e);
												}}
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												disabled={likeLoading}
												sx={{ 
													'& *': {
														pointerEvents: 'none'
													}
												}}
											>
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon sx={{ color: '#fff' }} />
												) : (
													<ThumbUpOffAltIcon sx={{ color: '#fff' }} />
												)}
												<Typography className="text">{boardArticle?.articleLikes || 0}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack
									className="second-box-config"
									sx={{ 
										borderBottom: total > 0 ? 'none' : '1px solid #eee', 
										border: '1px solid #eee',
										position: 'relative',
										zIndex: 10,
									}}
									onClick={(e) => {
										// Prevent event bubbling to parent elements
										e.stopPropagation();
									}}
									onMouseDown={(e) => {
										// Prevent mouse down events from bubbling
										e.stopPropagation();
									}}
								>
									<Typography className="title-text">Comments ({total})</Typography>
									<Stack 
										className="leave-comment"
										onClick={(e) => {
											// Prevent event bubbling
											e.stopPropagation();
										}}
									>
										<input
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												e.stopPropagation();
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
											onClick={(e) => {
												// Prevent event bubbling
												e.stopPropagation();
											}}
											onFocus={(e) => {
												// Prevent event bubbling
												e.stopPropagation();
											}}
											onKeyDown={(e) => {
												e.stopPropagation();
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													creteCommentHandler();
												}
											}}
										/>
										<Stack 
											className="button-box"
											onClick={(e) => {
												// Prevent event bubbling
												e.stopPropagation();
											}}
										>
											<Typography>{wordsCnt}/100</Typography>
											<Button 
												type="button"
												onClick={async (e) => {
													e.preventDefault();
													e.stopPropagation();
													console.log('🔵 Comment button clicked');
													await creteCommentHandler();
												}}
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												disabled={!comment.trim() || comment.trim().length === 0}
												sx={{
													cursor: (!comment.trim() || comment.trim().length === 0) ? 'not-allowed' : 'pointer',
													pointerEvents: 'auto',
												}}
											>
												comment
											</Button>
										</Stack>
									</Stack>
								</Stack>
								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}
								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="member-info">
													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>
													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																onClick={(e) => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
															<Backdrop
																sx={{
																	top: '40%',
																	right: '25%',
																	left: '25%',
																	width: '1000px',
																	height: 'fit-content',
																	borderRadius: '10px',
																	color: '#ffffff',
																	zIndex: 999,
																}}
																open={openBackdrop}
															>
																<Stack
																	sx={{
																		width: '100%',
																		height: '100%',
																		background: 'white',
																		border: '1px solid #b9b9b9',
																		padding: '15px',
																		gap: '10px',
																		borderRadius: '10px',
																		boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
																	}}
																>
																	<Typography variant="h4" color={'#b9b9b9'}>
																		Update comment
																	</Typography>
																	<Stack gap={'20px'}>
																		<input
																			autoFocus
																			value={updatedComment}
																			onChange={(e) => updateCommentInputHandler(e.target.value)}
																			type="text"
																			style={{
																				border: '1px solid #b9b9b9',
																				outline: 'none',
																				height: '40px',
																				padding: '0px 10px',
																				borderRadius: '5px',
																			}}
																		/>
																		<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
																			<Typography variant="subtitle1" color={'#b9b9b9'}>
																				{updatedCommentWordsCnt}/100
																			</Typography>
																			<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
																				<Button
																					variant="outlined"
																					color="inherit"
																					onClick={() => cancelButtonHandler()}
																				>
																					Cancel
																				</Button>
																				<Button
																					variant="contained"
																					color="inherit"
																					onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																				>
																					Update
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
																</Stack>
															</Backdrop>
														</Stack>
													)}
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}
								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</div>
						</div>
					</Stack>
				</div>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
