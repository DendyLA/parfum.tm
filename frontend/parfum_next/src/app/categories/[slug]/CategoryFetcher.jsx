'use client';
import React, { useEffect, useState } from "react";
import { getCategoryBySlug } from "@/lib/endpoints";
import InfiniteProductList from "@/components/InfinityProductList/InfinityProductList";

export default function CategoryFetcher({ slug }) {
	const [categoryId, setCategoryId] = useState(null);
	const [loading, setLoading] = useState(true);

  	useEffect(() => {
		if (!slug) return;

		async function fetchCategory() {
		try {
			const category = await getCategoryBySlug(slug);
			setCategoryId(category.id);
		} catch (err) {
			console.error("Ошибка получения категории:", err);
			setCategoryId(null);
		} finally {
			setLoading(false);
		}
		}

		fetchCategory();
	}, [slug]);

	if (loading) return <p>Загрузка...</p>;
	if (!categoryId) return <p>Категория не найдена</p>;

	return <InfiniteProductList categoryId={categoryId} />;
}
