import React from 'react';
import { Skeleton, Stack } from '@mui/material';

/**
 * Property Card Skeleton Loader
 */
export const PropertyCardSkeleton = () => {
	return (
		<div
			className="property-card-skeleton"
			style={{
				width: '100%',
				borderRadius: '12px',
				overflow: 'hidden',
				backgroundColor: '#ffffff',
				boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
			}}
		>
			{/* Image Skeleton */}
			<Skeleton
				variant="rectangular"
				height={200}
				sx={{
					width: '100%',
					bgcolor: '#f0f0f0',
				}}
			/>

			<Stack spacing={1.5} sx={{ p: 2 }}>
				{/* Title Skeleton */}
				<Skeleton
					variant="text"
					width="80%"
					height={24}
					sx={{ bgcolor: '#f0f0f0' }}
				/>

				{/* Location Skeleton */}
				<Skeleton
					variant="text"
					width="60%"
					height={18}
					sx={{ bgcolor: '#f0f0f0' }}
				/>

				{/* Details Skeleton */}
				<Stack direction="row" spacing={2}>
					<Skeleton variant="text" width={60} height={16} sx={{ bgcolor: '#f0f0f0' }} />
					<Skeleton variant="text" width={60} height={16} sx={{ bgcolor: '#f0f0f0' }} />
					<Skeleton variant="text" width={60} height={16} sx={{ bgcolor: '#f0f0f0' }} />
				</Stack>

				{/* Price Skeleton */}
				<Skeleton
					variant="text"
					width="50%"
					height={20}
					sx={{ bgcolor: '#f0f0f0', mt: 1 }}
				/>

				{/* Stats Skeleton */}
				<Stack direction="row" spacing={2} sx={{ mt: 1 }}>
					<Skeleton variant="circular" width={20} height={20} sx={{ bgcolor: '#f0f0f0' }} />
					<Skeleton variant="circular" width={20} height={20} sx={{ bgcolor: '#f0f0f0' }} />
				</Stack>
			</Stack>
		</div>
	);
};

/**
 * Agent Card Skeleton Loader
 */
export const AgentCardSkeleton = () => {
	return (
		<div
			className="agent-card-skeleton"
			style={{
				width: '100%',
				borderRadius: '12px',
				overflow: 'hidden',
				backgroundColor: '#ffffff',
				boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
				padding: '16px',
			}}
		>
			<Stack alignItems="center" spacing={2}>
				{/* Avatar Skeleton */}
				<Skeleton
					variant="circular"
					width={120}
					height={120}
					sx={{ bgcolor: '#f0f0f0' }}
				/>

				{/* Name Skeleton */}
				<Skeleton
					variant="text"
					width="70%"
					height={24}
					sx={{ bgcolor: '#f0f0f0' }}
				/>

				{/* Stats Skeleton */}
				<Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
					<Skeleton variant="text" width={40} height={18} sx={{ bgcolor: '#f0f0f0' }} />
					<Skeleton variant="text" width={40} height={18} sx={{ bgcolor: '#f0f0f0' }} />
					<Skeleton variant="text" width={40} height={18} sx={{ bgcolor: '#f0f0f0' }} />
				</Stack>
			</Stack>
		</div>
	);
};

/**
 * Community Card Skeleton Loader
 */
export const CommunityCardSkeleton = () => {
	return (
		<div
			className="community-card-skeleton"
			style={{
				width: '100%',
				borderRadius: '12px',
				overflow: 'hidden',
				backgroundColor: '#ffffff',
				boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
				padding: '16px',
			}}
		>
			<Stack direction="row" spacing={2}>
				{/* Thumbnail Skeleton */}
				<Skeleton
					variant="rectangular"
					width={120}
					height={80}
					sx={{
						borderRadius: '8px',
						bgcolor: '#f0f0f0',
						flexShrink: 0,
					}}
				/>

				<Stack spacing={1} sx={{ flex: 1 }}>
					{/* Title Skeleton */}
					<Skeleton
						variant="text"
						width="80%"
						height={22}
						sx={{ bgcolor: '#f0f0f0' }}
					/>

					{/* Author & Date Skeleton */}
					<Skeleton
						variant="text"
						width="50%"
						height={16}
						sx={{ bgcolor: '#f0f0f0' }}
					/>

					{/* Stats Skeleton */}
					<Stack direction="row" spacing={2}>
						<Skeleton variant="circular" width={16} height={16} sx={{ bgcolor: '#f0f0f0' }} />
						<Skeleton variant="circular" width={16} height={16} sx={{ bgcolor: '#f0f0f0' }} />
						<Skeleton variant="circular" width={16} height={16} sx={{ bgcolor: '#f0f0f0' }} />
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};

/**
 * Filter Panel Skeleton Loader
 */
export const FilterSkeleton = () => {
	return (
		<div
			className="filter-skeleton"
			style={{
				width: '100%',
				borderRadius: '12px',
				backgroundColor: '#ffffff',
				boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
				padding: '24px',
			}}
		>
			<Stack spacing={3}>
				{/* Title Skeleton */}
				<Skeleton variant="text" width="40%" height={32} sx={{ bgcolor: '#f0f0f0' }} />

				{/* Reset Button Skeleton */}
				<Skeleton
					variant="rectangular"
					width="100%"
					height={44}
					sx={{ borderRadius: '8px', bgcolor: '#f0f0f0' }}
				/>

				{/* Filter Sections */}
				{[1, 2, 3, 4].map((item) => (
					<Stack key={item} spacing={1.5}>
						<Skeleton variant="text" width="30%" height={20} sx={{ bgcolor: '#f0f0f0' }} />
						<Stack direction="row" spacing={1} flexWrap="wrap">
							{[1, 2, 3, 4].map((chip) => (
								<Skeleton
									key={chip}
									variant="rectangular"
									width={80}
									height={36}
									sx={{ borderRadius: '6px', bgcolor: '#f0f0f0' }}
								/>
							))}
						</Stack>
					</Stack>
				))}
			</Stack>
		</div>
	);
};

/**
 * Generic List Skeleton Loader
 */
export const ListSkeleton = ({ count = 3, SkeletonComponent }: { count?: number; SkeletonComponent: React.ComponentType }) => {
	return (
		<Stack spacing={2}>
			{Array.from({ length: count }).map((_, index) => (
				<SkeletonComponent key={index} />
			))}
		</Stack>
	);
};

/**
 * Grid Skeleton Loader
 */
export const GridSkeleton = ({
	count = 6,
	SkeletonComponent,
	columns = 3,
}: {
	count?: number;
	SkeletonComponent: React.ComponentType;
	columns?: number;
}) => {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gap: '16px',
			}}
		>
			{Array.from({ length: count }).map((_, index) => (
				<SkeletonComponent key={index} />
			))}
		</div>
	);
};
