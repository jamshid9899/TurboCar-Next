import React from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import ScrollAnimation from '../common/ScrollAnimation';

const AboutUs = () => {
	return (
		<ScrollAnimation animationType="fade-up" duration={0.7}>
			<Stack className="about-us-section">
				<Box component="div" className="container">
					{/* Header */}
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
							<Button className="about-button" variant="contained">
								Start Exploring Today
							</Button>
						</Box>
					</Box>
				</Box>
			</Stack>
		</ScrollAnimation>
	);
};

export default AboutUs;

