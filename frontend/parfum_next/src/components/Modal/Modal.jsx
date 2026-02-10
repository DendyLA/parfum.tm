'use client';
import React from "react";
import Link from "next/link";
import styles from './Modal.module.scss';

export default function Modal({ visible, title, message }) {
  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        <p>{message}</p>

        <Link href="/" className={styles.button}>
          Вернуться к покупкам
        </Link>
      </div>
    </div>
  );
}
