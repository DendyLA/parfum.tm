'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, Trash } from "lucide-react";

import "intl-tel-input/build/css/intlTelInput.css";
import styles from './OrderInfo.module.scss'


export default function OrderInfo() {
	

	return (
		<div className={styles.info}>
			<div className={styles.info__top}>
				<h5 className={styles.info__desc}>Ваш заказ</h5>
				<div className={styles.info__count}>6949 man</div>
			</div>
			<div className={styles.info__middle}>
				<div className={styles.info__product}>
					<Image href=''/>
					<div className={styles.info__box}>
						<div className={styles.info__title}>Dior Diorskin Forever Natural Nude</div>
						<div className={styles.info__category}>Парфюм</div>
						<div className={styles.info__variation}><span style={{ backgroundColor: '#ac0303' }}></span> 101</div>
						<div className={styles.info__things}>
							<div className={`${styles.info__minus}`}><Minus  strokeWidth={1}/></div>
							<div className="info__num">2</div>
							<div className={`${styles.info__plus}`} ><Plus  strokeWidth={1}/></div>
							
						</div>
					</div>
					<Trash className={styles.info__delete}/>
				</div>
				<div className={styles.info__product}>
					<Image href=''/>
					<div className={styles.info__box}>
						<div className={styles.info__title}>Dior Diorskin Forever Natural Nude</div>
						<div className={styles.info__category}>Парфюм</div>
						<div className={styles.info__variation}><span style={{ backgroundColor: '#ac0303' }}></span> 101</div>
						<div className={styles.info__things}>
							<div className={`${styles.info__minus}`}><Minus  strokeWidth={1}/></div>
							<div className="info__num">2</div>
							<div className={`${styles.info__plus}`} ><Plus  strokeWidth={1}/></div>
							
						</div>
					</div>
					<Trash className={styles.info__delete}/>
				</div>
				<div className={styles.info__product}>
					<Image href=''/>
					<div className={styles.info__box}>
						<div className={styles.info__title}>Dior Diorskin Forever Natural Nude</div>
						<div className={styles.info__category}>Парфюм</div>
						<div className={styles.info__variation}><span style={{ backgroundColor: '#ac0303' }}></span> 101</div>
						<div className={styles.info__things}>
							<div className={`${styles.info__minus}`}><Minus  strokeWidth={1}/></div>
							<div className="info__num">2</div>
							<div className={`${styles.info__plus}`} ><Plus  strokeWidth={1}/></div>
							
						</div>
					</div>
					<Trash className={styles.info__delete}/>
				</div>
				<div className={styles.info__product}>
					<Image href=''/>
					<div className={styles.info__box}>
						<div className={styles.info__title}>Dior Diorskin Forever Natural Nude</div>
						<div className={styles.info__category}>Парфюм</div>
						<div className={styles.info__variation}><span style={{ backgroundColor: '#ac0303' }}></span> 101</div>
						<div className={styles.info__things}>
							<div className={`${styles.info__minus}`}><Minus  strokeWidth={1}/></div>
							<div className="info__num">2</div>
							<div className={`${styles.info__plus}`} ><Plus  strokeWidth={1}/></div>
							
						</div>
					</div>
					<Trash className={styles.info__delete}/>
				</div>
				<div className={styles.info__product}>
					<Image href=''/>
					<div className={styles.info__box}>
						<div className={styles.info__title}>Dior Diorskin Forever Natural Nude</div>
						<div className={styles.info__category}>Парфюм</div>
						<div className={styles.info__variation}><span style={{ backgroundColor: '#ac0303' }}></span> 101</div>
						<div className={styles.info__things}>
							<div className={`${styles.info__minus}`}><Minus  strokeWidth={1}/></div>
							<div className="info__num">2</div>
							<div className={`${styles.info__plus}`} ><Plus  strokeWidth={1}/></div>
							
						</div>
					</div>
					<Trash className={styles.info__delete}/>
				</div>
			</div>
			<div className={styles.info__bottom}>
				<div className={styles.info__desc}>Итого</div>
				<div className={styles.info__sum}>6903 man</div>
			</div>
		</div>
	);
}
