'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { getPageData, getProductsByCategory } from '../action';
import { BannerDataType, CategoriesBannerDataType, productType } from '@/lib/interface';

const useFetchData = ({ url = "", categoryUrl = "", fetchBanner = false, fetchCategories = false }) => {
    const [products, setProducts] = useState<productType[]>([])
    const [banner, setBanner] = useState<BannerDataType>({ title: "", image: "" })
    const [categories, setCategories] = useState<CategoriesBannerDataType[]>([])
    const [isLoading, setLoading] = useState(true);
    const getData = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getPageData(url);
            if (categoryUrl != "") {
                const products = await getProductsByCategory(categoryUrl)
                setProducts(products)
            }
            if (fetchBanner) setBanner(data.bannerData)
            if (fetchCategories) setCategories(data.categoriesObject)
        } catch (e) {
            console.log("Error fetching data:", e);
        } finally {
            setLoading(false)
        }
    }, [url, fetchBanner])
    useEffect(() => {
        getData();
    }, [getData])
    return { banner, isLoading, products, categories }
}

export default useFetchData