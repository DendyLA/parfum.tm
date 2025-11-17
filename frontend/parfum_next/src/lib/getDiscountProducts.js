import { getProducts } from "./endpoints";

export async function getDiscountProducts(limit = 5) {
	let page = 1;
	const pageSize = 20;
	let result = [];

	while (result.length < limit) {
		const data = await getProducts({ page, pageSize });

		if (!data || data.length === 0) break;

		// фильтруем товары со скидкой
		const discounted = data.filter(p => p.discount_price && p.discount_price < p.price);

		result = [...result, ...discounted];

		page += 1;
	}

	return result.slice(0, limit);
}