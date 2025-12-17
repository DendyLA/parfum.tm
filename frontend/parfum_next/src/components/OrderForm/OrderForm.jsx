'use client';

import React, { useState, useRef, useEffect } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import styles from './OrderForm.module.scss'


export default function OrderForm({ onSubmit }) {
	const phoneRef = useRef(null);
	const itiRef = useRef(null);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		comment: "",
	});

	const [errors, setErrors] = useState({});

	// 🔹 инициализация intl-tel-input
	useEffect(() => {
		if (!phoneRef.current) return;

		itiRef.current = intlTelInput(phoneRef.current, {
			initialCountry: "tm",
			onlyCountries: ["tm"],
			separateDialCode: true,
			nationalMode: false,
			autoPlaceholder: "aggressive",
			utilsScript:
				"https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
		});

		return () => {
			itiRef.current?.destroy();
		};
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const validate = () => {
		const newErrors = {};

		if (!form.firstName.trim()) newErrors.firstName = "Введите имя";
		if (!form.lastName.trim()) newErrors.lastName = "Введите фамилию";

		if (!itiRef.current || !itiRef.current.isValidNumber()) {
			newErrors.phone = "Введите корректный номер Туркменистана";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validate()) return;

		const phone = itiRef.current.getNumber(); // +9936xxxxxxx

		const data = {
			...form,
			phone,
		};

		console.log("ORDER DATA:", data);
		onSubmit?.(data);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.form__box}>
				<div className={styles.form__wrapper}>
					<input
						type="text"
						name="firstName"
						className={`${styles.form__input}`}
						placeholder="Ваше Имя"
						value={form.firstName}
						onChange={handleChange}
						required
					/>
					<input
						type="text"
						name="lastName"
						className={`${styles.form__input}`}
						placeholder="Ваша фамилия"
						value={form.lastName}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.form__wrapper}>
					{/* ✅ intl-tel-input */}
					<input
						ref={phoneRef}
						type="tel"
						className={`${styles.form__input}`}
						placeholder="62 123456"
						required
					/>

					<input
						type="text"
						name="comment"
						className={`${styles.form__input}`}
						placeholder="Ваш комментарий (необязательно)"
						value={form.comment}
						onChange={handleChange}
					/>
				</div>
			</div>
			

			{errors.phone && <p className={styles.form__error}>{errors.phone}</p>}

			<button type="submit" className={`${styles.form__submit}`}>
				Оформить заказ
			</button>
		</form>
	);
}
