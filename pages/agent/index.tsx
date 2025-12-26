import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, InputAdornment, TextField, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchIcon from '@mui/icons-material/Search';
import AgentCard from '../../libs/components/common/AgentCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { AgentsInquiry } from '../../libs/types/member/member.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../apollo/user/query';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { sweetErrorHandling } from '../../libs/sweetAlert';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GridSkeleton, AgentCardSkeleton } from '../../libs/components/common/SkeletonLoader';
import EmptyState from '../../libs/components/common/EmptyState';
import { useDebounce } from '../../libs/hooks/useDebounce';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	// Default filter for initial load
	const getDefaultFilter = (): AgentsInquiry => ({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	});

	// Get initial filter from URL query or use default
	const getInitialFilter = (): AgentsInquiry => {
		if (router?.query?.input) {
			try {
				return JSON.parse(router.query.input as string);
			} catch (e) {
				console.error('Error parsing query input:', e);
				return getDefaultFilter();
			}
		}
		return initialInput || getDefaultFilter();
	};

	const [searchFilter, setSearchFilter] = useState<AgentsInquiry>(getInitialFilter());
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const debouncedSearchText = useDebounce(searchText, 500);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const { 
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list || []);
			setTotal(data?.getAgents?.metaCounter?.[0]?.total || data?.getAgents?.totalCount || 0);
		},
	});

	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) {
				await sweetMixinErrorAlert('Please login first');
				throw new Error(Message.NOT_AUTHENTICATED);
			}

			await likeTargetMember({
				variables: { memberId: id },
			});
			await getAgentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			if (err.message !== Message.NOT_AUTHENTICATED) {
				sweetMixinErrorAlert(err.message).then();
			}
		}
	};

	const subscribeHandler = async (id: string) => {
		try {
			if (!id) {
				await sweetErrorHandling(new Error('Invalid member ID'));
				return;
			}
			if (!user?._id) {
				await sweetMixinErrorAlert('Please login first');
				throw new Error(Message.NOT_AUTHENTICATED);
			}

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Followed!', 800);
			// Refetch with current search filter
			await getAgentsRefetch({ 
				variables: { input: searchFilter } 
			});
		} catch (err: any) {
			console.error('Error in subscribeHandler:', err);
			const errorMessage = err?.graphQLErrors?.[0]?.message || err?.networkError?.message || err?.message || 'Follow failed!';
			// If it's a "Create failed" error, it might mean the user is already subscribed, so try to unsubscribe
			if (errorMessage.includes('Create failed') || errorMessage.includes('already')) {
				await unsubscribeHandler(id); // Attempt to unsubscribe
			} else if (err.message !== Message.NOT_AUTHENTICATED) {
				await sweetErrorHandling(new Error(errorMessage));
			}
		}
	};

	const unsubscribeHandler = async (id: string) => {
		try {
			if (!id) {
				await sweetErrorHandling(new Error('Invalid member ID'));
				return;
			}
			if (!user?._id) {
				await sweetMixinErrorAlert('Please login first');
				throw new Error(Message.NOT_AUTHENTICATED);
			}

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unfollowed!', 800);
			// Refetch with current search filter
			await getAgentsRefetch({ 
				variables: { input: searchFilter } 
			});
		} catch (err: any) {
			console.error('Error in unsubscribeHandler:', err);
			const errorMessage = err?.graphQLErrors?.[0]?.message || err?.networkError?.message || err?.message || 'Unfollow failed!';
			if (err.message !== Message.NOT_AUTHENTICATED) {
				await sweetErrorHandling(new Error(errorMessage));
			}
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		
		if (router.query.input) {
			try {
				const inputObj = JSON.parse(router.query.input as string);
				setSearchFilter(inputObj);
				setCurrentPage(inputObj.page || 1);
			} catch (e) {
				console.error('Error parsing query input:', e);
				const defaultFilter = getDefaultFilter();
				setSearchFilter(defaultFilter);
				setCurrentPage(1);
			}
		} else if (!searchFilter || Object.keys(searchFilter).length === 0) {
			const defaultFilter = initialInput || getDefaultFilter();
			setSearchFilter(defaultFilter);
			setCurrentPage(defaultFilter.page || 1);
		}
	}, [router.isReady, router.query.input]);

	useEffect(() => {
		if (searchFilter) {
			setCurrentPage(searchFilter.page || 1);
		}
	}, [searchFilter]);

	// Debounced search effect
	useEffect(() => {
		if (debouncedSearchText !== undefined) {
			const newFilter = {
				...searchFilter,
				page: 1,
				search: {
					...searchFilter.search,
					text: debouncedSearchText || undefined,
				},
			};
			// Remove text from search if empty
			if (!debouncedSearchText) {
				delete newFilter.search.text;
			}
			setSearchFilter(newFilter);
			router.push(`/agent?input=${JSON.stringify(newFilter)}`, undefined, { scroll: false });
		}
	}, [debouncedSearchText]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		const newFilter = { ...searchFilter };
		switch (e.currentTarget.id) {
			case 'recent':
				newFilter.sort = 'createdAt';
				newFilter.direction = Direction.DESC;
				setFilterSortName('Recent');
				break;
			case 'old':
				newFilter.sort = 'createdAt';
				newFilter.direction = Direction.ASC;
				setFilterSortName('Oldest order');
				break;
			case 'likes':
				newFilter.sort = 'memberLikes';
				newFilter.direction = Direction.DESC;
				setFilterSortName('Likes');
				break;
			case 'views':
				newFilter.sort = 'memberViews';
				newFilter.direction = Direction.DESC;
				setFilterSortName('Views');
				break;
		}
		setSearchFilter(newFilter);
		router.push(`/agent?input=${JSON.stringify(newFilter)}`, undefined, { scroll: false });
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	if (device === 'mobile') {
		return <h1>AGENTS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'agent-list-page'}>
				<Stack className={'container'}>
					<Stack className={'filter'}>
						<Box component={'div'} className={'left'}>
							<TextField
								type="text"
								placeholder={'Search for an agent'}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										const newFilter = {
											...searchFilter,
											page: 1,
											search: { ...searchFilter.search, text: searchText },
										};
										setSearchFilter(newFilter);
										router.push(`/agent?input=${JSON.stringify(newFilter)}`, undefined, { scroll: false });
									}
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon sx={{ color: '#717171', fontSize: '22px' }} />
										</InputAdornment>
									),
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '12px',
										height: '56px',
										width: '100%',
										maxWidth: '500px',
										background: '#ffffff',
										boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
										'& fieldset': {
											borderColor: '#e3e3e3',
											borderWidth: '2px',
										},
										'&:hover fieldset': {
											borderColor: '#FF6B00',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#FF6B00',
											borderWidth: '2px',
										},
									},
									'& .MuiInputBase-input': {
										fontFamily: 'Poppins, sans-serif',
										fontSize: '15px',
										fontWeight: 500,
										color: '#181a20',
										'&::placeholder': {
											color: '#999',
											opacity: 1,
										},
									},
								}}
							/>
						</Box>
						<Box component={'div'} className={'right'}>
							<span className={'sort-label'}>Sort by</span>
							<div className={'sort-dropdown-wrapper'}>
								<Button 
									onClick={sortingClickHandler} 
									endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '20px' }} />}
									className={'sort-button'}
								>
									{filterSortName}
								</Button>
								<Menu 
									anchorEl={anchorEl} 
									open={sortingOpen} 
									onClose={sortingCloseHandler}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									sx={{
										'& .MuiPaper-root': {
											borderRadius: '12px',
											boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
											border: '1px solid #e3e3e3',
											marginTop: '8px',
											minWidth: '180px',
										},
										'& .MuiMenuItem-root': {
											fontFamily: 'Poppins, sans-serif',
											fontSize: '15px',
											fontWeight: 500,
											color: '#181a20',
											padding: '12px 20px',
											'&:hover': {
												background: '#f8f9fa',
												color: '#FF6B00',
											},
										},
									}}
								>
									<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
										Recent
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
										Oldest
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
										Likes
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
										Views
									</MenuItem>
								</Menu>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-wrap'}>
						{getAgentsLoading ? (
							<GridSkeleton count={9} SkeletonComponent={AgentCardSkeleton} columns={3} />
						) : agents?.length === 0 ? (
							<EmptyState
								type="agent"
								actionLabel="Browse All Dealers"
								onActionClick={() => {
									router.push('/agent');
								}}
							/>
						) : (
							agents.map((agent: Member) => {
								return (
									<AgentCard
										agent={agent}
										likeMemberHandler={likeMemberHandler}
										subscribeHandler={subscribeHandler}
										unsubscribeHandler={unsubscribeHandler}
										key={agent._id}
									/>
								);
							})
						)}
					</Stack>
					<Stack className={'pagination'}>
						{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
							<Stack className="pagination-box" direction="row" alignItems="center" gap={1}>
								<IconButton
									onClick={() => {
										if (currentPage > 1) {
											paginationChangeHandler({} as ChangeEvent<unknown>, currentPage - 1);
										}
									}}
									disabled={currentPage === 1}
									sx={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										border: '1px solid #e3e3e3',
										background: '#ffffff',
										color: currentPage === 1 ? '#d0d0d0' : '#717171',
										'&:hover': {
											background: currentPage === 1 ? '#ffffff' : '#f6f6f6',
											borderColor: currentPage === 1 ? '#e3e3e3' : '#f17742',
											color: currentPage === 1 ? '#d0d0d0' : '#f17742',
										},
										'&.Mui-disabled': {
											background: '#ffffff',
											borderColor: '#e3e3e3',
											color: '#d0d0d0',
										},
									}}
								>
									<ChevronLeftIcon />
								</IconButton>
								
								<Box
									sx={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										background: '#f17742',
										color: '#ffffff',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '16px',
										fontWeight: 600,
									}}
								>
									{currentPage}
								</Box>
								
								<IconButton
									onClick={() => {
										if (currentPage < Math.ceil(total / searchFilter.limit)) {
											paginationChangeHandler({} as ChangeEvent<unknown>, currentPage + 1);
										}
									}}
									disabled={currentPage >= Math.ceil(total / searchFilter.limit)}
									sx={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										border: '1px solid #e3e3e3',
										background: '#ffffff',
										color: currentPage >= Math.ceil(total / searchFilter.limit) ? '#d0d0d0' : '#717171',
										'&:hover': {
											background: currentPage >= Math.ceil(total / searchFilter.limit) ? '#ffffff' : '#f6f6f6',
											borderColor: currentPage >= Math.ceil(total / searchFilter.limit) ? '#e3e3e3' : '#f17742',
											color: currentPage >= Math.ceil(total / searchFilter.limit) ? '#d0d0d0' : '#f17742',
										},
										'&.Mui-disabled': {
											background: '#ffffff',
											borderColor: '#e3e3e3',
											color: '#d0d0d0',
										},
									}}
								>
									<ChevronRightIcon />
								</IconButton>
							</Stack>
						)}

						{agents.length !== 0 && (
							<span>
								Total {total} agent{total > 1 ? 's' : ''} available
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default withLayoutBasic(AgentList);
