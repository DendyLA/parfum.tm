'use client'

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductCard.module.scss";

export default function ProductCard({ product = {} }) {
	const [isLoading, setIsLoading] = useState(true);

	const currentProduct = Object.keys(product).length
		? product
		: {
			title: "Title",
			category: "Category",
			image: "/images/products/product_1.jpg",
			price: 12345,
			discount_price: 123,
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
				src={currentProduct.image}
				alt={currentProduct.title}
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
				<Link href={""} className={`${styles.product__title} link`}>{currentProduct.title}</Link>	
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
				(<div className={styles.product__category}>{currentProduct.category}</div>)
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
							{currentProduct.discount_price ? (
							<>
								<span className={styles.product__price_new}>{currentProduct.discount_price} man</span>
								<span className={styles.product__price_old}>{currentProduct.price} man</span>
							</>
							) : (
							<span className={styles.product__price}>{currentProduct.price} man</span>
							)}
						</>
						)
				}
				
			</div>
		</li>
	);
}
