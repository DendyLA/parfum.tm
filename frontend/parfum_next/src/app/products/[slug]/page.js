import Image from "next/image";

import ProductDetail from "@/components/ProductDetail/ProductDetail";


export default async function ProductPage({ params }) {
	const { slug } = await params;

	
  return (
	<section className="section_padd">
			<div className="container">
				<ProductDetail slug={slug}/>	
			</div>
		</section>
  );
}
