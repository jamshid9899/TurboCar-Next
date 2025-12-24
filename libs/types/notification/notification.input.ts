import { NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

/** 
 * NOTIFICATIONS INQUIRY
 * Notification'larni filter qilish uchun
 */
export interface NotificationsInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: Direction;
	search: {
		notificationStatus?: NotificationStatus;
		notificationGroup?: NotificationGroup;
		notificationRefId?: string;
	};
}

/** 
 * NOTIFICATION UPDATE
 * Notification status'ni yangilash uchun
 */
export interface NotificationUpdate {
	_id: string;
	notificationStatus: NotificationStatus;
}

