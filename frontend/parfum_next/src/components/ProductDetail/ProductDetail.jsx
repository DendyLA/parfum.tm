'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductDetail.module.scss";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { getProductBySlug } from "@/lib/endpoints";
import ProductGallery from "../ProductGallery/ProductGallery";

import { addToCart } from "@/lib/addToCart";



export default function ProductDetail({ slug }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
	const [added, setAdded] = useState(false);


	const handleAddToCart = () => {
		addToCart(product);
		setAdded(true);
		setTimeout(() => setAdded(false), 1500);
	};

    

    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        getProductBySlug(slug)
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <p>Загрузка...</p>;
    if (!product) return <p>Продукт не найден</p>;

    // ❗ Единственное добавление — собираем массив картинок
    const images = [
        product.image,
        ...(product.gallery?.map(g => g.image) ?? [])
    ];

	const breadcrumbItems = [
        { name: "PARFUMTM", href: "/" },
        { name: product.category.translations.ru.name, href: `/categories/${product.category.slug}` },
        { name: product.translations.ru.name }
    ];

	
    return (
        <div className={styles.product}>
            <Breadcrumbs items={breadcrumbItems} />
            <div className={styles.product__wrapper}>
                <div className={styles.product__info}>
					<div className={styles.product__hit}>Лучший выбор</div>
                    <div className={styles.product__name}>{product.translations.ru.name}</div>
                    <div className={styles.product__category}>{product.category.translations.ru.name}</div>
                </div>
                <div className={styles.product__gallery}>

                    {/* ❗ Передаём изображения в галерею */}
                    <ProductGallery images={images} />

                </div>
                <div className={styles.product__order}>
					<div className={styles.price}>
						{product.discount_price ? (
							<>
								<div className={styles.price__new}>{product.discount_price} man</div>
								<div className={styles.price__old}>{product.price} man</div>
							</>
						) : (
							<div className={styles.price__static}>{product.price}</div>
						)}
						
					</div>
					<div className="variations"></div>
					<div className={styles.product__btn }  onClick={handleAddToCart}>{added ? "Добавлено" : "Купить"}</div>
					<div className={styles.product__available}>Есть в наличии!</div>
				</div>
            </div>
			<div className="product__about">
				
			</div>
        </div>
    );
}
