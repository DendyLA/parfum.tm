'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import styles from "./OrderInfo.module.scss";

import { getCart, updateQuantity, removeFromCart } from "@/lib/addToCart";
import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

/**
 * OrderInfo
 * @param {function} onCartChange - функция обратного вызова, чтобы уведомить родителя об изменениях корзины
 */
export default function OrderInfo({ onCartChange }) {
  const { locale } = useLocale();
  const messagesObj = useMessages("orderInfo", locale)?.orderInfo || {};

  // Универсальная функция для доступа к переводам
  const t = (path, fallback = "") =>
    path.split(".").reduce((o, k) => o?.[k], messagesObj) ?? fallback;

  const [cart, setCart] = useState([]);

  // Загружаем корзину при монтировании
  useEffect(() => {
    const currentCart = getCart();
    setCart(currentCart);
    onCartChange?.(currentCart);
  }, [onCartChange]);

  // Изменяем количество
  const changeQty = (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) {
      removeItem(item);
      return;
    }
    const updated = updateQuantity(item._key, newQty);
    setCart(updated);
    onCartChange?.(updated); // уведомляем родителя
  };

  // Удаляем товар
  const removeItem = (item) => {
    const updated = removeFromCart(item._key);
    setCart(updated);
    onCartChange?.(updated); // уведомляем родителя
  };

  // Общая сумма
  const total = cart.reduce((sum, item) => {
    const price = item.discount_price ?? item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className={styles.info}>
      {/* Верхняя часть */}
      <div className={styles.info__top}>
        <h5 className={styles.info__desc}>{t("yourOrder", "Ваш заказ")}</h5>
        <div className={styles.info__count}>{total.toFixed(2)} {t("currency", "man")}</div>
      </div>

      {/* Список товаров */}
      <div className={styles.info__middle}>
        {cart.map(item => (
          <div className={styles.info__product} key={item._key}>
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name || t("noName", "Нет имени")}
              width={70}
              height={70}
            />

            <div className={styles.info__box}>
              <div className={styles.info__title}>{item.name || t("noName", "Нет имени")}</div>
              <div className={styles.info__category}>
                {item.category_name || t("noCategory", "Нет категории")}
              </div>

              {item.variation_label && (
                <div className={styles.info__variation}>
                  {item.variation_color && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 15,
                        height: 15,
                        marginRight: 5,
                        backgroundColor: item.variation_color,
                        border: "1px solid #000",
                      }}
                    />
                  )}
                  {item.variation_label}
                </div>
              )}

              {/* Количество */}
              <div className={styles.info__things}>
                <div
                  className={styles.info__minus}
                  onClick={() => changeQty(item, -1)}
                >
                  <Minus strokeWidth={1} />
                </div>

                <div className={styles.info__num}>{item.quantity}</div>

                <div
                  className={styles.info__plus}
                  onClick={() => changeQty(item, 1)}
                >
                  <Plus strokeWidth={1} />
                </div>
              </div>
            </div>

            <Trash2
              className={styles.info__delete}
              onClick={() => removeItem(item)}
            />
          </div>
        ))}
      </div>

      {/* Итог */}
      <div className={styles.info__bottom}>
        <div className={styles.info__desc}>{t("total", "Итого")}</div>
        <div className={styles.info__sum}>{total.toFixed(2)} {t("currency", "man")}</div>
      </div>
    </div>
  );
}
