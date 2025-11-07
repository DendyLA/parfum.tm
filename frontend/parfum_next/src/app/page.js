import Image from "next/image";
import styles from "./page.module.scss";

import Banners from "@/components/Banners/Banners";
import ProductList from "@/components/ProductList/ProductList";
import CompanyList from "@/components/CompanyList/CompanyList";


export default function Home() {

	const products = [
		{title : 'Titlesadasdsadasdadsad dsad asdasd asd asd asd sa dasd sad a dasd as d', category : 'Category',image: '/images/products/product_1.jpg',  price : 12345, discount_price : 123},
		{title : 'Title2', category : 'Category2',image: '/images/products/product_1.jpg',  price : 12345},
		{title : 'Title3', category : 'Category3',image: '/images/products/product_1.jpg',  price : 12345, discount_price : 123},
		{title : 'Title4', category : 'Category4',image: '/images/products/product_1.jpg',  price : 12345},
		{title : 'Title5', category : 'Category5',image: '/images/products/product_1.jpg',  price : 12345, discount_price : 123},

	]

	const productsNew = [
		{title : 'Titlesadasdsadasdadsad dsad asdasd asd asd asd sa dasd sad a dasd as d', category : 'Category',image: '/images/products/product_1.jpg',  price : 12345, discount_price : 123},
		{title : 'asdasd ad asd ', category : 'Category2',image: '/images/products/product_1.jpg',  price : 12345},
		{title : 'Titlaas dasde3', category : 'Category3',image: '/images/products/product_1.jpg',  price : 12345, discount_price : 123},
		{title : 'Titd asd asd asle4', category : 'Category4',image: '/images/products/product_1.jpg',  price : 12345},
		{title : 'Titl asd ase5', category : 'Category5',image: '/images/products/product_1.jpg',  price : 12345, discount_price : 123},

	]

	const company = [
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
		{title : 'Cerave', image : '/images/brands/cerave.png'},
	]


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
				<ProductList product={products}/>
			</div>
		</section>
		<section className='section_padd'>
			<div className="container">
				<h4 className='title'>Новинки</h4>
				<ProductList product={productsNew}/>
			</div>
		</section>
		<section className='section_padd'>
			<div className="container">
				<CompanyList company={company}/>
			</div>
		</section>
		
	</>
  );
}
