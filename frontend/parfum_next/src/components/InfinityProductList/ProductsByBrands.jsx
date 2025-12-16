'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProductsByBrand } from "@/lib/endpoints";
import SkeletonList from "../SkeletonList/SkeletonList";

export default function ProductsByBrand({ brandId, filters = {} }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);
    const pageRef = useRef(1);
    const initializedRef = useRef(false);
    const requestIdRef = useRef(0);
	const filtersKey = JSON.stringify(filters);

    // ============================
    // СБРОС ПРИ СМЕНЕ БРЕНДА / ФИЛЬТРОВ
    // ============================
    useEffect(() => {
        if (!brandId) return;

        pageRef.current = 1;
        requestIdRef.current++;
        initializedRef.current = false;

        setProducts([]);
        setHasMore(true);
    }, [brandId, filtersKey]);

    // ============================
    // ЗАГРУЗКА
    // ============================
    const loadMore = useCallback(async () => {
        if (!brandId || loading || !hasMore) return;

        const currentRequestId = ++requestIdRef.current;
        setLoading(true);

        try {
            const data = await getProductsByBrand({
                brandId,
                page: pageRef.current,
                pageSize: 5,
                ...filters
            });

            if (currentRequestId !== requestIdRef.current) return;

            const items = Array.isArray(data?.results)
                ? data.results
                : Array.isArray(data)
                ? data
                : [];

            if (items.length === 0) {
                setHasMore(false);
                return;
            }

            setProducts(prev => [...prev, ...items]);
            pageRef.current += 1;
            initializedRef.current = true;
        } catch (e) {
            console.error("Ошибка загрузки товаров:", e);
            setHasMore(false);
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [brandId, filtersKey, loading, hasMore]);

    // ============================
    // 🔥 ПЕРВАЯ ЗАГРУЗКА — ЯВНО
    // ============================
    useEffect(() => {
        if (!brandId) return;
        loadMore();
    }, [brandId, filtersKey, loadMore]);

    // ============================
    // INFINITE SCROLL (ТОЛЬКО ПОСЛЕ ПЕРВОЙ ЗАГРУЗКИ)
    // ============================
    useEffect(() => {
        if (!loaderRef.current || !initializedRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <>
            <ul className={styles.products}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ul>

            {hasMore && <div ref={loaderRef} style={{ height: 20 }} />}

            {loading && <SkeletonList count={5} />}

            {!hasMore && products.length > 0 && (
                <p className={styles.products__info}>Больше товаров нет</p>
            )}

            {!hasMore && products.length === 0 && (
                <p className={styles.products__info}>Товары не найдены</p>
            )}
        </>
    );
}
