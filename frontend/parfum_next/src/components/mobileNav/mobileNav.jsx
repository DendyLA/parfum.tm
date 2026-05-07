'use client';

import { useState, useEffect } from "react";
import { Home, ShoppingBasket, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileNav.module.scss";
import CategoryMenu from "../CategoryMenu/CategoryMenu";
import Cart from "../Cart/Cart";

export default function MobileNav() {
  const pathname = usePathname();

  const [showCart, setShowCart] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHomeClick = (e) => {
    const isHome =
      pathname === "/" || pathname.match(/^\/[a-z]{2}$/);

    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={styles.mobileNav}>
        <Link
          href="/"
          className={styles.navButton}
          onClick={handleHomeClick}
        >
          <Home size={24} />
        </Link>

        <button
          className={styles.navButton}
          onClick={() => setShowCategories(true)}
        >
          <Menu size={24} />
        </button>

        <button
          className={styles.navButton}
          onClick={() => setShowCart(prev => !prev)}
        >
          <ShoppingBasket size={24} />
        </button>
      </div>

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