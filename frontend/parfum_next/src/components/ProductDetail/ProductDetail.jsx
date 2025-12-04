'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductDetail.module.scss";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { getProductBySlug } from "@/lib/endpoints";
import { addRecentProduct } from "@/lib/recentProducts";

import { cleanHtml } from "@/utils/cleanHtml";

import { addToCart } from "@/lib/addToCart";

import { pencilColors } from "@/constants/pencilColors";

import Variations from "../Variations/Variations";
import ProductGallery from "../ProductGallery/ProductGallery";


export default  function ProductDetail({ slug }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
	const [added, setAdded] = useState(false);
	const [selectedVariation, setSelectedVariation] = useState(null);




	const variations = product?.variations || [];
	const variationsArray = typeof variations === "string"
	? product.variations.split(",").map(item => item.trim())
	: Array.isArray(product?.variations)
		? product.variations
		: [];


	const filteredColors = Object.fromEntries(
		variationsArray
			.filter(code => pencilColors[code])   // Оставляем только существующие
			.map(code => [code, pencilColors[code]])
	);


	const handleAddToCart = () => {
		addToCart(product);
		setAdded(true);
		setTimeout(() => setAdded(false), 1500);
	};

    
	useEffect(() => {
		if (!product) return;
		addRecentProduct(product);
	}, [product]);

    useEffect(() => {
        if (!slug) return;
		
        setLoading(true);
        getProductBySlug(slug)
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <p>Загрузка...</p>;
    if (!product) return <p>Продукт не найден</p>;

   
    const images = [
        product.image,
        ...(product.gallery?.map(g => g.image) ?? [])
    ];

	const hasVariations = Object.keys(filteredColors).length > 0;
	const disableBuy = hasVariations && !selectedVariation;

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
							<div className={styles.price__static}>{product.price} man</div>
						)}
						
					</div>
					
					<div className="variations">
						{Object.keys(filteredColors).length > 0 && (
							<Variations colors={filteredColors} onSelect={setSelectedVariation}/>
						)}
					</div>
					<div className={`${styles.product__btn} ${disableBuy ? styles.disabled : ''}` }  onClick={!disableBuy ? handleAddToCart : undefined} >{added ? "Добавлено" : "Купить"}</div>
					{disableBuy && <span className={styles.extra}>Выберит один из вариантов товара</span>}
					<div className={styles.product__available}>Есть в наличии!</div>
				</div>
            </div>
			{product.translations.ru.description && (
				<div className={styles.product__about}>
					<div className={styles.product__descr}>Описание</div>
					<div className={styles.product__text} dangerouslySetInnerHTML={{ __html: cleanHtml(product.translations.ru.description) }}></div>
				</div>
			)}
			
        </div>
    );
}
