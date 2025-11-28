'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./InfinityProductsList.module.scss";
import { getProducts, getCategoryTree } from "@/lib/endpoints";

export default function ProductsByCategory({ categoryId, filters = {} }) {
    const [products, setProducts] = useState([]);
    const [queue, setQueue] = useState([]);        // [{ id: 23, page: 1 }, ...]
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    const flattenTree = (node) => {
        let result = [node.id];
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                result = result.concat(flattenTree(child));
            });
        }
        return result;
    };

    // Сброс при смене категории
    useEffect(() => {
        if (!categoryId) return;

        setProducts([]);
        setQueue([]);
        setHasMore(true);

        getCategoryTree(categoryId)
            .then(tree => {
                const ids = flattenTree(tree);
                if (ids.length === 0) {
                    setHasMore(false);
                    return;
                }
                setQueue(ids.map(id => ({ id, page: 1 })));
            })
            .catch(err => {
                console.error("Ошибка дерева категорий:", err);
                setHasMore(false);
            });
    }, [categoryId, filters]);

    // Загрузка товаров
    const loadMore = useCallback(async () => {
        if (loading || queue.length === 0) return;

        setLoading(true);
        const current = queue[0];
        if (!current) {
            setLoading(false);
            return;
        }

        try {
            const data = await getProducts({
                page: current.page,
                pageSize: 10,
                category: current.id,
                ...filters
            });

            if (Array.isArray(data) && data.length > 0) {
                setProducts(prev => {
                    const newItems = data.filter(item => !prev.some(p => p.id === item.id));
                    return [...prev, ...newItems];
                });

                // Увеличиваем страницу
                setQueue(prev => {
                    const updated = [...prev];
                    if (updated[0]) updated[0] = { ...updated[0], page: updated[0].page + 1 };
                    return updated;
                });
            } else {
                // Если пустой массив, убираем категорию из очереди
                setQueue(prev => prev.slice(1));
            }
        } catch (err) {
            console.warn(`Ошибка загрузки категории ${current.id}, страница ${current.page}`);
            setQueue(prev => prev.slice(1));
        } finally {
            setLoading(false);
        }
    }, [queue, filters, loading]);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading && queue.length > 0) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loadMore, loading, queue]);

    // Автозагрузка при появлении новой очереди
    useEffect(() => {
        if (!loading && queue.length > 0) {
            loadMore();
        }
    }, [queue]);

    // hasMore = false, если очередь пустая и загрузка закончена
    useEffect(() => {
        if (queue.length === 0 && !loading) {
            setHasMore(false);
        }
    }, [queue, loading]);

    const showNoProducts = !loading && products.length === 0 && !hasMore;

    return (
        <>
            <ul className={styles.products}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                <div ref={loaderRef} style={{ height: "20px" }} />
            </ul>

            {loading && (
                <div style={{ padding: "40px 0", textAlign: "center" }}>
                    Загрузка товаров...
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <p className={styles.products__info}>Больше товаров нет</p>
            )}

            {showNoProducts && (
                <p className={styles.products__info}>Товары не найдены</p>
            )}
        </>
    );
}
