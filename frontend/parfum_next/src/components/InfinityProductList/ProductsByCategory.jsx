'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProducts, getCategoryTree } from "@/lib/endpoints";
import { Skeleton } from "@mui/material";

export default function ProductsByCategory({ categoryId }) {
	const [products, setProducts] = useState([]);
	const [categoryStack, setCategoryStack] = useState([]); // список всех id из дерева
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const loaderRef = useRef(null);

	// ================================
	// Преобразование дерева → список id
	// ================================
	const flattenTree = useCallback((node) => {
		const ids = [node.id];

		if (node.children && node.children.length > 0) {
			for (const child of node.children) {
				ids.push(...flattenTree(child));
			}
		}
		return ids;
	}, []);

	// ================================
	// Загрузка дерева категорий
	// ================================
	useEffect(() => {
		if (!categoryId) return;

		setProducts([]);
		setHasMore(true);

		getCategoryTree(categoryId).then(tree => {
			const ids = flattenTree(tree);

			setCategoryStack(ids.map(id => ({ id, page: 1 })));
		});
	}, [categoryId, flattenTree]);

	// ================================
	// Загрузка товаров для категорий
	// ================================
	const loadProducts = useCallback(async () => {
		if (loading || categoryStack.length === 0) return;
		setLoading(true);

		const current = categoryStack[0];

		try {
			const data = await getProducts({
				page: current.page,
				pageSize: 5,
				category: current.id
			});

			if (data && data.length > 0) {
				setProducts(prev => [
					...prev,
					...data.filter(d => !prev.some(p => p.id === d.id))
				]);

				// увеличиваем страницу
				const updated = [...categoryStack];
				updated[0] = { ...current, page: current.page + 1 };
				setCategoryStack(updated);

			} else {
				// товаров нет -> идем к следующей категории
				const updated = [...categoryStack];
				updated.shift();
				setCategoryStack(updated);

				if (updated.length === 0) setHasMore(false);
			}
		} catch (err) {
			console.error("Ошибка загрузки товаров:", err);
			setHasMore(false);
		}

		setLoading(false);
	}, [loading, categoryStack]);

	// ================================
	// Intersection Observer
	// ================================
	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && !loading && hasMore) {
				loadProducts();
			}
		});

		const node = loaderRef.current;
		if (node) observer.observe(node);

		return () => node && observer.unobserve(node);
	}, [loadProducts, loading, hasMore]);




	return (
		<>
			<ul className={styles.products}>
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
				<div ref={loaderRef} style={{ height: "10px" }} />
			</ul>
			
			
			{!hasMore && <p className={styles.products__info}>Больше товаров нет</p>}
		</>
	);
}
