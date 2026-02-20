'use client';

import React, { useState } from "react";
import styles from './OrderForm.module.scss';
import { createOrder } from "@/lib/endpoints";
import { getCart, clearCart } from "@/lib/addToCart";
import Modal from "@/components/Modal/Modal";

import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function OrderForm({ onSuccess }) {
  const { locale } = useLocale();

  const messagesObj = useMessages("orderForm", locale)?.orderForm || {};

  const t = (path, fallback = "") =>
    path.split(".").reduce((o, k) => o?.[k], messagesObj) ?? fallback;

  const [form, setForm] = useState({
    firstName: "",
    address: "",
    phone: "",
    comment: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 5 && cleaned.length <= 12;
  };

  const validate = (cartToCheck) => {
    const newErrors = {};
    const cartData = cartToCheck || [];

    if (!form.firstName.trim())
      newErrors.firstName = t("errors.name", "Введите имя");

    if (!form.address.trim())
      newErrors.address = t("errors.address", "Введите адрес");

    if (!form.phone.trim())
      newErrors.phone = t("errors.phoneRequired", "Введите номер");
    else if (!validatePhone(form.phone))
      newErrors.phone = t("errors.phoneInvalid", "Неверный номер");

    if (!cartData || cartData.length === 0)
      newErrors.cart = t("errors.emptyCart", "Корзина пуста");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Берём актуальную корзину прямо перед отправкой
    const currentCart = getCart();

    if (!validate(currentCart)) return;

    setLoading(true);

    try {
      const totalPrice = currentCart.reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
        0
      );

      const itemsForServer = currentCart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id || null,
      }));

      await createOrder({
        first_name: form.firstName,
        phone: form.phone,
        address: form.address,
        comment: form.comment,
        total_price: totalPrice.toString(),
        items: itemsForServer,
      });

      setForm({ firstName: "", address: "", phone: "", comment: "" });
      clearCart();
      setErrors({});

      setModal({
        visible: true,
        title: t("success.title", "Успешно"),
        message: t("success.message", "Заказ оформлен"),
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);

      setModal({
        visible: true,
        title: t("error.title", "Ошибка"),
        message: err.message || t("error.message", "Попробуйте снова"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form__box}>
          <div className={styles.form__wrapper}>
            <input
              type="text"
              name="firstName"
              className={styles.form__input}
              placeholder={t("placeholders.name", "Имя")}
              value={form.firstName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              className={styles.form__input}
              placeholder={t("placeholders.address", "Адрес")}
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.form__wrapper}>
            <input
              type="tel"
              name="phone"
              className={styles.form__input}
              placeholder={t("placeholders.phone", "Телефон")}
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="comment"
              className={styles.form__input}
              placeholder={t("placeholders.comment", "Комментарий")}
              value={form.comment}
              onChange={handleChange}
            />
          </div>
        </div>

        {errors.firstName && <p className={styles.form__error}>{errors.firstName}</p>}
        {errors.address && <p className={styles.form__error}>{errors.address}</p>}
        {errors.phone && <p className={styles.form__error}>{errors.phone}</p>}
        {errors.cart && <p className={styles.form__error}>{errors.cart}</p>}

        <button type="submit" className={styles.form__submit} disabled={loading}>
          {loading ? t("buttons.loading", "Отправка...") : t("buttons.submit", "Оформить")}
        </button>
      </form>

      <Modal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, visible: false })}
      />
    </>
  );
}
