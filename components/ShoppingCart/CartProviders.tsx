"use client"
import React from 'react'
import { CartProvider } from 'use-shopping-cart'

const CartProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <CartProvider
    mode="payment"
    cartMode="client-only"
    stripe={""}
    successUrl=""
    cancelUrl=""
    currency="USD"
    allowedCountries={['US', 'GB', 'CA']}
    billingAddressCollection={true}
    shouldPersist={true}
    language='en-US'
    >
        {children}
    </CartProvider>
  )
}

export default CartProviders