import { NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

/** 
 * NOTIFICATIONS INQUIRY
 * For filtering notifications
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
 * For updating notification status
 */
export interface NotificationUpdate {
	_id: string;
	notificationStatus: NotificationStatus;
}

