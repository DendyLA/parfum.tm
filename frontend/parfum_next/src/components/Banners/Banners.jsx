'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './Banners.module.scss';

export default function Banners({ slides = [] }) {
	const items = slides.length ? slides : [
		{ id: 1, title: "Slide 1", image: "/images/banners/promo_1.jpg" },
		{ id: 2, title: "Slide 2", image: "/images/banners/promo_2.jpg" },
		{ id: 3, title: "Slide 3", image: "/images/banners/promo_3.jpg" },
	];

	const [loadedImages, setLoadedImages] = useState({});

	const handleImageLoad = (id) => {
		setLoadedImages((prev) => ({ ...prev, [id]: true }));
	};

	return (
		<div className={styles.banner}>
			<Swiper
				modules={[Navigation, Pagination, Autoplay, A11y]}
				spaceBetween={20}
				slidesPerView={1}
				loop={true}
				navigation={true}
				pagination={{ clickable: true }}
				autoplay={{ delay: 4000, disableOnInteraction: false }}
				className={styles.slider}
			>
				{items.map((it) => (
					<SwiperSlide key={it.id || it.title} className={styles.slide}>
						<Link href="">
							<div className={styles.imageWrapper}>
								{/* Скелетон */}
								{!loadedImages[it.id] && (
									<div className='skeleton'></div>
								)}

								<Image
									src={typeof it === "string" ? it : it.image}
									alt={it.title || "slide"}
									fill
									style={{
										objectFit: "cover",
										opacity: loadedImages[it.id] ? 1 : 0,
										transition: "opacity 0.5s ease",
									}}
									sizes="100%"
									priority
									onLoad={() => handleImageLoad(it.id)}
								/>
							</div>
						</Link>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
