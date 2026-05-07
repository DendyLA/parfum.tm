import CategoryFetcher from "./CategoryFetcher";
import ruMeta from "@/messages/meta/ru.json";
import tkMeta from "@/messages/meta/tk.json";

export async function generateMetadata({ params }) {
	const { locale = "ru", slug } = await params;
	const messages = locale === "tk" ? tkMeta : ruMeta;

	// Если slug нет — возвращаем дефолтное название
	const categoryName = slug ? slug.replace(/-/g, " ").toUpperCase() : "КАТЕГОРИЯ";

	return {
		title: messages.categoryPage.title.replace("{categoryName}", categoryName),
		description: messages.categoryPage.description.replace("{categoryName}", categoryName),
		openGraph: {
			title: messages.categoryPage.title.replace("{categoryName}", categoryName),
			description: messages.categoryPage.description.replace("{categoryName}", categoryName),
			url: `https://parfum.com.tm/${locale}/categories/${slug || ""}`,
			type: "website",
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default async function CategoryPage({ params }) {
	const { slug, locale = "ru" } = await params;

	

	return (
		<section className="section_padd">
			<div className="container">
				<div className="filter"></div>
				<CategoryFetcher slug={slug} locale={locale} />
			</div>
		</section>
	);
}