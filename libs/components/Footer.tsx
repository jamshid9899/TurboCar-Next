import React, { useState } from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, IconButton, Typography, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { PropertyType, PropertyBrand, PropertyLocation } from '../enums/property.enum';
import { useSignupModal } from './common/SignupModalContext';

const Footer = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { openSignupModal } = useSignupModal();
	const [activeTab, setActiveTab] = useState<number>(0);

	/** HANDLERS **/
	const handleSubscribe = () => {
		if (!user?._id) {
			// Open signup modal instead of navigating
			openSignupModal();
		} else {
			// If user is logged in, navigate to account page
			router.push('/mypage');
		}
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	// Helper function to create property search URL with filters
	const createPropertySearchUrl = (filters: any) => {
		const search: any = {};
		
		if (filters.propertyType) {
			search.typeList = [filters.propertyType];
		}
		if (filters.propertyFuelType) {
			search.fuelTypeList = [filters.propertyFuelType];
		}
		if (filters.propertyLocation) {
			const locationMap: { [key: string]: string } = {
				'Madrid': 'MADRID',
				'Barcelona': 'BARCELONA',
				'Valencia': 'VALENCIA',
				'Sevilla': 'SEVILLA',
				'Málaga': 'MALAGA',
				'Malaga': 'MALAGA',
				'Bilbao': 'BILBAO',
				'Zaragoza': 'ZARAGOZA',
				'Murcia': 'MURCIA',
				'Alicante': 'ALICANTE',
				'Granada': 'GRANADA',
				'Cordoba': 'CORDOBA',
				'Palma': 'PALMA',
			};
			const enumLocation = locationMap[filters.propertyLocation] || filters.propertyLocation;
			search.locationList = [enumLocation];
		}
		if (filters.propertyBrand) {
			search.brandList = [filters.propertyBrand];
		}
		if (filters.luxuryBrands) {
			search.brandList = filters.luxuryBrands;
		}
		
		const input = JSON.stringify({
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: 'DESC',
			search: search,
		});
		
		return `/property?input=${encodeURIComponent(input)}`;
	};

	// Format enum values for display
	const formatEnumValue = (value: string): string => {
		return value
			.split('_')
			.map(word => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
	};

	// Get vehicle types from enum
	const vehicleTypes = Object.values(PropertyType).filter(type => type !== 'ELECTRIC');

	// Get popular brands (top 20)
	const popularBrands = [
		PropertyBrand.TOYOTA,
		PropertyBrand.BMW,
		PropertyBrand.MERCEDES,
		PropertyBrand.AUDI,
		PropertyBrand.HONDA,
		PropertyBrand.FORD,
		PropertyBrand.CHEVROLET,
		PropertyBrand.NISSAN,
		PropertyBrand.HYUNDAI,
		PropertyBrand.KIA,
		PropertyBrand.VOLKSWAGEN,
		PropertyBrand.TESLA,
		PropertyBrand.LEXUS,
		PropertyBrand.MAZDA,
		PropertyBrand.SUBARU,
		PropertyBrand.JEEP,
		PropertyBrand.PORSCHE,
		PropertyBrand.LAND_ROVER,
		PropertyBrand.VOLVO,
		PropertyBrand.INFINITI,
	];

	// Get all cities from enum
	const cities = Object.values(PropertyLocation);

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container-mobile'}>
				<Stack className={'main-mobile'}>
					<div className={'logo-section-mobile'}>
						<img src="/img/logo/turbocar_1.svg" alt="TurboCar" className={'logo'} />
						<Typography sx={{ color: '#bebdbd', fontSize: '13px', mt: 1 }}>
							Your trusted car marketplace in Spain
						</Typography>
					</div>
					<div className={'links-section-mobile'}>
						<div>
							<strong>Quick Links</strong>
							<span onClick={() => router.push('/property?mode=buy')}>Cars for Sale</span>
							<span onClick={() => router.push('/property?mode=rent')}>Cars for Rent</span>
							<span onClick={() => router.push('/about')}>About Us</span>
							<span onClick={() => router.push('/cs?tab=terms')}>Terms</span>
							<span onClick={() => router.push('/cs?tab=privacy')}>Privacy</span>
							<span onClick={() => router.push('/cs')}>Support</span>
						</div>
					</div>
					<div className={'social-section-mobile'}>
						<div className={'media-box'}>
							<IconButton
								component="a"
								href="https://www.facebook.com/turbocar"
								target="_blank"
								rel="noopener noreferrer"
								sx={{ color: '#ffffff', '&:hover': { color: '#FF6B00' } }}
							>
								<FacebookOutlinedIcon />
							</IconButton>
							<IconButton
								component="a"
								href="https://t.me/turbocar"
								target="_blank"
								rel="noopener noreferrer"
								sx={{ color: '#ffffff', '&:hover': { color: '#FF6B00' } }}
							>
								<TelegramIcon />
							</IconButton>
							<IconButton
								component="a"
								href="https://www.instagram.com/turbocar"
								target="_blank"
								rel="noopener noreferrer"
								sx={{ color: '#ffffff', '&:hover': { color: '#FF6B00' } }}
							>
								<InstagramIcon />
							</IconButton>
							<IconButton
								component="a"
								href="https://twitter.com/turbocar"
								target="_blank"
								rel="noopener noreferrer"
								sx={{ color: '#ffffff', '&:hover': { color: '#FF6B00' } }}
							>
								<TwitterIcon />
							</IconButton>
						</div>
					</div>
				</Stack>
				<Stack className={'second-mobile'}>
					<span>© {moment().year()} TurboCar. All rights reserved.</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				{/* TOP SECTION - Category Tabs */}
				<div className={'footer-top-section'}>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						className={'footer-tabs'}
						sx={{
							borderBottom: '1px solid rgba(255, 107, 0, 0.2)',
							'& .MuiTab-root': {
								color: '#bebdbd',
								fontSize: '14px',
								fontWeight: 600,
								textTransform: 'none',
								minHeight: '50px',
								'&.Mui-selected': {
									color: '#FF6B00',
								},
							},
							'& .MuiTabs-indicator': {
								backgroundColor: '#FF6B00',
							},
						}}
					>
						<Tab label="Vehicle Types" />
						<Tab label="Brands" />
						<Tab label="Cities" />
						<Tab label="Services" />
					</Tabs>
					<div className={'footer-tab-content'}>
						{activeTab === 0 && (
							<div className={'footer-grid-links footer-grid-3col'}>
								{vehicleTypes.map((type) => (
									<span
										key={type}
										onClick={() => router.push(createPropertySearchUrl({ propertyType: type }))}
									>
										{formatEnumValue(type)}
									</span>
								))}
								<span onClick={() => router.push(createPropertySearchUrl({ propertyFuelType: 'ELECTRIC' }))}>
									Electric
								</span>
							</div>
						)}
						{activeTab === 1 && (
							<div className={'footer-grid-links footer-grid-3col'}>
								{popularBrands.map((brand) => (
									<span
										key={brand}
										onClick={() => router.push(createPropertySearchUrl({ propertyBrand: brand }))}
									>
										{formatEnumValue(brand)}
									</span>
								))}
							</div>
						)}
						{activeTab === 2 && (
							<div className={'footer-grid-links footer-grid-3col'}>
								{cities.map((city) => (
									<span
										key={city}
										onClick={() => router.push(createPropertySearchUrl({ propertyLocation: city }))}
									>
										{formatEnumValue(city)}
									</span>
								))}
							</div>
						)}
						{activeTab === 3 && (
							<div className={'footer-grid-links'}>
								<span onClick={() => router.push('/property?mode=buy')}>Buy Car</span>
								<span onClick={() => router.push('/property?mode=rent')}>Rent Car</span>
							</div>
						)}
					</div>
				</div>

				{/* MAIN FOOTER - 4 Column Layout */}
				<Stack className={'main'}>
					{/* Column 1: Logo, Contact & Social */}
					<Stack className={'left'}>
						<div className={'footer-box'}>
							{/* Logo */}
							<Stack direction="row" alignItems="center" spacing={1} className={'logo-box'}>
								<img src="/img/logo/turbocar_1.svg" alt="TurboCar" className={'logo'} />
							</Stack>
							
							{/* Contact Info */}
							<div style={{ marginTop: '24px', marginBottom: '24px' }}>
								<Typography sx={{ color: '#fff', fontSize: '14px', fontWeight: 600, mb: 1.5 }}>
									24/7 Customer Support
								</Typography>
								<Typography sx={{ color: '#FF6B00', fontSize: '18px', fontWeight: 700, mb: 2 }}>
									+34 900 123 456
								</Typography>
								
								<Typography sx={{ color: '#fff', fontSize: '14px', fontWeight: 600, mb: 1.5, mt: 2 }}>
									Need Help?
								</Typography>
								<Typography sx={{ color: '#FF6B00', fontSize: '18px', fontWeight: 700 }}>
									+34 900 123 456
								</Typography>
								<Typography sx={{ color: '#bebdbd', fontSize: '12px', mt: 0.5 }}>
									Support Available
								</Typography>
							</div>
							
							{/* Social Media */}
							<div>
								<Typography sx={{ color: '#fff', fontSize: '14px', fontWeight: 700, mb: 2 }}>
									Follow Us On Social Media
								</Typography>
								<div className={'media-box'}>
									<IconButton
										component="a"
										href="https://www.facebook.com/turbocar"
										target="_blank"
										rel="noopener noreferrer"
										sx={{ color: '#bebdbd', '&:hover': { color: '#FF6B00' } }}
									>
										<FacebookOutlinedIcon />
									</IconButton>
									<IconButton
										component="a"
										href="https://t.me/turbocar"
										target="_blank"
										rel="noopener noreferrer"
										sx={{ color: '#bebdbd', '&:hover': { color: '#FF6B00' } }}
									>
										<TelegramIcon />
									</IconButton>
									<IconButton
										component="a"
										href="https://www.instagram.com/turbocar"
										target="_blank"
										rel="noopener noreferrer"
										sx={{ color: '#bebdbd', '&:hover': { color: '#FF6B00' } }}
									>
										<InstagramIcon />
									</IconButton>
									<IconButton
										component="a"
										href="https://twitter.com/turbocar"
										target="_blank"
										rel="noopener noreferrer"
										sx={{ color: '#bebdbd', '&:hover': { color: '#FF6B00' } }}
									>
										<TwitterIcon />
									</IconButton>
								</div>
							</div>
						</div>
					</Stack>

					{/* Column 2: Quick Links */}
					<Stack className={'center-left'}>
						<div className={'footer-box'}>
							<strong>QUICK LINKS</strong>
							<span onClick={() => router.push('/property?mode=buy')}>Cars for Sale</span>
							<span onClick={() => router.push('/property?mode=rent')}>Cars for Rent</span>
							<span onClick={() => router.push(createPropertySearchUrl({ luxuryBrands: ['PORSCHE', 'FERRARI', 'LAMBORGHINI', 'BENTLEY', 'ROLLS_ROYCE', 'ASTON_MARTIN', 'MCLAREN', 'MASERATI'] }))}>
								Luxury Cars
							</span>
							<span onClick={() => router.push(createPropertySearchUrl({ propertyFuelType: 'ELECTRIC' }))}>
								Electric Cars
							</span>
							<span onClick={() => router.push('/agent')}>Find Dealers</span>
							<span onClick={() => router.push('/community')}>Community</span>
							<span onClick={() => router.push('/about')}>About Us</span>
							<span onClick={() => router.push('/cs?tab=terms')}>Terms of Use</span>
							<span onClick={() => router.push('/cs?tab=privacy')}>Privacy Policy</span>
							<span onClick={() => router.push('/cs?tab=faq')}>FAQs</span>
						</div>
					</Stack>

					{/* Column 3: Support */}
					<Stack className={'center-right'}>
						<div className={'footer-box'}>
							<strong>SUPPORT</strong>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
								<PhoneIcon sx={{ color: '#FF6B00', fontSize: '18px' }} />
								<span>24/7 Customer Support</span>
							</Stack>
							<p>+34 900 123 456</p>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
								<EmailIcon sx={{ color: '#FF6B00', fontSize: '18px' }} />
								<span>Need Help?</span>
							</Stack>
							<p>support@turbocar.es</p>
							<span style={{ fontSize: '12px', color: '#929495' }}>Live Chat Available</span>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
								<LocationOnIcon sx={{ color: '#FF6B00', fontSize: '18px' }} />
								<span>Office Location</span>
							</Stack>
							<p>Madrid, Spain</p>
						</div>
					</Stack>

					{/* Column 4: Connect & Newsletter */}
					<Stack className={'right'}>
						{/* Newsletter */}
						<div className={'footer-box'}>
							<strong>KEEP YOURSELF UP TO DATE</strong>
							<div style={{ marginTop: '16px', marginBottom: '32px' }}>
								<button
									type="button"
									onClick={handleSubscribe}
									style={{
										width: '100%',
										height: '48px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: '#212329',
										color: '#fff',
										fontFamily: 'inherit',
										fontSize: '14px',
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										border: 'none',
										borderRadius: '8px',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = '#2a2d35';
										e.currentTarget.style.transform = 'translateY(-2px)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = '#212329';
										e.currentTarget.style.transform = 'translateY(0)';
									}}
								>
									SUBSCRIBE
								</button>
							</div>
							
							{/* Connect */}
							<strong style={{ marginTop: '20px', display: 'block' }}>CONNECT</strong>
							<Typography sx={{ color: '#fff', fontSize: '14px', mt: 1, mb: 2 }}>
								Follow us on social media
							</Typography>
							<div className={'media-box'}>
								<IconButton
									component="a"
									href="https://www.facebook.com/turbocar"
									target="_blank"
									rel="noopener noreferrer"
									sx={{ 
										width: '44px',
										height: '44px',
										borderRadius: '50%',
										background: '#FF6B00 !important',
										'&:hover': { 
											background: '#FF8E53 !important',
											transform: 'scale(1.1)' 
										} 
									}}
								>
									<FacebookOutlinedIcon sx={{ color: '#fff' }} />
								</IconButton>
								<IconButton
									component="a"
									href="https://t.me/turbocar"
									target="_blank"
									rel="noopener noreferrer"
									sx={{ 
										width: '44px',
										height: '44px',
										borderRadius: '50%',
										background: '#FF6B00 !important',
										'&:hover': { 
											background: '#FF8E53 !important',
											transform: 'scale(1.1)' 
										} 
									}}
								>
									<TelegramIcon sx={{ color: '#fff' }} />
								</IconButton>
								<IconButton
									component="a"
									href="https://www.instagram.com/turbocar"
									target="_blank"
									rel="noopener noreferrer"
									sx={{ 
										width: '44px',
										height: '44px',
										borderRadius: '50%',
										background: '#FF6B00 !important',
										'&:hover': { 
											background: '#FF8E53 !important',
											transform: 'scale(1.1)' 
										} 
									}}
								>
									<InstagramIcon sx={{ color: '#fff' }} />
								</IconButton>
								<IconButton
									component="a"
									href="https://twitter.com/turbocar"
									target="_blank"
									rel="noopener noreferrer"
									sx={{ 
										width: '44px',
										height: '44px',
										borderRadius: '50%',
										background: '#FF6B00 !important',
										'&:hover': { 
											background: '#FF8E53 !important',
											transform: 'scale(1.1)' 
										} 
									}}
								>
									<TwitterIcon sx={{ color: '#fff' }} />
								</IconButton>
							</div>
						</div>
					</Stack>
				</Stack>

				{/* BOTTOM SECTION */}
				<Stack className={'second'}>
					<span>© {moment().year()} TurboCar. All rights reserved.</span>
					<Stack direction="row" spacing={2} sx={{ gap: '16px' }}>
						<span onClick={() => router.push('/cs?tab=privacy')}>Privacy</span>
						<span>·</span>
						<span onClick={() => router.push('/cs?tab=terms')}>Terms</span>
						<span>·</span>
						<span onClick={() => router.push('/')}>Sitemap</span>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
