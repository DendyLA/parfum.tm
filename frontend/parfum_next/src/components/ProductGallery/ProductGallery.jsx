
'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useFancybox from "@/hooks/useFancybox";
import "./ProductGallery.scss";

export default function ProductGallery({ images = [] }) {
	const [fancyboxRef] = useFancybox();
	const swiperRef = useRef(null);

	// Сброс слайда при смене images
	useEffect(() => {
		if (swiperRef.current) {
		swiperRef.current.slideTo(0, 0); // перейти на первый слайд без анимации
		}
	}, [images]);

	if (!images.length) return null;

	return (
		<div className="gallery" ref={fancyboxRef}>
		<Swiper
			onSwiper={(swiper) => (swiperRef.current = swiper)}
			modules={[Navigation]}
			slidesPerView={1}
			navigation={{
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			}}
			style={{ position: 'relative' }}
		>
			{images.map((img, index) => (
			<SwiperSlide key={index}>
				<a data-fancybox href={img}>
				<Image
					src={img}
					alt={`Product ${index}`}
					width={600}
					height={600}
					style={{
					width: '100%',
					height: 'auto',
					objectFit: 'contain',
					borderRadius: '10px',
					}}
				/>
				</a>
			</SwiperSlide>
			))}

			{/* Стрелки */}
			<div className="swiper-button-prev" />
			<div className="swiper-button-next" />
		</Swiper>
		</div>
	);
}
