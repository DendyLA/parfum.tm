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
import Variations from "../Variations/Variations";
import ProductGallery from "../ProductGallery/ProductGallery";

export default function ProductDetail({ slug, locale = 'ru' }) {
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

  // Все активные вариации
  const variationsArray = Array.isArray(product.variations)
    ? product.variations.filter(v => v.is_active)
    : [];
  const hasVariations = variationsArray.length > 0;
  const disableBuy = hasVariations && !selectedVariation;

  // Галерея
  const galleryImages = selectedVariation?.gallery?.length
    ? selectedVariation.gallery.map(g => g.image)
    : [
        product.image,
        ...(product.gallery?.map(g => g.image) ?? [])
      ];

  // Хлебные крошки с проверкой null
  const breadcrumbItems = [
    { name: "PARFUMTM", href: "/" },
    {
      name: product.category?.translations?.[locale]?.name || "Без категории",
      href: product.category ? `/categories/${product.category.slug}` : "#"
    },
    { name: product.translations?.[locale]?.name || "Без названия" }
  ];

  const outOfStock = !product.count || product.count < 1;

  // Добавление в корзину
  const handleAddToCart = () => {
    if (disableBuy || outOfStock) return;

    const variationData = selectedVariation
      ? {
          id: selectedVariation.id,
          type: selectedVariation.variation_type?.code || "",
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
          <div className={styles.product__name}>
            {product.translations?.[locale]?.name || "Без названия"}
          </div>
          <div className={styles.product__category}>
            {product.category?.translations?.[locale]?.name || "Без категории"}
          </div>
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
              variations={variationsArray}
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

          {/* Подсказка если не выбрана вариация */}
          {disableBuy && !outOfStock && (
            <span className={styles.extra}>Выберите вариант товара</span>
          )}

          {!outOfStock && <div className={styles.product__available}>Есть в наличии!</div>}
        </div>
      </div>

      {/* Описание */}
      {product.translations?.[locale]?.description && (
        <div className={styles.product__about}>
          <div className={styles.product__descr}>Описание</div>
          <div
            className={styles.product__text}
            dangerouslySetInnerHTML={{ __html: cleanHtml(product.translations[locale].description) }}
          />
        </div>
      )}
    </div>
  );
}
