import Image from "next/image";

import ProductDetail from "@/components/ProductDetail/ProductDetail";
import { getProducts } from "@/lib/endpoints";

import ProductSection from "@/components/ProductSection/ProductSection";
import RecentViewedClient from "../RecentViewed";


export default async function ProductPage({ params }) {
	const { slug } = await params;
	const recommended = await getProducts({ pageSize: 5, is_recommended : true });
	
  return (
	<>
		<section className="section_padd">
				<div className="container">
					<ProductDetail slug={slug} />	
				</div>
		</section>
		<RecentViewedClient />
		<ProductSection title={'Рекомендуем'} products={recommended}/>
		
	</>
	
  );
}
