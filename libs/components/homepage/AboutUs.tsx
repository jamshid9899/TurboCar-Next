import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
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

	return (
		<Stack className="about-us-page">
			{/* Header Section */}
			<ScrollAnimation animationType="fade-up" duration={0.7}>
				<Stack className="about-us-section">
					<Box component="div" className="container">
						<Box component="div" className="about-header">
							<Typography className="about-title">About Us</Typography>
							<Typography className="about-subtitle">
								We're on a mission to provide car buyers and sellers with the best marketplace experience, 
								making car transactions easier and more trustworthy worldwide.
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
									Welcome to TurboCar — enhance your experience while helping the car community thrive
								</Typography>
								<Typography className="card-text">
									Start your journey today and make a difference in the car marketplace — all for free! 
									Check out our available opportunities below and join us in our mission to improve the 
									lives of car buyers and sellers.
								</Typography>
								<Typography className="card-text">
									We support car dealers and private sellers of all sizes, helping them grow while contributing 
									to the automotive community. Our curated collection of tools and resources empowers you to 
									make a positive impact, bringing quality cars and loving owners together.
								</Typography>
								<Button 
									className="about-button" 
									variant="contained"
									onClick={() => router.push('/property')}
								>
									Start Exploring Today
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
							<Typography className="section-title">How to Buy a Car</Typography>
							<Typography className="section-subtitle">
								Follow these simple steps to find and purchase your perfect vehicle
							</Typography>
						</Box>

						<Box component="div" className="steps-container">
							<Box component="div" className="step-item">
								<Box component="div" className="step-number">1</Box>
								<Box component="div" className="step-icon">
									<SearchIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Browse & Search</Typography>
								<Typography className="step-description">
									Explore our extensive collection of cars. Use filters to find vehicles by brand, type, 
									price range, location, and more. Save your favorites for later comparison.
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">2</Box>
								<Box component="div" className="step-icon">
									<DirectionsCarIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">View Details</Typography>
								<Typography className="step-description">
									Click on any car to see detailed information including specifications, images, 
									condition, mileage, and seller information. Contact the seller directly through our platform.
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">3</Box>
								<Box component="div" className="step-icon">
									<PaymentIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Negotiate & Pay</Typography>
								<Typography className="step-description">
									Communicate with the seller to negotiate the price and arrange payment. 
									We provide secure payment options and transaction support to ensure a safe purchase.
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">4</Box>
								<Box component="div" className="step-icon">
									<CheckCircleIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Complete Purchase</Typography>
								<Typography className="step-description">
									Finalize the transaction, complete all paperwork, and take ownership of your new car. 
									Our team is here to assist you throughout the entire process.
								</Typography>
							</Box>
						</Box>

						<Box component="div" className="section-action">
							<Button 
								className="section-button" 
								variant="contained"
								onClick={() => router.push('/property?mode=buy')}
							>
								Browse Cars for Sale
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
							<Typography className="section-title">How to Rent a Car</Typography>
							<Typography className="section-subtitle">
								Rent a car quickly and easily with our streamlined rental process
							</Typography>
						</Box>

						<Box component="div" className="steps-container">
							<Box component="div" className="step-item">
								<Box component="div" className="step-number">1</Box>
								<Box component="div" className="step-icon">
									<SearchIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Find Rental Cars</Typography>
								<Typography className="step-description">
									Search for available rental cars by location, date, car type, and price. 
									View real-time availability and compare different rental options.
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">2</Box>
								<Box component="div" className="step-icon">
									<CalendarTodayIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Select Dates</Typography>
								<Typography className="step-description">
									Choose your rental start and end dates. Check minimum and maximum rental periods 
									for each vehicle. Some cars may have specific rental duration requirements.
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">3</Box>
								<Box component="div" className="step-icon">
									<CreditCardIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Book & Pay</Typography>
								<Typography className="step-description">
									Review rental terms, pricing, and any additional fees. Complete your booking 
									with secure payment. You'll receive a confirmation with all rental details.
								</Typography>
							</Box>

							<Box component="div" className="step-item">
								<Box component="div" className="step-number">4</Box>
								<Box component="div" className="step-icon">
									<LocalShippingIcon sx={{ fontSize: '32px', color: '#FF6B00' }} />
								</Box>
								<Typography className="step-title">Pick Up & Return</Typography>
								<Typography className="step-description">
									Pick up your rental car at the agreed location and time. Enjoy your rental period, 
									then return the vehicle in the same condition. Our platform tracks your rental status.
								</Typography>
							</Box>
						</Box>

						<Box component="div" className="section-action">
							<Button 
								className="section-button" 
								variant="contained"
								onClick={() => router.push('/property?mode=rent')}
							>
								Browse Cars for Rent
							</Button>
						</Box>
					</Box>
				</Stack>
			</ScrollAnimation>
		</Stack>
	);
};

export default AboutUs;

