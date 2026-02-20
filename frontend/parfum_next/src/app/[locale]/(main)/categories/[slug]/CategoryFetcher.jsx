'use client';
import React, { useEffect, useState } from "react";
import { getCategoryBySlug } from "@/lib/endpoints";
import ProductsByCategory from "@/components/InfinityProductList/ProductsByCategory";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useLocale } from "@/context/LocaleContext";

export default function CategoryFetcher({ slug }) {
	const { locale } = useLocale(); // текущий язык 'ru' или 'tk'
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

	if (loading) return <p>Загрузка...</p>;
	if (!category) return <p>{locale === 'tk' ? 'Kategoriýa tapylmady' : 'Категория не найдена'}</p>;

	// Динамически берём название категории по выбранному языку
	const categoryName =
		category.translations?.[locale]?.name ||
		category.name ||
		(locale === 'tk' ? 'Kategoriýa' : 'Категория');

	const breadcrumbItems = [
		{ name: "PARFUMTM", href: "/" },
		{ name: categoryName }
	];

	return (
		<>
			<Breadcrumbs items={breadcrumbItems} />
			<ProductFilters key={category.id} values={filters} onChange={setFilters} />
			<ProductsByCategory categoryId={category.id} filters={filters}/>
		</>
	)
}
