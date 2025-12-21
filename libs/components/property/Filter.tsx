import React, { useCallback, useEffect, useState } from 'react';
import { Stack, Box, Typography, Slider, Checkbox, FormControlLabel, ToggleButtonGroup, ToggleButton, InputAdornment, TextField, Collapse, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
	PropertyLocation,
	PropertyBrand,
	PropertyType,
	PropertyCondition,
	PropertyFuelType,
	PropertyTransmission,
	PropertyColor,
	PropertyFeatures,
} from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';

interface FilterProps {
	searchFilter: PropertiesInquiry;
	setSearchFilter: (data: any) => void;
	initialInput?: PropertiesInquiry;
}

// Top 6 brands for quick access
const TOP_BRANDS = [
	PropertyBrand.BMW,
	PropertyBrand.AUDI,
	PropertyBrand.MERCEDES,
	PropertyBrand.TOYOTA,
	PropertyBrand.HONDA,
	PropertyBrand.FORD,
];

// Color icons mapping
const colorIcons: Partial<Record<PropertyColor, string>> = {
	[PropertyColor.WHITE]: '⚪',
	[PropertyColor.BLACK]: '⚫',
	[PropertyColor.RED]: '🔴',
	[PropertyColor.BLUE]: '🔵',
	[PropertyColor.GREEN]: '🟢',
	[PropertyColor.YELLOW]: '🟡',
	[PropertyColor.SILVER]: '🔘',
	[PropertyColor.GRAY]: '⚫',
	[PropertyColor.ORANGE]: '🟠',
	[PropertyColor.BROWN]: '🟤',
	[PropertyColor.PURPLE]: '🟣',
	[PropertyColor.PINK]: '🩷',
	[PropertyColor.GOLD]: '🟡',
	[PropertyColor.BEIGE]: '🟤',
	[PropertyColor.BRONZE]: '🟠',
	[PropertyColor.CHARCOAL]: '⚫',
	[PropertyColor.CREAM]: '⚪',
	[PropertyColor.BURGUNDY]: '🔴',
	[PropertyColor.NAVY]: '🔵',
	[PropertyColor.TAN]: '🟤',
	[PropertyColor.OTHER]: '⚪',
};

