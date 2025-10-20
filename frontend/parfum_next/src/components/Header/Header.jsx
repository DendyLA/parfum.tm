"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
				<div className="header__middle">

				</div>
			</div>
			
		</header>
	)

}