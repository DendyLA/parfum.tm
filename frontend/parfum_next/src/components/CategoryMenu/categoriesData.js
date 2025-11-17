
// categoriesData.js
import { getCategories } from "@/lib/api";

// Рекурсивная функция для построения дерева категорий
function buildTree(items, parentId = null) {
	return items
		.filter(item => item.parent === parentId)
		.map(item => {
		const children = buildTree(items, item.id);
		return {
			name: item.translations?.ru?.name || item.slug,
			slug: item.slug,
			...(children.length ? { children } : {}),
		};
		});
}

// Получаем массив категорий и преобразуем его
export const categories = (async () => {
	const data = await getCategories({ page: 1, pageSize: 1000 });
	const results = data.results; // массив категорий из API
	return buildTree(results);
})();


