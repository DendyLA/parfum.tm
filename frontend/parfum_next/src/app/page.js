import Image from "next/image";
import styles from "./page.module.scss";

import Banners from "@/components/Banners/Banners";
import ProductList from "@/components/ProductList/ProductList";
import CompanyList from "@/components/CompanyList/CompanyList";
import InfiniteProductList from "@/components/ProductList/InfinityProductList/InfinityProductList";


import { getProducts, getCompanies} from "@/lib/endpoints";

export default async function Home() {
	const products = await getProducts({ page: 1, pageSize: 10 });
	const companies = await getCompanies({ page: 1, pageSize: 8 });

	const recommended = products.slice(0, 5);
	const newProducts = products.slice(0, 5);
	const discountProducts = products.filter(p => p.discount_price).slice(0, 5);
	const homeCompanies = companies.slice(0, 8);

  return (
    <>
		<section className='section_padd'>
			<div className="container">
				<Banners/>
			</div>
		</section>
		<section className='section_padd'>
			<div className="container">
				<h4 className='title'>Рекомендуем</h4>
				<ProductList product={recommended}/>
			</div>
		</section>
		<section className='section_padd'>
			<div className="container">
				<h4 className='title'>Новинки</h4>
				<ProductList product={newProducts}/>
			</div>
		</section>
		<section className='section_padd'>
			<div className="container">
				<CompanyList company={homeCompanies}/>
			</div>
		</section>
		{discountProducts?.length > 0 && (
		<section className='section_padd'>
			<div className="container">
			<h4 className='title'>Акции</h4>
			<ProductList product={discountProducts}/>
			</div>
		</section>
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
