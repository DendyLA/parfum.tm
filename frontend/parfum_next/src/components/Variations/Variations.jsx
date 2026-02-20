'use client';

import * as React from "react";
import { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import styles from "./Variations.module.scss";

import { useMessages } from "@/hooks/useMessages";
import { useLocale } from "@/context/LocaleContext";

export default function Variations({ variations = [], selected, onSelect }) {
    const { locale } = useLocale();
    const t = useMessages("variations", locale);

    const [value, setValue] = useState(selected?.id || "");

    const handleChange = (event) => {
        const val = event.target.value;
        setValue(val);
        const variationObj = variations.find(v => v.id.toString() === val);
        if (onSelect) onSelect(variationObj);
    };

    if (!variations || !variations.length) return null;

    return (
        <FormControl fullWidth className={styles.variations}>
            <InputLabel id="variation-select-label">
                {t.selectOption}
            </InputLabel>

            <Select
                labelId="variation-select-label"
                id="variation-select"
                value={value}
                label={t.selectOption}
                onChange={handleChange}
            >
                {variations.map(v => (
                    <MenuItem key={v.id} value={v.id.toString()}>
                        <div className={styles.variations__item}>
                            {v.color_hex && (
                                <div
                                    className={styles.variations__color}
                                    style={{ backgroundColor: v.color_hex }}
                                ></div>
                            )}
                            <span>{v.value}</span>
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
