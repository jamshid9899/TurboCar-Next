import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Direction } from '../../enums/common.enum';
import ScrollAnimation from '../common/ScrollAnimation';

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

interface AvailableCitiesProps {
	mode: 'RENT' | 'BUY';
	selectedLocation: PropertyLocation | null;
	selectedType: PropertyType | null;
	onCityClick: (location: PropertyLocation) => void;
}

const AvailableCities: React.FC<AvailableCitiesProps> = ({
	mode,
	selectedLocation,
	selectedType,
	onCityClick,
}) => {


	return (
		<Stack className="available-cities-section">
			<Box component="div" className="container">
				<Typography variant="h2" className="section-title">
					Available all over Spain
				</Typography>

				<Stack className="cities-grid">
					{CITIES.map((city, index) => {
						return (
							<ScrollAnimation
								key={city.location}
								animationType="fade-up"
								duration={0.7}
								delay={index * 50}
								threshold={0.2}
							>
								<Box
									component="div"
									className="city-card"
									onClick={() => onCityClick(city.location)}
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
							</ScrollAnimation>
						);
					})}
				</Stack>
			</Box>
		</Stack>
	);
};

export default AvailableCities;
