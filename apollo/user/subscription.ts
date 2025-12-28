import { gql } from '@apollo/client';

/**************************
 *         CHAT          *
 *************************/

// Subscribe to new chat messages
export const SUBSCRIBE_CHAT_MESSAGES = gql`
	subscription SubscribeChatMessages {
		subscribeChatMessages {
			_id
			messageContent
			messageStatus
			senderId
			receiverId
			createdAt
			updatedAt
			senderData {
				_id
				memberNick
				memberFullName
				memberImage
			}
		}
	}
`;

// Subscribe to chat message updates (read receipts, etc.)
export const SUBSCRIBE_CHAT_UPDATES = gql`
	subscription SubscribeChatUpdates {
		subscribeChatUpdates {
			_id
			messageStatus
			updatedAt
		}
	}
`;






