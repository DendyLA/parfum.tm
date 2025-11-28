'use client';
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import styles from "./SkeletonList.module.scss";

export default function SkeletonList({ count }) {
	
	return(
		 <div className={styles.skeleton__wrapper}>
			{Array.from({ length: count }).map((_, i) => (
				<div className={styles.skeleton__card} key={i}>
					<Skeleton animation="wave" variant="rectangular" height={270} />
					<Skeleton animation="wave" height={20} style={{ marginTop: 10 }} />
					<Skeleton animation="wave" width={100} height={20} />
				</div>
			 ))}
		</div>
	)
}