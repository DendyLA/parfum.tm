'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from './CompanyList.module.scss';

import Skeleton from "@mui/material/Skeleton";

export default function CompanyList({ company = {} }) {
	const [loaded, setLoaded] = useState({});
	const handleImageLoad = (title) => {
		setLoaded((prev) => ({ ...prev, [title]: true }));
	};


	const currentCompany = Object.keys(company).length
		? company
		: [{title: "CeraVe", image: "/images/brands/cerave.png",}];
  	

  	return (
		<ul className={styles.company}>
			{currentCompany.map((it, idx) => (
				<Link href={''} key={idx}>
					<li  className={styles.company__item}>
						<div className={styles.company__imageWrapper}>
							{!loaded[it.title] && (
								<Skeleton 
									variant="rectangular"
									animation="wave"
									width='100%'
									height='100%'
									sx={{ borderRadius: "8px" }}
									className="skeleton"
								/>
							)}
							<Image
								src={it.image}
								alt={it.title}
								width={80}
								height={80}
								sizes="100%"
								onLoad={() => handleImageLoad(it.title)}
							/>
						</div>
					</li>
				</Link>
			))}
			<Link href={''} className={styles.company__btn}>Смотреть все</Link>
		</ul>
  	);
}	
