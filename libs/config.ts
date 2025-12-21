export const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// ✅ CAR-SPECIFIC CONFIGS
export const availableOptions = ['isForSale', 'isForRent'];

// ✅ CAR YEARS (2000 - Current Year)
const currentYear = new Date().getFullYear();
export const carYears: number[] = [];
for (let year = 2000; year <= currentYear; year++) {
	carYears.push(year);
}

// ✅ MILEAGE OPTIONS (in km)
export const mileageRanges = [
	0, 10000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 300000
];

// ✅ PROPERTY SQUARE OPTIONS (in m²)
export const propertySquare = [
	0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 400, 500
];

// ✅ TOP CAR RANK THRESHOLD
export const topCarRank: number = 50;

// ✅ MESSAGES ENUM
export enum Message {
	SOMETHING_WENT_WRONG = 'Something went wrong!',
	NO_DATA_FOUND = 'No data found!',
	CREATE_FAILED = 'Create failed!',
	UPDATE_FAILED = 'Update failed!',
	REMOVE_FAILED = 'Remove failed!',
	USED_NICK_PHONE = 'You are inserting already used nick or phone!',
	TOKEN_CREATION_FAILED = 'Token creation error!',
	NO_MEMBER_NICK = 'No member with that member nick!',
	BLOCKED_USER = 'You have been blocked!',
	WRONG_PASSWORD = 'Wrong password, try again!',
	NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
	TOKEN_NOT_EXIST = 'Bearer Token is not provided!',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific roles!',
	NOT_ALLOWED_REQUEST = 'Not Allowed Request!',
	INSERT_ALL_INPUTS = 'Please provide all inputs',
}