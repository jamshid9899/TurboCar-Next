import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface ScrollAnimationProps {
	children: ReactNode;
	className?: string;
	animationType?: 'fade-up' | 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
	delay?: number;
	duration?: number;
	threshold?: number;
	triggerOnce?: boolean;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
	children,
	className = '',
	animationType = 'fade-up',
	delay = 0,
	duration = 0.7,
	threshold = 0.25, // 25% visible (approximately 70-80% from bottom)
	triggerOnce = true,
}) => {
	const { ref, inView } = useInView({
		threshold,
		triggerOnce,
	});

	const getAnimationClass = () => {
		switch (animationType) {
			case 'fade':
				return 'scroll-fade';
			case 'slide-up':
				return 'scroll-slide-up';
			case 'slide-left':
				return 'scroll-slide-left';
			case 'slide-right':
				return 'scroll-slide-right';
			case 'scale':
				return 'scroll-scale';
			default:
				return 'scroll-animate';
		}
	};

	return (
		<div
			ref={ref}
			className={`${getAnimationClass()} ${className} ${inView ? 'animate-in' : 'animate-out'}`}
			style={{
				transitionDelay: `${delay}ms`,
				transitionDuration: `${duration}s`,
			}}
		>
			{children}
		</div>
	);
};

export default ScrollAnimation;

