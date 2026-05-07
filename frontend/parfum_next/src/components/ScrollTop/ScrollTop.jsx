"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import styles from './ScrollTop.module.scss'


export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <button className={styles.scrollTopBtn} onClick={scrollToTop}>
            <ChevronUp/>
        </button>
    );
}