'use client'

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductCard.module.scss";
import { addToCart } from "@/lib/addToCart";

export default function ProductCard({ product = {} }) {
	const [isLoading, setIsLoading] = useState(true);
	const [added, setAdded] = useState(false);
	

	const title_ru =
		product.translations?.ru?.name ||
		product.title ||
		"Без названия";
	
	const category_ru =
		product.category?.translations?.ru?.name ||
		product.category?.name ||
		"Без Категории";
	

	const handleAddToCart = () => {
		addToCart(product);
		setAdded(true);
		setTimeout(() => setAdded(false), 1500);
	};

	return (
		<li className={styles.product__item}>
			<Link href={""} className={styles.product__image}>
				{isLoading && (
				<Skeleton
					variant="rectangular"
					animation="wave"
					width='100%'
					height='100%'
					sx={{ borderRadius: "8px" }}
					className="skeleton"
				/>
				)}
				<Image
				src={product.image}
				alt={title_ru || 'product card'}
				width={60}
				height={100}
				sizes="100%"
				onLoadingComplete={() => setIsLoading(false)}
				/>
			</Link>

			
			{isLoading ? (
				<Skeleton
				variant="rectangular"
				animation="wave"
				width={250}
				height={20}
				sx={{ borderRadius: "8px", marginTop: '.5rem' }}
				// className="skeleton"
			/>) :
				<Link href={""} className={`${styles.product__title} link`}>{title_ru}</Link>	
			}


			{isLoading ? (
				<Skeleton
				variant="rectangular"
				animation="wave"
				width={250}
				height={20}
				sx={{ borderRadius: "8px", marginTop: '.5rem' }}
				// className="skeleton"
			/>) :
				(<div className={styles.product__category}>{category_ru}</div>)
			}
			

			<div className={styles.product__price}>
				{isLoading ? (
					<Skeleton
					variant="rectangular"
					animation="wave"
					width={250}
					height={20}
					sx={{ borderRadius: "8px", marginTop: '.5rem' }}
					// className="skeleton"
					/>) :
						(
						<>
							{product.discount_price ? (
							<>
								<span className={styles.product__price_new}>{product.discount_price} man</span>
								<span className={styles.product__price_old}>{product.price} man</span>
							</>
							) : (
							<span className={styles.product__price}>{product.price} man</span>
							)}
						</>
						)
				}
				
			</div>
			<button onClick={() => handleAddToCart(product)} className={styles.product__btn}>{added ? "Добавлено" : "В корзину"}</button>

		</li>
	);
}
