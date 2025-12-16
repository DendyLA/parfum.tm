// app/search/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/endpoints";

import SearchResults from "@/components/SearchResults/SearchResults";
import RecentViewedClient from "@/components/RecentViewed/RecentViewed";

import styles from './page.module.scss'

export default function SearchPage() {
	const params = useSearchParams();
	const query = params.get("q") || "";

	const [results, setResults] = useState({ products: [], categories: [], brands: [] });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!query) return;

		const fetchData = async () => {
		setLoading(true);
		try {
			const data = await searchProducts(query, 1000); // full search
			setResults(data);
		} catch (err) {
			console.error(err);
			setResults({ products: [], categories: [], brands: [] });
		} finally {
			setLoading(false);
		}
		};
		fetchData();
	}, [query]);

	return (
		<div className={styles.search}>
			<div className={`${styles.search__box} container`}>
				<h1 className={styles.search__title}>Результаты поиска по "{query}"</h1>
				<SearchResults results={results} loading={loading} />
				
			</div>
			<RecentViewedClient/>
		</div>
	);
}
