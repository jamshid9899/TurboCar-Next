import { RentalStatus } from '../../enums/renta.enum';

/** 
 * RENTAL UPDATE
 * For updating rental
 * 100% compatible with backend
 */
export interface RentalUpdate {
	_id: string;
	rentalStatus?: RentalStatus;
}
