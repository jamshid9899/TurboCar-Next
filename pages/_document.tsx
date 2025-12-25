import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/turbocar_1.svg" />

				{/* SEO */}
				<meta name="keyword" content={'turbocar, turbocar.uz, car marketplace, buy rent cars spain'} />
				<meta
					name={'description'}
					content={
						'Buy, rent and sell cars anywhere anytime in Spain. Best Cars at Best prices on TurboCar | ' +
						'Покупайте, арендуйте и продавайте автомобили в любой точке Испании в любое время. Лучшие автомобили по лучшим ценам на TurboCar | ' +
						'스페인 어디서나 언제든지 자동차를 사고, 렌트하고, 팔 수 있습니다. TurboCar에서 최적의 가격으로 최고의 자동차를 만나보세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
