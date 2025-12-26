import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* Robots */}
				<meta name="robots" content="index,follow" />
				<meta name="googlebot" content="index,follow" />
				
				{/* Favicon */}
				<link rel="icon" type="image/svg+xml" href="/img/logo/turbocar_1.svg" />
				<link rel="apple-touch-icon" href="/img/logo/turbocar_1.svg" />

				{/* SEO Meta Tags */}
				<meta name="keywords" content="turbocar, turbocar.uz, car marketplace, buy cars, rent cars, sell cars, spain, used cars, new cars, car rental" />
				<meta
					name="description"
					content={
						'Buy, rent and sell cars anywhere anytime in Spain. Best Cars at Best prices on TurboCar | ' +
						'Покупайте, арендуйте и продавайте автомобили в любой точке Испании в любое время. Лучшие автомобили по лучшим ценам на TurboCar | ' +
						'스페인 어디서나 언제든지 자동차를 사고, 렌트하고, 팔 수 있습니다. TurboCar에서 최적의 가격으로 최고의 자동차를 만나보세요'
					}
				/>
				<meta name="author" content="TurboCar" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://turbocar.uz/" />
				<meta property="og:title" content="TurboCar - Buy, Rent & Sell Cars in Spain" />
				<meta
					property="og:description"
					content="Buy, rent and sell cars anywhere anytime in Spain. Best Cars at Best prices on TurboCar"
				/>
				<meta property="og:image" content="/img/logo/turbocar_1.svg" />

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://turbocar.uz/" />
				<meta property="twitter:title" content="TurboCar - Buy, Rent & Sell Cars in Spain" />
				<meta
					property="twitter:description"
					content="Buy, rent and sell cars anywhere anytime in Spain. Best Cars at Best prices on TurboCar"
				/>
				<meta property="twitter:image" content="/img/logo/turbocar_1.svg" />

				{/* Theme Color */}
				<meta name="theme-color" content="#f17742" />
				<meta name="msapplication-TileColor" content="#f17742" />

				{/* Structured Data - Organization */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'Organization',
							name: 'TurboCar',
							url: 'https://turbocar.uz',
							logo: 'https://turbocar.uz/img/logo/turbocar_1.svg',
							description: 'Buy, rent and sell cars anywhere anytime in Spain',
							sameAs: [],
						}),
					}}
				/>

				{/* Structured Data - WebSite */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'WebSite',
							name: 'TurboCar',
							url: 'https://turbocar.uz',
							potentialAction: {
								'@type': 'SearchAction',
								target: {
									'@type': 'EntryPoint',
									urlTemplate: 'https://turbocar.uz/property?input={search_term_string}',
								},
								'query-input': 'required name=search_term_string',
							},
						}),
					}}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
