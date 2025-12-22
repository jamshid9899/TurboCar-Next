import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeroSection = () => {


	return (
		<Stack className="hero-full-width">
			{/* Background Image with Overlay */}
			<Box component="div" className="hero-background">
				<div className="hero-overlay"></div>
			</Box>

			{/* Centered Content */}
			<Stack className="hero-content-centered">
				{/* Logo/Brand Name */}
				<Typography variant="h1" className="hero-brand">
					TURBOCAR
				</Typography>

				{/* Tagline/Slogan */}
				<Typography className="hero-tagline">
					Find Your Dream Car - Buy, Sell, Rent
				</Typography>
			</Stack>

			{/* Scroll Indicator */}
			<Box component="div" className="hero-scroll-indicator">
				<KeyboardArrowDownIcon className="scroll-arrow" />
			</Box>
		</Stack>
	);
};

export default HeroSection;
