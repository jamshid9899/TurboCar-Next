import React, { useState, useEffect, useRef } from 'react';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Direction } from '../../enums/common.enum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

interface CitySearchFiltersProps {
	mode: 'RENT' | 'BUY';
	onModeChange: (mode: 'RENT' | 'BUY') => void;
	selectedLocation: PropertyLocation | null;
	onLocationSelect: (location: PropertyLocation) => void;
	selectedType: PropertyType | null;
	onTypeSelect: (type: PropertyType) => void;
	onSearch: () => void;
}

const CitySearchFilters: React.FC<CitySearchFiltersProps> = ({
	mode,
	onModeChange,
	selectedLocation,
	onLocationSelect,
	selectedType,
	onTypeSelect,
	onSearch,
}) => {
	const [locationOpen, setLocationOpen] = useState(false);
	const [typeOpen, setTypeOpen] = useState(false);
	const locationDropdownRef = useRef<HTMLDivElement>(null);
	const locationBoxRef = useRef<HTMLDivElement>(null);
	const typeDropdownRef = useRef<HTMLDivElement>(null);
	const typeBoxRef = useRef<HTMLDivElement>(null);

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
			
			// Close type dropdown
			if (
				typeBoxRef.current &&
				!typeBoxRef.current.contains(event.target as Node) &&
				typeDropdownRef.current &&
				!typeDropdownRef.current.contains(event.target as Node)
			) {
				setTypeOpen(false);
			}
		};

		if (locationOpen || typeOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [locationOpen, typeOpen]);

	const handleLocationSelect = (location: PropertyLocation) => {
		onLocationSelect(location);
		setLocationOpen(false);
	};

	const handleTypeSelect = (type: PropertyType) => {
		onTypeSelect(type);
		setTypeOpen(false);
	};

	return (
		<Stack className="hero-search-filters">
			{/* Single Horizontal Search Card */}
			<Stack className="hero-search-card">
				{/* Rent/Buy Toggle - Inside Card */}
				<Stack className="rent-buy-toggle-inside">
					<Box 
						component="div"
						className={`toggle-btn-inside ${mode === 'RENT' ? 'active' : ''}`}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							onModeChange('RENT');
						}}
					>
						Rent
					</Box>
					<Box 
						component="div"
						className={`toggle-btn-inside ${mode === 'BUY' ? 'active' : ''}`}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							onModeChange('BUY');
						}}
					>
						Buy
					</Box>
				</Stack>

				{/* Divider */}
				<Box component="div" className="search-divider"></Box>

				{/* Location Dropdown */}
				<Box 
					component="div"
					ref={locationBoxRef}
					className={`location-search-box-horizontal ${locationOpen ? 'on' : ''}`}
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						setLocationOpen(!locationOpen);
						setTypeOpen(false);
					}}
					sx={{ position: 'relative' }}
				>
					<span className="search-label">LOCATION</span>
					<span className="search-value">{selectedLocation ? selectedLocation : 'Select Location'}</span>
					<KeyboardArrowDownIcon className={`dropdown-icon ${locationOpen ? 'open' : ''}`} />
					
					{/* Location Dropdown - Inside location box */}
					{locationOpen && (
						<Box
							ref={locationDropdownRef}
							component="div"
							className={`hero-location-dropdown ${locationOpen ? 'on' : ''}`}
							onClick={(e) => e.stopPropagation()}
							sx={{
								position: 'absolute',
								top: 'calc(100% + 8px)',
								left: 0,
								zIndex: 10000,
								backgroundColor: '#ffffff',
								color: '#181a20',
							}}
						>
							{Object.values(PropertyLocation).map((location) => (
								<Box
									key={location}
									component="div"
									className={`hero-location-option ${selectedLocation === location ? 'selected' : ''}`}
									onClick={() => handleLocationSelect(location)}
									sx={{
										color: '#181a20',
										backgroundColor: '#ffffff',
										'&:hover': {
											backgroundColor: '#f5f5f5',
										},
										'&.selected': {
											color: '#0066ff',
											fontWeight: 700,
											border: '2px solid #0066ff',
										},
										'& span': {
											color: selectedLocation === location ? '#0066ff' : '#181a20',
											fontWeight: selectedLocation === location ? 700 : 500,
											fontSize: '15px',
											fontFamily: 'inherit',
										}
									}}
								>
									<span>{location}</span>
								</Box>
							))}
						</Box>
					)}
				</Box>

				{/* Divider */}
				<Box component="div" className="search-divider"></Box>

				{/* Type Dropdown */}
				<Box 
					component="div"
					ref={typeBoxRef}
					className={`location-search-box-horizontal ${typeOpen ? 'on' : ''}`}
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						setTypeOpen(!typeOpen);
						setLocationOpen(false);
					}}
					sx={{ position: 'relative' }}
				>
					<span className="search-label">TYPE</span>
					<span className="search-value">{selectedType ? selectedType : 'Select Type'}</span>
					<KeyboardArrowDownIcon className={`dropdown-icon ${typeOpen ? 'open' : ''}`} />
					
					{/* Type Dropdown - Inside type box */}
					{typeOpen && (
						<Box
							ref={typeDropdownRef}
							component="div"
							className={`hero-location-dropdown hero-type-dropdown ${typeOpen ? 'on' : ''}`}
							onClick={(e) => e.stopPropagation()}
							sx={{
								position: 'absolute',
								top: 'calc(100% + 8px)',
								right: 0,
								zIndex: 10000,
								backgroundColor: '#ffffff',
								color: '#181a20',
							}}
						>
							{Object.values(PropertyType).map((type) => (
								<Box
									key={type}
									component="div"
									className={`hero-location-option ${selectedType === type ? 'selected' : ''}`}
									onClick={() => handleTypeSelect(type)}
									sx={{
										color: '#181a20',
										backgroundColor: '#ffffff',
										'&:hover': {
											backgroundColor: '#f5f5f5',
										},
										'&.selected': {
											color: '#0066ff',
											fontWeight: 700,
											border: '2px solid #0066ff',
										},
										'& span': {
											color: selectedType === type ? '#0066ff' : '#181a20',
											fontWeight: selectedType === type ? 700 : 500,
											fontSize: '15px',
											fontFamily: 'inherit',
										}
									}}
								>
									<span>{type}</span>
								</Box>
							))}
						</Box>
					)}
				</Box>

				{/* Search Button */}
				<Box 
					component="div"
					className="hero-search-btn"
					onClick={onSearch}
				>
					<SearchIcon />
					<span>Search</span>
				</Box>
			</Stack>

		</Stack>
	);
};

export default CitySearchFilters;

