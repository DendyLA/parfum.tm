'use client';
import React from "react";
import Link from "next/link";
import styles from './Modal.module.scss';

import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

export default function Modal({ visible, title, message }) {
  const { locale } = useLocale();

  // Получаем переводы для модалки
  const messagesObj = useMessages("modal", locale)?.modal || {};

  // Функция для удобного доступа к вложенным ключам
  const t = (path, fallback = "") => {
    return path.split(".").reduce((o, k) => o?.[k], messagesObj) ?? fallback;
  };

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        <p>{message}</p>

        <Link href="/" className={styles.button}>
          {t("button", "Вернуться к покупкам")}
        </Link>
      </div>
    </div>
  );
}
