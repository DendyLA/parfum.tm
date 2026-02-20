'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { Instagram } from 'lucide-react';

import { useLocale } from "@/context/LocaleContext";
import { useMessages } from "@/hooks/useMessages";

import styles from './Footer.module.scss';

export default function Footer() {
	const { locale } = useLocale();
	const messages = useMessages("footer", locale);

	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		console.log("Отправка:", data);
	};

	return (
		<footer className={styles.footer}>
			<div className="container">
				<form className={styles.footer__subscribe} onSubmit={handleSubmit(onSubmit)}>
					<h4 className={styles.footer__title}>{messages.title}</h4>

					<div className={styles.footer__wrapper}>
						<div className={styles.footer__input} id="email-field">
							<input
								className="input"
								type="text"
								required
								placeholder={messages.emailPlaceholder}
								{...register("email", {
									required: messages.emailRequired,
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: messages.emailInvalid
									}
								})}
							/>

							<span className="bar"></span>
							<label>{messages.emailLabel}</label>

							{errors?.email && (
								<p className={styles.error}>
									{String(errors.email.message)}
								</p>
							)}
						</div>

						<button type="submit" className={styles.footer__submit}>
							{messages.subscribe}
						</button>
					</div>

					<div className={styles.social}>
						<div className={`${styles.social__item} link`}>
							<a href="https://www.instagram.com/parfumtm_/">
								<Instagram color="#000000" />
							</a>
						</div>
					</div>
				</form>
			</div>
		</footer>
	);
}
