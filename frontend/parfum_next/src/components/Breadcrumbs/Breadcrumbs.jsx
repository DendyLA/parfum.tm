// components/Breadcrumbs.jsx
'use client';

import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

export default function Breadcrumbs({ items }) {
	if (!items || items.length === 0) return null;

	return (
		<nav className={styles.breadcrumbs} aria-label="breadcrumb">
			<ol>
				{items.map((item, index) => (
				<li key={index}>
					{item.href ? (
					<Link href={item.href}>{item.name}</Link>
					) : (
					<span>{item.name}</span> // текущая страница
					)}
					{index < items.length - 1 && <span className={styles.separator}> / </span>}
				</li>
				))}
			</ol>
		</nav>
	);
}
