import { getCategories } from "@/lib/api";

// Рекурсивная функция
function buildTree(items, locale, parentId = null) {
	return items
		.filter(item => item.parent === parentId)
		.map(item => {
			const children = buildTree(items, locale, item.id);

			return {
				name:
					item.translations?.[locale]?.name ||
					item.translations?.ru?.name ||
					item.slug,
				slug: item.slug,
				...(children.length ? { children } : {}),
			};
		});
}

// 🔥 функция вместо константы
export async function getCategoryTree(locale = "ru") {
	const data = await getCategories({ page: 1, pageSize: 1000 });
	const results = data.results;

	return buildTree(results, locale);
}
