'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import styles from "./ProductDetail.module.scss";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { getProductBySlug } from "@/lib/endpoints";


// Импортируем только необходимые стили Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

// Импорт Fancybox CSS — оставляем только рабочий путь
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// Импорт компонентов
import { Fancybox } from '@fancyapps/ui';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';



export default function ProductDetail({ slug }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

	const breadcrumbItems = [
		{ name: "PARFUMTM", href: "/" },
		{ name: "", href: `/category/` },
		{ name: '' } // текущее имя категории
	];

	useEffect(() => {
        if (!slug) return;

        setLoading(true);
        getProductBySlug(slug)
            .then(data => setProduct(data))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <p>Загрузка...</p>;
    if (!product) return <p>Продукт не найден</p>;



	
	console.log(product)
	return (
		<div className="product">
			<Breadcrumbs items={breadcrumbItems}/>
			<div className="product__wrapper">
				<div className="product__info">
					<div className="product__name"></div>
					<div className="product__category"></div>
				</div>
				<div className="product__gallery">
					{/* Основное фото */}
					<div className="main-image" style={{ textAlign: 'center' }}>
						{images[activeIndex] && (
						<a data-fancybox="gallery" href={images[activeIndex]}>
							<Image
							src={images[activeIndex]}
							alt={`Product ${activeIndex}`}
							width={500}
							height={500}
							style={{ borderRadius: '10px', objectFit: 'contain' }}
							/>
						</a>
						)}
					</div>

					{/* Мини-карусель */}
					<Swiper
						slidesPerView={images.length > 5 ? 5 : images.length}
						spaceBetween={10}
						freeMode={true}
						watchSlidesProgress
						modules={[FreeMode, Thumbs]}
						style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}
					>
						{images.map((img, index) => (
						<SwiperSlide key={index} onClick={() => setActiveIndex(index)}>
							<Image
							src={img}
							alt={`Thumb ${index}`}
							width={activeIndex === index ? 80 : 60}
							height={activeIndex === index ? 80 : 60}
							/>
						</SwiperSlide>
						))}
					</Swiper>
				</div>
				<div className="product__order"></div>
			</div>
		</div>
	);
}
