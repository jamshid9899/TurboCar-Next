import numeral from 'numeral';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from './sweetAlert';
import { Message } from './enums/common.enum';

// ✅ NUMBER FORMATTER
export const formatterStr = (value: number | undefined): string => {
	if (!value) return '0';
	return numeral(value).format('0,0');
};

// ✅ LIKE TARGET PROPERTY HANDLER
export const likePropertyHandler = async (
	user: any,
	id: string,
	likeTargetProperty: any,
	refetch?: any
) => {
	try {
		if (!id) return;
		if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetProperty({
			variables: { propertyId: id },
		});

		if (refetch) {
			await refetch();
		}

		await sweetTopSmallSuccessAlert('Liked!', 800);
	} catch (err: any) {
		console.log('ERROR, likePropertyHandler:', err.message);
		await sweetMixinErrorAlert(err.message);
	}
};

// ✅ LIKE TARGET BOARD ARTICLE HANDLER
export const likeBoardArticleHandler = async (
	user: any,
	id: string,
	likeTargetBoardArticle: any,
	refetch?: any
) => {
	try {
		if (!id) return;
		if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetBoardArticle({
			variables: { articleId: id },
		});

		if (refetch) {
			await refetch();
		}

		await sweetTopSmallSuccessAlert('Liked!', 800);
	} catch (err: any) {
		console.log('ERROR, likeBoardArticleHandler:', err.message);
		await sweetMixinErrorAlert(err.message);
	}
};

// ✅ LIKE TARGET MEMBER HANDLER
export const likeMemberHandler = async (
	user: any,
	id: string,
	likeTargetMember: any,
	refetch?: any
) => {
	try {
		if (!id) return;
		if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetMember({
			variables: { memberId: id },
		});

		if (refetch) {
			await refetch();
		}

		await sweetTopSmallSuccessAlert('Liked!', 800);
	} catch (err: any) {
		console.log('ERROR, likeMemberHandler:', err.message);
		await sweetMixinErrorAlert(err.message);
	}
};