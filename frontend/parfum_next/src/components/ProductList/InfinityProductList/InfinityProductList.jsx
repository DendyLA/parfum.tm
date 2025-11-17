'use client';

import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Skeleton from "@mui/material/Skeleton";

import styles from "./InfinityProductsList.module.scss"; // используем те же стили что и ProductList

import { apiFetch } from "@/lib/api"; // твоя универсальная функция запроса

export default function InfiniteProductList({ endpoint }) {
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const loaderRef = useRef(null);
	
	// загрузка товаров
	const loadProducts = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			// добавляем page и page_size к запросу
			const data = await apiFetch(`${endpoint}?page=${page}&page_size=5`);
			if (!data || data.length === 0) {
				setHasMore(false);
			} else {
				setProducts(prev => [...prev, ...data]);
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
		loadProducts(); // загружаем первые 5
	}, []);

	// IntersectionObserver для бесконечного скролла
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
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
			{/* невидимый элемент для IntersectionObserver */}
			<div ref={loaderRef}></div>
		</ul>
	);
}
