'use client';
import LandingPage from "@/components/LandingPage/page";
import { useEffect } from "react";
import { getPageData } from "./action";
import useFetchData from "./hooks/useFetchData";
import Loading from "@/components/Button/Loading";

export default function Home() {
  const {isLoading, banner, categories, products} = useFetchData({url: "home", categoryUrl: "featured",fetchBanner: true, fetchCategories: true})
  return (
    <main className="flex min-h-screen flex-col items-center">
      {isLoading ? (
        <Loading/>
      ) : (
        <LandingPage bannerData={banner} categoriesData={categories} featuredProducts={products}/>
      )}
    </main>
  );
}
