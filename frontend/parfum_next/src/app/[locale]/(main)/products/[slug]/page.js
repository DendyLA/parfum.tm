
import ProductDetail from "@/components/ProductDetail/ProductDetail";
import { getProducts } from "@/lib/endpoints";

import ProductSection from "@/components/ProductSection/ProductSection";
import RecentViewedClient from "@/components/RecentViewed/RecentViewed";

export default async function ProductPage({ params }) {
	const { slug, locale = "ru" } = params;

	// серверный импорт переводов
	let messages;
	try {
		messages = (await import(`@/messages/products/${locale}.json`)).default;
	} catch {
		messages = (await import(`@/messages/products/ru.json`)).default;
	}

	const recommended = await getProducts({ pageSize: 5, is_recommended: true });

	return (
		<>
			<section className="section_padd">
				<div className="container">
					<ProductDetail slug={slug} locale={locale} />
				</div>
			</section>

			<RecentViewedClient />

			<ProductSection
				title={messages.recommended}
				products={recommended}
			/>
		</>
	);
}
