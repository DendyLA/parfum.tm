'use client';

export const useMessages = (component, locale) => {
  try {
    // импортируем синхронно (не через useEffect)
    const msgs = require(`../messages/${component}/${locale}.json`);
    return msgs || {};
  } catch (err) {
    console.error(`Ошибка загрузки переводов для ${component}/${locale}:`, err);
    return {};
  }
};
