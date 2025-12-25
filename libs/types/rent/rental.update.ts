import { RentalStatus } from '../../enums/renta.enum';

/** 
 * RENTAL UPDATE
 * Rental yangilash uchun
 * Backend bilan 100% mos
 */
export interface RentalUpdate {
	_id: string;
	rentalStatus?: RentalStatus;
}
