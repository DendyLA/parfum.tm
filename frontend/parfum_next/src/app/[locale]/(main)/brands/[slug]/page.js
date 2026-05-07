// src/app/[locale]/(main)/brands/[slug]/page.js
import BrandsFetcher from "./BrandsFetcher";
import ruMeta from "@/messages/meta/ru.json";
import tkMeta from "@/messages/meta/tk.json";

export async function generateMetadata({ params }) {
	const { locale = "ru", slug } = await params;
	const messages = locale === "tk" ? tkMeta : ruMeta;

	if (!slug) {
		// Можно выбросить ошибку, чтобы Next.js показал 404
		return {
			title: "Бренд не найден",
			description: "Бренд не найден",
		};
	}

	// Форматируем название бренда для мета
	const brandName = slug.replace(/-/g, " ").toUpperCase();

	return {
		title: messages.brand.title.replace("{brandName}", brandName),
		description: messages.brand.description.replace("{brandName}", brandName),
		openGraph: {
			title: messages.brand.title.replace("{brandName}", brandName),
			description: messages.brand.description.replace("{brandName}", brandName),
			url: `https://parfum.com.tm/${locale}/brands/${slug}`,
			type: "website",
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default async function BrandPage({ params }) {
	const { slug, locale = "ru" } = await params;


	return (
		<section className="section_padd">
			<div className="container">
				<BrandsFetcher slug={slug} locale={locale} />
			</div>
		</section>
	);
}