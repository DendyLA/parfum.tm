'use client';

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProducts, getCategoryProducts } from "@/lib/endpoints";

export default function InfiniteProductList({ categoryId }) {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const loaderRef = useRef(null);

	const loadProducts = async () => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			let data;
			if (categoryId) {
				data = await getCategoryProducts(categoryId, { page, pageSize: 5 });
			} else {
				data = await getProducts({ page, pageSize: 5 });
			}

			if (!data || data.length === 0) {
				setHasMore(false);
			} else {
				setProducts(prev => {
				// Фильтруем новые продукты, которых ещё нет в prev
				const newProducts = data.filter(
					d => !prev.some(p => p.id === d.id)
				);
				return [...prev, ...newProducts];
				});
				setPage(prev => prev + 1);
			}
		} catch (e) {
			console.error("Ошибка загрузки продуктов:", e);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Сбрасываем список и пагинацию, если categoryId изменился
		setProducts([]);
		setPage(1);
		setHasMore(true);
		loadProducts();
	}, [categoryId]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
				loadProducts();
				}
			},
			{ threshold: 0.1 }
		);

		if (loaderRef.current) observer.observe(loaderRef.current);

		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [loaderRef, loading, hasMore]);

	return (
		<ul className={styles.products}>
			{products.map(product => (
				<ProductCard key={product.id} product={product} />
			))}
			<div ref={loaderRef}></div>
			{loading && <p>Загрузка...</p>}
		</ul>
	);
}
