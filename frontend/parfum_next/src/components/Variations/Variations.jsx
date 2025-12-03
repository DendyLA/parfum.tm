"use client";

import * as React from "react";
import { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import styles from "./Variations.module.scss";

export default function Variations({ colors }) {
	const [value, setValue] = useState("");

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	
	if (!colors || typeof colors !== "object") return null;

  	const numbers = Object.keys(colors);

	return (
		<FormControl fullWidth className={styles.variations}>
			<InputLabel id="color-select-label" >Выберите оттенок</InputLabel>

			<Select
				labelId="color-select-label"
				id="color-select"
				value={value}
				label="Выберите оттенок"
				onChange={handleChange}
			>
				{numbers.map((num) => (
				<MenuItem key={num} value={num}>
					<div className={styles.variations__item}>
						<div className={styles.variations__color} style={{ backgroundColor: colors[num] }}></div>
						<span>{num}</span>
					</div>
				</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
