import React from 'react';
import { Stack, Box } from '@mui/material';
import HowItWorks from './HowItWorks';
import ScrollAnimation from '../common/ScrollAnimation';

const HowItWorksContainer = () => {
	return (
		<ScrollAnimation animationType="fade-up" duration={0.7} delay={700}>
			<Stack className="how-it-works-container">
				<Box component="div" className="container">
					<Box component="div" className="how-it-works-grid">
						<HowItWorks mode="RENT" />
						<HowItWorks mode="BUY" />
					</Box>
				</Box>
			</Stack>
		</ScrollAnimation>
	);
};

export default HowItWorksContainer;




