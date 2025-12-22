import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HeroSearch from './HeroSearch';

const HeroSection = () => {
	const router = useRouter();


	return (
		<Stack className="hero-full-width">
			{/* Background Image with Overlay */}
			<Box component="div" className="hero-background">
				<div className="hero-overlay"></div>
			</Box>

			{/* Centered Content */}
			<Stack className="hero-content-centered">
				{/* Search Bar */}
				<HeroSearch />

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
