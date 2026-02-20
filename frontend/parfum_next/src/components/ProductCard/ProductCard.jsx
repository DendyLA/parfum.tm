'use client'

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.scss";
import { addToCart } from "@/lib/addToCart";
import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function ProductCard({ product = {} }) {
	const [isLoading, setIsLoading] = useState(true);
	const [added, setAdded] = useState(false);
	const router = useRouter();
	const { locale } = useLocale();
	const messages = useMessages("productCard", locale);

	const withLocale = (path) => `/${locale}${path}`;

	const title =
		product.translations?.[locale]?.name ||
		product.title ||
		messages.noTitle;

	const category =
		product.category?.translations?.[locale]?.name ||
		product.category?.name ||
		messages.noCategory;

	const outOfStock = !product.count || product.count < 1;

	const handleAddToCart = () => {
		if (outOfStock) return;

		if (product.variations && product.variations.length > 0) {
			router.push(withLocale(`/products/${product.slug}`));
		} else {
			console.log("Добавляем в корзину:", product);
			addToCart(product, locale);
			setAdded(true);
			setTimeout(() => setAdded(false), 1500);
		}
	};

	return (
		<li className={styles.product__item}>

			<Link
				href={withLocale(`/products/${product.slug}`)}
				className={styles.product__image}
			>
				{product.image ? (
					<Image
						src={product.image}
						alt={title}
						width={60}
						height={100}
						sizes="100%"
						onLoadingComplete={() => setIsLoading(false)}
					/>
				) : (
					<div className={styles.product__noimage}>
						{messages.noImage}
					</div>
				)}
			</Link>

			<Link
				href={withLocale(`/products/${product.slug}`)}
				className={`${styles.product__title} link`}
			>
				{title}
			</Link>

			<div className={styles.product__category}>
				{category}
			</div>

			<div className={styles.product__price}>
				{product.discount_price ? (
					<>
						<span className={styles.product__price_new}>
							{product.discount_price} {messages.currency}
						</span>
						<span className={styles.product__price_old}>
							{product.price} {messages.currency}
						</span>
					</>
				) : (
					<span>
						{product.price} {messages.currency}
					</span>
				)}
			</div>

			<button
				onClick={handleAddToCart}
				className={styles.product__btn}
				disabled={outOfStock}
			>
				{outOfStock
					? messages.outOfStock
					: added
						? messages.added
						: messages.addToCart}
			</button>
		</li>
	);
}
