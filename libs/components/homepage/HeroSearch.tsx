import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Button, FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SellIcon from '@mui/icons-material/Sell';
import KeyIcon from '@mui/icons-material/Key';

// Car Brands
const carBrands = [
	'TOYOTA',
	'BMW',
	'MERCEDES',
	'AUDI',
	'HONDA',
	'FORD',
	'CHEVROLET',
	'NISSAN',
	'HYUNDAI',
	'KIA',
	'VOLKSWAGEN',
	'MAZDA',
];

// Car Types
const carTypes = [
	'SEDAN',
	'SUV',
	'TRUCK',
	'COUPE',
	'HATCHBACK',
	'CONVERTIBLE',
	'VAN',
	'WAGON',
];

// Locations (Spanish cities)
const locations = [
	'MADRID',
	'BARCELONA',
	'VALENCIA',
	'SEVILLA',
	'MALAGA',
	'BILBAO',
	'ZARAGOZA',
	'MURCIA',
];

// Price Ranges
const priceRanges = [
	{ label: '€0 - €10,000', min: 0, max: 10000 },
	{ label: '€10,000 - €20,000', min: 10000, max: 20000 },
	{ label: '€20,000 - €30,000', min: 20000, max: 30000 },
	{ label: '€30,000 - €50,000', min: 30000, max: 50000 },
	{ label: '€50,000+', min: 50000, max: 1000000 },
];

const HeroSearch = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	// Search State
	const [brand, setBrand] = useState('');
	const [type, setType] = useState('');
	const [location, setLocation] = useState('');
	const [priceRange, setPriceRange] = useState('');

	// Search Handler
	const handleSearch = () => {
		const searchParams: any = {};

		if (brand) searchParams.brandList = [brand];
		if (type) searchParams.typeList = [type];
		if (location) searchParams.locationList = [location];
		
		if (priceRange) {
			const range = priceRanges.find(r => r.label === priceRange);
			if (range) {
				searchParams.pricesRange = { start: range.min, end: range.max };
			}
		}

		const query = {
			page: 1,
			limit: 12,
			search: searchParams,
		};

		router.push(`/property?input=${JSON.stringify(query)}`);
	};

	// CTA Handlers
	const handleBrowseCars = () => {
		router.push('/property?search=buy');
	};

	const handleSellCar = () => {
		router.push('/agent/add-property');
	};

	const handleRentCar = () => {
		router.push('/property?search=rent');
	};

	return (
		<Stack className="hero-search-form" spacing={4}>
			{/* Search Filters */}
			<Stack 
				direction={{ xs: 'column', md: 'row' }} 
				spacing={2}
				sx={{
					background: 'white',
					padding: '20px',
					borderRadius: '12px',
					boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
				}}
			>
				{/* Brand Filter */}
				<FormControl fullWidth>
					<Select
						value={brand}
						onChange={(e) => setBrand(e.target.value)}
						displayEmpty
						sx={{
							background: 'white',
							'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
						}}
					>
						<MenuItem value="">
							<em>Select Brand</em>
						</MenuItem>
						{carBrands.map((b) => (
							<MenuItem key={b} value={b}>
								{b}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Type Filter */}
				<FormControl fullWidth>
					<Select
						value={type}
						onChange={(e) => setType(e.target.value)}
						displayEmpty
						sx={{
							background: 'white',
							'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
						}}
					>
						<MenuItem value="">
							<em>Select Type</em>
						</MenuItem>
						{carTypes.map((t) => (
							<MenuItem key={t} value={t}>
								{t}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Location Filter */}
				<FormControl fullWidth>
					<Select
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						displayEmpty
						sx={{
							background: 'white',
							'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
						}}
					>
						<MenuItem value="">
							<em>Select Location</em>
						</MenuItem>
						{locations.map((l) => (
							<MenuItem key={l} value={l}>
								{l}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Price Range Filter */}
				<FormControl fullWidth>
					<Select
						value={priceRange}
						onChange={(e) => setPriceRange(e.target.value)}
						displayEmpty
						sx={{
							background: 'white',
							'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
						}}
					>
						<MenuItem value="">
							<em>Price Range</em>
						</MenuItem>
						{priceRanges.map((p) => (
							<MenuItem key={p.label} value={p.label}>
								{p.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Search Button */}
				<Button
					variant="contained"
					onClick={handleSearch}
					startIcon={<SearchIcon />}
					sx={{
						minWidth: '150px',
						height: '56px',
						background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
						'&:hover': {
							background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
						},
					}}
				>
					Search
				</Button>
			</Stack>

			{/* CTA Buttons */}
			<Stack 
				direction={{ xs: 'column', sm: 'row' }} 
				spacing={2} 
				justifyContent="center"
			>
				<Button
					variant="outlined"
					startIcon={<DirectionsCarIcon />}
					onClick={handleBrowseCars}
					sx={{
						color: 'white',
						borderColor: 'white',
						'&:hover': {
							borderColor: 'white',
							background: 'rgba(255, 255, 255, 0.1)',
						},
					}}
				>
					Browse Cars
				</Button>

				<Button
					variant="outlined"
					startIcon={<SellIcon />}
					onClick={handleSellCar}
					sx={{
						color: 'white',
						borderColor: 'white',
						'&:hover': {
							borderColor: 'white',
							background: 'rgba(255, 255, 255, 0.1)',
						},
					}}
				>
					Sell Your Car
				</Button>

				<Button
					variant="outlined"
					startIcon={<KeyIcon />}
					onClick={handleRentCar}
					sx={{
						color: 'white',
						borderColor: 'white',
						'&:hover': {
							borderColor: 'white',
							background: 'rgba(255, 255, 255, 0.1)',
						},
					}}
				>
					Rent a Car
				</Button>
			</Stack>
		</Stack>
	);
};

export default HeroSearch;