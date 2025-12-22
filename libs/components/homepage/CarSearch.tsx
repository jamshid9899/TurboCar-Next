import React, { useState, useEffect, useRef } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { PropertyLocation, PropertyBrand } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Direction } from '../../enums/common.enum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

interface CarSearchProps {
	onSearchChange?: (searchInput: PropertiesInquiry) => void;
}

const CarSearch = (props: CarSearchProps) => {
	const { onSearchChange } = props;
	const router = useRouter();
	const [mode, setMode] = useState<'RENT' | 'BUY'>('RENT');
	const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);
	const [selectedBrand, setSelectedBrand] = useState<PropertyBrand | null>(null);
	const [locationOpen, setLocationOpen] = useState(false);
	const [brandOpen, setBrandOpen] = useState(false);
	const locationDropdownRef = useRef<HTMLDivElement>(null);
	const locationBoxRef = useRef<HTMLDivElement>(null);
	const brandDropdownRef = useRef<HTMLDivElement>(null);
	const brandBoxRef = useRef<HTMLDivElement>(null);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// Close location dropdown
			if (
				locationBoxRef.current &&
				!locationBoxRef.current.contains(event.target as Node) &&
				locationDropdownRef.current &&
				!locationDropdownRef.current.contains(event.target as Node)
			) {
				setLocationOpen(false);
			}
			
			// Close brand dropdown
			if (
				brandBoxRef.current &&
				!brandBoxRef.current.contains(event.target as Node) &&
				brandDropdownRef.current &&
				!brandDropdownRef.current.contains(event.target as Node)
			) {
				setBrandOpen(false);
			}
		};

		if (locationOpen || brandOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [locationOpen, brandOpen]);

	const buildSearchInput = (): PropertiesInquiry => {
		const searchQuery: any = {
			isForSale: mode === 'BUY',
			isForRent: mode === 'RENT',
		};
		
		if (selectedLocation) {
			searchQuery.locationList = [selectedLocation];
		}
		
		if (selectedBrand) {
			searchQuery.brandList = [selectedBrand];
		}

		return {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: searchQuery,
		} as PropertiesInquiry;
	};

	const handleSearch = () => {
		const searchInput = buildSearchInput();
		
		if (onSearchChange) {
			onSearchChange(searchInput);
		} else {
			router.push({
				pathname: '/property',
				query: {
					input: JSON.stringify(searchInput),
				},
			});
		}
	};

	const handleModeChange = (newMode: 'RENT' | 'BUY') => {
		setMode(newMode);
		const searchInput = buildSearchInput();
		if (onSearchChange) {
			onSearchChange(searchInput);
		}
	};

	const handleLocationSelect = (location: PropertyLocation) => {
		setSelectedLocation(location);
		setLocationOpen(false);
		const searchInput = buildSearchInput();
		if (onSearchChange) {
			onSearchChange(searchInput);
		}
	};

	const handleBrandSelect = (brand: PropertyBrand) => {
		setSelectedBrand(brand);
		setBrandOpen(false);
		const searchInput = buildSearchInput();
		if (onSearchChange) {
			onSearchChange(searchInput);
		}
	};

	return (
		<Stack className="car-search-section">
			<Box component="div" className="container">
				{/* Location Search */}
				<Stack className="cities-search-wrapper">
					{/* Rent/Buy Toggle */}
					<Stack className="rent-buy-toggle">
						<Box 
							component="div"
							className={`toggle-btn ${mode === 'RENT' ? 'active' : ''}`}
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								handleModeChange('RENT');
							}}
						>
							RENT
						</Box>
						<Box 
							component="div"
							className={`toggle-btn ${mode === 'BUY' ? 'active' : ''}`}
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								handleModeChange('BUY');
							}}
						>
							BUY
						</Box>
					</Stack>

					<Box 
						component="div"
						ref={locationBoxRef}
						className={`location-search-box ${locationOpen ? 'on' : ''}`}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							setLocationOpen(!locationOpen);
							setBrandOpen(false);
						}}
					>
						<span>{selectedLocation ? selectedLocation : 'Select Location'}</span>
						<KeyboardArrowDownIcon />
					</Box>

					<Box 
						component="div"
						ref={brandBoxRef}
						className={`location-search-box ${brandOpen ? 'on' : ''}`}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							setBrandOpen(!brandOpen);
							setLocationOpen(false);
						}}
					>
						<span>{selectedBrand ? selectedBrand : 'Select Car Brand'}</span>
						<KeyboardArrowDownIcon />
					</Box>

					<Box 
						component="div"
						className="search-btn"
						onClick={handleSearch}
					>
						<SearchIcon />
					</Box>

					{/* Location Dropdown */}
					{locationOpen && (
						<Stack 
							ref={locationDropdownRef} 
							className={`cities-location-dropdown ${locationOpen ? 'on' : ''}`}
							onClick={(e) => e.stopPropagation()}
						>
							{Object.values(PropertyLocation).map((location) => (
								<Box
									key={location}
									component="div"
									className={`location-option ${selectedLocation === location ? 'selected' : ''}`}
									onClick={() => handleLocationSelect(location)}
								>
									<span>{location}</span>
								</Box>
							))}
						</Stack>
					)}

					{/* Brand Dropdown */}
					{brandOpen && (
						<Stack 
							ref={brandDropdownRef} 
							className={`cities-location-dropdown brand-dropdown ${brandOpen ? 'on' : ''}`}
							onClick={(e) => e.stopPropagation()}
						>
							{Object.values(PropertyBrand).map((brand) => (
								<Box
									key={brand}
									component="div"
									className={`location-option ${selectedBrand === brand ? 'selected' : ''}`}
									onClick={() => handleBrandSelect(brand)}
								>
									<span>{brand}</span>
								</Box>
							))}
						</Stack>
					)}
				</Stack>
			</Box>
		</Stack>
	);
};

export default CarSearch;

