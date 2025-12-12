import { Direction } from '../../enums/common.enum';
import { RentalStatus, RentalType } from '../../enums/renta.enum';

/** 
 * RENTAL BOOKING INPUT
 * Yangi rental yaratish uchun
 */
export interface RentalBookingInput {
	propertyId: string;
	startDate: string; // ISO date string
	endDate: string;   // ISO date string
	rentalType: RentalType;
	totalPrice: number;
}

/** 
 * RENTAL BOOKING UPDATE
 * Rental statusni yangilash uchun
 */
export interface RentalBookingUpdate {
	_id: string;
	rentalStatus: RentalStatus;
}

/** 
 * RENTAL SEARCH
 * Search parameters for admin
 */
interface RentalSearch {
	page?: number;
	limit?: number;
	sort?: string;
	direction?: 'ASC' | 'DESC';
	rentalStatus?: RentalStatus;
	propertyId?: string;
	renterId?: string;
	ownerId?: string;
}

/** 
 * RENTALS INQUIRY
 * Admin uchun pagination va filter
 */
export interface RentalsInquiry {
	search: RentalSearch;
}

/** 
 * MY RENTALS INQUIRY (optional)
 * User o'zining rental'larini filter qilish uchun
 */
interface MyRentalsSearch {
	rentalStatus?: RentalStatus;
	startDateFrom?: Date;
	startDateTo?: Date;
}

export interface MyRentalsInquiry {
	page?: number;
	limit?: number;
	sort?: string;
	direction?: Direction;
	search?: MyRentalsSearch;
}