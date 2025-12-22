import React, { useState, useEffect, useRef } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { PropertyLocation, PropertyBrand } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Direction } from '../../enums/common.enum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

interface CityData {
	location: PropertyLocation;
	name: string;
	image: string;
}

const CITIES: CityData[] = [
	{ location: PropertyLocation.MADRID, name: 'Madrid', image: '/img/banner/cities/madrid.jpeg' },
	{ location: PropertyLocation.BARCELONA, name: 'Barcelona', image: '/img/banner/cities/barselona.jpeg' },
	{ location: PropertyLocation.VALENCIA, name: 'Valencia', image: '/img/banner/cities/city1.jpeg' },
	{ location: PropertyLocation.SEVILLA, name: 'Sevilla', image: '/img/banner/cities/city3.jpeg' },
	{ location: PropertyLocation.MALAGA, name: 'Malaga', image: '/img/banner/cities/city4.jpeg' },
	{ location: PropertyLocation.BILBAO, name: 'Bilbao', image: '/img/banner/cities/city6.jpeg' },
	{ location: PropertyLocation.ZARAGOZA, name: 'Zaragoza', image: '/img/banner/cities/city7.jpeg' },
	{ location: PropertyLocation.MURCIA, name: 'Murcia', image: '/img/banner/cities/city9.jpeg' },
	{ location: PropertyLocation.ALICANTE, name: 'Alicante', image: '/img/banner/cities/city10.jpeg' },
	{ location: PropertyLocation.GRANADA, name: 'Granada', image: '/img/banner/cities/pic1.jpeg' },
	{ location: PropertyLocation.CORDOBA, name: 'Cordoba', image: '/img/banner/cities/pic2.jpeg' },
	{ location: PropertyLocation.PALMA, name: 'Palma', image: '/img/banner/cities/picture.jpeg' },
];

const AvailableCities = () => {
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

	const handleCityClick = (location: PropertyLocation) => {
		const searchQuery: any = {
			locationList: [location],
			isForSale: mode === 'BUY',
			isForRent: mode === 'RENT',
		};
		
		if (selectedBrand) {
			searchQuery.brandList = [selectedBrand];
		}

		router.push({
			pathname: '/property',
			query: {
				input: JSON.stringify({
					page: 1,
					limit: 9,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: searchQuery,
				} as PropertiesInquiry),
			},
		});
	};

	const handleLocationSelect = (location: PropertyLocation) => {
		setSelectedLocation(location);
		setLocationOpen(false);
		if (location) {
			handleCityClick(location);
		}
	};

	const handleBrandSelect = (brand: PropertyBrand) => {
		setSelectedBrand(brand);
		setBrandOpen(false);
		if (selectedLocation) {
			handleCityClick(selectedLocation);
		}
	};

	const handleSearch = () => {
		if (selectedLocation) {
			handleCityClick(selectedLocation);
		}
	};

	const handleModeChange = (newMode: 'RENT' | 'BUY') => {
		setMode(newMode);
		if (selectedLocation) {
			handleCityClick(selectedLocation);
		}
	};

	return (
		<Stack className="available-cities-section">
			<Box component="div" className="container">
				<Typography variant="h2" className="section-title">
					Available all over Spain
				</Typography>

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

				<Stack className="cities-grid">
					{CITIES.map((city) => {
						return (
							<Box
								key={city.location}
								component="div"
								className="city-card"
								onClick={() => handleCityClick(city.location)}
							>
								{/* City Image */}
								<Box component="div" className="city-image">
									<img src={city.image} alt={city.name} />
								</Box>

								{/* City Name */}
								<Box component="div" className="city-info">
									<Typography className="city-name">{city.name}</Typography>
								</Box>
							</Box>
						);
					})}
				</Stack>
			</Box>
		</Stack>
	);
};

export default AvailableCities;
