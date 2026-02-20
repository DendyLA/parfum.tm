'use client';

import { useEffect, useState } from "react";
import ProductSection from "@/components/ProductSection/ProductSection";
import { getRecentProducts } from "@/lib/recentProducts";

import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function RecentViewedClient() {
	const { locale } = useLocale();
	const messages = useMessages("recentViewed", locale);

	const [recentProducts, setRecentProducts] = useState([]);

	useEffect(() => {
		setRecentProducts(getRecentProducts());
	}, []);

	if (recentProducts.length === 0) return null;

	return (
		<ProductSection
			title={messages.title}
			products={recentProducts}
		/>
	);
}
