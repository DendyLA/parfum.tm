import Image from "next/image";
import styles from "./page.module.scss";

import Banners from "@/components/Banners/Banners";
import ProductList from "@/components/ProductList/ProductList";
import InfiniteProductList from "@/components/InfinityProductList/InfinityProductList";
import ProductSection from "@/components/ProductSection/ProductSection";

import { getProducts, getPromotions} from "@/lib/endpoints";
import { getDiscountProducts } from '@/lib/getDiscountProducts'


export default async function Home() {
	const banners = await getPromotions();
	const products = await getProducts({ page: 1, pageSize: 5, in_stock: true });
	const discountProducts = await getDiscountProducts(5);

	const recommended = await getProducts({ pageSize: 5, is_recommended : true, in_stock: true });
	const newProducts = await getProducts({ pageSize: 5, ordering: '-created_at', in_stock: true });
	
	
  return (
    <>
		<section className='section_padd'>
			<div className="container">
				<Banners slides={banners}/>
			</div>
		</section>
		<ProductSection title="Рекомендуем" products={recommended} />
		<ProductSection title="Новинки" products={newProducts} />
		
		{discountProducts?.length > 0 && ( 
			<ProductSection title="Акции" products={discountProducts} />
		)}
		<section className='section_padd'>
			<div className="container">
				<h4 className='title'>Специально для тебя </h4>
				<InfiniteProductList endpoint="/products/" />
			</div>
		</section>
		
	</>
  );
}
