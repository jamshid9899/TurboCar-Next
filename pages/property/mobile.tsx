import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography, Drawer, IconButton } from '@mui/material';
import PropertyCard from '../../libs/components/property/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import Filter from '../../libs/components/property/Filter';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { Property } from '../../libs/types/property/property';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { ListSkeleton, PropertyCardSkeleton } from '../../libs/components/common/SkeletonLoader';
import EmptyState from '../../libs/components/common/EmptyState';

// Default filter for initial load
const getDefaultFilter = (router: any): PropertiesInquiry => {
	const base: PropertiesInquiry = {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	};

	if (router?.query?.mode === 'rent') {
		base.search = { isForRent: true };
	}

	if (router?.query?.mode === 'buy') {
		base.search = { isForSale: true };
	}

	return base;
};

const PropertyListMobile: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

	// Get initial filter from URL query or use default
	const getInitialFilter = (): PropertiesInquiry => {
		if (router?.query?.input) {
			try {
				return JSON.parse(router.query.input as string);
			} catch (e) {
				console.error('Error parsing query input:', e);
				return getDefaultFilter(router);
			}
		}
		return initialInput || getDefaultFilter(router);
	};

	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(getInitialFilter());
	const [properties, setProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	// Handle mode from router.query (rent/buy)
	useEffect(() => {
		if (!router.isReady) return;

		if (router.query.mode === 'rent') {
			setSearchFilter(prev => ({
				...prev,
				page: 1,
				search: {
					...prev.search,
					isForRent: true,
					isForSale: false,
				},
			}));
			setCurrentPage(1);
		}

		if (router.query.mode === 'buy') {
			setSearchFilter(prev => ({
				...prev,
				page: 1,
				search: {
					...prev.search,
					isForSale: true,
					isForRent: false,
				},
			}));
			setCurrentPage(1);
		}
	}, [router.isReady, router.query.mode]);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const { 
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProperties(data?.getProperties?.list || []);
			setTotal(data?.getProperties?.metaCounter?.[0]?.total || data?.getProperties?.totalCount || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;

		// Handle input query parameter (if exists, it takes precedence)
		if (router.query.input) {
			try {
				const inputObj = JSON.parse(router.query.input as string);
				setSearchFilter(inputObj);
				setCurrentPage(inputObj.page || 1);
			} catch (e) {
				console.error('Error parsing query input:', e);
				const defaultFilter = getDefaultFilter(router);
				setSearchFilter(defaultFilter);
				setCurrentPage(1);
			}
		}
	}, [router.isReady, router.query.input]);

	useEffect(() => {
		if (searchFilter && router.isReady) {
			setCurrentPage(searchFilter.page || 1);
		}
	}, [searchFilter, router.isReady]);

	/** HANDLERS **/
	const likePropertyHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user?._id) {
				await sweetMixinErrorAlert('Please login first');
				throw new Error(Message.NOT_AUTHENTICATED);
			}

			await likeTargetProperty({
				variables: { propertyId: id },
			});
			await getPropertiesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			if (err.message !== Message.NOT_AUTHENTICATED) {
				sweetMixinErrorAlert(err.message).then();
			}
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/property?input=${JSON.stringify(searchFilter)}`, `/property?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const toggleFilterDrawer = () => {
		setFilterDrawerOpen(!filterDrawerOpen);
	};

	// Get selected locations for result info
	const selectedLocations = searchFilter?.search?.locationList || [];
	const locationText = selectedLocations.length > 0 
		? selectedLocations.length === 1 
			? selectedLocations[0]
			: `${selectedLocations.length} locations`
		: '';

	// Determine mode and build header text
	const mode = router.query.mode as string;
	const modeText = mode === 'rent' ? 'Rent Cars' : mode === 'buy' ? 'Buy Cars' : 'Cars';
	const headerText = locationText 
		? `${modeText} in ${locationText}`
		: `${total} ${total === 1 ? 'car' : 'cars'} found`;

	return (
		<Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
			{/* Mobile Header */}
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{
					padding: '16px',
					backgroundColor: '#ffffff',
					borderBottom: '1px solid #e0e0e0',
					position: 'sticky',
					top: 0,
					zIndex: 100,
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px' }}>
					{headerText}
				</Typography>
				<IconButton
					onClick={toggleFilterDrawer}
					aria-label="Open filters"
					sx={{
						backgroundColor: '#f17742',
						color: '#ffffff',
						'&:hover': {
							backgroundColor: '#e0662e',
						},
					}}
				>
					<FilterListIcon />
				</IconButton>
			</Stack>

			{/* Sort Bar */}
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{
					padding: '12px 16px',
					backgroundColor: '#ffffff',
					borderBottom: '1px solid #e0e0e0',
				}}
			>
				<Typography variant="body2" sx={{ color: '#717171' }}>
					Sort by:
				</Typography>
				<Button
					onClick={sortingClickHandler}
					endIcon={<KeyboardArrowDownRoundedIcon />}
					sx={{
						color: '#181a20',
						textTransform: 'none',
						fontWeight: 600,
					}}
				>
					{filterSortName}
				</Button>
				<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
					<MenuItem onClick={sortingHandler} id={'new'}>
						New
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'lowest'}>
						Lowest Price
					</MenuItem>
					<MenuItem onClick={sortingHandler} id={'highest'}>
						Highest Price
					</MenuItem>
				</Menu>
			</Stack>

			{/* Filter Drawer */}
			<Drawer
				anchor="bottom"
				open={filterDrawerOpen}
				onClose={toggleFilterDrawer}
				sx={{
					'& .MuiDrawer-paper': {
						maxHeight: '90vh',
						borderRadius: '16px 16px 0 0',
					},
				}}
			>
				<Box sx={{ padding: '16px' }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							Filters
						</Typography>
						<IconButton onClick={toggleFilterDrawer} aria-label="Close filters">
							×
						</IconButton>
					</Stack>
					<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
				</Box>
			</Drawer>

			{/* Property List */}
			<Box sx={{ padding: '16px' }}>
				{getPropertiesLoading ? (
					<ListSkeleton count={6} SkeletonComponent={PropertyCardSkeleton} />
				) : properties?.length === 0 ? (
					<EmptyState
						type="property"
						actionLabel="Browse All Cars"
						onActionClick={() => {
							router.push('/property');
						}}
					/>
				) : (
					<Stack spacing={2}>
						{properties.map((property: Property) => (
							<PropertyCard property={property} likePropertyHandler={likePropertyHandler} key={property?._id} />
						))}
					</Stack>
				)}
			</Box>

			{/* Pagination */}
			{properties.length !== 0 && (
				<Stack
					alignItems="center"
					sx={{
						padding: '24px 16px',
						backgroundColor: '#ffffff',
					}}
				>
					<Pagination
						page={currentPage}
						count={Math.ceil(total / searchFilter.limit)}
						onChange={handlePaginationChange}
						shape="rounded"
						color="primary"
						size="large"
					/>
					<Typography variant="body2" sx={{ mt: 2, color: '#717171' }}>
						Total {total} propert{total > 1 ? 'ies' : 'y'} available
					</Typography>
				</Stack>
			)}
		</Box>
	);
};

export default PropertyListMobile;


