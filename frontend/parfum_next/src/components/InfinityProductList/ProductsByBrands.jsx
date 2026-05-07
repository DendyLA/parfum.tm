'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProductsByBrand } from "@/lib/endpoints";
import SkeletonList from "../SkeletonList/SkeletonList";
import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function ProductsByBrand({ brandId, filters = {} }) {
    const { locale } = useLocale();
    const messages = useMessages("productsByBrand", locale);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);
    const pageRef = useRef(1);
    const requestIdRef = useRef(0);
    const loadingRef = useRef(false);   // ✅ ref-копия loading
    const hasMoreRef = useRef(true);    // ✅ ref-копия hasMore

    const filtersKey = JSON.stringify(filters);

    // ============================
    // СБРОС
    // ============================
    useEffect(() => {
        if (!brandId) return;
        pageRef.current = 1;
        requestIdRef.current++;
        loadingRef.current = false;
        hasMoreRef.current = true;
        setProducts([]);
        setHasMore(true);
        setLoading(false);
    }, [brandId, filtersKey]);

    // ============================
    // ЗАГРУЗКА
    // ============================
    const loadMore = useCallback(async () => {
        // ✅ Читаем из ref, не из state — нет лишних зависимостей
        if (!brandId || loadingRef.current || !hasMoreRef.current) return;

        const currentRequestId = ++requestIdRef.current;
        loadingRef.current = true;
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
                hasMoreRef.current = false;
                setHasMore(false);
                return;
            }

            setProducts(prev => [...prev, ...items]);
            pageRef.current += 1;

        } catch (e) {
            console.error("Ошибка загрузки товаров:", e);
            hasMoreRef.current = false;
            setHasMore(false);
        } finally {
            if (currentRequestId === requestIdRef.current) {
                loadingRef.current = false;
                setLoading(false);
            }
        }
    }, [brandId, filtersKey]); // ✅ только стабильные зависимости

    // первая загрузка
    useEffect(() => {
        if (!brandId) return;
        loadMore();
    }, [brandId, filtersKey, loadMore]);

    // infinite scroll
    useEffect(() => {
        const el = loaderRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) loadMore();
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
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
                <p className={styles.products__info}>{messages.noMoreProducts}</p>
            )}
            {!hasMore && products.length === 0 && (
                <p className={styles.products__info}>{messages.noProducts}</p>
            )}
        </>
    );
}