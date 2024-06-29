import React from 'react'
import { Button } from '../ui/button'
import { productType } from '@/lib/interface'
import { useShoppingCart } from 'use-shopping-cart'
interface CartProps {
  product: productType
}
const AddToCartBtn: React.FC<CartProps> = ({ product }) => {
  const { addItem, handleCartClick } = useShoppingCart();
  const newProduct = {
    name: product?.title ?? "",
    description: product?.description ?? "",
    id: product?.id,
    price: parseFloat(product?.price),
    currency: "USD",
    image: product?.images[0] ?? "",
  }
  return (
    <Button onClick={() => {
      addItem(newProduct),
        handleCartClick()
    }} className='font-normal mt-4 md:text-[1.25rem]'>
      Add to cart
    </Button>
  )
}

export default AddToCartBtn