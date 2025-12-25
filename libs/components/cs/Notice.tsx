import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			event: true,
			title: 'Register now and get exclusive car deals and discounts',
			date: '01.03.2024',
		},
		{
			no: 2,
			title: "It's absolutely free to list and trade cars on TurboCar",
			date: '31.03.2024',
		},
		{
			no: 3,
			title: 'New feature: Rent cars by the hour or day',
			date: '15.04.2024',
		},
		{
			no: 4,
			title: 'Verified dealers now available in all major cities',
			date: '20.04.2024',
		},
	];

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Stack className={'bottom'}>
						{data.map((ele: any) => (
							<div className={`notice-card ${ele?.event && 'event'}`} key={ele.title}>
								{ele?.event ? <div>event</div> : <span className={'notice-number'}>{ele.no}</span>}
								<span className={'notice-title'}>{ele.title}</span>
								<span className={'notice-date'}>{ele.date}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
