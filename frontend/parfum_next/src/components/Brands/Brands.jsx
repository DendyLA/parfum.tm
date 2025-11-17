'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from './Brands.module.scss';

export default function Brands() {
	
	return (
		<div className={styles.brands}>
			<div className={styles.brands__wrapper}>
				<div className={`${styles.brands__title} title`}></div>
				<div className={styles.brands__content}>
					<div className={styles.brands__item}>
						<div className={styles.brands__letter}></div>
						<ul className={styles.brands__list}>
							<li>asad</li>
							<li>fasd</li>
							<li>dsad</li>
							<li>gasd</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
