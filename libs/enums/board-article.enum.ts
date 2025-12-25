export enum BoardArticleCategory {
	FREE = 'FREE',
	RECOMMEND = 'RECOMMEND',
	NEWS = 'NEWS',
	HUMOR = 'HUMOR',
}

export enum BoardArticleStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}

// Board Article Category Configuration
export interface BoardArticleCategoryConfig {
	category: BoardArticleCategory;
	label: string;
	title: string;
	subtitle: string;
	iconName: 'ChatBubbleOutline' | 'DirectionsCar' | 'Article' | 'Mood';
}

export const BOARD_ARTICLE_CATEGORY_CONFIG: Record<BoardArticleCategory, BoardArticleCategoryConfig> = {
	[BoardArticleCategory.FREE]: {
		category: BoardArticleCategory.FREE,
		label: 'Free',
		title: 'FREE',
		subtitle: 'Discuss anything car-related with the community',
		iconName: 'ChatBubbleOutline',
	},
	[BoardArticleCategory.RECOMMEND]: {
		category: BoardArticleCategory.RECOMMEND,
		label: 'Recommendations',
		title: 'RECOMMENDATIONS',
		subtitle: 'Get recommendations and share your favorite cars',
		iconName: 'DirectionsCar',
	},
	[BoardArticleCategory.NEWS]: {
		category: BoardArticleCategory.NEWS,
		label: 'News',
		title: 'NEWS',
		subtitle: 'Stay updated with the latest automotive news',
		iconName: 'Article',
	},
	[BoardArticleCategory.HUMOR]: {
		category: BoardArticleCategory.HUMOR,
		label: 'Memes',
		title: 'MEMES',
		subtitle: 'Share funny car memes and jokes',
		iconName: 'Mood',
	},
};
