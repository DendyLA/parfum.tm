export const categories = [
  {
    name: "Парфюмерия",
    slug: "perfume",
    children: [
      { name: "Для мужчин", slug: "men" },
      { name: "Для женщин", slug: "women" },
      { name: "Унисекс", slug: "unisex" },
      { name: "Наборы для мужчин", slug: "sets-men" },
      { name: "Наборы для женщин", slug: "sets-women" },
    ],
  },
  {
    name: "Макияж",
    slug: "makeup",
    children: [
      {
        name: "Лицо",
        slug: "face",
        children: [
          { name: "Базы и праймеры", slug: "primer" },
          { name: "Мисты для лица", slug: "face-mist" },
          { name: "Тон.средства", slug: "foundation" },
          { name: "Кушоны", slug: "cushion" },
          {
            name: "Пудры",
            slug: "powder",
            children: [
              { name: "Рассыпчатые пудры", slug: "loose-powder" },
              { name: "Компактные пудры", slug: "compact-powder" },
            ],
          },
          {
            name: "Румяна",
            slug: "blush",
            children: [
              { name: "Сухие", slug: "blush-dry" },
              { name: "Жидкие", slug: "blush-liquid" },
              { name: "Стик", slug: "blush-stick" },
            ],
          },
          {
            name: "Контуры и бронзеры",
            slug: "contour-bronzer",
            children: [
              { name: "Сухие", slug: "contour-dry" },
              { name: "Жидкие", slug: "contour-liquid" },
              { name: "Стик", slug: "contour-stick" },
            ],
          },
          {
            name: "Хайлайтеры",
            slug: "highlighter",
            children: [
              { name: "Сухие", slug: "highlighter-dry" },
              { name: "Жидкие", slug: "highlighter-liquid" },
              { name: "Стик", slug: "highlighter-stick" },
            ],
          },
          { name: "Консилеры", slug: "concealer" },
          { name: "Фиксаторы макияжа", slug: "makeup-fix" },
        ],
      },
      {
        name: "Глаза и брови",
        slug: "eyes-brows",
        children: [
          { name: "Туши для ресниц", slug: "mascara" },
          { name: "Тени для век", slug: "eyeshadow" },
          {
            name: "Подводки",
            slug: "eyeliner",
            children: [
              { name: "Гелевые", slug: "gel" },
              { name: "Жидкие", slug: "liquid" },
              { name: "Фломастеры", slug: "marker" },
            ],
          },
          { name: "Карандаши для глаз", slug: "eye-pencil" },
          { name: "Сыворотки и масла для ресниц и бровей", slug: "serums-oils" },
          { name: "Тени для бровей", slug: "brow-shadow" },
          { name: "Гели, туши и фиксаторы для бровей", slug: "brow-fix" },
          { name: "Карандаши для бровей", slug: "brow-pencil" },
        ],
      },
      {
        name: "Губы",
        slug: "lips",
        children: [
          { name: "Помады", slug: "lipstick" },
          { name: "Помада жидкие", slug: "lipstick-liquid" },
          { name: "Блески для губ", slug: "lip-gloss" },
          { name: "Тинты для губ", slug: "lip-tint" },
          { name: "Бальзамы, маски и масла для губ", slug: "lip-care" },
          { name: "Карандаши для губ", slug: "lip-pencil" },
        ],
      },
      { name: "Средства для снятия макияжа", slug: "makeup-remover" },
      { name: "Аксессуары для макияжа", slug: "makeup-accessories" },
    ],
  },
  {
    name: "Уход за лицом и телом",
    slug: "skincare-bodycare",
    children: [
      {
        name: "Лицо",
        slug: "face-care",
        children: [
          { name: "Пенки и гели для умывания", slug: "cleansers" },
          { name: "Пилинги и скрабы", slug: "peelings-scrubs" },
          { name: "Энзимные пудры", slug: "enzyme-powders" },
          { name: "Сыворотки", slug: "serums" },
          { name: "Тоники, тонеры и лосьоны", slug: "tonics" },
          { name: "Маски", slug: "masks" },
          { name: "Кремы для лица", slug: "face-creams" },
          { name: "Кремы и сыворотки вокруг глаз", slug: "eye-creams-serums" },
          { name: "Патчи вокруг глаз", slug: "eye-patches" },
          { name: "Пилинг-пэды", slug: "peeling-pads" },
        ],
      },
      {
        name: "Тело",
        slug: "body-care",
        children: [
          { name: "Кремы и лосьоны", slug: "body-creams" },
          { name: "Скрабы и баттеры", slug: "scrubs-butters" },
          { name: "Спреи для тела", slug: "body-sprays" },
          { name: "Гели для душа", slug: "shower-gels" },
          { name: "Кремы для рук и ног", slug: "hand-foot-creams" },
        ],
      },
      {
        name: "Дезодоранты",
        slug: "deodorants",
        children: [
          { name: "Для женщин", slug: "deodorants-women" },
          { name: "Для мужчин", slug: "deodorants-men" },
        ],
      },
    ],
  },
  {
    name: "Уход за волосами",
    slug: "haircare",
    children: [
      { name: "Шампуни", slug: "shampoo" },
      { name: "Маски и бальзамы", slug: "masks-conditioners" },
      { name: "Несмываемые спреи и кремы", slug: "leave-in" },
      { name: "Спреи и масла термозащита", slug: "heat-protection" },
      { name: "Пилинги и скрабы для головы", slug: "scalp-scrubs" },
      { name: "Масла для волос", slug: "hair-oils" },
      { name: "Лаки и пенки для волос", slug: "hair-sprays" },
      { name: "Сухие шампуни", slug: "dry-shampoo" },
      { name: "Расчёски для волос", slug: "hair-combs" },
    ],
  },
  {
    name: "Маникюр и педикюр",
    slug: "nails-care",
    children: [
      { name: "Уход за ногтями", slug: "nail-care" },
    ],
  },
];
