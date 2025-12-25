import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PropertyBrand } from '../../enums/property.enum';
import { useRouter } from 'next/router';

interface CategoryFilterProps {
	onBrandSelect?: (brand: PropertyBrand) => void;
	selectedBrand?: PropertyBrand | null;
}

const CategoryFilter = ({ onBrandSelect, selectedBrand: externalSelectedBrand }: CategoryFilterProps) => {
	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [internalSelectedBrand, setInternalSelectedBrand] = useState<PropertyBrand | null>(null);
	
	// Use external selectedBrand if provided, otherwise use internal state
	const selectedBrand = externalSelectedBrand !== undefined ? externalSelectedBrand : internalSelectedBrand;

	// Popular car brands for categories
	const popularBrands = [
		PropertyBrand.TESLA,
		PropertyBrand.BMW,
		PropertyBrand.MERCEDES,
		PropertyBrand.AUDI,
		PropertyBrand.TOYOTA,
		PropertyBrand.FORD,
		PropertyBrand.HONDA,
		PropertyBrand.VOLKSWAGEN,
		PropertyBrand.NISSAN,
		PropertyBrand.HYUNDAI,
		PropertyBrand.PORSCHE,
		PropertyBrand.LAND_ROVER,
	];

	// Format brand name for display
	const formatBrandName = (brand: PropertyBrand): string => {
		return brand
			.split('_')
			.map(word => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
	};

	// Handle brand selection
	const handleBrandClick = (brand: PropertyBrand) => {
		if (onBrandSelect) {
			onBrandSelect(brand);
		} else {
			setInternalSelectedBrand(brand);
			const searchQuery: any = {
				brandList: [brand],
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
		}
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
		<Box component="div" className="category-filter-wrapper">
			<Box 
				component="div" 
				className="category-filter-scroll-container"
				ref={scrollContainerRef}
			>
			{popularBrands.map((brand) => {
				const isSelected = selectedBrand === brand;
				return (
					<Box
						key={brand}
						component="button"
						className={`category-filter-chip ${isSelected ? 'selected' : ''}`}
						onClick={() => handleBrandClick(brand)}
					>
						{formatBrandName(brand)}
					</Box>
				);
			})}
			</Box>
			<IconButton 
				className="category-filter-scroll-btn"
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
	);
};

export default CategoryFilter;

