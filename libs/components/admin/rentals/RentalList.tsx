import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { RentalBooking } from '../../../types/rent/rental.dto';
import { REACT_APP_API_URL } from '../../../config';
import { RentalStatus } from '../../../enums/renta.enum';

interface Data {
	id: string;
	property: string;
	renter: string;
	owner: string;
	startDate: string;
	endDate: string;
	totalPrice: string;
	status: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'RENTAL ID',
	},
	{
		id: 'property',
		numeric: false,
		disablePadding: false,
		label: 'PROPERTY',
	},
	{
		id: 'renter',
		numeric: false,
		disablePadding: false,
		label: 'RENTER',
	},
	{
		id: 'owner',
		numeric: false,
		disablePadding: false,
		label: 'OWNER',
	},
	{
		id: 'startDate',
		numeric: false,
		disablePadding: false,
		label: 'START DATE',
	},
	{
		id: 'endDate',
		numeric: false,
		disablePadding: false,
		label: 'END DATE',
	},
	{
		id: 'totalPrice',
		numeric: true,
		disablePadding: false,
		label: 'TOTAL PRICE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface RentalPanelListType {
	rentals: RentalBooking[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateRentalHandler: any;
	removeRentalHandler: any;
}

export const RentalPanelList = (props: RentalPanelListType) => {
	const {
		rentals,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateRentalHandler,
		removeRentalHandler,
	} = props;

	const formatDate = (date: Date | string) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{rentals.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{rentals.length !== 0 &&
							rentals.map((rental: RentalBooking, index: number) => {
								const propertyImage = rental?.propertyData?.propertyImages?.[0]
									? `${REACT_APP_API_URL}/${rental.propertyData.propertyImages[0]}`
									: '/img/car/defaultCar.svg';
								const renterImage = rental?.renterData?.memberImage
									? `${REACT_APP_API_URL}/${rental.renterData.memberImage}`
									: '/img/profile/defaultUser.svg';
								const ownerImage = rental?.ownerData?.memberImage
									? `${REACT_APP_API_URL}/${rental.ownerData.memberImage}`
									: '/img/profile/defaultUser.svg';

								return (
									<TableRow hover key={rental?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{rental._id}</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'}>
												<Link href={`/property/detail?id=${rental?.propertyId}`}>
													<div>
														<Avatar alt="Property" src={propertyImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
												</Link>
												<Link href={`/property/detail?id=${rental?.propertyId}`}>
													<div>{rental.propertyData?.propertyTitle || '-'}</div>
												</Link>
											</Stack>
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'} alignItems="center">
												<Avatar alt="Renter" src={renterImage} sx={{ ml: '2px', mr: '10px', width: 32, height: 32 }} />
												<div>{rental.renterData?.memberNick || '-'}</div>
											</Stack>
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Stack direction={'row'} alignItems="center">
												<Avatar alt="Owner" src={ownerImage} sx={{ ml: '2px', mr: '10px', width: 32, height: 32 }} />
												<div>{rental.ownerData?.memberNick || '-'}</div>
											</Stack>
										</TableCell>

										<TableCell align="center">{formatDate(rental.startDate)}</TableCell>
										<TableCell align="center">{formatDate(rental.endDate)}</TableCell>
										<TableCell align="center">${rental.totalPrice?.toLocaleString() || '0'}</TableCell>

										<TableCell align="center">
											{rental.rentalStatus === RentalStatus.PENDING && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge warning'}>
														{rental.rentalStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(RentalStatus)
															.filter((ele) => ele !== rental.rentalStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateRentalHandler({ _id: rental._id, rentalStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}

											{rental.rentalStatus === RentalStatus.CONFIRMED && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{rental.rentalStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(RentalStatus)
															.filter((ele) => ele !== rental.rentalStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateRentalHandler({ _id: rental._id, rentalStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}

											{rental.rentalStatus === RentalStatus.CANCELLED && (
												<Button className={'badge error'}>{rental.rentalStatus}</Button>
											)}

											{rental.rentalStatus === RentalStatus.FINISHED && (
												<Button className={'badge info'}>{rental.rentalStatus}</Button>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

