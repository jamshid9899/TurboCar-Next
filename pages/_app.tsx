import type { AppProps } from 'next/app';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { light, dark } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { getTheme } from '../libs/utils/theme';
import { SignupModalProvider } from '../libs/components/common/SignupModalContext';
import ErrorBoundary from '../libs/components/common/ErrorBoundary';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	const [theme, setTheme] = useState(() => createTheme(light as any));
	const client = useApollo(pageProps.initialApolloState || null);

	useEffect(() => {
		// Initialize theme
		const currentTheme = getTheme();
		setTheme(createTheme(currentTheme === 'dark' ? (dark as any) : (light as any)));

		// Listen for theme changes (when user toggles)
		const handleThemeChange = () => {
			const newTheme = getTheme();
			setTheme(createTheme(newTheme === 'dark' ? (dark as any) : (light as any)));
		};

		// Custom event for theme changes
		window.addEventListener('themechange', handleThemeChange);

		return () => {
			window.removeEventListener('themechange', handleThemeChange);
		};
	}, []);

	return (
		<ErrorBoundary>
			<ApolloProvider client={client}>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
					<SignupModalProvider>
						<Component {...pageProps} />
					</SignupModalProvider>
				</MuiThemeProvider>
			</ApolloProvider>
		</ErrorBoundary>
	);
};

export default appWithTranslation(App);
