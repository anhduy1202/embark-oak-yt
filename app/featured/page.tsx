'use client'
import React from 'react'
import useFetchData from '../hooks/useFetchData'
import Loading from '@/components/Button/Loading'
import CategoryPage from '@/components/CategoryPage/CategoryPage'

const FeaturedPage = () => {
    const {isLoading, banner, categories, products: featuredProducts} = useFetchData({url: "featured", categoryUrl: "featured",fetchBanner: true, fetchCategories: false})
    return (
      <>
       {isLoading ? (
          <Loading/>
       ) : (
          <div className="">
              <CategoryPage products={featuredProducts} banner={banner}/>
          </div>
       )}
      </>
    )
}

export default FeaturedPage