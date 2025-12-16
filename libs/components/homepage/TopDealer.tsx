// libs/components/homepage/TopDealers.tsx
import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';
import Link from 'next/link';
import TopDealerCard from './TopDealerCard';

interface TopDealersProps {
	initialInput: AgentsInquiry;
}

const TopDealers = (props: TopDealersProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topDealers, setTopDealers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const { loading, data, error, refetch } = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			if (data?.getAgents?.list) {
				setTopDealers(data.getAgents.list);
			}
		},
	});

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-dealers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Dealers</span>
						<p>Trusted car dealers</p>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading...
							</Box>
						) : topDealers.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No dealers available</p>
							</Box>
						) : (
							<Swiper
								className={'top-dealers-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={25}
								modules={[Autoplay]}
							>
								{topDealers.map((dealer: Member) => {
									return (
										<SwiperSlide key={dealer._id} className={'top-dealer-slide'}>
											<TopDealerCard dealer={dealer} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-dealers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Dealers</span>
							<p>Our trusted car dealers across Spain</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/agent'}>
									<span>See All Dealers</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{loading ? (
							<Box component={'div'} className={'loading'}>
								Loading dealers...
							</Box>
						) : topDealers.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<p>No dealers available at the moment</p>
							</Box>
						) : (
							<Swiper
								className={'top-dealers-swiper'}
								slidesPerView={'auto'}
								spaceBetween={25}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-dealers-next',
									prevEl: '.swiper-dealers-prev',
								}}
								pagination={{
									el: '.swiper-dealers-pagination',
								}}
							>
								{topDealers.map((dealer: Member) => {
									return (
										<SwiperSlide key={dealer._id} className={'top-dealer-slide'}>
											<TopDealerCard dealer={dealer} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-dealers-prev'} />
						<div className={'swiper-dealers-pagination'}></div>
						<EastIcon className={'swiper-dealers-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopDealers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopDealers;