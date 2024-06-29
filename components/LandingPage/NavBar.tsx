import { MenuItemType } from '@/lib/interface'
import React from 'react'
import { DesktopMenu, MobileMenu } from '../Menu/Menu'

const NavBar = () => {
    const navLinks: MenuItemType[] = [
        {
            id: 'link1',
            title: 'Man',
            url: '/mens-clothing'
        },
        {
            id: 'link2',
            title: 'Woman',
            url: '/womens-clothing'
        },
        {
            id: 'link3',
            title: 'Featured',
            url: '/featured'
        },
    ]
    return (
        <>
            {/* Desktop Menu */}
            <nav className='hidden md:grid grid-cols-3 gap-4 items-center'>
                <DesktopMenu links={navLinks} />
            </nav>
            {/* Mobile Menu */}
            <nav className='md:hidden flex justify-between items-center'>
                <MobileMenu links={navLinks}/>
            </nav>
        </>
    )
}

export default NavBar