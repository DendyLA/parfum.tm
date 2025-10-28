"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Search, ShoppingBasket } from "lucide-react";

import CategoryMenu from "../CategoryMenu/CategoryMenu";

import styles from './Header.module.scss';





export default function Header() {

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

				<div className={`${styles.header__middle}`}>
					<div className={`${styles.header__search}`}>
						<div className={`${styles.search__btn} link-icon`}>
							<Search size={32} strokeWidth={1} absoluteStrokeWidth />
							</div>
						<form action="" className='search__form'>
							<input type="text" name="search" id="search" className='search__input' placeholder="Больше 60 000 товаров"/>
							<label htmlFor="search"></label>
						</form>
					</div>
					<div className={`${styles.header__logo}`}>
						<Link className="link" href=""><Image src="/images/logo/logo.svg" alt="Company Logo" width={180} height={60} priority/></Link>
					</div>
					<div className={`${styles.header__basket} link-icon`}>
						<ShoppingBasket size={32} strokeWidth={1} absoluteStrokeWidth />
					</div>
				</div>

				<CategoryMenu/>
			</div>
			
		</header>
	)

}