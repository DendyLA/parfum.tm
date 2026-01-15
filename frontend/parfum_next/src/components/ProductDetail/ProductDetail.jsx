'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ProductDetail.module.scss";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { getProductBySlug } from "@/lib/endpoints";
import { addRecentProduct } from "@/lib/recentProducts";
import { cleanHtml } from "@/utils/cleanHtml";
import { addToCart } from "@/lib/addToCart";
import { pencilColors } from "@/constants/pencilColors";
import Variations from "../Variations/Variations";
import ProductGallery from "../ProductGallery/ProductGallery";

export default function ProductDetail({ slug }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState(null);

    // Загружаем продукт
    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        getProductBySlug(slug)
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [slug]);

    // Добавляем продукт в недавно просмотренные
    useEffect(() => {
        if (!product) return;
        addRecentProduct(product);
    }, [product]);

    if (loading) return <p>Загрузка...</p>;
    if (!product) return <p>Продукт не найден</p>;

    // Обрабатываем вариации цвета
    const variationsArray = Array.isArray(product.variations) ? product.variations : [];
    const colorVariations = variationsArray.filter(v => v.variation_type?.code === "color" && v.is_active);

    const hasVariations = colorVariations.length > 0;
    const disableBuy = hasVariations && !selectedVariation;

    // Галерея
    const galleryImages = selectedVariation?.gallery?.length
        ? selectedVariation.gallery.map(g => g.image)
        : [
            product.image,
            ...(product.gallery?.map(g => g.image) ?? [])
        ];

    // Хлебные крошки
    const breadcrumbItems = [
        { name: "PARFUMTM", href: "/" },
        { name: product.category.translations.ru.name, href: `/categories/${product.category.slug}` },
        { name: product.translations.ru.name }
    ];

    const outOfStock = !product.count || product.count < 1;

    // Добавление в корзину
    const handleAddToCart = () => {
        if (disableBuy || outOfStock) return;

        const variationData = selectedVariation
            ? {
                id: selectedVariation.id,
                type: selectedVariation.variation_type.code,
                value: selectedVariation.value,
                color_hex: selectedVariation.color_hex
            }
            : null;

        addToCart({
            ...product,
            selectedVariation: variationData
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className={styles.product}>
            <Breadcrumbs items={breadcrumbItems} />

            <div className={styles.product__wrapper}>
                {/* Информация о продукте */}
                <div className={styles.product__info}>
                    <div className={styles.product__hit}>Лучший выбор</div>
                    <div className={styles.product__name}>{product.translations.ru.name}</div>
                    <div className={styles.product__category}>{product.category.translations.ru.name}</div>
                </div>

                {/* Галерея */}
                <div className={styles.product__gallery}>
                    <ProductGallery images={galleryImages} />
                </div>

                {/* Заказ */}
                <div className={styles.product__order}>
                    <div className={styles.price}>
                        {product.discount_price ? (
                            <>
                                <div className={styles.price__new}>{product.discount_price} man</div>
                                <div className={styles.price__old}>{product.price} man</div>
                            </>
                        ) : (
                            <div className={styles.price__static}>{product.price} man</div>
                        )}
                    </div>

                    {/* Вариации */}
                    {hasVariations && !outOfStock && (
                        <Variations
                            variations={colorVariations}
                            selected={selectedVariation}
                            onSelect={setSelectedVariation}
                        />
                    )}

                    {/* Кнопка купить */}
                    <div
                        className={`${styles.product__btn} ${disableBuy ? styles.disabled : ''}`}
                        onClick={handleAddToCart}
                    >
                        {outOfStock ? "Нет в наличии" : added ? "Добавлено" : "В корзину"}
                    </div>

                    {disableBuy && !outOfStock && <span className={styles.extra}>Выберите вариант товара</span>}
                    {!outOfStock && <div className={styles.product__available}>Есть в наличии!</div>}
                </div>
            </div>

            {/* Описание */}
            {product.translations.ru.description && (
                <div className={styles.product__about}>
                    <div className={styles.product__descr}>Описание</div>
                    <div
                        className={styles.product__text}
                        dangerouslySetInnerHTML={{ __html: cleanHtml(product.translations.ru.description) }}
                    />
                </div>
            )}
        </div>
    );
}
