import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from './PropertyCard';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import { PropertyStatus } from '../../enums/property.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { UPDATE_PROPERTY } from '../../../apollo/user/mutation';
import { Direction } from '../../enums/common.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { PropertyUpdate } from '../../types/property/property.input';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert, sweetConfirmAlert } from '../../sweetAlert';

const MyProperties: NextPage = (props: any) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	
	const [propertyStatus, setPropertyStatus] = useState<PropertyStatus>(PropertyStatus.ACTIVE);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>({
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			memberId: '',
		},
	});
	const [agentProperties, setAgentProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [updateProperty] = useMutation(UPDATE_PROPERTY);
	const {
		loading: getAgentPropertiesLoading,
		data: getAgentPropertiesData,
		error: getAgentPropertiesError,
		refetch: getAgentPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !user?._id || !searchFilter?.search?.memberId || searchFilter?.search?.memberId === '',
		notifyOnNetworkStatusChange: true,
		onError: (error) => {
			console.error('GET_PROPERTIES error:', error);
			console.error('SearchFilter:', searchFilter);
			console.error('User ID:', user?._id);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (user?._id) {
			console.log('Setting searchFilter with user._id:', user._id);
			// Initialize searchFilter with user's memberId when user is loaded
			setSearchFilter({
				page: 1,
				limit: 5,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					memberId: user._id,
				},
			});
		}
	}, [user?._id]);

	// Filter properties by status when data or status changes
	useEffect(() => {
		console.log('=== useEffect TRIGGERED ===');
		console.log('getAgentPropertiesData exists:', !!getAgentPropertiesData);
		console.log('List exists:', !!getAgentPropertiesData?.getProperties?.list);
		console.log('List length:', getAgentPropertiesData?.getProperties?.list?.length);
		console.log('Current propertyStatus:', propertyStatus);
		
		if (getAgentPropertiesData?.getProperties?.list) {
			const allProperties = getAgentPropertiesData.getProperties.list || [];
			console.log('=== FILTERING PROPERTIES ===');
			console.log('Current propertyStatus filter:', propertyStatus);
			console.log('Total properties from backend:', allProperties.length);
			console.log('All properties with statuses:', allProperties.map((p: Property) => ({ 
				id: p._id?.substring(0, 8), 
				title: p.propertyTitle?.substring(0, 20),
				status: p.propertyStatus 
			})));
			
			const filteredList = allProperties.filter((prop: Property) => {
				const matches = prop.propertyStatus === propertyStatus;
				if (!matches) {
					console.log(`Property ${prop.propertyTitle?.substring(0, 20)} (${prop.propertyStatus}) does NOT match filter ${propertyStatus}`);
				}
				return matches;
			});
			
			console.log('Filtered list result:', filteredList.length, 'properties');
			console.log('Filtered details:', filteredList.map((p: Property) => ({ 
				id: p._id?.substring(0, 8), 
				title: p.propertyTitle?.substring(0, 20),
				status: p.propertyStatus 
			})));
			
			setAgentProperties(filteredList);
			setTotal(filteredList.length);
		} else if (getAgentPropertiesData && (!getAgentPropertiesData?.getProperties?.list || getAgentPropertiesData.getProperties.list.length === 0)) {
			// If query completed but no data, clear the list
			console.log('No properties in response, clearing list');
			setAgentProperties([]);
			setTotal(0);
		} else {
			console.log('No data available yet, waiting...');
		}
	}, [getAgentPropertiesData, propertyStatus]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		const updatedFilter: PropertiesInquiry = {
			...searchFilter,
			page: value,
			search: {
				...searchFilter.search,
				memberId: user?._id || '',
			},
		};
		setSearchFilter(updatedFilter);
	};

	const changeStatusHandler = async (value: PropertyStatus) => {
		console.log('=== CHANGING STATUS TAB ===');
		console.log('From:', propertyStatus, 'To:', value);
		
		// Refetch FIRST to get latest data from backend
		if (searchFilter?.search?.memberId) {
			await getAgentPropertiesRefetch();
		}
		
		// Then set the new status filter
		// The useEffect will filter by the new status when propertyStatus changes
		setPropertyStatus(value);
	};

	const deletePropertyHandler = async (id: string) => {
		try {
			if (!id) {
				await sweetMixinErrorAlert('Property ID is missing');
				return;
			}

			const confirmed = await sweetConfirmAlert('Are you sure you want to delete this property?');
			if (!confirmed) return;

			await updateProperty({
				variables: {
					input: {
						_id: id,
						propertyStatus: PropertyStatus.DELETE,
					} as PropertyUpdate,
				},
			});

			await sweetTopSmallSuccessAlert('Property deleted successfully!', 2000);
			await getAgentPropertiesRefetch();
		} catch (err: any) {
			console.error('Error deleting property:', err);
			await sweetMixinErrorAlert(err.message || 'Failed to delete property');
		}
	};

	const updatePropertyHandler = async (status: PropertyStatus, id: string) => {
		try {
			if (!id) {
				await sweetMixinErrorAlert('Property ID is missing');
				return;
			}

			// Show confirmation dialog
			const confirmed = await sweetConfirmAlert(`Are you sure you want to change the status to ${status}?`);
			if (!confirmed) {
				return;
			}

			console.log('=== UPDATING PROPERTY STATUS ===');
			console.log('Property ID:', id);
			console.log('Current status filter:', propertyStatus);
			console.log('New status:', status);

			const result = await updateProperty({
				variables: {
					input: {
						_id: id,
						propertyStatus: status,
					} as PropertyUpdate,
				},
			});

			console.log('Update result:', result.data?.updateProperty);

			await sweetTopSmallSuccessAlert(`Property status updated to ${status}!`, 2000);
			
			// Refetch to get updated data from backend FIRST
			const refetchResult = await getAgentPropertiesRefetch();
			
			console.log('Refetch completed, new data count:', refetchResult.data?.getProperties?.list?.length);
			console.log('All properties after refetch:', refetchResult.data?.getProperties?.list?.map((p: Property) => ({
				id: p._id?.substring(0, 8),
				title: p.propertyTitle?.substring(0, 20),
				status: p.propertyStatus
			})));
			
			// Switch to the tab of the new status AFTER refetch
			// This ensures the useEffect filters with the new data and new status
			if (status !== propertyStatus) {
				setPropertyStatus(status);
			} else {
				// If status is same, manually trigger filter since useEffect might not trigger
				if (refetchResult.data?.getProperties?.list) {
					const allProperties = refetchResult.data.getProperties.list || [];
					const filteredList = allProperties.filter((prop: Property) => {
						return prop.propertyStatus === propertyStatus;
					});
					console.log('Manual filter result:', filteredList.length);
					setAgentProperties(filteredList);
					setTotal(filteredList.length);
				}
			}
		} catch (err: any) {
			console.error('Error updating property status:', err);
			await sweetMixinErrorAlert(err.message || 'Failed to update property status');
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>TURBOCAR PROPERTIES MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Properties</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(PropertyStatus.ACTIVE)}
							className={propertyStatus === PropertyStatus.ACTIVE ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(PropertyStatus.RENTED)}
							className={propertyStatus === PropertyStatus.RENTED ? 'active-tab-name' : 'tab-name'}
						>
							Rented
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(PropertyStatus.SOLD)}
							className={propertyStatus === PropertyStatus.SOLD ? 'active-tab-name' : 'tab-name'}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							<Typography className="title-text">Action</Typography>
						</Stack>

						{getAgentPropertiesLoading ? (
							<div className={'no-data'}>
								<p>Loading properties...</p>
							</div>
						) : getAgentPropertiesError ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>Error: {getAgentPropertiesError.message}</p>
								<p style={{ fontSize: '12px', color: '#999' }}>
									Debug: User ID: {user?._id || 'N/A'}, MemberId: {searchFilter?.search?.memberId || 'N/A'}
								</p>
							</div>
						) : agentProperties?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Property found!</p>
							</div>
						) : (
							agentProperties.map((property: Property) => {
								return (
									<PropertyCard
										key={property._id}
										property={property}
										deletePropertyHandler={deletePropertyHandler}
										updatePropertyHandler={updatePropertyHandler}
									/>
								);
							})
						)}

						{agentProperties.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} property available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

export default MyProperties;
