"use client";

import React from "react";
import Link from "next/link";
import styles from "./SearchPopup.module.scss";

export default function SearchPopup({ query, results, loading, lang = "ru", onLinkClick }) {
    if (!query) return null;

    if (loading) return <div className={styles.searchPopup}><p>Загрузка...</p></div>;

    // Собираем все результаты в один массив с типом
    const allResults = [
        ...(results.products?.map(p => ({ ...p, type: "product" })) || []),
        ...(results.categories?.map(c => ({ ...c, type: "category" })) || []),
        ...(results.brands?.map(b => ({ ...b, type: "brand" })) || []),
    ];

    const hasResults = allResults.length > 0;

    // Берем максимум 3
    const limitedResults = allResults.slice(0, 3);

    return (
        <div className={styles.searchPopup}>
            {!hasResults && <p>Ничего не найдено</p>}

            {hasResults && (
                <ul className={styles.searchPopup__list}>
                    {limitedResults.map((item, index) => {
                        if (item.type === "product") {
                            return (
                                <li key={`product-${item.id}`}>
                                    <Link href={`/products/${item.slug}`} onClick={onLinkClick}>
                                        {item.translations?.[lang]?.name || "Без названия"}
                                    </Link>
                                </li>
                            );
                        }
                        if (item.type === "category") {
                            return (
                                <li key={`category-${item.id}`}>
                                    <Link href={`/categories/${item.slug}`} onClick={onLinkClick}>
                                        {item.translations?.[lang]?.name || "Без названия"}
                                    </Link>
                                </li>
                            );
                        }
                        if (item.type === "brand") {
                            return (
                                <li key={`brand-${item.id}`}>
                                    <Link href={`/brands/${item.slug}`} onClick={onLinkClick}>
                                        {item.name || "Без названия"}
                                    </Link>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            )}

            {hasResults && (
                <Link href={`/search?q=${query}`} className={styles.searchPopup__all} onClick={onLinkClick}>
                    Показать все результаты
                </Link>
            )}
        </div>
    );
}
