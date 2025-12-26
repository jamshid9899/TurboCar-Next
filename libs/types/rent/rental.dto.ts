import { Property, TotalCounter } from '../property/property';
import { Member } from '../member/member';
import { RentalStatus, RentalType } from '../../enums/renta.enum';

/** 
 * RENTAL BOOKING (Single)
 * Single rental object
 */
export interface RentalBooking {
	_id: string;
	propertyId: string;
	renterId: string;
	ownerId: string;
	rentalType: RentalType;
	rentalStatus: RentalStatus;
	startDate: Date | string;
	endDate: Date | string;
	totalPrice: number;
	createdAt: Date | string;
	updatedAt: Date | string;
	
	/** Populated fields **/
	propertyData?: Property;
	renterData?: Member;
	ownerData?: Member;
}

/** 
 * RENTALS (Paginated List)
 * Paginated list for admin
 */
export interface Rentals {
	list: RentalBooking[];
	metaCounter: TotalCounter[];
}