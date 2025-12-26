import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import TopDealerCard from './TopDealerCard';
import { Member } from '../../types/member/member';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { Direction } from '../../enums/common.enum';
import { GET_AGENTS } from '../../../apollo/user/query';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

const TopDealers = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [topDealers, setTopDealers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	
	const [getAgents, { loading, data, error, refetch: getAgentsRefetch }] = useLazyQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setTopDealers(data?.getAgents?.list || []);
		},
	});

	/** HANDLERS **/
	const subscribeHandler = async (id: string) => {
		try {
			if (!id) {
				await sweetErrorHandling(new Error('Invalid member ID'));
				return;
			}
			if (!user?._id) {
				await sweetErrorHandling(new Error(Message.NOT_AUTHENTICATED));
				return;
			}

			// Check if already following
			const dealer = topDealers.find((d) => d._id === id);
			if (dealer?.meFollowed && dealer?.meFollowed[0]?.myFollowing) {
				// Already following, so unsubscribe instead
				await unsubscribeHandler(id);
				return;
			}

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await getAgentsRefetch({
				variables: {
					input: {
						page: 1,
						limit: 6,
						sort: 'memberRank',
						direction: Direction.DESC,
						search: {},
					},
				},
			});
		} catch (err: any) {
			console.error('Error in subscribeHandler:', err);
			const errorMessage = err?.graphQLErrors?.[0]?.message || err?.networkError?.message || err?.message || 'Subscribe failed!';
			
			// If error is "Create failed" or similar, try to unsubscribe instead
			if (errorMessage.toLowerCase().includes('create failed') || 
			    errorMessage.toLowerCase().includes('already') ||
			    errorMessage.toLowerCase().includes('duplicate')) {
				// Try to unsubscribe instead
				try {
					await unsubscribeHandler(id);
				} catch (unsubErr: any) {
					await sweetErrorHandling(new Error('Already following this dealer'));
				}
			} else {
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
				await sweetErrorHandling(new Error(Message.NOT_AUTHENTICATED));
				return;
			}

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await getAgentsRefetch({
				variables: {
					input: {
						page: 1,
						limit: 6,
						sort: 'memberRank',
						direction: Direction.DESC,
						search: {},
					},
				},
			});
		} catch (err: any) {
			console.error('Error in unsubscribeHandler:', err);
			const errorMessage = err?.graphQLErrors?.[0]?.message || err?.networkError?.message || err?.message || 'Unsubscribe failed!';
			if (errorMessage.includes('Create failed')) {
				await sweetErrorHandling(new Error('Unsubscribe failed! Please try again.'));
			} else {
				await sweetErrorHandling(new Error(errorMessage));
			}
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		getAgents({
			variables: {
				input: {
					page: 1,
					limit: 6,
					sort: 'memberRank',
					direction: Direction.DESC,
					search: {},
				},
			},
		});
	}, []);

	if (device === 'mobile') {
		return <div>TOP DEALERS MOBILE</div>;
	} else {
		return (
			<Stack className={'top-dealers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						{/* Premium Overline with Decorative Lines */}
						<div className={'overline-section'}>
							<div className={'decorative-line'}></div>
							<span className={'overline-text'}>TRUSTED PARTNERS</span>
							<div className={'decorative-line'}></div>
						</div>

						{/* Main Title with Gradient */}
						<h2 className={'main-title'}>Top Dealers</h2>

						{/* Subtitle */}
						<p className={'subtitle'}>Most trusted car dealers</p>
					</Stack>
					<Stack className={'card-box'}>
						{topDealers.map((dealer: Member) => {
							return (
								<TopDealerCard
									key={dealer._id}
									dealer={dealer}
									subscribeHandler={subscribeHandler}
									unsubscribeHandler={unsubscribeHandler}
								/>
							);
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default TopDealers;