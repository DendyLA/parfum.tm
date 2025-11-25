'use client';
import React, { useEffect, useState } from "react";
import { getCategoryBySlug } from "@/lib/endpoints";
import InfiniteProductList from "@/components/InfinityProductList/InfinityProductList";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Skeleton from "@mui/material/Skeleton";

import ProductsByCategory from "@/components/InfinityProductList/ProductsByCategory";

export default function CategoryFetcher({ slug }) {
	const [category, setCategory] = useState(null);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({});

	useEffect(() => {
		if (!slug) return;

		async function fetchCategory() {
			try {
				const categoryData = await getCategoryBySlug(slug);
				setCategory(categoryData); // сохранили всю категорию
			} catch (err) {
				console.error("Ошибка получения категории:", err);
				setCategory(null);
			} finally {
				setLoading(false);
			}
		}

		fetchCategory();
	}, [slug]);

	// --- SKELETON ---
	if (loading) {
		return (
			<div className="skeleton__wrapper">
				{Array.from({ length: 4 }).map((_, i) => (
					<div className="skeleton__card" key={i}>
						<Skeleton animation="wave" variant="rectangular" height={250} />
						<Skeleton animation="wave" height={20} style={{ marginTop: 10 }} />
						<Skeleton animation="wave" width={100} height={20} />
					</div>
				))}
			</div>
		);
	}	

	if (!category) return <p>Категория не найдена</p>;

	const breadcrumbItems = [
		{ name: "PARFUMTM", href: "/" },
		{ name: category.translations.ru.name } // текущее имя категории
	];

	return (
		<>
			<Breadcrumbs items={breadcrumbItems} />
			<ProductFilters key={category.id} values={filters} onChange={setFilters} />
			<ProductsByCategory categoryId={category.id} filters={filters}/>
			{/* <InfiniteProductList 
				categoryId={category.id}
				filters={filters}
			/> */}
		</>
	)
}
