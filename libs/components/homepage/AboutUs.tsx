import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ScrollAnimation from '../common/ScrollAnimation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const AboutUs = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	return (
		<Stack className="about-us-page">
			{/* Header Section */}
			<ScrollAnimation animationType="fade-up" duration={0.7}>
				<Stack className="about-us-section">
					<Box component="div" className="container">
					<Box component="div" className="about-header">
						<Typography className="about-title">{t('About Us')}</Typography>
						<Typography className="about-subtitle">
							{t('aboutUs.subtitle')}
						</Typography>
					</Box>

						{/* Content Section */}
						<Box component="div" className="about-content">
							{/* Left Side - Car Images */}
							<Box component="div" className="about-images">
								<Box component="div" className="car-image-item">
									<img src="/img/banner/car1.jpg" alt="Luxury Car" />
								</Box>
								<Box component="div" className="car-image-item">
									<img src="/img/banner/car11.jpg" alt="Sports Car" />
								</Box>
								<Box component="div" className="car-image-item">
									<img src="/img/banner/car12.jpg" alt="Electric Car" />
								</Box>
								<Box component="div" className="car-image-item">
									<img src="/img/banner/car9.jpg" alt="Family Car" />
								</Box>
							</Box>

							{/* Right Side - Content Card */}
							<Box component="div" className="about-card">
								<Typography className="card-title">
									{t('aboutUs.welcomeTitle')}
								</Typography>
								<Typography className="card-text">
									{t('aboutUs.welcomeText1')}
								</Typography>
								<Typography className="card-text">
									{t('aboutUs.welcomeText2')}
								</Typography>
								<Button 
									className="about-button" 
									variant="contained"
									onClick={() => router.push('/property')}
								>
									{t('aboutUs.startExploring')}
								</Button>
							</Box>
						</Box>
					</Box>
				</Stack>
			</ScrollAnimation>

			{/* How to Buy Section */}
			<ScrollAnimation animationType="fade-up" duration={0.7} delay={100}>
				<Stack className="how-to-section how-to-buy">
					<Box component="div" className="container">
						<Box component="div" className="section-header">
							<ShoppingCartIcon sx={{ fontSize: '48px', color: '#FF6B00', mb: 2 }} />
							<Typography className="section-title">{t('aboutUs.howToBuy')}</Typography>
							<Typography className="section-subtitle">
								{t('aboutUs.howToBuySubtitle')}
							</Typography>
						</Box>

						<Box component="div" className="steps-container">
							<Box component="div" className="step-item">
								<Box component="div" className="step-number">1</Box>
								<Box component="div" className="step-icon">
									<SearchIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.step1Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.step1Desc')}
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">2</Box>
								<Box component="div" className="step-icon">
									<DirectionsCarIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.step2Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.step2Desc')}
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">3</Box>
								<Box component="div" className="step-icon">
									<PaymentIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.step3Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.step3Desc')}
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">4</Box>
								<Box component="div" className="step-icon">
									<CheckCircleIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.step4Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.step4Desc')}
								</Typography>
							</Box>
						</Box>

						<Box component="div" className="section-action">
							<Button 
								className="section-button" 
								variant="contained"
								onClick={() => router.push('/property?mode=buy')}
							>
								{t('aboutUs.browseCarsForSale')}
							</Button>
						</Box>
					</Box>
				</Stack>
			</ScrollAnimation>

			{/* How to Rent Section */}
			<ScrollAnimation animationType="fade-up" duration={0.7} delay={200}>
				<Stack className="how-to-section how-to-rent">
					<Box component="div" className="container">
						<Box component="div" className="section-header">
							<DirectionsCarIcon sx={{ fontSize: '48px', color: '#FF6B00', mb: 2 }} />
							<Typography className="section-title">{t('aboutUs.howToRent')}</Typography>
							<Typography className="section-subtitle">
								{t('aboutUs.howToRentSubtitle')}
							</Typography>
						</Box>

						<Box component="div" className="steps-container">
							<Box component="div" className="step-item">
								<Box component="div" className="step-number">1</Box>
								<Box component="div" className="step-icon">
									<SearchIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.rentStep1Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.rentStep1Desc')}
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">2</Box>
								<Box component="div" className="step-icon">
									<CalendarTodayIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.rentStep2Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.rentStep2Desc')}
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">3</Box>
								<Box component="div" className="step-icon">
									<CreditCardIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.rentStep3Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.rentStep3Desc')}
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">4</Box>
								<Box component="div" className="step-icon">
									<LocalShippingIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">{t('aboutUs.rentStep4Title')}</Typography>
								<Typography className="step-description">
									{t('aboutUs.rentStep4Desc')}
								</Typography>
							</Box>
						</Box>

						<Box component="div" className="section-action">
							<Button 
								className="section-button" 
								variant="contained"
								onClick={() => router.push('/property?mode=rent')}
							>
								{t('aboutUs.browseCarsForRent')}
							</Button>
						</Box>
					</Box>
				</Stack>
			</ScrollAnimation>
		</Stack>
	);
};

export default AboutUs;

