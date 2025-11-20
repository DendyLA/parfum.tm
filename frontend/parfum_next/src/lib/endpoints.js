import { apiFetch } from "./api";

/**
 * Получить список товаров
 */
export async function getProducts({ page = 1, pageSize = 10, category, discount_price, ordering } = {}) {
	const params = new URLSearchParams();

	params.append("page", page);
	params.append("page_size", pageSize);

	if (category) params.append("category", category);
	if (discount_price !== undefined) params.append("discount_price", discount_price);
	if (ordering) params.append("ordering", ordering); // 'created_at' или '-created_at'

	return await apiFetch(`/products/?${params.toString()}`);
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


export async function getSubcategories(parentId, { page = 1, pageSize = 50 } = {}) {
    let url = `/categories/?parent=${parentId}&page=${page}&page_size=${pageSize}`;
    return await apiFetch(url);
}


/**
 * Get category Products
 */
export async function getCategoryProducts(
	categoryId,
	{ page = 1, pageSize = 50, ordering, discount_price } = {}
) {
	const params = new URLSearchParams();

	params.append("category", categoryId);
	params.append("page", page);
	params.append("page_size", pageSize);

	if (ordering) params.append("ordering", ordering);
	if (discount_price !== undefined) params.append("discount_price", discount_price);

	return await apiFetch(`/products?${params.toString()}`);
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