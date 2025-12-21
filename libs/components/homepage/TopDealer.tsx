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
			await sweetErrorHandling(new Error(errorMessage));
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
						<Stack className="left">
							<Typography className={'main-title'}>Top Dealers</Typography>
							<Typography className={'sub-title'}>Most trusted car dealers</Typography>
						</Stack>
						<Stack className="right">
							<div className={'more-box'}>
								<span>See All Dealers</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Stack>
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