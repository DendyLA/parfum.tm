'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus } from "lucide-react";
import styles from './Cart.module.scss';
import { getCart, saveCart, removeFromCart, updateQuantity } from "@/lib/addToCart"; // импорт из исправленного cart.js
import { pencilColors } from "@/constants/pencilColors";

export default function Cart({ onClose }) {
	const [cart, setCart] = useState([]);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => { document.body.style.overflow = ""; };
	}, []);

	useEffect(() => {
		setCart(getCart());
	}, []);

	const handleUpdateQuantity = (item, newQty) => {
		const updated = updateQuantity(item.id, item.selectedVariation, newQty);
		setCart(updated);
	};

	const handleRemove = (item) => {
		const updated = removeFromCart(item.id, item.selectedVariation);
		setCart(updated);
	};

	const totalPrice = cart.reduce((sum, item) => {
		const price = item.discount_price ?? item.price;
		return sum + price * item.quantity;
	}, 0);

	const handleBackgroundClick = (e) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div className={styles.cart} onClick={handleBackgroundClick}>
			<div className={styles.cart__wrapper}>
				<div className={styles.cart__top}>
					<h4 className={styles.cart__title}>Корзина</h4>
					<div className={styles.cart__close} onClick={onClose}><X /></div>
				</div>

				{cart.length === 0 ? (
					<p className={styles.cart__empty}>Корзина пуста</p>
				) : (
					<div className={styles.cart__bottom}>
						<ul className={styles.cart__list}>
							{cart.map(item => {
								const number = item.selectedVariation?.value || item.selectedVariation?.id;
								const hex = number ? pencilColors[number] : null;

								return (
									<li
										key={item._key || `${item.id}-${number}`}
										className={styles.cart__item}
									>
										<div className={styles.cart__image}>
											<Image
												src={item.image || "/placeholder.png"}
												alt={item.translations.ru.name}
												width={100}
												height={100}
											/>
										</div>
										<div className={styles.cart__info}>
											<h5 className={styles.cart__name}>{item.translations.ru.name}</h5>

											{number && (
												<div className={styles.variations__item}>
													<div className={styles.variations__color} style={{ backgroundColor: hex }}/>
													<span>{number}</span>
												</div>
											)}

											<div className={styles.cart__category}>
												{item.category?.translations?.ru?.name || "Без категории"}
											</div>
										</div>

										<div className={styles.cart__count}>
											<button onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>
												<Minus size={16} />
											</button>
											<span>{item.quantity}</span>
											<button onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>
												<Plus size={16} />
											</button>
										</div>

										<div className={styles.cart__right}>
											<div className={styles.cart__price}>
												{item.discount_price ? (
													<>
														<span className={styles.cart__discount}>{item.discount_price} man</span>
														<span className={styles.cart__old}>{item.price} man</span>
													</>
												) : (
													<span>{item.price} man</span>
												)}
											</div>
											<button className={styles.cart__delete} onClick={() => handleRemove(item)}>
												<Trash2 size={16} />
											</button>
										</div>
									</li>
								);
							})}
						</ul>

						<div className={styles.cart__all}>
							<div className={styles.cart__total}>
								Общая сумма: <strong>{totalPrice.toFixed(2)} man</strong>
							</div>
							<Link href='/order'>
								<button className={styles.cart__submit} onClick={onClose}>
									Оформить заказ
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
