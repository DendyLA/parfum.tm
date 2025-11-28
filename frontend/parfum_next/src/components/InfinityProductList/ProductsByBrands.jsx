'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProductsByBrand } from "@/lib/endpoints";
import { Skeleton } from "@mui/material";
import SkeletonList from "../SkeletonList/SkeletonList";


export default function ProductsByBrand({ brandId, filters = {} }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    // Сброс состояния при смене бренда или фильтров
    useEffect(() => {
        if (!brandId) return;
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, [brandId, filters]);

    // Загрузка следующей порции товаров
    const loadMore = useCallback(async () => {
        if (loading || !hasMore || !brandId) return;

        setLoading(true);

        try {
            const data = await getProductsByBrand({
                brandId,
                page,
                pageSize: 5,
                ...filters
            });

            // Поддержка API с results или просто массивом
            const items = Array.isArray(data.results) ? data.results : data ?? [];

            if (items.length > 0) {
                setProducts(prev => {
                    const newItems = items.filter(
                        item => !prev.some(p => p.id === item.id)
                    );
                    return [...prev, ...newItems];
                });
                setPage(prev => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Ошибка загрузки товаров:", err);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [brandId, page, filters, loading, hasMore]);

    // Intersection Observer для бесконечного скролла
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loadMore, hasMore, loading]);

    return (
        <>
            <ul className={styles.products}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                <div ref={loaderRef} style={{ height: "20px" }} />
            </ul>

            {loading && (
                 <SkeletonList count={5} />
            )}

            {!hasMore && products.length > 0 && (
                <p className={styles.products__info}>Больше товаров нет</p>
            )}

            {!hasMore && products.length === 0 && (
                <p className={styles.products__info}>Товары не найдены</p>
            )}
        </>
    );
}
