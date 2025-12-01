'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import  "./ProductGallery.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";


import useFancybox from "@/hooks/useFancybox";

export default function ProductGallery({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [fancyboxRef] = useFancybox();

    return (
        <div className='gallery'>
            {/* Главное фото */}
            <div ref={fancyboxRef} style={{ textAlign: "center" }}>
                <a
                    data-fancybox
                    href={images[activeIndex]}   // 👉 Fancybox показывает только текущее фото
                >
                    <Image
                        src={images[activeIndex]}
                        alt="Main product image"
                        width={500}
                        height={500}
                        style={{
                            borderRadius: "10px",
                            objectFit: "contain",
                            maxHeight: "500px",
                        }}
                    />
                </a>
            </div>

            {/* Мини-карусель */}
            <Swiper
                slidesPerView={images.length > 5 ? 5 : images.length}
                spaceBetween={10}
                freeMode
                modules={[FreeMode]}
                style={{ marginTop: 20 }}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div
                            onClick={() => setActiveIndex(index)}
                            style={{
                                cursor: "pointer",
                                border:
                                    activeIndex === index
                                        ? "2px solid #000"
                                        : "1px solid #ccc",
                                borderRadius: 8,
                                width: 'auto',
                            }}
                        >
                            <Image
                                src={img}
                                alt={`Thumb ${index}`}
                                width={70}
                                height={70}
                                style={{
                                    objectFit: "cover",
                                    opacity: activeIndex === index ? 1 : 0.6,
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
