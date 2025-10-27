export const categories = [
  {
    name: "Парфюмерия",
    slug: "perfume",
    children: [
      {
        name: "Женская парфюмерия",
        slug: "women",
        children: [
          {
            name: "Нишевая",
            slug: "niche",
            children: [
              { name: "Лимитированные", slug: "limited" },
              { name: "Коллекционные", slug: "collectible",  },
            ],
          },
        ],
      },
      {
        name: "Мужская парфюмерия",
        slug: "perfume/men",
      },
    ],
  },
  {
    name: "Макияж",
    slug: "makeup",
    children: [
      { name: "Для глаз", slug: "makeup/eyes" },
      {
        name: "Для губ",
        slug: "makeup/lips",
        children: [{ name: "Блески", slug: "makeup/lips/gloss" }],
      },
    ],
	
  },
  {
    name: "Для тела",
    slug: "makeup",
    children: [
      { name: "Для глаз", slug: "makeup/eyes" },
      {
        name: "Для губ",
        slug: "makeup/lips",
        children: [{ name: "Блески", slug: "makeup/lips/gloss" }],
      },
    ],
	
  },
  {
    name: "Для глаз",
    slug: "makeup",
    children: [
      { name: "Для глаз", slug: "makeup/eyes" },
      {
        name: "Для губ",
        slug: "makeup/lips",
        children: [{ name: "Блески", slug: "makeup/lips/gloss" }],
      },
    ],
	
  },
];
