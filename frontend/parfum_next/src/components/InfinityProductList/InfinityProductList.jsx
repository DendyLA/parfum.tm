'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProducts, getCategoryProducts } from "@/lib/endpoints";
import Skeleton from "@mui/material/Skeleton";

export default function InfiniteProductList({ categoryId, filters }) {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const loaderRef = useRef(null);

	const loadProducts = useCallback(async () => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			let data;
			if (categoryId) {
				data = await getCategoryProducts(categoryId, {
					page,
					pageSize: 5,
					...filters,
				});
			} else {
				data = await getProducts({
					page,
					pageSize: 5,
					...filters,
				});
			}

			if (!data || data.length === 0) {
				setHasMore(false);
			} else {
				setProducts(prev => {
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
	}, [categoryId, filters, page, loading, hasMore]);

	// Сбрасываем продукты при смене категории или фильтров
	useEffect(() => {
		setProducts([]);
		setPage(1);
		setHasMore(true);
	}, [categoryId, filters]);

	// Запуск загрузки после сброса
	useEffect(() => {
		if (page === 1 && hasMore && !loading) {
			loadProducts();
		}
	}, [page, hasMore, loading, loadProducts]);

	// IntersectionObserver
	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && !loading && hasMore) {
				loadProducts();
			}
		});

		const node = loaderRef.current;
		if (node) observer.observe(node);

		return () => {
			if (node) observer.unobserve(node);
		};
	}, [loadProducts, loading, hasMore]);

	return (
		<>
			<ul className={styles.products}>
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
				<div ref={loaderRef} style={{ height: "1px" }}></div>
				
			</ul>
			{!hasMore && <p className={styles.products__info}>Больше товаров нет</p>}
		</>
	);
}
 