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

import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleContext";

export default function ProductDetail({ slug }) {
  const { locale } = useLocale();
  const t = useMessages("productDetail", locale);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then(data => setProduct(data))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    addRecentProduct(product);
  }, [product]);

  if (loading) return <p>{t.loading}</p>;
  if (!product) return <p>{t.notFound}</p>;

  const variationsArray = Array.isArray(product.variations)
    ? product.variations.filter(v => v.is_active)
    : [];

  const hasVariations = variationsArray.length > 0;
  const disableBuy = hasVariations && !selectedVariation;

  const galleryImages = selectedVariation?.gallery?.length
    ? selectedVariation.gallery.map(g => g.image)
    : [
        product.image,
        ...(product.gallery?.map(g => g.image) ?? [])
      ];

  const breadcrumbItems = [
    { name: "PARFUMTM", href: `/${locale}` },
    {
      name: product.category?.translations?.[locale]?.name || t.noCategory,
      href: product.category ? `/${locale}/categories/${product.category.slug}` : "#"
    },
    { name: product.translations?.[locale]?.name || t.noTitle }
  ];

  const outOfStock = !product.count || product.count < 1;

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
    }, locale);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={styles.product}>
      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.product__wrapper}>
        <div className={styles.product__info}>
          <div className={styles.product__hit}>{t.bestChoice}</div>

          <div className={styles.product__name}>
            {product.translations?.[locale]?.name || t.noTitle}
          </div>

          <div className={styles.product__category}>
            {product.category?.translations?.[locale]?.name || t.noCategory}
          </div>
        </div>

        <div className={styles.product__gallery}>
          <ProductGallery images={galleryImages} />
        </div>

        <div className={styles.product__order}>
          <div className={styles.price}>
            {product.discount_price ? (
              <>
                <div className={styles.price__new}>
                  {product.discount_price} {t.currency}
                </div>
                <div className={styles.price__old}>
                  {product.price} {t.currency}
                </div>
              </>
            ) : (
              <div className={styles.price__static}>
                {product.price} {t.currency}
              </div>
            )}
          </div>

          {hasVariations && !outOfStock && (
            <Variations
              variations={variationsArray}
              selected={selectedVariation}
              onSelect={setSelectedVariation}
            />
          )}

          <div
            className={`${styles.product__btn} ${disableBuy ? styles.disabled : ''}`}
            onClick={handleAddToCart}
          >
            {outOfStock
              ? t.outOfStock
              : added
                ? t.added
                : t.addToCart}
          </div>

          {disableBuy && !outOfStock && (
            <span className={styles.extra}>{t.chooseVariation}</span>
          )}

          {!outOfStock && (
            <div className={styles.product__available}>
              {t.inStock}
            </div>
          )}
        </div>
      </div>

      {product.translations?.[locale]?.description && (
        <div className={styles.product__about}>
          <div className={styles.product__descr}>{t.description}</div>
          <div
            className={styles.product__text}
            dangerouslySetInnerHTML={{
              __html: cleanHtml(product.translations[locale].description)
            }}
          />
        </div>
      )}
    </div>
  );
}
