import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import HeroSearch from './HeroSearch';

const HeroSection = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="hero-section">
				<Box component={'div'} className="hero-content">
					<Typography variant="h2" className="hero-title">
						Find Your Dream Car
					</Typography>
					<Typography className="hero-subtitle">
						Buy, Sell, Rent - All in One Place
					</Typography>
					<Box component={'div'} className="hero-search">
						<HeroSearch />
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="hero-section">
				<Stack className="header-main">
					<Stack className="container">
						<Box component={'div'} className="hero-content">
							<Typography variant="h1" className="hero-title">
								Find Your Dream Car
							</Typography>
							<Typography className="hero-subtitle">
								Buy, Sell, Rent - All in One Place
							</Typography>
						</Box>
						<Box component={'div'} className="search-box">
							<HeroSearch />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default HeroSection;