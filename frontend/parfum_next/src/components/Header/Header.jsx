'use client';

import React, { useState, useEffect, useRef } from "react"; // добавили useEffect
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBasket } from "lucide-react";

import CategoryMenu from "../CategoryMenu/CategoryMenu";
import Cart from "../Cart/Cart";
import SearchPopup from "../Search/SearchPopup";
import { useSearch } from "@/hooks/useSearch";
import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleContext";

import styles from './Header.module.scss';

export default function Header() {
  const { locale, setLocale } = useLocale();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { query, setQuery, results, loading } = useSearch();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const messages = useMessages("header", locale);

  const handleCartToggle = () => setIsCartOpen(prev => !prev);
  const handleCartClose = () => setIsCartOpen(false);

  // закрытие попапа при клике снаружи
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setSearchOpen(false);
    setQuery('');
  };

  const switchLocale = (newLocale) => {
    const segments = pathname.split('/');
    if (segments[1] === 'ru' || segments[1] === 'tk') {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    setLocale(newLocale);
    router.push(segments.join('/') || '/');
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.header__top}>
          <div className={styles.features}>{messages.features}</div>
          <div className={styles.actions}>
            <ul className={styles.actions__list}>
              {messages.actions?.map((action, i) => (
                <li key={i} className={styles.actions__item}>
                  <Link href={`/${locale}/${action.href}`} className={i === 0 ? "link-extra" : "link"}>
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.lang}>
            <ul className={styles.lang__list}>
              <li className={`${styles.lang__item} ${locale === 'ru' ? styles.active : ''}`}>
                <button onClick={() => switchLocale('ru')} className="link">
                  {messages.languages?.[0] || "Рус"}
                </button>
              </li>
              <li className={`${styles.lang__item} ${locale === 'tk' ? styles.active : ''}`}>
                <button onClick={() => switchLocale('tk')} className="link">
                  {messages.languages?.[1] || "Tkm"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.header__middle}>

          	<div className={styles.header__search} ref={searchRef}>
				<div className={styles.search__wrapper}>
					<input
						type="text"
						value={query}
						onChange={e => {
							setQuery(e.target.value);
							setSearchOpen(true);
						}}
						onFocus={() => setSearchOpen(true)}
						name="search"
						id="search"
						className={styles.search__input}
						placeholder={messages.searchPlaceholder}
					/>
					{query && (
						<button
							className={styles.search__clear}
							onClick={() => {
								setQuery('');
								setSearchOpen(false);
							}}
							type="button"
						>
							×
						</button>
					)}
				</div>
				{searchOpen && query && (
					<div className={styles.search__popup}>
						<SearchPopup
							query={query}
							results={results}
							loading={loading}
							onLinkClick={handleLinkClick}
						/>
					</div>
				)}
			</div>

          <div className={styles.header__logo}>
            <Link href="/" className="link">
              <Image src="/images/logo/logo.svg" alt="Company Logo" width={180} height={60} priority />
            </Link>
          </div>

          <div className={`${styles.header__basket} link-icon`} onClick={handleCartToggle}>
            <ShoppingBasket size={32} strokeWidth={1} absoluteStrokeWidth />
          </div>
        </div>

        <CategoryMenu />
      </div>

      {isCartOpen && <Cart onClose={handleCartClose} />}
    </header>
  );
}