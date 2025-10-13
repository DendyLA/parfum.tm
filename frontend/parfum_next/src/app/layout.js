import "../styles/globals.scss";

export const metadata = {
	title: "ParfumTM - Интернет-магазин косметики и парфюмерии №1",
	description: "ParfumTM ☜❶☞ Интернет-магазин парфюмерии и косметики ✿ Бесплатная доставка ✿ 100% оригинальные продукты ✿ Лучший выбор и низкие цены!",
	keywords: "парфюмерия, духи, брендовые ароматы, новинки, скидки, купить духи, косметика, уход за кожей, макияж, мужская парфюмерия, женская парфюмерия, унисекс ароматы, оригинальная косметика, парфюмерный магазин, интернет-магазин парфюмерии, парфюмерия онлайн, косметика онлайн, лучшие бренды, люксовая косметика, уход за волосами, аксессуары для красоты",
	openGraph: {
		title: "ParfumTM - Интернет магазин косметики и парфюмерии №1",
		description: "ParfumTM ☜❶☞ Интернет-магазин парфюмерии и косметики ✿ Бесплатная доставка ✿ 100% оригинальные продукты ✿ Лучший выбор и низкие цены!",
		url: "https://www.parfum.com.tm/",
		siteName: "Парфюмерия",
		images: [
		{
			url: "https://yourdomain.com/og-image.jpg", //!!!!!!!!!!!!!!!!!!!!!
			width: 1200,
			height: 630,
			alt: "Парфюмерия",
		},
		],
		locale: "ru_RU",
		type: "website",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="ru">
		<head>
			<link rel="icon" href="/favicon.ico" />
			{/* <link rel="canonical" href="https://parfum.com.tm" /> */}
			<meta name="robots" content="index, follow" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</head>
		<body>

			<main>{children}</main>

		</body>
		</html>
	);
}
