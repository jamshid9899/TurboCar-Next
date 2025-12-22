import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Modal, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Direction } from '../../enums/common.enum';

const HeroSearch = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [mode, setMode] = useState<'RENT' | 'BUY'>('RENT');
	const [searchFilter, setSearchFilter] = useState<{
		search: {
			locationList: PropertyLocation[];
			typeList: PropertyType[];
			text: string;
			isForSale?: boolean;
			isForRent?: boolean;
		};
	}>({
		search: {
			locationList: [],
			typeList: [],
			text: '',
			isForSale: false,
			isForRent: true,
		},
	});

	// Dropdown states
	const [locationOpen, setLocationOpen] = useState(false);
	const [typeOpen, setTypeOpen] = useState(false);
	const [advancedOpen, setAdvancedOpen] = useState(false);
	const selectBoxRef = useRef<HTMLDivElement>(null);
	const locationDropdownRef = useRef<HTMLDivElement>(null);
	const typeDropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectBoxRef.current &&
				!selectBoxRef.current.contains(event.target as Node) &&
				locationDropdownRef.current &&
				!locationDropdownRef.current.contains(event.target as Node) &&
				typeDropdownRef.current &&
				!typeDropdownRef.current.contains(event.target as Node)
			) {
				setLocationOpen(false);
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

	/** HANDLERS **/
	const handleModeChange = (newMode: 'RENT' | 'BUY') => {
		setMode(newMode);
		const updatedFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				isForSale: newMode === 'BUY',
				isForRent: newMode === 'RENT',
			},
		};
		setSearchFilter(updatedFilter);
	};

	const searchHandler = (e?: React.MouseEvent) => {
		if (e) {
			e.stopPropagation();
		}

		// Location is required for RENT
		if (mode === 'RENT' && searchFilter.search.locationList.length === 0) {
			setLocationOpen(true);
			return;
		}
		
		const propertiesInquiry: PropertiesInquiry = {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				locationList: searchFilter.search.locationList.length > 0 ? searchFilter.search.locationList : undefined,
				typeList: searchFilter.search.typeList.length > 0 ? searchFilter.search.typeList : undefined,
				text: searchFilter.search.text || undefined,
				isForSale: mode === 'BUY',
				isForRent: mode === 'RENT',
			},
		};

		router.push({
			pathname: '/property',
			query: { input: JSON.stringify(propertiesInquiry) },
		});
	};

	const toggleLocation = (location: PropertyLocation, e: React.MouseEvent) => {
		e.stopPropagation();
		const list = [...searchFilter.search.locationList];
		const index = list.indexOf(location);
		if (index > -1) {
			list.splice(index, 1);
		} else {
			list.push(location);
		}
		
		const updatedFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				locationList: list,
			},
		};
		setSearchFilter(updatedFilter);
	};

	const toggleType = (type: PropertyType, e: React.MouseEvent) => {
		e.stopPropagation();
		const list = [...searchFilter.search.typeList];
		const index = list.indexOf(type);
		if (index > -1) {
			list.splice(index, 1);
		} else {
			list.push(type);
		}
		
		const updatedFilter = {
			...searchFilter,
			search: {
				...searchFilter.search,
				typeList: list,
			},
		};
		setSearchFilter(updatedFilter);
	};

	const handleLocationBoxClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setLocationOpen(!locationOpen);
		if (typeOpen) setTypeOpen(false);
	};

	const handleTypeBoxClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setTypeOpen(!typeOpen);
		if (locationOpen) setLocationOpen(false);
	};

	if (device === 'mobile') {
		return (
			<Stack className="hero-search-mobile">
				<input
					type="text"
					placeholder="Search cars..."
					onChange={(e) => setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, text: e.target.value } })}
				/>
				<button onClick={searchHandler}>
					<SearchIcon />
				</button>
			</Stack>
		);
	} else {
		return (
			<>
				<Stack className="select-box-wrapper">
					<Stack ref={selectBoxRef} className="select-box" onClick={(e) => e.stopPropagation()}>
					{/* RENT - First */}
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box 
						component="div"
						className={`box ${mode === 'RENT' ? 'active' : ''}`} 
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							handleModeChange('RENT');
						}}
					>
						<span>RENT</span>
					</Box>

					{/* BUY - Second */}
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box 
						component="div"
						className={`box ${mode === 'BUY' ? 'active' : ''}`} 
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							handleModeChange('BUY');
						}}
					>
						<span>BUY</span>
					</Box>

					{/* LOCATION - Third */}
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box component="div" className={`box ${locationOpen ? 'on' : ''} ${mode === 'RENT' && searchFilter.search.locationList.length === 0 ? 'required' : ''}`} onClick={handleLocationBoxClick}>
						<span>Location{mode === 'RENT' && searchFilter.search.locationList.length === 0 ? ' *' : ''}</span>
						<KeyboardArrowDownIcon />
					</Box>

					{/* CAR TYPE - Fourth */}
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box component="div" className={`box ${typeOpen ? 'on' : ''}`} onClick={handleTypeBoxClick}>
						<span>Car Type</span>
						<KeyboardArrowDownIcon />
					</Box>
					</Stack>

					<Stack className="search-box-other" onClick={(e) => e.stopPropagation()}>
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box className="search-btn" onClick={searchHandler}>
						<SearchIcon />
					</Box>
					</Stack>
				</Stack>

				{/* LOCATION DROPDOWN */}
				{locationOpen && (
					<Stack ref={locationDropdownRef} className={`filter-location ${locationOpen ? 'on' : ''}`} onClick={(e) => e.stopPropagation()}>
						{Object.values(PropertyLocation).map((location) => (
							<div key={location} onClick={(e) => toggleLocation(location, e)}>
								<input type="checkbox" checked={searchFilter.search.locationList.includes(location)} readOnly />
								<span>{location}</span>
							</div>
						))}
					</Stack>
				)}

				{/* TYPE DROPDOWN */}
				{typeOpen && (
					<Stack ref={typeDropdownRef} className={`filter-type ${typeOpen ? 'on' : ''}`} onClick={(e) => e.stopPropagation()}>
						{Object.values(PropertyType).slice(0, 4).map((type) => (
							<div
								key={type}
								onClick={(e) => toggleType(type, e)}
								style={{
									backgroundImage: `url(/img/banner/${type.toLowerCase()}.jpg)`,
								}}
							>
								<span>{type}</span>
							</div>
						))}
					</Stack>
				)}

				{/* ADVANCED FILTER MODAL */}
				<Modal open={advancedOpen} onClose={() => setAdvancedOpen(false)}>
					{/* @ts-ignore - TypeScript limitation with complex union types */}
					<Box className="advanced-filter-modal">
						{/* @ts-ignore - TypeScript limitation with complex union types */}
						<Box className="close" onClick={() => setAdvancedOpen(false)}>
							✕
						</Box>
						<Stack className="top">
							<span>Advanced Search</span>
							<div className="search-input-box">
								<img src="/img/icons/search.svg" alt="" />
								<input
									type="text"
									placeholder="Search by keyword..."
									value={searchFilter.search.text}
									onChange={(e) =>
										setSearchFilter({ ...searchFilter, search: { ...searchFilter.search, text: e.target.value } })
									}
								/>
							</div>
						</Stack>
						<hr />
						<Stack className="middle">
							<Stack className="row-box">
								{/* @ts-ignore - TypeScript limitation with complex union types */}
								<Box className="box">
									<span>Sale/Rent</span>
									<Stack className="inside">
										<Button
											onClick={() => {
												handleModeChange('BUY');
											}}
											className={mode === 'BUY' ? 'active' : ''}
										>
											For Sale
										</Button>
										<Button
											onClick={() => {
												handleModeChange('RENT');
											}}
											className={mode === 'RENT' ? 'active' : ''}
										>
											For Rent
										</Button>
									</Stack>
								</Box>
							</Stack>
						</Stack>
						<Stack className="bottom">
							<div>
								<img
									src="/img/icons/refresh.svg"
									alt=""
									onClick={() => {
										const resetFilter = {
											search: {
												locationList: [],
												typeList: [],
												text: '',
												isForSale: mode === 'BUY',
												isForRent: mode === 'RENT',
											},
										};
										setSearchFilter(resetFilter);
										
										const propertiesInquiry: PropertiesInquiry = {
											page: 1,
											limit: 9,
											sort: 'createdAt',
											search: {},
										};
										router.push({
											pathname: '/property',
											query: { input: JSON.stringify(propertiesInquiry) },
										});
										setAdvancedOpen(false);
									}}
								/>
								<span
									onClick={() => {
										const resetFilter = {
											search: {
												locationList: [],
												typeList: [],
												text: '',
												isForSale: mode === 'BUY',
												isForRent: mode === 'RENT',
											},
										};
										setSearchFilter(resetFilter);
										
										const propertiesInquiry: PropertiesInquiry = {
											page: 1,
											limit: 9,
											sort: 'createdAt',
											search: {},
										};
										router.push({
											pathname: '/property',
											query: { input: JSON.stringify(propertiesInquiry) },
										});
										setAdvancedOpen(false);
									}}
								>
									Refresh
								</span>
							</div>
							<button onClick={searchHandler}>Search</button>
						</Stack>
					</Box>
				</Modal>
			</>
		);
	}
};

export default HeroSearch;