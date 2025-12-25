import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScrollAnimation from '../common/ScrollAnimation';

interface HowItWorksProps {
	mode?: 'RENT' | 'BUY';
	title?: string;
	subtitle?: string;
	description?: string;
	features?: Array<{
		icon: string;
		title: string;
		description: string;
	}>;
	imageUrl?: string;
	buttonText?: string;
	buttonLink?: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({
	mode = 'RENT',
	title,
	subtitle,
	description,
	features,
	imageUrl,
	buttonText,
	buttonLink,
}) => {
	// Default content for RENT mode
	const defaultRentContent = {
		title: 'Discover the new way',
		subtitle: 'to rent a car',
		description: 'Choose from thousands of cars available from private and professional owners near you.',
		features: [
			{
				icon: 'check',
				title: 'Prices by the hour or day',
				description: 'Trip liability insurance is included. You can even add another driver at no extra cost.',
			},
			{
				icon: 'time',
				title: 'No waiting around',
				description: 'Book a car near you instantly, even at the last minute. No lines. No paperwork.',
			},
			{
				icon: 'phone',
				title: 'Unlock the car with the app',
				description: 'Our secure TurboCar Connect technology allows you to do the walkaround inspection of the car with the app. The car opens. The keys are inside. Off you go!',
			},
		],
		imageUrl: '/img/community/avto11.jpg',
		buttonText: 'See how it works',
		buttonLink: '/property?mode=rent',
	};

	// Default content for BUY mode
	const defaultBuyContent = {
		title: 'Discover the new way',
		subtitle: 'to buy a car',
		description: 'Choose from thousands of quality cars available from private sellers and verified dealers.',
		features: [
			{
				icon: 'check',
				title: 'Verified listings',
				description: 'All cars are verified with complete history reports. You can even add extended warranty at no extra cost.',
			},
			{
				icon: 'time',
				title: 'Instant booking',
				description: 'Book a viewing instantly, even at the last minute. No waiting. No hassle.',
			},
			{
				icon: 'phone',
				title: 'Easy financing options',
				description: 'Our secure TurboCar financing technology allows you to get pre-approved instantly. Compare offers. Choose the best deal. Drive away!',
			},
		],
		imageUrl: '/img/banner/car.png',
		buttonText: 'See how it works',
		buttonLink: '/property?mode=buy',
	};

	const content = mode === 'RENT' ? defaultRentContent : defaultBuyContent;
	const finalTitle = title || content.title;
	const finalSubtitle = subtitle || content.subtitle;
	const finalDescription = description || content.description;
	const finalFeatures = features || content.features;
	const finalImageUrl = imageUrl || content.imageUrl;
	const finalButtonText = buttonText || content.buttonText;
	const finalButtonLink = buttonLink || content.buttonLink;

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case 'check':
				return <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#f17742' }} />;
			case 'time':
				return <AccessTimeIcon sx={{ fontSize: 32, color: '#f17742' }} />;
			case 'phone':
				return <PhoneAndroidIcon sx={{ fontSize: 32, color: '#f17742' }} />;
			case 'car':
				return <DirectionsCarIcon sx={{ fontSize: 32, color: '#f17742' }} />;
			default:
				return <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#f17742' }} />;
		}
	};

	return (
		<ScrollAnimation animationType="fade-up" duration={0.7}>
			<Stack className="how-it-works-section">
				<Box component="div" className="container">
					<Box component="div" className="how-it-works-card">
						{/* Left Side - Image */}
						<Box component="div" className="how-it-works-image">
							<img src={finalImageUrl} alt={mode === 'RENT' ? 'Rent a car' : 'Buy a car'} />
						</Box>

						{/* Right Side - Content */}
						<Box component="div" className="how-it-works-content">
							<Typography className="how-it-works-title">
								{finalTitle}{' '}
								<span className="how-it-works-subtitle">{finalSubtitle}</span>
							</Typography>
							<Typography className="how-it-works-description">{finalDescription}</Typography>

							{/* Features List */}
							<Box component="div" className="how-it-works-features">
								{finalFeatures.map((feature, index) => (
									<Box key={index} component="div" className="feature-item">
										<Box component="div" className="feature-icon">
											{getIcon(feature.icon)}
										</Box>
										<Box component="div" className="feature-content">
											<Typography className="feature-title">{feature.title}</Typography>
											<Typography className="feature-description">{feature.description}</Typography>
										</Box>
									</Box>
								))}
							</Box>

							{/* CTA Button */}
							<Button
								className="how-it-works-button"
								variant="outlined"
								onClick={() => {
									if (typeof window !== 'undefined') {
										window.location.href = finalButtonLink;
									}
								}}
							>
								{finalButtonText}
								<ArrowForwardIcon sx={{ ml: 1, fontSize: 20 }} />
							</Button>
						</Box>
					</Box>
				</Box>
			</Stack>
		</ScrollAnimation>
	);
};

export default HowItWorks;

