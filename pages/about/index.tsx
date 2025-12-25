import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack } from '@mui/material';
import AboutUs from '../../libs/components/homepage/AboutUs';

const About: NextPage = () => {
	const device = useDeviceDetect();

	return (
		<Stack className={'about-page'}>
			<AboutUs />
		</Stack>
	);
};

export default withLayoutBasic(About);
