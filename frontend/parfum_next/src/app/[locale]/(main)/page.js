import { getProducts, getPromotions } from "@/lib/endpoints";
import { getDiscountProducts } from '@/lib/getDiscountProducts';
import ProductSection from "@/components/ProductSection/ProductSection";
import Banners from "@/components/Banners/Banners";
import InfiniteProductList from "@/components/InfinityProductList/InfinityProductList";

export default async function Home({ params }) {
	const locale = params.locale || "ru";

	const messages = (await import(`@/messages/home/${locale}.json`)).default;

	const banners = await getPromotions();
	const discountProducts = await getDiscountProducts(5);

	const recommended = await getProducts({
		pageSize: 5,
		is_recommended: true,
		in_stock: true
	});

	const newProducts = await getProducts({
		pageSize: 5,
		ordering: '-created_at',
		in_stock: true
	});

	return (
		<>
			<section className='section_padd'>
				<div className="container">
					<Banners slides={banners}/>
				</div>
			</section>

			<ProductSection title={messages.recommended} products={recommended} />
			<ProductSection title={messages.new} products={newProducts} />

			{discountProducts?.length > 0 && (
				<ProductSection title={messages.discount} products={discountProducts} />
			)}

			<section className='section_padd'>
				<div className="container">
					<h4 className='title'>{messages.special}</h4>
					<InfiniteProductList endpoint="/products/" />
				</div>
			</section>
		</>
	);
}
