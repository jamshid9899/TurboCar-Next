import {
	PropertyCondition,
	PropertyBrand,
	PropertyType,
	PropertyFuelType,
	PropertyColor,
	PropertyTransmission,
	PropertyFeatures,
	PropertyCylinders,
	PropertyLocation,
	PropertyStatus,
} from '../../enums/property.enum';

/** 
 * PROPERTY UPDATE
 * For updating property
 * 100% compatible with backend
 */
export interface PropertyUpdate {
	_id: string;

	// Basic Info
	propertyCondition?: PropertyCondition;
	propertyBrand?: PropertyBrand;
	propertyType?: PropertyType;
	propertyFuelType?: PropertyFuelType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyColor?: PropertyColor;
	propertyTransmission?: PropertyTransmission;
	propertyFeatures?: PropertyFeatures[];
	propertyCylinders?: PropertyCylinders;

	// Details
	propertyTitle?: string;
	propertyPrice?: number;
	propertyRentPrice?: number;
	propertyMileage?: number;
	propertySeats?: number;
	propertyImages?: string[];
	propertyDesc?: string;

	// Sale/Rent
	isForSale?: boolean;
	isForRent?: boolean;

	// Rental Fields
	rentedUntil?: Date;
	minimumRentDays?: number;
	maximumRentDays?: number;

	// Date Fields
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}