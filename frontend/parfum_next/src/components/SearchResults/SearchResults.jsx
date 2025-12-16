// components/SearchResults/SearchResults.jsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from './SearchResults.module.scss'

export default function SearchResults({ results, loading }) {
	const lang = "ru";

	if (loading) return <p>Загрузка...</p>;

	

	return (
		<>
		<section className={styles.search__wrapper}>
			<h2>Товары</h2>
			{results.products.length > 0 ? (
			<ul>
				{results.products.map(p => (
				<ProductCard key={p.id} product={p} />
				))}
			</ul>
			) : <p>Нет товаров</p>}
		</section>

		<section className={styles.search__wrapper}>
			<h2>Категории</h2>
			{results.categories.length > 0 ? (
			<ul>
				{results.categories.map(c => (
				<li key={c.id}>
					<Link href={`/categories/${c.slug}`}>
					{c.translations?.[lang]?.name || "Без названия"}
					</Link>
				</li>
				))}
			</ul>
			) : <p>Нет категорий</p>}
		</section>

		<section className={styles.search__wrapper}>
			<h2>Бренды</h2>
			{results.brands.length > 0 ? (
			<ul>
				{results.brands.map(b => (
				<li key={b.id}>
					<Link href={`/brand/${b.slug}`}>
					{b.name || "Без названия"}
					</Link>
				</li>
				))}
			</ul>
			) : <p>Нет брендов</p>}
		</section>
		</>
	);
}
