// app/search/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/endpoints";
import Link from "next/link";

export default function SearchPage() {
    const params = useSearchParams();
    const query = params.get("q") || "";
    const lang = "ru"; // язык по умолчанию

    const [results, setResults] = useState({ products: [], categories: [], brands: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await searchProducts(query, 1000); // full search
                setResults(data);
            } catch (err) {
                console.error(err);
                setResults({ products: [], categories: [], brands: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    return (
        <div>
            <h1>Результаты поиска по "{query}"</h1>

            {loading && <p>Загрузка...</p>}

            {!loading && (
                <>
                    <section>
                        <h2>Товары</h2>
                        {results.products.length > 0 ? (
                            <ul>
                                {results.products.map(p => (
                                    <li key={p.id}>
                                        <Link href={`/product/${p.slug}`}>
                                            {p.translations?.[lang]?.name || "Без названия"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>Нет товаров</p>}
                    </section>

                    <section>
                        <h2>Категории</h2>
                        {results.categories.length > 0 ? (
                            <ul>
                                {results.categories.map(c => (
                                    <li key={c.id}>
                                        <Link href={`/category/${c.slug}`}>
                                            {c.translations?.[lang]?.name || "Без названия"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>Нет категорий</p>}
                    </section>

                    <section>
                        <h2>Бренды</h2>
                        {results.brands.length > 0 ? (
                            <ul>
                                {results.brands.map(b => (
                                    <li key={b.id}>
                                        <Link href={`/brand/${b.slug}`}>
                                            {b.name || "Без названия"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>Нет брендов</p>}
                    </section>
                </>
            )}
        </div>
    );
}
