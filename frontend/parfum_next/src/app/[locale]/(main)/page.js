import { Suspense } from "react";
import { getProducts, getPromotions } from "@/lib/endpoints";
import { getDiscountProducts } from '@/lib/getDiscountProducts';
import ProductSection from "@/components/ProductSection/ProductSection";
import Banners from "@/components/Banners/Banners";
import InfiniteProductList from "@/components/InfinityProductList/InfinityProductList";
import SkeletonList from "@/components/SkeletonList/SkeletonList";

export default async function Home({ params }) {
    const { locale = "ru" } = await params; // ✅ await params

    const messages = (await import(`@/messages/home/${locale}.json`)).default;

    // ✅ Все запросы параллельно — не ждут друг друга
    const [banners, discountProducts, recommended, newProducts] = await Promise.all([
        getPromotions(),
        getDiscountProducts(5),
        getProducts({ pageSize: 5, is_recommended: true, in_stock: true }),
        getProducts({ pageSize: 5, ordering: '-created_at', in_stock: true }),
    ]);

    return (
        <>
            <section className='section_padd'>
                <div className="container">
                    <Banners slides={banners} />
                </div>
            </section>

            <Suspense fallback={<SkeletonList count={5} />}>
                <ProductSection title={messages.recommended} products={recommended} />
            </Suspense>

            <Suspense fallback={<SkeletonList count={5} />}>
                <ProductSection title={messages.new} products={newProducts} />
            </Suspense>

            {discountProducts?.length > 0 && (
                <Suspense fallback={<SkeletonList count={5} />}>
                    <ProductSection title={messages.discount} products={discountProducts} />
                </Suspense>
            )}

            <section className='section_padd'>
                <div className="container">
                    <h4 className='title'>{messages.special}</h4>
                    <Suspense fallback={<SkeletonList count={10} />}>
                        <InfiniteProductList endpoint="/products/" />
                    </Suspense>
                </div>
            </section>
        </>
    );
}