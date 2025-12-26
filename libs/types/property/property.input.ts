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
import { Direction } from '../../enums/common.enum';

/** 
 * PROPERTY INPUT
 * For creating a new property
 */
export interface PropertyInput {
	propertyCondition: PropertyCondition;
	propertyBrand: PropertyBrand;
	propertyType: PropertyType;
	propertyFuelType: PropertyFuelType;
	propertyLocation: PropertyLocation;
	propertyColor: PropertyColor;
	propertyTransmission: PropertyTransmission;
	propertyFeatures: PropertyFeatures[];
	propertyCylinders: PropertyCylinders;
	propertyRentPrice?: number;
	propertySeats: number;
	propertyYear: number;
	propertyTitle: string;
	propertyPrice: number;
	propertyMileage: number;
	propertyImages: string[];
	propertyDesc?: string;
	isForSale: boolean;
	isForRent: boolean;
	memberId?: string;
}

/** 
 * PROPERTY UPDATE
 * For updating property
 */
export interface PropertyUpdate {
	_id: string;
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
	propertyTitle?: string;
	propertyPrice?: number;
	propertyRentPrice?: number;
	propertyMileage?: number;
	propertySeats?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	isForSale?: boolean;
	isForRent?: boolean;
	rentedUntil?: Date;
	minimumRentDays?: number;
	maximumRentDays?: number;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}

/** 
 * PROPERTIES INQUIRY (Search/Filter)
 */
interface PISearch {
	memberId?: string;
	locationList?: PropertyLocation[];
	typeList?: PropertyType[];
	brandList?: PropertyBrand[];
	conditionList?: PropertyCondition[];
	fuelTypeList?: PropertyFuelType[];
	colorList?: PropertyColor[];
	transmissionList?: PropertyTransmission[];
	featuresList?: PropertyFeatures[];
	cylindersList?: PropertyCylinders[];
	seatsList?: number[];
	pricesRange?: Range;
	mileageRange?: Range;
	yearRange?: YearRange;
	text?: string;
	isForSale?: boolean;
	isForRent?: boolean;
}

export interface PropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

/** 
 * AGENT PROPERTIES INQUIRY
 * For agent to view their own properties
 */
interface APISearch {
	memberId?: string;
	propertyStatus?: PropertyStatus;
	propertyType?: PropertyType;
	isForSale?: boolean;
	isForRent?: boolean;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

/** 
 * ALL PROPERTIES INQUIRY (Admin)
 */
interface ALPISearch {
	propertyStatus?: PropertyStatus;
	propertyLocationList?: PropertyLocation[];
	propertyTypeList?: PropertyType[];
	isForSale?: boolean;
	isForRent?: boolean;
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

/** 
 * HELPER INTERFACES
 */
interface Range {
	start: number;
	end: number;
}

interface YearRange {
	start: number; // 2000
	end: number;   // 2024
}