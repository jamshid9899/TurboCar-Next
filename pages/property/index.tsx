import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import PropertyCard from '../../libs/components/property/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/property/Filter';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { Property } from '../../libs/types/property/property';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Default filter for initial load - now handles mode from router.query
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

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	
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
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		// Preserve mode in URL when paginating
		const modeParam = router.query.mode ? `&mode=${router.query.mode}` : '';
		await router.push(
			`/property?input=${JSON.stringify(searchFilter)}${modeParam}`,
			`/property?input=${JSON.stringify(searchFilter)}${modeParam}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likePropertyHandler = async (user: T, id: string) => {
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

	const resetFilters = () => {
		const defaultFilter = getDefaultFilter(router);
		setSearchFilter(defaultFilter);
		// Preserve mode in URL when resetting
		if (router.query.mode) {
			router.push(`/property?mode=${router.query.mode}`, undefined, { scroll: false });
		} else {
			router.push('/property', undefined, { scroll: false });
		}
	};

	if (device === 'mobile') {
		return <h1>PROPERTIES MOBILE</h1>;
	} else {
		// Get selected locations for result info
		const selectedLocations = searchFilter?.search?.locationList || [];
		const locationText = selectedLocations.length > 0 
			? selectedLocations.length === 1 
				? selectedLocations[0]
				: `${selectedLocations.length} locations`
			: '';

		// Determine mode and build header text: "Rent Cars in Madrid" or "Buy Cars in Barcelona"
		const mode = router.query.mode as string;
		const modeText = mode === 'rent' ? 'Rent Cars' : mode === 'buy' ? 'Buy Cars' : 'Cars';
		const headerText = locationText 
			? `${modeText} in ${locationText}`
			: `${total} ${total === 1 ? 'car' : 'cars'} found`;
		
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							{/* Sort + Result Info Header */}
							{/* @ts-ignore */}
							<Box component="div" className="sort-header">
								{/* @ts-ignore */}
								<Box component="div" className="result-info">
									<Typography className="result-count">
										{headerText}
									</Typography>
								</Box>
								{/* @ts-ignore */}
								<Box component="div" className="sort-box">
									<span>Sort by:</span>
									<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
										{filterSortName}
									</Button>
									<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
										<MenuItem
											onClick={sortingHandler}
											id={'new'}
											disableRipple
											sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
										>
											New
										</MenuItem>
										<MenuItem
											onClick={sortingHandler}
											id={'lowest'}
											disableRipple
											sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
										>
											Lowest Price
										</MenuItem>
										<MenuItem
											onClick={sortingHandler}
											id={'highest'}
											disableRipple
											sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
										>
											Highest Price
										</MenuItem>
									</Menu>
								</Box>
							</Box>
							
							<Stack className={'list-config'}>
								{properties?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Properties found!</p>
									</div>
								) : (
									properties.map((property: Property) => {
										return <PropertyCard property={property} likePropertyHandler={likePropertyHandler} key={property?._id} />;
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{properties.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{properties.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} propert{total > 1 ? 'ies' : 'y'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

PropertyList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default withLayoutBasic(PropertyList);
