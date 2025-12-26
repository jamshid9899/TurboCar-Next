import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

interface EmptyStateProps {
	title?: string;
	description?: string;
	icon?: React.ReactNode;
	action?: React.ReactNode;
	actionLabel?: string;
	actionHref?: string;
	onActionClick?: () => void;
	type?: 'property' | 'agent' | 'community' | 'filter' | 'generic';
}

const EmptyState: React.FC<EmptyStateProps> = ({
	title,
	description,
	icon,
	action,
	actionLabel,
	actionHref,
	onActionClick,
	type = 'generic',
}) => {
	const router = useRouter();

	// Default icons based on type
	const getDefaultIcon = () => {
		if (icon) return icon;
		
		switch (type) {
			case 'property':
				return <Inventory2OutlinedIcon sx={{ fontSize: 80, color: '#d0d0d0' }} />;
			case 'agent':
				return <PeopleOutlineIcon sx={{ fontSize: 80, color: '#d0d0d0' }} />;
			case 'community':
				return <ArticleOutlinedIcon sx={{ fontSize: 80, color: '#d0d0d0' }} />;
			case 'filter':
				return <FilterListOffIcon sx={{ fontSize: 80, color: '#d0d0d0' }} />;
			default:
				return <SearchOffIcon sx={{ fontSize: 80, color: '#d0d0d0' }} />;
		}
	};

	// Default titles based on type
	const getDefaultTitle = () => {
		if (title) return title;
		
		switch (type) {
			case 'property':
				return 'No Cars Found';
			case 'agent':
				return 'No Dealers Found';
			case 'community':
				return 'No Articles Found';
			case 'filter':
				return 'No Results Match Your Filters';
			default:
				return 'No Results Found';
		}
	};

	// Default descriptions based on type
	const getDefaultDescription = () => {
		if (description) return description;
		
		switch (type) {
			case 'property':
				return 'Try adjusting your search filters or browse all available cars.';
			case 'agent':
				return 'No dealers match your search criteria. Try different filters.';
			case 'community':
				return 'Be the first to share something with the community!';
			case 'filter':
				return 'Try removing some filters or adjusting your search criteria.';
			default:
				return 'We couldn\'t find what you\'re looking for.';
		}
	};

	const handleActionClick = () => {
		if (onActionClick) {
			onActionClick();
		} else if (actionHref) {
			router.push(actionHref);
		} else if (type === 'filter') {
			// Reset filters
			router.push('/property');
		}
	};

	return (
		<Box
			className="empty-state"
			sx={{
				width: '100%',
				padding: { xs: 4, md: 6 },
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
			}}
		>
			<Stack spacing={3} alignItems="center" sx={{ maxWidth: 500 }}>
				{/* Icon */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 120,
						height: 120,
						borderRadius: '50%',
						backgroundColor: '#f8f8f8',
					}}
				>
					{getDefaultIcon()}
				</Box>

				{/* Title */}
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: '#181a20',
						fontFamily: 'inherit',
					}}
				>
					{getDefaultTitle()}
				</Typography>

				{/* Description */}
				<Typography
					variant="body1"
					sx={{
						color: '#717171',
						fontFamily: 'inherit',
						lineHeight: 1.6,
					}}
				>
					{getDefaultDescription()}
				</Typography>

				{/* Action Button */}
				{(action || actionLabel) && (
					<Box sx={{ mt: 2 }}>
						{action || (
							<Button
								variant="contained"
								onClick={handleActionClick}
								sx={{
									backgroundColor: '#f17742',
									color: '#ffffff',
									padding: '12px 32px',
									borderRadius: '8px',
									fontWeight: 600,
									textTransform: 'none',
									'&:hover': {
										backgroundColor: '#e0662e',
									},
								}}
							>
								{actionLabel || (type === 'filter' ? 'Reset Filters' : 'Browse All')}
							</Button>
						)}
					</Box>
				)}
			</Stack>
		</Box>
	);
};

export default EmptyState;

