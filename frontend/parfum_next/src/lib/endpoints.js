import { apiFetch } from "./api";

/**
 * Получить список товаров
 */
export async function getProducts({
	page = 1,
	pageSize = 10,
	category, // <- сюда передаём айди категории
	min_price,
	max_price,
	has_discount,
	ordering,
	is_recommended = false,
	in_stock, // <- новый параметр для фильтрации по count
	} = {}) {
	const params = new URLSearchParams();

	params.append("page", page);
	params.append("page_size", pageSize);

	if (category !== undefined && category !== null) {
		params.append("category", category);
	}
	if (ordering) params.append("ordering", ordering);
	if (min_price !== undefined) params.append("min_price", min_price);
	if (max_price !== undefined) params.append("max_price", max_price);
	if (has_discount !== undefined) params.append("has_discount", has_discount);
	if (is_recommended !== undefined && is_recommended !== null) {
		params.append("is_recommended", is_recommended);
	}
	if (in_stock !== undefined) {
		// true → только товары с count > 0
		// false → только товары с count = 0
		params.append("in_stock", in_stock);
	}

	try {
		return await apiFetch(`/products/?${params.toString()}`);
	} catch (err) {
		if (err.message.includes("404")) return [];
		throw err;
	}
}

/**
 * Получить список товаров по бренду
 */
export async function getProductsByBrand({
	brandId,
	page = 1,
	pageSize = 5,
	ordering,
	min_price,
	max_price,
	has_discount,
	in_stock, // <- новый параметр для фильтрации по count
	} = {}) {
	const params = new URLSearchParams();

	params.append("page", page);
	params.append("page_size", pageSize);
	params.append("brand", brandId); // <-- тут ID, не slug

	if (ordering) params.append("ordering", ordering);
	if (min_price !== undefined) params.append("min_price", min_price);
	if (max_price !== undefined) params.append("max_price", max_price);
	if (has_discount !== undefined) params.append("has_discount", has_discount);
	if (in_stock !== undefined) params.append("in_stock", in_stock);

	try {
		return await apiFetch(`/products/?${params.toString()}`);
	} catch (err) {
		if (err.message.includes("404")) return [];
		throw err;
	}
}

/**
 * Получить один товар по slug
 */
export async function getProductBySlug(slug, { in_stock } = {}) {
	if (!slug) throw new Error("Slug не указан");

	const params = new URLSearchParams();
	if (in_stock !== undefined) params.append("in_stock", in_stock);

	try {
		const data = await apiFetch(`/products/${slug}/?${params.toString()}`);
		return data;
	} catch (err) {
		throw new Error(`Продукт с slug="${slug}" не найден: ${err.message}`);
	}
}

/**
 * Получить один товар по ID
 */
export async function getProductById(id, { in_stock } = {}) {
	const params = new URLSearchParams();
	if (in_stock !== undefined) params.append("in_stock", in_stock);

	return await apiFetch(`/products/${id}/?${params.toString()}`);
}

/**
 * Остальные функции оставляем без изменений
 */

export async function getCompanies({ page = 1, pageSize = 10 } = {}) {
  	return await apiFetch(`/brands/?page=${page}&page_size=${pageSize}`);
}

export async function getBrandBySlug(slug) {
	if (!slug) throw new Error("Slug не указан");

	try {
		const data = await apiFetch(`/brands/${slug}/`);
		return data;
	} catch (err) {
		throw new Error(`Бренд с slug="${slug}" не найден: ${err.message}`);
	}
}

export async function getCategories({ page = 1, pageSize = 20 } = {}) {
	let url = `/categories/?page=${page}&page_size=${pageSize}`;
	return await apiFetch(url);
}

export async function getCategoryById(id) {
  	return await apiFetch(`/categories/${id}/`);
}

export async function getCategoryProducts(categoryId, params = {}) {
  	return await getProducts({ ...params, category: categoryId });
}

export async function getCategoryTree(id) {
	return await apiFetch(`/categories/${id}/tree/`);
}

export async function getCategoryBySlug(slug) {
	const params = new URLSearchParams();
	params.append("slug", slug);

	const data = await apiFetch(`/categories/?${params.toString()}`);

	if (data && data.length > 0) return data[0];
	throw new Error(`Категория с slug="${slug}" не найдена`);
}

export async function getPromotions({ page = 1, pageSize = 10 } = {}) {
	const params = new URLSearchParams();
	params.append("page", page);
	params.append("page_size", pageSize);
	params.append("active", "true");

	return await apiFetch(`/promotions/?${params.toString()}`);
}


/**
 * Поиск по товарам, категориям и брендам
 * query — строка поиска
 * limit — число результатов для попапа (по умолчанию 3)
 */


export async function searchProducts(query, limit = 3, full = false) {
    if (!query) return { products: [], categories: [], brands: [] };

    const params = new URLSearchParams();
    params.append("search", query);
    if (!full) params.append("limit", limit);

    const data = await apiFetch(`/products/search/?${params.toString()}`);

    return {
        products: data.products || [],
        categories: data.categories || [],
        brands: data.brands || [],
    };
}
