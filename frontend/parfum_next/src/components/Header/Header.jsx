"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { Search, ShoppingBasket } from "lucide-react";

import CategoryMenu from "../CategoryMenu/CategoryMenu";
import Cart from "../Cart/Cart";
import SearchPopup from "../Search/SearchPopup";
import { useSearch } from "@/hooks/useSearch";

import styles from './Header.module.scss';




export default function Header() {
	const [isCartOpen, setIsCartOpen] = useState(false); 
	const { query, setQuery, results, loading } = useSearch();
	const [active, setActive] = useState(false);
	const searchRef = useRef(null);

	const handleCartToggle = () => setIsCartOpen(!isCartOpen);
	const handleCartClose = () => setIsCartOpen(false);

	// Закрытие попапа при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Закрытие попапа при клике на ссылку внутри него
    const handleLinkClick = () => {
        setActive(false);
    };
	
	return (
		<header className={styles.header}>
			<div className="container">
				<div className={styles.header__top}>
					<div className={styles.features}>100% оригинальная продукция</div>
					<div className={styles.actions}>
						<ul className={styles.actions__list}>
							<li className={styles.actions__item}><Link className="link-extra" href="">Акции</Link></li>
							<li className={styles.actions__item}><Link className="link" href="">Доставка и оплата</Link></li>
							<li className={styles.actions__item}><Link className="link" href="">Про магазин</Link></li>
						</ul>
					</div>
					<div className={styles.lang}>
						<ul className={styles.lang__list}>
							<li className={styles.lang__item}>
								<Link className="link" href="">Рус</Link>
							</li>
							<li className={`${styles.lang__item} ${styles.active}`}>
								<Link className="link" href="">Ткм</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className={`${styles.header__middle}`} >
					<div className={`${styles.header__search} ${active ? styles.active : ""}`} ref={searchRef}>
						<div className={`${styles.search__btn} link-icon`} onClick={() => setActive((prev) => !prev)}>
							<Search size={32} strokeWidth={1} absoluteStrokeWidth />
							</div>
						<form action="" className={`${styles.search__form} ${active ? `${styles.active} ${'animate-slide-in-left'}`  : ""}`}>
							<input type="text" value={query}  onChange={(e) => setQuery(e.target.value)} name="search" id="search" className={styles.search__input} placeholder="Больше 60 000 товаров"/>
							<div className={`${styles.search__popup} ${active ? `${styles.active} ${'animate-slide-in-left'}`  : ""}`}>
								<SearchPopup
									query={query}
									results={results}
									loading={loading}
									onLinkClick={handleLinkClick}
								/>
							</div>
							
						</form>
					</div>
					<div className={`${styles.header__logo}`}>
						<Link className="link" href="/"><Image src="/images/logo/logo.svg" alt="Company Logo" width={180} height={60} priority/></Link>
					</div>
					<div className={`${styles.header__basket} link-icon`} onClick={handleCartToggle}>
						<ShoppingBasket size={32} strokeWidth={1} absoluteStrokeWidth />
						{/* <div className={styles.header__basket_num}>{ cart.length }</div> */}
					</div>
				</div>

				<CategoryMenu/>
			</div>
			{/* Корзина */}
			{isCartOpen && <Cart onClose={handleCartClose} />}
		</header>
	)

}