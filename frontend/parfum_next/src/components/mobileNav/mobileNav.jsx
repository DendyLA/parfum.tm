'use client';

import { useState, useEffect } from "react";
import { Home, Search, ShoppingBasket, Menu } from "lucide-react";
import Link from "next/link";
import styles from "./MobileNav.module.scss";
import SearchPopup from "../Search/SearchPopup";
import CategoryMenu from "../CategoryMenu/CategoryMenu";
import Cart from "../Cart/Cart";
import { searchProducts } from "@/lib/endpoints"; // ✅ реальная функция поиска

export default function MobileNav() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], categories: [], brands: [] });
  const [loading, setLoading] = useState(false);

  const [showCart, setShowCart] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchClick = () => {
    if (mounted && isMobile) setShowSearch(true);
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults({ products: [], categories: [], brands: [] });
  };

  // 🔎 поиск с дебаунсом
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults({ products: [], categories: [], brands: [] });
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery, 3, false); // лимит 3
        setSearchResults(results);
      } catch (err) {
        console.error("Ошибка поиска:", err);
        setSearchResults({ products: [], categories: [], brands: [] });
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <div className={styles.mobileNav}>
        <Link href="/" className={styles.navButton}>
          <Home size={24} />
        </Link>

        <button className={styles.navButton} onClick={handleSearchClick}>
          <Search size={24} />
        </button>

        <button className={styles.navButton} onClick={() => setShowCategories(true)}>
          <Menu size={24} />
        </button>

        <button className={styles.navButton} onClick={() => setShowCart(prev => !prev)}>
          <ShoppingBasket size={24} />
        </button>
      </div>

      {/* 🔍 Мобильный поиск */}
      {mounted && isMobile && showSearch && (
        <div
          className={styles.overlay}
          onClick={closeSearch}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "50px"
          }}
        >
          <div
            className={styles.searchWrapper}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "400px",
              background: "#fff",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px"
              }}
              autoFocus
            />
            <SearchPopup
              query={searchQuery}
              results={searchResults}
              loading={loading}
              onLinkClick={closeSearch}
            />
          </div>
        </div>
      )}

      {/* 📂 Категории */}
      {showCategories && (
        <CategoryMenu
          isOpen={showCategories}
          onClose={() => setShowCategories(false)}
          showBrands={false}
        />
      )}

      {/* 🛒 Корзина */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </>
  );
}