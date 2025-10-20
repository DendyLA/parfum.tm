export const categories = [
  {
    name: "Парфюмерия",
    slug: "perfume",
    children: [
      {
        name: "Женская парфюмерия",
        slug: "perfume/women",
        children: [
          {
            name: "Нишевая",
            slug: "perfume/women/niche",
            children: [
              { name: "Лимитированные", slug: "perfume/women/niche/limited" },
              { name: "Коллекционные", slug: "perfume/women/niche/collectible" },
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
];
