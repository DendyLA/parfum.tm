import { apiFetch } from "./api";

/**
 * Получить список товаров
 */
export async function getProducts({ page = 1, pageSize = 10 } = {}) {
    return await apiFetch(`/products/?page=${page}&page_size=${pageSize}`);
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
