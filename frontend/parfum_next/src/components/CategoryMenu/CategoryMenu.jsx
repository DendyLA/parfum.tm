'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Minus, ChevronDown, X } from "lucide-react";
import styles from './CategoryMenu.module.scss';
import { getCategories } from "@/lib/endpoints";

export default function CategoryMenu() {
	const [categories, setCategories] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [animate, setAnimate] = useState(false); // для плавного появления
	const [openCategories, setOpenCategories] = useState({});

  	// Получение категорий
	useEffect(() => {
		async function fetchCategories() {
			try {
				const data = await getCategories({ page: 1, pageSize: 1000 });
				// console.log("Ответ API:", data);

				// API может возвращать массив напрямую или { results: [...] }
				const items = Array.isArray(data) ? data : data.results;

				// Построение дерева категорий
				const buildTree = (items, parentId = null) =>
				items
					.filter(item => item.parent === parentId)
					.map(item => {
					const children = buildTree(items, item.id);
					return {
						name: item.translations?.ru?.name || item.slug,
						slug: item.slug,
						...(children.length ? { children } : {}),
					};
					});

				setCategories(buildTree(items));
			} catch (error) {
				console.error("Ошибка при получении категорий:", error);
			}
		}

		fetchCategories();
	}, []);

	const toggleMenu = () => {
		if (isOpen) {
			setAnimate(false);
			setTimeout(() => setIsOpen(false), 300); // дождаться конца анимации
		} else {
			setIsOpen(true);
			setTimeout(() => setAnimate(true), 10);
		}
	};

	const toggleCategory = (slug) => {
		setOpenCategories(prev => ({
			...prev,
			[slug]: !prev[slug],
		}));
	};

  	const renderCategories = (cats) => (
		<ul className={styles.subNav__wrapper}>
		{cats.map(cat => {
			const hasChildren = cat.children && cat.children.length > 0;
			const isExpanded = openCategories[cat.slug];

			return (
			<li key={cat.slug} className={styles.subNav__item}>
				<div className={styles.subNav__link}>
				<Link href={`/categories/${cat.slug}`}>{cat.name}</Link>
				{hasChildren && (
					<button
					className={styles.subNav__btn}
					onClick={() => toggleCategory(cat.slug)}
					aria-label={isExpanded ? "Скрыть подкатегории" : "Показать подкатегории"}
					>
					{isExpanded ? <Minus size={16} /> : <ChevronDown size={16} />}
					</button>
				)}
				</div>

				<ul
				className={`${styles.subNav__children} ${isExpanded ? styles.show : styles.hide}`}
				>
				{hasChildren && renderCategories(cat.children)}
				</ul>
			</li>
			);
		})}
		</ul>
	);

  return (
    <nav className={styles.nav}>
      	<div className={styles.nav__burger} onClick={toggleMenu}>
        	<Menu size={32} strokeWidth={1} />
      	</div>

		<ul className={styles.nav__wrapper}>
			{categories.map(cat => (
			<li className={styles.nav__item} key={cat.slug}>
				<Link href={`/categories/${cat.slug}`}>{cat.name}</Link>
			</li>
			))}
		</ul>

      {/* Боковое меню */}
      {isOpen && (
        <div
			className={styles.subNav}
			onClick={e => {
				if (e.target === e.currentTarget) toggleMenu();
			}}
        >
			<div className={`${styles.subNav__overlay} ${animate ? styles.subNav__overlay_open : ""}`}>
				<X
				color="#000"
				width={30}
				height={30}
				className={styles.subNav__icon}
				onClick={toggleMenu}
				/>
				<div className={styles.subNav__title}>Категории</div>
				{renderCategories(categories)}
			</div>
        </div>
      )}
    </nav>
  );
}
