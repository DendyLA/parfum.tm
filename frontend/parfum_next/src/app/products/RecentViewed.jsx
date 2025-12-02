
'use client';

import { useEffect, useState } from "react";
import ProductSection from "@/components/ProductSection/ProductSection";
import { getRecentProducts } from "@/lib/recentProducts";

export default function RecentViewedClient() {
	const [recentProducts, setRecentProducts] = useState([]);

	useEffect(() => {
		setRecentProducts(getRecentProducts());
	}, []);


	if (recentProducts.length === 0) return null;

	
	return <ProductSection title="Последние просмотренные товары" products={recentProducts} />;
}
