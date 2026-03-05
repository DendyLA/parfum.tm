import BrandsFetcher from "./BrandsFetcher";
import ruMeta from "@/messages/meta/ru.json";
import tkMeta from "@/messages/meta/tk.json";

export async function generateMetadata({ params }) {
	const { locale, slug } = params;

	// Берем переводы мета
	const messages = locale === "tk" ? tkMeta : ruMeta;

	// Название бренда динамически можно подгружать, либо оставляем slug
	const brandName = slug.replace(/-/g, " ").toUpperCase();

	return {
		title: messages.brandPage.title.replace("{brandName}", brandName),
		description: messages.brandPage.description.replace("{brandName}", brandName),
		openGraph: {
		title: messages.brandPage.title.replace("{brandName}", brandName),
		description: messages.brandPage.description.replace("{brandName}", brandName),
		url: `https://parfum.com.tm/${locale}/brands/${slug}`,
		type: "website",
		},
		robots: {
		index: true,
		follow: true,
		},
	};
}

export default function BrandPage({ params }) {
	const { slug } = params;
	const { locale } = params;

	return (
		<section className="section_padd">
		<div className="container">
			<BrandsFetcher slug={slug} key={slug} locale={locale} />
		</div>
		</section>
	);
}