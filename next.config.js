/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
	images: {
		remotePatterns: (() => {
			const patterns = [];
			const apiUrl = process.env.REACT_APP_API_URL;
			
			if (apiUrl?.includes('localhost')) {
				const port = apiUrl.split(':')[2]?.split('/')[0];
				if (port) {
					patterns.push({
						protocol: 'http',
						hostname: 'localhost',
						port: port,
						pathname: '/**',
					});
				}
			}
			
			if (apiUrl && !apiUrl.includes('localhost')) {
				const hostname = apiUrl.replace('https://', '').replace('http://', '').split('/')[0];
				if (hostname) {
					patterns.push({
						protocol: apiUrl.startsWith('https') ? 'https' : 'http',
						hostname: hostname,
						pathname: '/**',
					});
				}
			}
			
			return patterns;
		})(),
		domains: process.env.REACT_APP_API_URL
			? [process.env.REACT_APP_API_URL.replace('https://', '').replace('http://', '').split('/')[0]].filter(Boolean)
			: [],
		unoptimized: false,
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
