'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export function useSearch(limit = 3) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], categories: [], brands: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults({ products: [], categories: [], brands: [] });
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('search', query);
                params.append('limit', limit);
                const data = await apiFetch(`/products/search/?${params.toString()}`);
                setResults(data);
            } catch (e) {
                console.error('Ошибка поиска:', e);
                setResults({ products: [], categories: [], brands: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query, limit]);

    return { query, setQuery, results, loading };
}
