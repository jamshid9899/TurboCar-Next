import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { RentalPanelList } from '../../../libs/components/admin/rentals/RentalList';
import { RentalsInquiry } from '../../../libs/types/rent/rental.input';
import { RentalBooking } from '../../../libs/types/rent/rental.dto';
import { RentalStatus } from '../../../libs/enums/renta.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { RentalUpdate } from '../../../libs/types/rent/rental.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_RENTALS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_RENTAL_BY_ADMIN, REMOVE_RENTAL_BY_ADMIN } from '../../../apollo/admin/mutation';

const AdminRentals: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [rentalsInquiry, setRentalsInquiry] = useState<RentalsInquiry>(initialInquiry);
	const [rentals, setRentals] = useState<RentalBooking[]>([]);
	const [rentalsTotal, setRentalsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		rentalsInquiry?.search?.rentalStatus ? rentalsInquiry?.search?.rentalStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const { data: rentalsData, refetch: refetchRentals } = useQuery(GET_ALL_RENTALS_BY_ADMIN, {
		variables: { input: rentalsInquiry },
		onCompleted: (data) => {
			if (data?.getAllRentalsByAdmin) {
				setRentals(data.getAllRentalsByAdmin.list || []);
				setRentalsTotal(data.getAllRentalsByAdmin.metaCounter?.[0]?.total || 0);
			}
		},
		onError: (err) => {
			console.log('GET_ALL_RENTALS_BY_ADMIN ERROR:', err);
			sweetErrorHandling(err).then();
		},
	});

	const [updateRentalByAdmin] = useMutation(UPDATE_RENTAL_BY_ADMIN, {
		onCompleted: (data) => {
			console.log('Rental updated successfully!');
			refetchRentals();
		},
		onError: (err) => {
			console.log('UPDATE_RENTAL_BY_ADMIN ERROR:', err);
			sweetErrorHandling(err).then();
		},
	});

	const [removeRentalByAdmin] = useMutation(REMOVE_RENTAL_BY_ADMIN, {
		onCompleted: (data) => {
			console.log('Rental removed successfully!');
			refetchRentals();
		},
		onError: (err) => {
			console.log('REMOVE_RENTAL_BY_ADMIN ERROR:', err);
			sweetErrorHandling(err).then();
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		refetchRentals();
	}, [rentalsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		rentalsInquiry.search = { ...rentalsInquiry.search, page: newPage + 1 };
		setRentalsInquiry({ ...rentalsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		rentalsInquiry.search = {
			...rentalsInquiry.search,
			limit: parseInt(event.target.value, 10),
			page: 1,
		};
		setRentalsInquiry({ ...rentalsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setRentalsInquiry({
			...rentalsInquiry,
			search: { ...rentalsInquiry.search, page: 1, sort: 'createdAt' },
		});

		switch (newValue) {
			case 'PENDING':
				setRentalsInquiry({
					...rentalsInquiry,
					search: { ...rentalsInquiry.search, rentalStatus: RentalStatus.PENDING },
				});
				break;
			case 'CONFIRMED':
				setRentalsInquiry({
					...rentalsInquiry,
					search: { ...rentalsInquiry.search, rentalStatus: RentalStatus.CONFIRMED },
				});
				break;
			case 'CANCELLED':
				setRentalsInquiry({
					...rentalsInquiry,
					search: { ...rentalsInquiry.search, rentalStatus: RentalStatus.CANCELLED },
				});
				break;
			case 'FINISHED':
				setRentalsInquiry({
					...rentalsInquiry,
					search: { ...rentalsInquiry.search, rentalStatus: RentalStatus.FINISHED },
				});
				break;
			default:
				delete rentalsInquiry?.search?.rentalStatus;
				setRentalsInquiry({ ...rentalsInquiry });
				break;
		}
	};

	const removeRentalHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove this rental?')) {
				await removeRentalByAdmin({
					variables: {
						rentalId: id,
					},
				});
			}
			menuIconCloseHandler();
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const updateRentalHandler = async (updateData: RentalUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateRentalByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Rental List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'PENDING')}
									value="PENDING"
									className={value === 'PENDING' ? 'li on' : 'li'}
								>
									Pending
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'CONFIRMED')}
									value="CONFIRMED"
									className={value === 'CONFIRMED' ? 'li on' : 'li'}
								>
									Confirmed
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'CANCELLED')}
									value="CANCELLED"
									className={value === 'CANCELLED' ? 'li on' : 'li'}
								>
									Cancelled
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'FINISHED')}
									value="FINISHED"
									className={value === 'FINISHED' ? 'li on' : 'li'}
								>
									Finished
								</ListItem>
							</List>
							<Divider />
						</Box>
						<RentalPanelList
							rentals={rentals}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateRentalHandler={updateRentalHandler}
							removeRentalHandler={removeRentalHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={rentalsTotal}
							rowsPerPage={rentalsInquiry?.search?.limit || 10}
							page={(rentalsInquiry?.search?.page || 1) - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminRentals.defaultProps = {
	initialInquiry: {
		search: {
			page: 1,
			limit: 10,
			sort: 'createdAt',
			direction: 'DESC',
		},
	},
};

export default withAdminLayout(AdminRentals);

