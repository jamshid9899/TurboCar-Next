import {
	PropertyCondition,
	PropertyBrand,
	PropertyType,
	PropertyFuelType,
	PropertyColor,
	PropertyTransmission,
	PropertyFeatures,
	PropertyCylinders,
	PropertyStatus,
	PropertyLocation,
} from '../../enums/property.enum';
import { Member } from '../member/member';

/** 
 * ME LIKED
 * User'ning like qilgan property'lari
 */
export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

/** 
 * TOTAL COUNTER
 * Pagination uchun
 */
export interface TotalCounter {
	total: number;
}

/** 
 * PROPERTY (Single)
 * Bitta property object
 */
export interface Property {
	_id: string;
	propertyCondition: PropertyCondition;
	propertyBrand: PropertyBrand;
	propertyType: PropertyType;
	propertyFuelType: PropertyFuelType;
	propertyStatus: PropertyStatus;
	propertyLocation: PropertyLocation;
	propertyColor: PropertyColor;
	propertyTransmission: PropertyTransmission;
	propertyFeatures: PropertyFeatures[];
	propertyCylinders: PropertyCylinders;
	propertyYear: number;
	propertyTitle: string;
	propertyPrice: number;
	propertyMileage: number;
	propertyViews: number;
	propertyLikes: number;
	propertyComments: number;
	propertyRank: number;
	propertyImages: string[];
	propertyDesc?: string;
	propertyRentPrice?: number;
	propertySeats: number;
	isForSale: boolean;
	isForRent: boolean;
	memberId: string;
	rentedUntil?: Date;
	minimumRentDays?: number;
	maximumRentDays?: number;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

/** 
 * PROPERTIES (Paginated List)
 * Property list with pagination
 */
export interface Properties {
	list: Property[];
	metaCounter: TotalCounter[];
}
