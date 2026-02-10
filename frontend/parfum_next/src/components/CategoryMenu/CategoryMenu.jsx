'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Minus, ChevronDown, X } from "lucide-react";
import styles from './CategoryMenu.module.scss';
import { getCategories } from "@/lib/endpoints";
import Brands from "../Brands/Brands";
import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function CategoryMenu() {
  const { locale } = useLocale();
  const messages = useMessages("categoryMenu", locale);

  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // 👉 helper: добавляет язык в URL
  const withLocale = (path) => `/${locale}${path}`;

  async function fetchAllCategories() {
    let page = 1;
    const pageSize = 50;
    let all = [];
    let hasMore = true;

    while (hasMore) {
      const data = await getCategories({ page, pageSize });
      const items = Array.isArray(data) ? data : data.results;
      all = [...all, ...items];

      if (!items || items.length < pageSize) hasMore = false;
      else page += 1;
    }

    return all;
  }

  const buildTree = (items, parentId = null) =>
    items
      .filter(item => item.parent === parentId)
      .map(item => {
        const children = buildTree(items, item.id);
        return {
          name: item.translations?.[locale]?.name || item.slug,
          slug: item.slug,
          ...(children.length ? { children } : {}),
        };
      });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const items = await fetchAllCategories();
        setCategories(buildTree(items));
      } catch (error) {
        console.error("Ошибка категорий:", error);
      }
    }

    fetchCategories();
  }, [locale]);

  useEffect(() => {
    document.body.style.overflow = isOpen || brandsOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, brandsOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      setAnimate(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(true);
      setTimeout(() => setAnimate(true), 10);
    }
  };

  const toggleCategory = slug => {
    setOpenCategories(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const renderCategories = cats => (
    <ul className={styles.subNav__wrapper}>
      {cats.map(cat => {
        const hasChildren = cat.children?.length;
        const isExpanded = openCategories[cat.slug];

        return (
          <li key={cat.slug} className={styles.subNav__item}>
            <div className={styles.subNav__link}>
              <Link
                href={withLocale(`/categories/${cat.slug}`)}
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>

              {hasChildren && (
                <button
                  className={styles.subNav__btn}
                  onClick={() => toggleCategory(cat.slug)}
                  aria-label={isExpanded ? messages.hide : messages.show}
                >
                  {isExpanded ? <Minus size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>

            {hasChildren && (
              <ul className={`${styles.subNav__children} ${isExpanded ? styles.show : styles.hide}`}>
                {renderCategories(cat.children)}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (!isClient) return null;

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <Menu size={32} strokeWidth={1} />
      </div>

      <ul className={styles.nav__wrapper}>
        {categories.map(cat => (
          <li className={styles.nav__item} key={cat.slug}>
            <Link href={withLocale(`/categories/${cat.slug}`)}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="nav__brands">
        <li className={styles.nav__item} onClick={() => setBrandsOpen(true)}>
          {messages.brands}
        </li>
      </ul>

      {brandsOpen && <Brands onClose={() => setBrandsOpen(false)} />}

      {isOpen && (
        <div
          className={styles.subNav}
          onClick={e => e.target === e.currentTarget && toggleMenu()}
        >
          <div className={`${styles.subNav__overlay} ${animate ? styles.subNav__overlay_open : ""}`}>
            <X className={styles.subNav__icon} onClick={toggleMenu} />
            <div className={styles.subNav__title}>{messages.categories}</div>
            {renderCategories(categories)}
          </div>
        </div>
      )}
    </nav>
  );
}
