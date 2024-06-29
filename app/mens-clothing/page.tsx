"use client"
import React from 'react'
import useFetchData from '../hooks/useFetchData'
import Loading from '@/components/Button/Loading'
import CategoryPage from '@/components/CategoryPage/CategoryPage'

const MensClothing = () => {
    const { isLoading, banner, categories, products: menProducts } = useFetchData({ url: "mens-clothing", categoryUrl: "mens-clothing", fetchBanner: true, fetchCategories: false })
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="">
                    <CategoryPage products={menProducts} banner={banner} />
                </div>
            )}
        </>
    )
}

export default MensClothing