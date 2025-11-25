'use client';
import React, { useState, useEffect, useRef } from "react";
import styles from './ProductFilters.module.scss'
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ProductFilters({ onChange, values }) {
	// Получаем значения фильтров из props или ставим пустые
	const [ordering, setOrdering] = useState(values?.ordering || "");
	const [minPrice, setMinPrice] = useState(values?.min_price || "");
	const [maxPrice, setMaxPrice] = useState(values?.max_price || "");
	const [hasDiscount, setHasDiscount] = useState(values?.has_discount || false);

	const debounceRef = useRef(null);

	// При изменении внешних values — синхронизируем state
	useEffect(() => {
		setOrdering(values?.ordering || "");
		setMinPrice(values?.min_price || "");
		setMaxPrice(values?.max_price || "");
		setHasDiscount(values?.has_discount || false);
	}, [values]);

	// Универсальный вызов onChange с debounce
	useEffect(() => {
		clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(() => {
			onChange({
				ordering: ordering || undefined,
				min_price: minPrice || undefined,
				max_price: maxPrice || undefined,
				has_discount: hasDiscount ? true : undefined,
			});
		}, 300);

		return () => clearTimeout(debounceRef.current);
	}, [ordering, minPrice, maxPrice, hasDiscount]);

	const toggleOrdering = (value) => {
		setOrdering((prev) => (prev === value ? "" : value));
	};

	return (
		<div className={styles.filters}>
			{/* Сортировка */}
			<div className={styles.sorting}>
				<span
					className={ordering === "price" ? styles.active : ""}
					onClick={() => toggleOrdering("price")}
				>
					Цена <ArrowUp height={20}/>
				</span>

				<span
					className={ordering === "-price" ? styles.active : ""}
					onClick={() => toggleOrdering("-price")}
				>
					Цена <ArrowDown height={20}/>
				</span>

				<span
					className={ordering === "-created_at" ? styles.active : ""}
					onClick={() => toggleOrdering("-created_at")}
				>
					Новинки
				</span>
			</div>

			{/* Фильтр цены */}
			<div className={styles.price__range}>
				<input
					type="number"
					placeholder="Мин. цена"
					value={minPrice}
					className={styles.inputNumber}
					onChange={(e) => setMinPrice(e.target.value)}
				/>

				<input
					type="number"
					placeholder="Макс. цена"
					value={maxPrice}
					className={styles.inputNumber}
					onChange={(e) => setMaxPrice(e.target.value)}
				/>
			</div>

			{/* Только со скидкой */}
			<div className={styles.discount}>
				<label className={ hasDiscount ? styles.active : ""}>
					<input
						type="checkbox"
						checked={hasDiscount}
						onChange={(e) => setHasDiscount(e.target.checked)}
					/>
					Только со скидкой
				</label>
			</div>
		</div>
	);
}
