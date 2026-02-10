'use client';

import React from "react";
import Link from "next/link";
import styles from "./SearchPopup.module.scss";
import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function SearchPopup({ query, results, loading, onLinkClick }) {
    const { locale } = useLocale();
    const messages = useMessages("searchPopup", locale);

    if (!query) return null;

    if (loading) return <div className={styles.searchPopup}><p>{messages.loading}</p></div>;

    // Собираем все результаты в один массив с типом
    const allResults = [
        ...(results.products?.map(p => ({ ...p, type: "product" })) || []),
        ...(results.categories?.map(c => ({ ...c, type: "category" })) || []),
        ...(results.brands?.map(b => ({ ...b, type: "brand" })) || []),
    ];

    const hasResults = allResults.length > 0;

    // Берем максимум 3
    const limitedResults = allResults.slice(0, 3);

    // helper для добавления языка в ссылку
    const withLocale = (path) => `/${locale}${path}`;

    return (
        <div className={styles.searchPopup}>
            {!hasResults && <p>{messages.notFound}</p>}

            {hasResults && (
                <ul className={styles.searchPopup__list}>
                    {limitedResults.map((item) => {
                        if (item.type === "product") {
                            return (
                                <li key={`product-${item.id}`}>
                                    <Link
                                        href={withLocale(`/products/${item.slug}`)}
                                        onClick={onLinkClick}
                                    >
                                        {item.translations?.[locale]?.name || messages.noTitle}
                                    </Link>
                                </li>
                            );
                        }
                        if (item.type === "category") {
                            return (
                                <li key={`category-${item.id}`}>
                                    <Link
                                        href={withLocale(`/categories/${item.slug}`)}
                                        onClick={onLinkClick}
                                    >
                                        {item.translations?.[locale]?.name || messages.noTitle}
                                    </Link>
                                </li>
                            );
                        }
                        if (item.type === "brand") {
                            return (
                                <li key={`brand-${item.id}`}>
                                    <Link
                                        href={withLocale(`/brands/${item.slug}`)}
                                        onClick={onLinkClick}
                                    >
                                        {item.name || messages.noTitle}
                                    </Link>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            )}

            {hasResults && (
                <Link
                    href={withLocale(`/search?q=${encodeURIComponent(query)}`)}
                    className={styles.searchPopup__all}
                    onClick={onLinkClick}
                >
                    {messages.showAllResults}
                </Link>
            )}
        </div>
    );
}
