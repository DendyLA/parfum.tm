'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { getCompanies } from "@/lib/endpoints";

import styles from './Brands.module.scss';

export default function Brands({ onClose }) {
  	const [companies, setCompanies] = useState([]);

	useEffect(() => {
	async function fetchCompanies() {
		const data = await getCompanies({ page: 1, pageSize: 50 });
		setCompanies(data || []); // <- используем data напрямую
	}
		fetchCompanies();
	}, []);

	

  // Группировка по первой букве
	const grouped = {};
	companies.forEach((c) => {
		const name = c.name || "";
		const firstLetter = name[0].toUpperCase();
		if (firstLetter.match(/[A-Z]/)) {
			if (!grouped[firstLetter]) grouped[firstLetter] = [];
			grouped[firstLetter].push(c);
		} else {
			if (!grouped["#"]) grouped["#"] = [];
			grouped["#"].push(c);
		}
 	 });

	const letters = Object.keys(grouped).sort((a, b) => {
		if (a === "#") return 1;
		if (b === "#") return -1;
		return a.localeCompare(b);
	});

	return (
		<div className={styles.brands} onClick={onClose}>
			<div className={styles.brands__wrapper}  onClick={(e) => e.stopPropagation()}>
				<div className={styles.brands__top}>
					<div className={`${styles.brands__title} title`}>Бренды</div>
					<div className={styles.brands__close}  onClick={onClose}><X width={30} height={30}/></div>
				</div>

				<div className={styles.brands__content}>
					{letters.map((letter) => (
					<div key={letter} className={styles.brands__item}>
						<div className={styles.brands__letter}>{letter}</div>
						<ul className={styles.brands__list}>
							{grouped[letter].map((c) => (
								<li key={c.id}>
								<Link href={`/brands/${c.slug}`} onClick={onClose}>
									{c.name}
								</Link>
								</li>
							))}
						</ul>
					</div>
					))}
				</div>
			</div>
		</div>
	);
}
