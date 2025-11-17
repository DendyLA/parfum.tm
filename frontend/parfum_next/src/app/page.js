import Image from "next/image";
import styles from "./page.module.scss";

import Banners from "@/components/Banners/Banners";
import ProductList from "@/components/ProductList/ProductList";
import CompanyList from "@/components/CompanyList/CompanyList";
import InfiniteProductList from "@/components/ProductList/InfinityProductList/InfinityProductList";


import { getProducts, getCompanies, getPromotions} from "@/lib/endpoints";
import { getDiscountProducts } from '@/lib/getDiscountProducts'


export default async function Home() {
	const banners = await getPromotions();
	const products = await getProducts({ page: 1, pageSize: 5 });
	const discountProducts = await getDiscountProducts(5);
	const companies = await getCompanies({ page: 1, pageSize: 8 });

	const recommended = await getProducts({ pageSize: 5, ordering: 'created_at' });;
	const newProducts = await getProducts({ pageSize: 5, ordering: '-created_at' });;
	const homeCompanies = companies.slice(0, 8);
	
  return (
    <>
		<section className='section_padd'>
			<div className="container">
				<Banners slides={banners}/>
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
