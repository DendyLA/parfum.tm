const STORAGE_KEY = "recent_products";
const MAX_ITEMS = 5;

/**
 * Добавляет товар в список последних просмотренных
 * @param {object} product
 */
export function addRecentProduct(product) {
    if (!product?.id) {
        console.error("Recent product без id:", product);
        return;
    }

    try {
        let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // Убираем дубликаты по id
        items = items.filter(p => p.id !== product.id);

        // Добавляем весь объект товара
        items.unshift(product);

        // Ограничиваем количество
        if (items.length > MAX_ITEMS) {
            items = items.slice(0, MAX_ITEMS);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.error("Ошибка recent storage:", e);
        localStorage.removeItem(STORAGE_KEY);
    }
}

/**
 * Получить последние просмотренные товары
 */
export function getRecentProducts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}
