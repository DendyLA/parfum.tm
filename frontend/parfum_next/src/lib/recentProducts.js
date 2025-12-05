const STORAGE_KEY = "recent_products";
const MAX_ITEMS = 5;

/**
 * Добавляет товар в список последних просмотренных
 * @param {object} product
 */
export function addRecentProduct(product) {
    if (!product || !product.slug) return;

    // Получаем текущее
    let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Убираем дубликаты
    items = items.filter(p => p.slug !== product.slug);

    // Добавляем в начало
    items.unshift({
        slug: product.slug,
        name: product.translations?.ru?.name ?? "",
        image: product.image,
        price: product.price,
        discount_price: product.discount_price,
		count: product.count ?? 0
    });

    // Ограничиваем 5 шт.
    if (items.length > MAX_ITEMS) {
        items = items.slice(0, MAX_ITEMS);
    }

    // Сохраняем
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Получить последние просмотренные товары
 */
export function getRecentProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
