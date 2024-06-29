'use client'
import React from 'react'
import useFetchData from '../hooks/useFetchData'
import Loading from '@/components/Button/Loading'
import CategoryPage from '@/components/CategoryPage/CategoryPage'

const WomensClothing = () => {
    const {isLoading, banner, categories, products: womenProducts} = useFetchData({url: "womens-clothing", categoryUrl: "womens-clothing",fetchBanner: true, fetchCategories: false})
    return (
      <>
       {isLoading ? (
          <Loading/>
       ) : (
          <div className="">
              <CategoryPage products={womenProducts} banner={banner}/>
          </div>
       )}
      </>
    )
}

export default WomensClothing