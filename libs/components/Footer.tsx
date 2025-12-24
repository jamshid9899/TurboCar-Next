import React, { useState } from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import moment from 'moment';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../sweetAlert';

const Footer = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [email, setEmail] = useState<string>('');

	/** HANDLERS **/
	const handleSubscribe = async () => {
		if (!email || !email.includes('@')) {
			await sweetMixinErrorAlert('Please enter a valid email address');
			return;
		}
		// TODO: Add backend subscription API call here
		await sweetTopSmallSuccessAlert('Successfully subscribed to newsletter!', 2000);
		setEmail('');
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubscribe();
		}
	};

	// Helper function to create property search URL with filters
	const createPropertySearchUrl = (filters: any) => {
		// Convert single values to arrays as backend expects arrays
		const search: any = {};
		
		if (filters.propertyType) {
			search.typeList = [filters.propertyType];
		}
		if (filters.propertyFuelType) {
			search.fuelTypeList = [filters.propertyFuelType];
		}
		if (filters.propertyLocation) {
			// Map location names to PropertyLocation enum values
			const locationMap: { [key: string]: string } = {
				'Madrid': 'MADRID',
				'Barcelona': 'BARCELONA',
				'Valencia': 'VALENCIA',
				'Sevilla': 'SEVILLA',
				'Málaga': 'MALAGA',
				'Malaga': 'MALAGA',
				'Bilbao': 'BILBAO',
			};
			const enumLocation = locationMap[filters.propertyLocation] || filters.propertyLocation;
			search.locationList = [enumLocation];
		}
		if (filters.propertyBrand) {
			search.brandList = [filters.propertyBrand];
		}
		if (filters.luxuryBrands) {
			// Luxury brands list
			search.brandList = filters.luxuryBrands;
		}
		
		const input = JSON.stringify({
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: 'DESC',
			search: search,
		});
		
		const url = `/property?input=${encodeURIComponent(input)}`;
		console.log('🔗 Footer Navigation URL:', url);
		console.log('📋 Decoded Input:', JSON.parse(decodeURIComponent(url.split('input=')[1])));
		return url;
	};

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/turbocar-logo-white.svg" alt="TurboCar" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>24/7 Customer Support</span>
							<p>+34 900 123 456</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Need Help?</span>
							<p>support@turbocar.es</p>
							<span>Live Chat Available</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
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
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Searches</strong>
								<span onClick={() => router.push('/property?mode=buy')}>Cars for Sale</span>
								<span onClick={() => router.push('/property?mode=rent')}>Cars for Rent</span>
								<span onClick={() => router.push(createPropertySearchUrl({ luxuryBrands: ['PORSCHE', 'FERRARI', 'LAMBORGHINI', 'BENTLEY', 'ROLLS_ROYCE', 'ASTON_MARTIN', 'MCLAREN', 'MASERATI'] }))}>
									Luxury Cars
								</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyFuelType: 'ELECTRIC' }))}>
									Electric Cars
								</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span onClick={() => router.push('/cs?tab=terms')}>Terms of Use</span>
								<span onClick={() => router.push('/cs?tab=privacy')}>Privacy Policy</span>
								<span onClick={() => router.push('/cs')}>Contact Support</span>
								<span onClick={() => router.push('/cs?tab=faq')}>FAQs</span>
							</div>
							<div>
								<strong>Top Cities</strong>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Madrid' }))}>Madrid</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Barcelona' }))}>Barcelona</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Valencia' }))}>Valencia</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Sevilla' }))}>Sevilla</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© TurboCar - All rights reserved. {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/turbocar-logo-white.svg" alt="TurboCar" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>24/7 Customer Support</span>
							<p>+34 900 123 456</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Need Help?</span>
							<p>support@turbocar.es</p>
							<span>Live Chat Available</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
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
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Stay Updated</strong>
							<div>
								<input
									type="email"
									placeholder={'Your Email'}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyPress={handleKeyPress}
								/>
								<span onClick={handleSubscribe}>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Searches</strong>
								<span onClick={() => router.push('/property?mode=buy')}>Cars for Sale</span>
								<span onClick={() => router.push('/property?mode=rent')}>Cars for Rent</span>
								<span onClick={() => router.push(createPropertySearchUrl({ luxuryBrands: ['PORSCHE', 'FERRARI', 'LAMBORGHINI', 'BENTLEY', 'ROLLS_ROYCE', 'ASTON_MARTIN', 'MCLAREN', 'MASERATI'] }))}>
									Luxury Cars
								</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyFuelType: 'ELECTRIC' }))}>
									Electric Cars
								</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span onClick={() => router.push('/cs?tab=terms')}>Terms of Use</span>
								<span onClick={() => router.push('/cs?tab=privacy')}>Privacy Policy</span>
								<span onClick={() => router.push('/cs')}>Contact Support</span>
								<span onClick={() => router.push('/cs?tab=faq')}>FAQs</span>
							</div>
							<div>
								<strong>Top Cities</strong>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Madrid' }))}>Madrid</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Barcelona' }))}>Barcelona</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Valencia' }))}>Valencia</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Sevilla' }))}>Sevilla</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Málaga' }))}>Málaga</span>
								<span onClick={() => router.push(createPropertySearchUrl({ propertyLocation: 'Bilbao' }))}>Bilbao</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© TurboCar - All rights reserved. {moment().year()}</span>
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