const Filter = ({ searchFilter, setSearchFilter, initialInput }: FilterProps) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');

	const [searchText, setSearchText] = useState('');
	const [locationList, setLocationList] = useState<PropertyLocation[]>([]);
	const [brandList, setBrandList] = useState<PropertyBrand[]>([]);
	const [typeList, setTypeList] = useState<PropertyType[]>([]);
	const [conditionList, setConditionList] = useState<PropertyCondition[]>([]);
	const [fuelTypeList, setFuelTypeList] = useState<PropertyFuelType[]>([]);
	const [transmissionList, setTransmissionList] = useState<PropertyTransmission[]>([]);
	const [colorList, setColorList] = useState<PropertyColor[]>([]);
	const [featuresList, setFeaturesList] = useState<PropertyFeatures[]>([]);
	
	// Price range
	const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
	
	// Mileage range
	const [mileageRange, setMileageRange] = useState<number[]>([0, 300000]);
	
	// Year range
	const [yearRange, setYearRange] = useState<number[]>([2000, new Date().getFullYear()]);
	
	// Sale/Rent
	const [isForSale, setIsForSale] = useState<boolean | undefined>(undefined);
	const [isForRent, setIsForRent] = useState<boolean | undefined>(undefined);

	// Advanced filters collapse state
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [showAllBrands, setShowAllBrands] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search) {
			const search = searchFilter.search;
			if (search.locationList) setLocationList(search.locationList);
			if (search.brandList) setBrandList(search.brandList);
			if (search.typeList) setTypeList(search.typeList);
			if (search.conditionList) setConditionList(search.conditionList);
			if (search.fuelTypeList) setFuelTypeList(search.fuelTypeList);
			if (search.transmissionList) setTransmissionList(search.transmissionList);
			if (search.colorList) setColorList(search.colorList);
			if (search.featuresList) setFeaturesList(search.featuresList);
			if (search.pricesRange) {
				setPriceRange([search.pricesRange.start || 0, search.pricesRange.end || 500000]);
			} else if ((search as any).minPrice || (search as any).maxPrice) {
				setPriceRange([(search as any).minPrice || 0, (search as any).maxPrice || 500000]);
			}
			if (search.mileageRange) {
				setMileageRange([search.mileageRange.start || 0, search.mileageRange.end || 300000]);
			} else if ((search as any).minMileage || (search as any).maxMileage) {
				setMileageRange([(search as any).minMileage || 0, (search as any).maxMileage || 300000]);
			}
			if (search.yearRange) {
				setYearRange([search.yearRange.start || 2000, search.yearRange.end || new Date().getFullYear()]);
			} else if ((search as any).minYear || (search as any).maxYear) {
				setYearRange([(search as any).minYear || 2000, (search as any).maxYear || new Date().getFullYear()]);
			}
			if (search.text) setSearchText(search.text);
			if (search.isForSale !== undefined) setIsForSale(search.isForSale);
			if (search.isForRent !== undefined) setIsForRent(search.isForRent);
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const toggleLocation = (location: PropertyLocation) => {
		const updated = locationList.includes(location)
			? locationList.filter((item) => item !== location)
			: [...locationList, location];
		setLocationList(updated);
		applyFilter({ locationList: updated });
	};

	const toggleBrand = (brand: PropertyBrand) => {
		const updated = brandList.includes(brand)
			? brandList.filter((item) => item !== brand)
			: [...brandList, brand];
		setBrandList(updated);
		applyFilter({ brandList: updated });
	};

	const toggleType = (type: PropertyType) => {
		const updated = typeList.includes(type)
			? typeList.filter((item) => item !== type)
			: [...typeList, type];
		setTypeList(updated);
		applyFilter({ typeList: updated });
	};

	const toggleCondition = (condition: PropertyCondition) => {
		const updated = conditionList.includes(condition)
			? conditionList.filter((item) => item !== condition)
			: [...conditionList, condition];
		setConditionList(updated);
		applyFilter({ conditionList: updated });
	};

	const toggleFuelType = (fuel: PropertyFuelType) => {
		const updated = fuelTypeList.includes(fuel)
			? fuelTypeList.filter((item) => item !== fuel)
			: [...fuelTypeList, fuel];
		setFuelTypeList(updated);
		applyFilter({ fuelTypeList: updated });
	};

	const toggleTransmission = (transmission: PropertyTransmission) => {
		const updated = transmissionList.includes(transmission)
			? transmissionList.filter((item) => item !== transmission)
			: [...transmissionList, transmission];
		setTransmissionList(updated);
		applyFilter({ transmissionList: updated });
	};

	const toggleColor = (color: PropertyColor) => {
		const updated = colorList.includes(color)
			? colorList.filter((item) => item !== color)
			: [...colorList, color];
		setColorList(updated);
		applyFilter({ colorList: updated });
	};

	const toggleFeature = (feature: PropertyFeatures) => {
		const updated = featuresList.includes(feature)
			? featuresList.filter((item) => item !== feature)
			: [...featuresList, feature];
		setFeaturesList(updated);
		applyFilter({ featuresList: updated });
	};

	const handlePriceChange = (event: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const handlePriceCommit = () => {
		applyFilter({
			pricesRange: {
				start: priceRange[0],
				end: priceRange[1],
			},
		});
	};

	const handleMileageChange = (event: Event, newValue: number | number[]) => {
		setMileageRange(newValue as number[]);
	};

	const handleMileageCommit = () => {
		applyFilter({
			mileageRange: {
				start: mileageRange[0],
				end: mileageRange[1],
			},
		});
	};

	const handleYearChange = (event: Event, newValue: number | number[]) => {
		setYearRange(newValue as number[]);
	};

	const handleYearCommit = () => {
		applyFilter({
			yearRange: {
				start: yearRange[0],
				end: yearRange[1],
			},
		});
	};

	const handleSaleRentChange = (event: React.MouseEvent<HTMLElement>, newValue: 'sale' | 'rent' | null) => {
		if (newValue === null) {
			setIsForSale(undefined);
			setIsForRent(undefined);
			applyFilter({ isForSale: undefined, isForRent: undefined });
			return;
		}
		if (newValue === 'sale') {
			setIsForSale(true);
			setIsForRent(false);
			applyFilter({ isForSale: true, isForRent: false });
		} else {
			setIsForRent(true);
			setIsForSale(false);
			applyFilter({ isForSale: false, isForRent: true });
		}
	};

	const handleTextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchText(value);
		applyFilter({ text: value });
	};

	const applyFilter = useCallback(
		(updates: any) => {
			const currentSearch = (searchFilter && searchFilter.search) ? searchFilter.search : {};
			const newFilter: PropertiesInquiry = {
				page: 1,
				limit: searchFilter?.limit || initialInput?.limit || 9,
				sort: searchFilter?.sort || initialInput?.sort || 'createdAt',
				direction: searchFilter?.direction || initialInput?.direction,
				search: {
					...currentSearch,
					locationList,
					brandList,
					typeList,
					conditionList,
					fuelTypeList,
					transmissionList,
					colorList,
					featuresList,
					pricesRange: {
						start: priceRange[0],
						end: priceRange[1],
					},
					mileageRange: {
						start: mileageRange[0],
						end: mileageRange[1],
					},
					yearRange: {
						start: yearRange[0],
						end: yearRange[1],
					},
					isForSale,
					isForRent,
					text: searchText,
					...updates,
				},
			};
			router.push(
				`/property?input=${JSON.stringify(newFilter)}`,
				`/property?input=${JSON.stringify(newFilter)}`,
				{ scroll: false }
			);
		},
		[
			searchFilter,
			locationList,
			brandList,
			typeList,
			conditionList,
			fuelTypeList,
			transmissionList,
			colorList,
			featuresList,
			priceRange,
			mileageRange,
			yearRange,
			isForSale,
			isForRent,
			searchText,
			router,
			initialInput,
		],
	);

	const resetFilters = () => {
		setSearchText('');
		setLocationList([]);
		setBrandList([]);
		setTypeList([]);
		setConditionList([]);
		setFuelTypeList([]);
		setTransmissionList([]);
		setColorList([]);
		setFeaturesList([]);
		setPriceRange([0, 500000]);
		setMileageRange([0, 300000]);
		setYearRange([2000, new Date().getFullYear()]);
		setIsForSale(undefined);
		setIsForRent(undefined);

		const defaultFilter: PropertiesInquiry = {
			page: 1,
			limit: initialInput?.limit || 9,
			sort: initialInput?.sort || 'createdAt',
			direction: initialInput?.direction,
			search: {},
		};
		setSearchFilter(defaultFilter);
		router.push('/property', undefined, { scroll: false });
	};

	if (device === 'mobile') {
		return <div>FILTER MOBILE</div>;
	} else {
		const typeValue = isForSale ? 'sale' : isForRent ? 'rent' : null;
		const allBrands = Object.values(PropertyBrand);
		const displayedBrands = showAllBrands ? allBrands : TOP_BRANDS;
		const remainingBrandsCount = allBrands.length - TOP_BRANDS.length;
		
		return (
			<Stack className="filter-main-new">
				{/* FILTER TITLE */}
				<Typography className="filter-title-new" variant="h5">
					Filters
				</Typography>

				{/* QUICK FILTERS - Always Visible */}
				<Stack className="quick-filters">
					{/* TYPE - ToggleButtonGroup */}
					<Stack className="filter-section-new">
						<Typography className="section-title-new">Type</Typography>
						<ToggleButtonGroup
							value={typeValue}
							exclusive
							onChange={handleSaleRentChange}
							aria-label="sale or rent"
							fullWidth
							className="type-toggle-group"
						>
							<ToggleButton value="sale" aria-label="for sale" className="type-toggle-btn">
								Sale
							</ToggleButton>
							<ToggleButton value="rent" aria-label="for rent" className="type-toggle-btn">
								Rent
							</ToggleButton>
						</ToggleButtonGroup>
					</Stack>

					{/* PRICE RANGE */}
					<Stack className="filter-section-new">
						<Typography className="section-title-new">Price</Typography>
						<Slider
							value={priceRange}
							onChange={handlePriceChange}
							onChangeCommitted={handlePriceCommit}
							valueLabelDisplay="auto"
							min={0}
							max={500000}
							step={1000}
							valueLabelFormat={(value) => `€${(value / 1000).toFixed(0)}k`}
							className="price-slider"
						/>
						<Stack className="price-range-display" direction="row" justifyContent="space-between" alignItems="center">
							<Typography variant="body2">€{(priceRange[0] / 1000).toFixed(0)}k</Typography>
							<Typography variant="body2">—</Typography>
							<Typography variant="body2">€{(priceRange[1] / 1000).toFixed(0)}k</Typography>
						</Stack>
					</Stack>

					{/* LOCATION */}
					<Stack className="filter-section-new">
						<Typography className="section-title-new">Location</Typography>
						<div className="chip-group-new">
							{Object.values(PropertyLocation).map((location) => {
								const isSelected = locationList.includes(location);
								return (
									<div
										key={location}
										className={`filter-chip-new ${isSelected ? 'selected' : ''}`}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											toggleLocation(location);
										}}
									>
										{location}
									</div>
								);
							})}
						</div>
					</Stack>

					{/* BRAND - Top 6 + More */}
					<Stack className="filter-section-new">
						<Typography className="section-title-new">Brand</Typography>
						<div className="chip-group-new">
							{displayedBrands.map((brand) => {
								const isSelected = brandList.includes(brand);
								return (
									<div
										key={brand}
										className={`filter-chip-new ${isSelected ? 'selected' : ''}`}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											toggleBrand(brand);
										}}
									>
										{brand}
									</div>
								);
							})}
							{!showAllBrands && remainingBrandsCount > 0 && (
								<div
									className="filter-chip-new more-chip"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setShowAllBrands(true);
									}}
								>
									+{remainingBrandsCount} More
								</div>
							)}
						</div>
					</Stack>

					{/* CAR TYPE */}
					<Stack className="filter-section-new">
						<Typography className="section-title-new">Car Type</Typography>
						<div className="chip-group-new">
							{Object.values(PropertyType).slice(0, 8).map((type) => {
								const isSelected = typeList.includes(type);
								return (
									<div
										key={type}
										className={`filter-chip-new ${isSelected ? 'selected' : ''}`}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											toggleType(type);
										}}
									>
										{type}
									</div>
								);
							})}
						</div>
					</Stack>
				</Stack>

				{/* MORE FILTERS BUTTON */}
				<Button
					className="more-filters-btn"
					onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
					endIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				>
					{showAdvancedFilters ? 'Hide' : '+ More Filters'}
				</Button>

				{/* ADVANCED FILTERS - Collapsible */}
				<Collapse in={showAdvancedFilters}>
					<Stack className="advanced-filters">
						{/* CONDITION */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Condition</Typography>
							<div className="chip-group-new">
								{Object.values(PropertyCondition).map((condition) => {
									const isSelected = conditionList.includes(condition);
									return (
										<div
											key={condition}
											className={`filter-chip-new ${isSelected ? 'selected' : ''}`}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												toggleCondition(condition);
											}}
										>
											{condition}
										</div>
									);
								})}
							</div>
						</Stack>

						{/* FUEL TYPE */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Fuel Type</Typography>
							<div className="chip-group-new">
								{Object.values(PropertyFuelType).map((fuel) => {
									const isSelected = fuelTypeList.includes(fuel);
									return (
										<div
											key={fuel}
											className={`filter-chip-new ${isSelected ? 'selected' : ''}`}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												toggleFuelType(fuel);
											}}
										>
											{fuel}
										</div>
									);
								})}
							</div>
						</Stack>

						{/* TRANSMISSION */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Transmission</Typography>
							<div className="chip-group-new">
								{Object.values(PropertyTransmission).map((transmission) => {
									const isSelected = transmissionList.includes(transmission);
									return (
										<div
											key={transmission}
											className={`filter-chip-new ${isSelected ? 'selected' : ''}`}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												toggleTransmission(transmission);
											}}
										>
											{transmission}
										</div>
									);
								})}
							</div>
						</Stack>

						{/* COLOR - With Icons */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Color</Typography>
							<div className="color-group">
								{Object.values(PropertyColor).map((color) => {
									const isSelected = colorList.includes(color);
									return (
										<div
											key={color}
											className={`color-chip ${isSelected ? 'selected' : ''}`}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												toggleColor(color);
											}}
											title={color}
										>
											<span className="color-icon">{colorIcons[color] || '⚪'}</span>
										</div>
									);
								})}
							</div>
						</Stack>

						{/* FEATURES - Checklist */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Features</Typography>
							<Stack className="features-checklist">
								{Object.values(PropertyFeatures).slice(0, 8).map((feature) => {
									const isSelected = featuresList.includes(feature);
									return (
										<FormControlLabel
											key={feature}
											control={
												<Checkbox
													checked={isSelected}
													onChange={(e) => {
														e.preventDefault();
														e.stopPropagation();
														toggleFeature(feature);
													}}
													size="small"
												/>
											}
											label={feature.replace(/_/g, ' ')}
											className="feature-checkbox"
										/>
									);
								})}
							</Stack>
						</Stack>

						{/* MILEAGE RANGE */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Mileage (km)</Typography>
							<Slider
								value={mileageRange}
								onChange={handleMileageChange}
								onChangeCommitted={handleMileageCommit}
								valueLabelDisplay="auto"
								min={0}
								max={300000}
								step={1000}
								valueLabelFormat={(value) => `${(value / 1000).toFixed(0)}k km`}
							/>
							<Stack className="price-range-display" direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="body2">{(mileageRange[0] / 1000).toFixed(0)}k km</Typography>
								<Typography variant="body2">—</Typography>
								<Typography variant="body2">{(mileageRange[1] / 1000).toFixed(0)}k km</Typography>
							</Stack>
						</Stack>

						{/* YEAR RANGE */}
						<Stack className="filter-section-new">
							<Typography className="section-title-new">Year</Typography>
							<Slider
								value={yearRange}
								onChange={handleYearChange}
								onChangeCommitted={handleYearCommit}
								valueLabelDisplay="auto"
								min={2000}
								max={new Date().getFullYear()}
								step={1}
							/>
							<Stack className="price-range-display" direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="body2">{yearRange[0]}</Typography>
								<Typography variant="body2">—</Typography>
								<Typography variant="body2">{yearRange[1]}</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Collapse>

				{/* RESET BUTTON */}
				<Button className="reset-btn-new" onClick={resetFilters} fullWidth>
					Reset Filters
				</Button>
			</Stack>
		);
	}
};

export default Filter;
