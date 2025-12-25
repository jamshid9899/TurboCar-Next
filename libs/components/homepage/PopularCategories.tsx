import React, { useState, useRef } from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PropertyType } from '../../enums/property.enum';
import { useRouter } from 'next/router';
import ScrollAnimation from '../common/ScrollAnimation';

const PopularCategories = () => {
	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [selectedType, setSelectedType] = useState<PropertyType | null>(null);

	// Popular car types for categories (matching the image)
	const popularTypes = [
		PropertyType.ELECTRIC,
		PropertyType.SUV,
		PropertyType.SEDAN,
		PropertyType.PICKUP,
		PropertyType.CROSSOVER,
		PropertyType.COUPE,
		PropertyType.HATCHBACK,
		PropertyType.WAGON,
		PropertyType.CONVERTIBLE,
	];

	// Format type name for display
	const formatTypeName = (type: PropertyType): string => {
		// Special cases for better display
		if (type === PropertyType.PICKUP) return 'Pickup Truck';
		return type
			.split('_')
			.map(word => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
	};

	// Handle type selection
	const handleTypeClick = (type: PropertyType) => {
		setSelectedType(type);
		const searchQuery: any = {
			typeList: [type],
		};
		
		router.push({
			pathname: '/property',
			query: {
				input: JSON.stringify({
					page: 1,
					limit: 9,
					sort: 'createdAt',
					direction: 'DESC',
					search: searchQuery,
				}),
			},
		});
	};

	// Scroll categories horizontally
	const scrollCategories = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const scrollAmount = 200;
			const currentScroll = scrollContainerRef.current.scrollLeft;
			const newScroll = direction === 'right' 
				? currentScroll + scrollAmount 
				: currentScroll - scrollAmount;
			
			scrollContainerRef.current.scrollTo({
				left: newScroll,
				behavior: 'smooth',
			});
		}
	};

	return (
		<ScrollAnimation animationType="fade-up" duration={0.7}>
			<Stack className="popular-categories-section">
				<Box component="div" className="container">
					{/* Header with title */}
					<Box component="div" className="categories-header">
						<Typography className="categories-title">Popular Categories</Typography>
					</Box>

					{/* Scrollable categories with arrow button */}
					<Box component="div" className="categories-wrapper">
						<Box 
							component="div" 
							className="categories-scroll-container"
							ref={scrollContainerRef}
						>
							{popularTypes.map((type) => {
								const isSelected = selectedType === type;
								return (
									<Box
										key={type}
										component="button"
										className={`category-chip ${isSelected ? 'selected' : ''}`}
										onClick={() => handleTypeClick(type)}
									>
										{formatTypeName(type)}
									</Box>
								);
							})}
						</Box>
						<IconButton 
							className="categories-scroll-btn"
							onClick={() => scrollCategories('right')}
							sx={{
								width: '40px',
								height: '40px',
								borderRadius: '50%',
								background: '#181a20',
								color: '#ffffff',
								flexShrink: 0,
								ml: '12px',
								'&:hover': {
									background: '#f17742',
								},
							}}
						>
							<ArrowForwardIcon />
						</IconButton>
					</Box>
				</Box>
			</Stack>
		</ScrollAnimation>
	);
};

export default PopularCategories;

