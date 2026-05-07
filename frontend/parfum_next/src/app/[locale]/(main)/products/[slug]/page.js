// app/[locale]/products/[slug]/page.jsx

import ProductDetail from "@/components/ProductDetail/ProductDetail";
import { getProducts, getProductBySlug } from "@/lib/endpoints";
import ProductSection from "@/components/ProductSection/ProductSection";
import RecentViewedClient from "@/components/RecentViewed/RecentViewed";

// ✅ Metadata
export async function generateMetadata({ params }) {
    const { slug, locale = "ru" } = await params; // 🔥 ВАЖНО

    // защита от undefined
    if (!slug) {
        return {
            title: "Продукт",
            description: "Продукт не найден",
        };
    }

    let messages;
    try {
        messages = (await import(`@/messages/meta/${locale}.json`)).default;
    } catch {
        messages = (await import(`@/messages/meta/ru.json`)).default;
    }

    let product = null;

    try {
        product = await getProductBySlug(slug);
    } catch (e) {
        // не ломаем страницу если продукт не найден
        product = null;
    }

    const productName =
        product?.translations?.[locale]?.name ||
        product?.translations?.ru?.name ||
        "Продукт";

    return {
        title: messages.productPage.title.replace("{productName}", productName),
        description: messages.productPage.description.replace("{productName}", productName),
        keywords: messages.productPage.keywords.replace("{productName}", productName),
    };
}

// ✅ Page
export default async function ProductPage({ params }) {
    const { slug, locale = "ru" } = await params; // 🔥 ВАЖНО

    // защита
    if (!slug) {
        return <div>Продукт не найден</div>;
    }

    let messages;
    try {
        messages = (await import(`@/messages/products/${locale}.json`)).default;
    } catch {
        messages = (await import(`@/messages/products/ru.json`)).default;
    }

    let recommended = [];

    try {
        recommended = await getProducts({
            pageSize: 5,
            is_recommended: true,
        });
    } catch (e) {
        recommended = [];
    }

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