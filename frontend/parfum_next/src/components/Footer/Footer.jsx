'use client';

import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

import {Facebook, Instagram} from 'lucide-react'

import styles from './Footer.module.scss';





export default function Header() {
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		console.log("Отправка:", data);
	};

	return (
		<footer className={styles.footer}>
			<div className="container">
				<form className={styles.footer__subscribe} onSubmit={handleSubmit(onSubmit)}>
					<h4 className={styles.footer__title}>Узнавайте первыми о распродажах и новинках!</h4>
					<div className={styles.footer__wrapper}>
						<div className={styles.footer__input} id="email-field">
							<input className={`input`} type="text" name="email" id="footer-subscribe-email" required="" placeholder="Электронная почта" 
							{...register("email", {
							required: "Email обязателен",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Введите корректный email"
							}
							})}/> 
							<span className="bar"></span>
							<label>Электронная почта</label>
							{errors?.email && (
								<p className={styles.error}>
								{String(errors.email.message)}
								</p>
							)}
						</div>
						<button type="submit"  className={styles.footer__submit}>подписаться</button>
					</div>
					<div className={styles.social}>
						{/* <div className={`${styles.social__item} link`}><a href=""><Facebook color="#000000"  /></a></div> */}
						<div className={`${styles.social__item} link`}><a href="https://www.instagram.com/parfumtm_/"><Instagram color="#000000"  /></a></div>
					</div>
				</form>
				
			</div>
		</footer>
	)

}