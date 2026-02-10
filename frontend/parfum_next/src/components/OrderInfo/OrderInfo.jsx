'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import styles from "./OrderInfo.module.scss";

import { getCart, updateQuantity, removeFromCart } from "@/lib/addToCart";

export default function OrderInfo() {
	const [cart, setCart] = useState([]);

	useEffect(() => {
		setCart(getCart());
	}, []);

	const changeQty = (item, delta) => {
		const newQty = (item.quantity || 1) + delta;
		if (newQty <= 0) {
			removeItem(item);
			return;
		}
		// используем _key для уникальной идентификации товара + вариации
		const updated = updateQuantity(item._key, newQty);
		setCart(updated);
	};

	const removeItem = (item) => {
		const updated = removeFromCart(item._key);
		setCart(updated);
	};

	const total = cart.reduce((sum, item) => {
		const price = item.discount_price ?? item.price;
		return sum + price * item.quantity;
	}, 0);

	return (
		<div className={styles.info}>
			<div className={styles.info__top}>
				<h5 className={styles.info__desc}>Ваш заказ</h5>
				<div className={styles.info__count}>{total.toFixed(2)} man</div>
			</div>

			<div className={styles.info__middle}>
				{cart.map(item => (
					<div className={styles.info__product} key={item._key}>
						<Image
							src={item.image || "/placeholder.png"}
							alt={item.name || "product"}
							width={70}
							height={70}
						/>

						<div className={styles.info__box}>
							<div className={styles.info__title}>{item.name}</div>
							<div className={styles.info__category}>
								{item.category_name || "Без категории"}
							</div>

							{/* Цвет вариации */}
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

			<div className={styles.info__bottom}>
				<div className={styles.info__desc}>Итого</div>
				<div className={styles.info__sum}>{total.toFixed(2)} man</div>
			</div>
		</div>
	);
}
