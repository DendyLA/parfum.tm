'use client';

import React, { useState, useEffect } from "react";
import styles from './OrderForm.module.scss';
import { createOrder } from "@/lib/endpoints"; 
import { getCart, clearCart } from "@/lib/addToCart";
import Modal from "@/components/Modal/Modal";

export default function OrderForm({ onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    address: "",
    phone: "",
    comment: "",
  });

  const [cart, setCart] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({ visible: false, title: "", message: "" });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 5 && cleaned.length <= 12;
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Введите имя";
    if (!form.address.trim()) newErrors.address = "Введите адрес";

    if (!form.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    const currentCart = getCart();
    if (!currentCart || currentCart.length === 0) newErrors.cart = "Корзина пуста";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const currentCart = getCart();
      if (!currentCart || currentCart.length === 0) throw new Error("Корзина пуста");

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

      // Очищаем форму и корзину
      setForm({ firstName: "", address: "", phone: "", comment: "" });
      clearCart();
      setCart([]);
      setErrors({});
      setModal({
        visible: true,
        title: "Заказ успешно оформлен",
        message: "Скоро с вами свяжутся",
      });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setModal({
        visible: true,
        title: "Ошибка",
        message: err.message || "Попробуйте снова",
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
              placeholder="Имя"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              className={styles.form__input}
              placeholder="Адрес"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.form__wrapper}>
            <input
              type="tel"
              name="phone"
              className={styles.form__input}
              placeholder="8 63129586 или +99363129586"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="comment"
              className={styles.form__input}
              placeholder="Комментарий (необязательно)"
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
          {loading ? "Отправка..." : "Оформить заказ"}
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
