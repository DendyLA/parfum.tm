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
} = {}) {
	const params = new URLSearchParams();

	params.append("page", page);
	params.append("page_size", pageSize);

	// Если категория есть, добавляем её в запрос
	if (category !== undefined && category !== null) {
		params.append("category", category);
	}
	if (ordering) params.append("ordering", ordering);
	if (min_price !== undefined) params.append("min_price", min_price);
	if (max_price !== undefined) params.append("max_price", max_price);
	if (has_discount !== undefined) params.append("has_discount", has_discount);

	// return await apiFetch(`/products/?${params.toString()}`);
	try {
		return await apiFetch(`/products/?${params.toString()}`);
	} catch (err) {
		if (err.message.includes("404")) {
		// Если 404 — возвращаем пустой массив
		return [];
		}
		throw err;
	}
}



/**
 * Получить один товар по ID
 */
export async function getProductById(id) {
    return await apiFetch(`/products/${id}/`);
}

/**
 * Получить список компаний (брендов)
 */
export async function getCompanies({ page = 1, pageSize = 10 } = {}) {
    return await apiFetch(`/brands/?page=${page}&page_size=${pageSize}`);
}




/**
 * Get category list
 */

export async function getCategories({ page = 1, pageSize = 20 } = {}) {
    let url = `/categories/?page=${page}&page_size=${pageSize}`;
    return await apiFetch(url);
}

export async function getCategoryById(id) {
    return await apiFetch(`/categories/${id}/`);
}


/**
 * Get category Products
 */
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
	
	// Возвращаем первый объект из results (slug уникален)
	if (data && data.length > 0) {
		
		return data[0];
	}

	throw new Error(`Категория с slug="${slug}" не найдена`);
}




/**
 * Get active banners
 */
export async function getPromotions({ page = 1, pageSize = 10 } = {}) {
	const params = new URLSearchParams();
	params.append("page", page);
	params.append("page_size", pageSize);
	params.append("active", "true"); // только активные

	return await apiFetch(`/promotions/?${params.toString()}`);
}