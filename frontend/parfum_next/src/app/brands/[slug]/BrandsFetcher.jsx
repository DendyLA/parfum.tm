'use client';
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ProductFilters from "@/components/ProductFilters/ProductFilters";
import Skeleton from "@mui/material/Skeleton";

import { getBrandBySlug } from "@/lib/endpoints";
import ProductsByBrand from "@/components/InfinityProductList/ProductsByBrands";

export default function BrandsFetcher({ slug }) {
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    // --- Загружаем бренд по slug ---
    useEffect(() => {
        if (!slug) return;

        setLoading(true);            
        setBrand(null);              

        async function fetchBrand() {
            try {
                const b = await getBrandBySlug(slug);
                setBrand(b);
            } catch (err) {
                console.error("Ошибка получения бренда:", err);
                setBrand(null);
            } finally {
                setLoading(false);
            }
        }

        fetchBrand();
    }, [slug]);



    if (!brand) return <p>Бренд не найден</p>;

    const breadcrumbItems = [
        { name: "PARFUMTM", href: "/" },
        { name: brand.name }
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <ProductFilters key={brand.id} values={filters} onChange={setFilters} />

            {/* brandId теперь корректно обновляется */}
            <ProductsByBrand brandId={brand.id} filters={filters} />
        </>
    );
}
