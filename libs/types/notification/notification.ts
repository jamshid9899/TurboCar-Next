import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

/** 
 * NOTIFICATION (Single)
 * Bitta notification object
 */
export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationRefId: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

/** 
 * NOTIFICATIONS (Paginated List)
 * Notification list with pagination
 */
export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
	totalCount?: number;
}



