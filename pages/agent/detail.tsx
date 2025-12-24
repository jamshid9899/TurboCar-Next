import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { Message } from '../../libs/enums/common.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CREATE_COMMENT, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
// import { CREATE_VIEW } from '../../apollo/user/mutation'; // Disabled - not available in backend
import { ViewGroup } from '../../libs/enums/view.enum';
import { GET_COMMENTS, GET_MEMBER, GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
	const [propertyTotal, setPropertyTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	// const [createView] = useMutation(CREATE_VIEW); // Disabled - not available in backend

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getMember) {
				setAgent(data.getMember);
				const memberId = data.getMember._id;
				console.log('Agent loaded, memberId:', memberId);
				const newSearchFilter: PropertiesInquiry = {
					...initialInput,
					page: 1,
					limit: 9,
					search: {
						memberId: memberId,
					},
				};
				console.log('Setting searchFilter:', newSearchFilter);
				setSearchFilter(newSearchFilter);
				
				const newCommentInquiry: CommentsInquiry = {
					...initialComment,
					page: 1,
					search: {
						commentRefId: memberId,
					},
				};
				setCommentInquiry(newCommentInquiry);
				
				setInsertCommentData({
					...insertCommentData,
					commentRefId: memberId,
				});
			}
		},
	});

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Properties loaded:', data?.getProperties);
			setAgentProperties(data?.getProperties?.list || []);
			setPropertyTotal(data?.getProperties?.totalCount || 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry?.search?.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list || []);
			setCommentTotal(data?.getComments?.metaCounter?.[0]?.total || data?.getComments?.totalCount || 0);
		},
		onError: (error) => {
			console.error('Error fetching comments:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agentId) setAgentId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {
		if (searchFilter?.search?.memberId) {
			console.log('searchFilter changed, refetching properties with memberId:', searchFilter.search.memberId);
			getPropertiesRefetch({ input: searchFilter }).catch((err) => {
				console.error('Error refetching properties:', err);
			});
		}
	}, [searchFilter?.search?.memberId, getPropertiesRefetch]);

	useEffect(() => {
		if (commentInquiry?.search?.commentRefId) {
			console.log('commentInquiry changed, refetching comments with commentRefId:', commentInquiry.search.commentRefId);
			getCommentsRefetch({ input: commentInquiry }).catch((err) => {
				console.error('Error refetching comments:', err);
			});
		}
	}, [commentInquiry?.search?.commentRefId, getCommentsRefetch]);

	// Track view when agent is loaded
	// NOTE: createView mutation is disabled as it's not available in backend
	// useEffect(() => {
	// 	if (agent?._id && user?._id) {
	// 		createView({
	// 			variables: {
	// 				input: {
	// 					memberId: user._id,
	// 					viewRefId: agent._id,
	// 					viewGroup: ViewGroup.MEMBER,
	// 				},
	// 			},
	// 		}).catch((err) => {
	// 			console.error('Error creating view:', err);
	// 		});
	// 	}
	// }, [agent?._id, user?._id, createView]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const propertyPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself');
			if (!insertCommentData.commentContent || insertCommentData.commentContent.trim() === '') {
				await sweetMixinErrorAlert('Please enter a review');
				return;
			}

			console.log('🔵 Creating comment with data:', insertCommentData);

			// Create comment
			const result = await createComment({ variables: { input: insertCommentData } });
			console.log('🔵 Comment created, result:', result);
			
			// Clear input immediately
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			
			// Prepare updated comment inquiry (reset to page 1 to show new comment)
			const updatedCommentInquiry = {
				...commentInquiry,
				page: 1, // Reset to first page to show new comment
			};
			
			// Update commentInquiry state first
			setCommentInquiry(updatedCommentInquiry);
			
			// Wait a bit for state to update, then refetch
			await new Promise(resolve => setTimeout(resolve, 100));
			
			// Refetch comments
			console.log('🔵 Refetching comments with inquiry:', updatedCommentInquiry);
			const refetchResult = await getCommentsRefetch({ input: updatedCommentInquiry });
			console.log('🔵 Refetch result:', refetchResult);
			
			// Update state directly from refetch result
			if (refetchResult?.data?.getComments) {
				const newComments = refetchResult.data.getComments.list || [];
				const newTotal = refetchResult.data.getComments.metaCounter?.[0]?.total || refetchResult.data.getComments.totalCount || 0;
				console.log('✅ Setting comments:', newComments.length, 'Total:', newTotal);
				setAgentComments(newComments);
				setCommentTotal(newTotal);
			} else {
				console.error('❌ Refetch result is empty or invalid');
			}
			
			await sweetTopSmallSuccessAlert('Review submitted successfully!', 800);
		} catch (err: any) {
			console.error('❌ ERROR, createCommentHandler:', err);
			await sweetErrorHandling(err);
		}
	};

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) {
				await sweetMixinErrorAlert('Please login first');
				throw new Error(Message.NOT_AUTHENTICATED);
			}

			await likeTargetProperty({
				variables: { propertyId: id },
			});
			await getPropertiesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			if (err.message !== Message.NOT_AUTHENTICATED) {
				sweetMixinErrorAlert(err.message).then();
			}
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					<Stack className={'agent-info'}>
						<img
							src={agent?.memberImage ? `${REACT_APP_API_URL}/${agent?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt=""
						/>
						<Box component={'div'} className={'info'} onClick={() => redirectToMemberPageHandler(agent?._id as string)}>
							<strong>{agent?.memberFullName ?? agent?.memberNick}</strong>
							<div>
								<img src="/img/icons/call.svg" alt="" />
								<span>{agent?.memberPhone}</span>
							</div>
						</Box>
					</Stack>
					<Stack className={'agent-home-list'}>
						<Stack className={'card-wrap'}>
							{agentProperties.map((property: Property) => {
								return (
									<div className={'wrap-main'} key={property?._id}>
										<PropertyBigCard property={property} likePropertyHandler={likePropertyHandler} key={property?._id} />
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{propertyTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(propertyTotal / searchFilter.limit) || 1}
											onChange={propertyPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Stack>
									<span>
										Total {propertyTotal} propert{propertyTotal > 1 ? 'ies' : 'y'} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No properties found!</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>we are glad to see you again</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Box component={'div'} className={'title-box'}>
									<StarIcon />
									<span>
										{commentTotal} review{commentTotal > 1 ? 's' : ''}
									</span>
								</Box>
								{agentComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Box component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Box>
							</Stack>
						)}

						<Stack className={'leave-review-config'}>
							<Typography className={'main-title'}>Leave A Review</Typography>
							<Typography className={'review-title'}>Review</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							></textarea>
							<Box className={'submit-btn'} component={'div'}>
								<Button
									className={'submit-review'}
									disabled={insertCommentData.commentContent === '' || user?._id === ''}
									onClick={createCommentHandler}
								>
									<Typography className={'title'}>Submit Review</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(AgentDetail);
