import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface BreadcrumbProps {
	title: string;
	breadcrumb?: string;
	position?: 'top' | 'bottom';
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title, breadcrumb, position = 'top' }) => {
	const router = useRouter();

	const getBreadcrumbItems = () => {
		const items: Array<{ label: string; path: string | undefined }> = [
			{
				label: 'Home',
				path: '/',
			},
		];

		if (breadcrumb) {
			const parts = breadcrumb.split(' / ');
			parts.forEach((part, index) => {
				items.push({
					label: part,
					path: index === parts.length - 1 ? router.asPath : undefined, // Last item is current page
				});
			});
		}

		return items;
	};

	const breadcrumbItems = getBreadcrumbItems();

	return (
		<Stack className={`breadcrumb-container breadcrumb-${position}`}>
			<Stack className={'container'}>
				{position === 'top' && (
					<>
					<Typography variant="h1" className={'page-title'}>
						{title}
					</Typography>
					<div className={'breadcrumb-nav'}>
						{breadcrumbItems.map((item, index) => (
							<React.Fragment key={index}>
								{item.path && index < breadcrumbItems.length - 1 ? (
									<a
										href={item.path}
										className={'breadcrumb-link'}
										onClick={(e: React.MouseEvent) => {
											e.preventDefault();
											router.push(item.path!);
										}}
									>
										{index === 0 && <HomeIcon className={'home-icon'} />}
										<span>{item.label}</span>
									</a>
								) : (
									<span className={'breadcrumb-current'}>
										{index === 0 && <HomeIcon className={'home-icon'} />}
										<span>{item.label}</span>
									</span>
								)}
								{index < breadcrumbItems.length - 1 && (
									<ChevronRightIcon className={'breadcrumb-separator'} />
								)}
							</React.Fragment>
						))}
					</div>
					</>
				)}
				{position === 'bottom' && (
					<div className={'breadcrumb-nav'}>
						{breadcrumbItems.map((item, index) => (
							<React.Fragment key={index}>
								{item.path && index < breadcrumbItems.length - 1 ? (
									<a
										href={item.path}
										className={'breadcrumb-link'}
										onClick={(e: React.MouseEvent) => {
											e.preventDefault();
											router.push(item.path!);
										}}
									>
										{index === 0 && <HomeIcon className={'home-icon'} />}
										<span>{item.label}</span>
									</a>
								) : (
									<span className={'breadcrumb-current'}>
										{index === 0 && <HomeIcon className={'home-icon'} />}
										<span>{item.label}</span>
									</span>
								)}
								{index < breadcrumbItems.length - 1 && (
									<ChevronRightIcon className={'breadcrumb-separator'} />
								)}
							</React.Fragment>
						))}
					</div>
				)}
			</Stack>
		</Stack>
	);
};

export default Breadcrumb;






