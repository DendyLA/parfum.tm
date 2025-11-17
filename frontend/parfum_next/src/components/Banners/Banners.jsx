'use client'

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./Banners.module.scss";

export default function Banners({ slides = [] }) {
   // Если есть акции — используем их, иначе — fallback
	const items = slides?.map((promo) => ({
		id: promo.id,
		title: promo.translations?.title || "Promo",
		image: promo.image,
		link: promo.translations?.link || "#",
	})) || []; // пустой массив, если slides нет


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
							<Skeleton
								variant="rectangular"
								animation="wave"
								width="100%"
								height="100%"
								sx={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								borderRadius: "12px",
								zIndex: 2,
								}}
							/>
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
