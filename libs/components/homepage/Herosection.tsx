import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CitySearchFilters from './CitySearchFilters';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';

interface HeroSectionProps {
	mode: 'RENT' | 'BUY';
	onModeChange: (mode: 'RENT' | 'BUY') => void;
	selectedLocation: PropertyLocation | null;
	onLocationSelect: (location: PropertyLocation) => void;
	selectedType: PropertyType | null;
	onTypeSelect: (type: PropertyType) => void;
	onSearch: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
	mode,
	onModeChange,
	selectedLocation,
	onLocationSelect,
	selectedType,
	onTypeSelect,
	onSearch,
}) => {
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
					Find your next car faster
				</Typography>

				{/* Search Filters in Hero - Centered */}
				<Box component="div" className="hero-search-container">
					<CitySearchFilters
						mode={mode}
						onModeChange={onModeChange}
						selectedLocation={selectedLocation}
						onLocationSelect={onLocationSelect}
						selectedType={selectedType}
						onTypeSelect={onTypeSelect}
						onSearch={onSearch}
					/>
				</Box>
			</Stack>

			{/* Scroll Indicator */}
			<Box component="div" className="hero-scroll-indicator">
				<KeyboardArrowDownIcon className="scroll-arrow" />
			</Box>
		</Stack>
	);
};

export default HeroSection;
