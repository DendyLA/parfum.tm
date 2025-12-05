'use client'

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // хук для редиректа
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductCard.module.scss";
import { addToCart } from "@/lib/addToCart";


import SkeletonList from "../SkeletonList/SkeletonList";

export default function ProductCard({ product = {} }) {
	const [isLoading, setIsLoading] = useState(true);
	const [added, setAdded] = useState(false);
	const router = useRouter();

	const title_ru = product.translations?.ru?.name || product.title || "Без названия";
	const category_ru = product.category?.translations?.ru?.name || product.category?.name || "Без Категории";

	const outOfStock = !product.count || product.count < 1; 
	
	

	const handleAddToCart = () => {
		if (outOfStock) return;

		if (product.variations && product.variations.length > 0) {
			// Есть вариации → переходим на страницу продукта
			router.push(`/products/${product.slug}`);
		} else {
			// Нет вариаций → добавляем сразу в корзину
			addToCart(product);
			setAdded(true);
			setTimeout(() => setAdded(false), 1500);
		}
	};
	
	return (
		<li className={styles.product__item}>
			{isLoading && (<SkeletonList count={1} />)}

			<Link href={`/products/${product.slug}`} className={styles.product__image}>
				<Image
					src={product.image}
					alt={title_ru || 'product card'}
					width={60}
					height={100}
					sizes="100%"
					onLoadingComplete={() => setIsLoading(false)}
				/>
			</Link>

			<Link href={`/products/${product.slug}`} className={`${styles.product__title} link`}>
				{title_ru}
			</Link>	

			<div className={styles.product__category}>{category_ru}</div>

			<div className={styles.product__price}>
				{product.discount_price ? (
					<>
						<span className={styles.product__price_new}>{product.discount_price} man</span>
						<span className={styles.product__price_old}>{product.price} man</span>
					</>
				) : (
					<span className={styles.product__price}>{product.price} man</span>
				)}
			</div>

			<button onClick={handleAddToCart} className={styles.product__btn} disabled={outOfStock}>
				{outOfStock ? "Нет в наличии" : added ? "Добавлено" : "В корзину"}
			</button>
		</li>
	);
}
