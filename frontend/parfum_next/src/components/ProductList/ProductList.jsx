
import React from "react";
import Link from "next/link";
import Image from "next/image";

import ProductCard from "../ProductCard/ProductCard";

import styles from './ProductList.module.scss';


export default function ProductList({product = {}}) {

	

  	return (
		<ul className={styles.products}>
			 {product.map((product, i) => (
				<ProductCard key={i} product={product} />
			))}
		</ul>
	)
}	
