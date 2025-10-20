"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from './Header.module.scss';

export default function Header() {

	return (
		<header className="header">
			<div className="header__top">
				<div className="container">
					<div className="features"></div>
					<div className="actions"></div>
					<div className="lang"></div>
				</div>
			</div>
			<div className="header__middle">

			</div>
		</header>
	)

}