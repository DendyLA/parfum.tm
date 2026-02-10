// 'use client';

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import  "./ProductGallery.scss";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { FreeMode } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/free-mode";


// import useFancybox from "@/hooks/useFancybox";
// export default function ProductGallery({ images = [] }) {
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [fancyboxRef] = useFancybox();

//     if (!images.length) return null;

//     return (
//         <div className='gallery'>
//             {/* Главное фото */}
//             <div ref={fancyboxRef} style={{ textAlign: "center" }}>
//                 <a data-fancybox href={images[activeIndex]}>
//                     <Image
//                         src={images[activeIndex]}
//                         alt="Main product image"
//                         width={500}
//                         height={500}
//                         style={{
//                             borderRadius: "10px",
//                             objectFit: "contain",
//                             maxHeight: "500px",
//                         }}
//                     />
//                 </a>
//             </div>

//             {/* Мини-карусель */}
//             <Swiper
//                 slidesPerView={Math.min(images.length, 5)}
//                 spaceBetween={10}
//                 freeMode
//                 modules={[FreeMode]}
//                 style={{ marginTop: 20 }}
//             >
//                 {images.map((img, index) => (
//                     <SwiperSlide key={img}>
//                         <div
//                             onClick={() => setActiveIndex(index)}
//                             style={{
//                                 cursor: "pointer",
//                                 border:
//                                     activeIndex === index
//                                         ? "2px solid #000"
//                                         : "1px solid #ccc",
//                                 borderRadius: 8,
//                             }}
//                         >
//                             <Image
//                                 src={img}
//                                 alt={`Thumb ${index}`}
//                                 width={70}
//                                 height={70}
//                                 style={{
//                                     objectFit: "cover",
//                                     opacity: activeIndex === index ? 1 : 0.6,
//                                 }}
//                             />
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     );
// }


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
