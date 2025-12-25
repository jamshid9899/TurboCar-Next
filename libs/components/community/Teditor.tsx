import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import { BoardArticleCategory, BOARD_ARTICLE_CATEGORY_CONFIG } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import { useMutation, useReactiveVar } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { BoardArticleInput } from '../../types/board-article/board-article.input';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../../apollo/store';
import { Message } from '../../enums/common.enum';
import '@toast-ui/editor/dist/toastui-editor.css';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const user = useReactiveVar(userVar);
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);
	const [articleTitle, setArticleTitle] = useState<string>('');
	const [articleImage, setArticleImage] = useState<string>('');
	const isUploadingRef = useRef<boolean>(false);

	/** APOLLO REQUESTS **/
	const [createBoardArticle, { loading: createLoading }] = useMutation(CREATE_BOARD_ARTICLE);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			if (!image) {
				console.error('No image provided');
				return null;
			}

			console.log('Starting image upload...', image.name || image.type);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			// Get GraphQL URL from environment variable
			const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL || process.env.NEXT_PUBLIC_REACT_APP_API_GRAPHQL_URL;
			
			if (!graphqlUrl) {
				console.error('REACT_APP_API_GRAPHQL_URL is not defined');
				await sweetMixinErrorAlert('API URL is not configured. Please check your environment variables.');
				return null;
			}

			console.log('Sending image upload request to:', graphqlUrl);
			const response = await axios.post(graphqlUrl, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			console.log('Image upload response:', response?.data);

			if (response?.data?.data?.imageUploader) {
				const responseImage = response.data.data.imageUploader;
				console.log('Image uploaded successfully:', responseImage);
				
				// Store the image path (not full URL) for backend
				setArticleImage(responseImage);
				
				// Return full URL for editor preview
				// Ensure the URL doesn't have double slashes
				const imagePath = responseImage.startsWith('/') ? responseImage : `/${responseImage}`;
				const baseUrl = REACT_APP_API_URL.endsWith('/') ? REACT_APP_API_URL.slice(0, -1) : REACT_APP_API_URL;
				const imageUrl = `${baseUrl}${imagePath}`;
				console.log('Image URL for editor:', imageUrl);
				return imageUrl;
			} else {
				console.error('Invalid response from image uploader:', response);
				await sweetMixinErrorAlert('Failed to upload image: Invalid response');
				return null;
			}
		} catch (err: any) {
			console.error('Error uploading image:', err);
			console.error('Error details:', {
				message: err?.message,
				response: err?.response?.data,
				status: err?.response?.status,
				config: err?.config,
			});
			
			// More detailed error message
			let errorMessage = 'Failed to upload image';
			if (err?.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err?.response?.data?.errors) {
				errorMessage = err.response.data.errors[0]?.message || errorMessage;
			} else if (err?.message) {
				errorMessage = err.message;
			} else if (err?.response?.status === 401) {
				errorMessage = 'Unauthorized. Please login again.';
			} else if (err?.response?.status === 413) {
				errorMessage = 'Image file is too large. Please use a smaller image.';
			} else if (err?.response?.status >= 500) {
				errorMessage = 'Server error. Please try again later.';
			}
			
			await sweetMixinErrorAlert(errorMessage);
			return null;
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		setArticleTitle(e.target.value);
	};

	const handleRegisterButton = async () => {
		try {
			// Check if user is logged in
			if (!user?._id) {
				await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
				router.push('/account/join');
				return;
			}

			// Get content from editor - use markdown format
			const editorInstance = editorRef.current?.getInstance();
			if (!editorInstance) {
				await sweetMixinErrorAlert('Editor is not initialized');
				return;
			}
			
			const articleContent = editorInstance.getMarkdown() || '';
			
			// Validate inputs
			if (!articleTitle || !articleTitle.trim()) {
				await sweetMixinErrorAlert('Please enter article title');
				return;
			}

			if (!articleContent || !articleContent.trim()) {
				await sweetMixinErrorAlert('Please enter article content');
				return;
			}

			// Validate category
			if (!articleCategory || !Object.values(BoardArticleCategory).includes(articleCategory)) {
				await sweetMixinErrorAlert('Please select a valid article category');
				return;
			}

			// Prepare input - ensure all required fields are present and properly formatted
			// Ensure articleCategory is a valid enum string value
			// Backend expects: 'FREE', 'RECOMMEND', 'NEWS', 'HUMOR'
			const validCategories = Object.values(BoardArticleCategory) as string[];
			const categoryValue = validCategories.includes(articleCategory as string) 
				? articleCategory 
				: BoardArticleCategory.FREE; // fallback to FREE if invalid
			
			if (!validCategories.includes(categoryValue as string)) {
				console.error('Invalid articleCategory value:', categoryValue);
				await sweetMixinErrorAlert(`Invalid article category: ${categoryValue}`);
				return;
			}
			
			// Create a clean input object with only the required fields
			// Ensure all values are strings for GraphQL
			const cleanInput: BoardArticleInput = {
				articleCategory: categoryValue as BoardArticleCategory,
				articleTitle: articleTitle.trim(),
				articleContent: articleContent.trim(),
				articleImage: (articleImage && articleImage.trim()) ? articleImage.trim() : '',
			};
			
			// Log the exact values being sent
			console.log('Sending to GraphQL:', {
				articleCategory: cleanInput.articleCategory,
				articleCategoryType: typeof cleanInput.articleCategory,
				articleTitle: cleanInput.articleTitle,
				articleContentLength: cleanInput.articleContent.length,
				articleImage: cleanInput.articleImage || '(empty)',
			});
			
			// Final validation before sending
			if (!cleanInput.articleCategory || !cleanInput.articleTitle || !cleanInput.articleContent) {
				await sweetMixinErrorAlert('Please fill in all required fields');
				return;
			}
			
			// Ensure articleCategory is a valid enum value
			if (!Object.values(BoardArticleCategory).includes(cleanInput.articleCategory)) {
				console.error('Invalid articleCategory:', cleanInput.articleCategory);
				await sweetMixinErrorAlert(`Invalid article category: ${cleanInput.articleCategory}`);
				return;
			}
			
			// Validate string lengths (if backend has limits)
			if (cleanInput.articleTitle.length > 500) {
				await sweetMixinErrorAlert('Article title is too long (max 500 characters)');
				return;
			}
			
			if (cleanInput.articleContent.length > 10000) {
				await sweetMixinErrorAlert('Article content is too long (max 10000 characters)');
				return;
			}

			// Create input exactly as Postman format
			// Postman format: { "input": { "articleCategory": "RECOMMEND", ... } }
			const graphqlInput = {
				articleCategory: String(cleanInput.articleCategory),
				articleTitle: String(cleanInput.articleTitle),
				articleContent: String(cleanInput.articleContent),
				articleImage: String(cleanInput.articleImage || ''),
			};
			
			// Log to verify format matches Postman
			console.log('GraphQL input (matching Postman format):', JSON.stringify(graphqlInput, null, 2));
			console.log('Field names:', Object.keys(graphqlInput));
			console.log('articleCategory value:', graphqlInput.articleCategory);
			
			// Use direct axios request (like Postman) to avoid Apollo Client serialization issues
			const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL || process.env.NEXT_PUBLIC_REACT_APP_API_GRAPHQL_URL;
			if (!graphqlUrl) {
				await sweetMixinErrorAlert('GraphQL URL is not configured');
				return;
			}
			
			// Create the exact GraphQL query as Postman
			const graphqlQuery = `mutation CreateBoardArticle($input: BoardArticleInput!) {
				createBoardArticle(input: $input) {
					_id
					articleCategory
					articleStatus
					articleTitle
					articleContent
					articleImage
					articleViews
					articleLikes
					articleComments
					memberId
					createdAt
					updatedAt
				}
			}`;
			
			const requestPayload = {
				query: graphqlQuery,
				variables: {
					input: graphqlInput,
				},
			};
			
			console.log('Sending direct axios request to:', graphqlUrl);
			console.log('Request payload:', JSON.stringify(requestPayload, null, 2));
			console.log('Input object:', JSON.stringify(graphqlInput, null, 2));
			console.log('Input field names:', Object.keys(graphqlInput));
			
			const axiosResponse = await axios.post(
				graphqlUrl,
				requestPayload,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			
			console.log('Axios response:', axiosResponse?.data);
			
			if (axiosResponse?.data?.data?.createBoardArticle) {
				await sweetTopSmallSuccessAlert('Article created successfully!', 2000);
				router.push(`/community?articleCategory=${articleCategory}`);
			} else if (axiosResponse?.data?.errors) {
				const errorMessage = axiosResponse.data.errors[0]?.message || 'Failed to create article';
				console.error('GraphQL errors:', axiosResponse.data.errors);
				await sweetMixinErrorAlert(errorMessage);
			} else {
				console.error('Unexpected response:', axiosResponse?.data);
				await sweetMixinErrorAlert('Unexpected response from server');
			}
		} catch (err: any) {
			console.error('Error creating article:', err);
			console.error('Error details:', {
				graphQLErrors: err?.graphQLErrors,
				networkError: err?.networkError,
				message: err?.message,
				response: err?.response,
			});
			
			// Extract error message
			let errorMessage = 'Failed to create article';
			
			// Check for GraphQL errors first
			if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
				const graphQLError = err.graphQLErrors[0];
				errorMessage = graphQLError.message || errorMessage;
				
				// Check for validation errors
				if (graphQLError.extensions?.exception?.response?.message) {
					errorMessage = graphQLError.extensions.exception.response.message;
				} else if (Array.isArray(graphQLError.extensions?.exception?.response?.message)) {
					errorMessage = graphQLError.extensions.exception.response.message.join(', ');
				}
			} else if (err?.networkError) {
				errorMessage = err.networkError.message || errorMessage;
			} else if (err?.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err?.response?.data?.errors) {
				errorMessage = err.response.data.errors[0]?.message || errorMessage;
			} else if (err?.message) {
				errorMessage = err.message;
			}
			
			// Check for "bad input" or validation errors
			if (errorMessage.toLowerCase().includes('bad input') || errorMessage.toLowerCase().includes('validation')) {
				errorMessage = 'Invalid input. Please check all fields and try again.';
			}
			
			await sweetMixinErrorAlert(errorMessage);
		}
	};

	const doDisabledCheck = () => {
		const articleContent = editorRef.current?.getInstance().getMarkdown() || '';
		if (articleContent.trim() === '' || articleTitle.trim() === '') {
			return true;
		}
		return false;
	};

	return (
		<Stack>
			<Stack direction="row" style={{ margin: '40px' }} justifyContent="space-evenly">
				<Box component={'div'} className={'form_row'} style={{ width: '300px' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Category
					</Typography>
					<FormControl sx={{ width: '100%', background: 'white' }}>
						<Select
							value={articleCategory}
							onChange={changeCategoryHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							{Object.values(BoardArticleCategory).map((category) => {
								const config = BOARD_ARTICLE_CATEGORY_CONFIG[category];
								return (
									<MenuItem key={category} value={category}>
										{config.label}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Box>
				<Box component={'div'} style={{ width: '300px', flexDirection: 'column' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Title
					</Typography>
					<TextField
						onChange={articleTitleHandler}
						id="filled-basic"
						label="Type Title"
						style={{ width: '300px', background: 'white' }}
					/>
				</Box>
			</Stack>

			<Editor
				initialValue={'Type here'}
				placeholder={'Type here'}
				previewStyle={'vertical'}
				height={'640px'}
				// @ts-ignore
				initialEditType={'WYSIWYG'}
				toolbarItems={[
					['heading', 'bold', 'italic', 'strike'],
					['image', 'table', 'link'],
					['ul', 'ol', 'task'],
				]}
				ref={editorRef}
				hooks={{
					addImageBlobHook: async (image: any, callback: any) => {
						// Prevent duplicate uploads
						if (isUploadingRef.current) {
							console.log('Image upload already in progress, skipping...');
							return false;
						}
						
						try {
							isUploadingRef.current = true;
							console.log('Image blob received:', image);
							const uploadedImageURL = await uploadImage(image);
							console.log('Uploaded image URL:', uploadedImageURL);
							
							if (uploadedImageURL) {
								// Call callback only once with the URL
								// Toast UI Editor will insert the image automatically
								callback(uploadedImageURL);
								console.log('Image callback called with URL:', uploadedImageURL);
							} else {
								console.error('Image upload failed, URL is null');
								await sweetMixinErrorAlert('Failed to upload image. Please try again.');
							}
						} catch (err: any) {
							console.error('Error in addImageBlobHook:', err);
							await sweetMixinErrorAlert('Failed to upload image. Please try again.');
						} finally {
							// Reset flag after a short delay to allow callback to complete
							setTimeout(() => {
								isUploadingRef.current = false;
							}, 1000);
						}
						// Return false to prevent default image insertion
						// The callback already inserted the image, so we don't need default behavior
						return false;
					},
				}}
				events={{
					load: function (param: any) {},
				}}
			/>

			<Stack direction="row" justifyContent="center">
				<Button
					variant="contained"
					color="primary"
					style={{ margin: '30px', width: '250px', height: '45px' }}
					onClick={handleRegisterButton}
					disabled={doDisabledCheck() || createLoading}
				>
					{createLoading ? 'Publishing...' : 'Publish Article'}
				</Button>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;
