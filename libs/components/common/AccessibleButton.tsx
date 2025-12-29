import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface AccessibleButtonProps extends ButtonProps {
	'aria-label'?: string;
	'aria-describedby'?: string;
	'aria-pressed'?: boolean;
	'aria-expanded'?: boolean;
	'aria-controls'?: string;
}

/**
 * Accessible Button Component
 * Adds proper ARIA attributes and keyboard navigation support
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
	children,
	'aria-label': ariaLabel,
	'aria-describedby': ariaDescribedBy,
	'aria-pressed': ariaPressed,
	'aria-expanded': ariaExpanded,
	'aria-controls': ariaControls,
	onClick,
	...props
}) => {
	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		// Handle Enter and Space key presses
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (onClick) {
				onClick(event as any);
			}
		}
	};

	return (
		<Button
			{...props}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
			aria-describedby={ariaDescribedBy}
			aria-pressed={ariaPressed}
			aria-expanded={ariaExpanded}
			aria-controls={ariaControls}
			role={props.role || 'button'}
			tabIndex={props.tabIndex !== undefined ? props.tabIndex : 0}
		>
			{children}
		</Button>
	);
};







