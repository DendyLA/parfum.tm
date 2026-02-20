const BASE_URL = "http://127.0.0.1:8000/api/v1";

// const BASE_URL = "https://parfum.com.tm/api/v1";

/**
 * Универсальный запрос к API
 * @param {string} endpoint - путь после BASE_URL, например "/products/"
 * @param {object} options - дополнительные параметры fetch (method, body и т.д.)
 */
export async function apiFetch(endpoint, options = {}) {
	try {
		const res = await fetch(`${BASE_URL}${endpoint}`, {
			cache: "no-store",
			...options,
		});

		if (!res.ok) {
			throw new Error(`Ошибка загрузки данных с ${endpoint}`);
		}

		const data = await res.json();
		return data.results || data; // results — для пагинации
	} catch (error) {
		console.error(`Ошибка при запросе ${endpoint}:`, error);
		return [];
	}
}
