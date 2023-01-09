import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div>
        <header className='flex justify-between p-5 max-w-7xl mx-auto'>
            <div className='flex items-center space-x-5'>
                <Link href='/'>
                    <img 
                        alt='Medium Logo'
                        src='https://links.papareact.com/yvf' 
                        className='w-44 object-contain cursor-pointer'
                    />
                </Link>
                <div className='hidden md:inline-flex items-center space-x-5'>
                    <h3 className='cursor-pointer'>About</h3>
                    <h3 className='cursor-pointer'>Contact</h3>
                    <h3 className='bg-green-600 text-white px-4 py-1 rounded-full cursor-pointer'>Follow</h3>
                </div>
            </div>
            <div className='flex items-center space-x-5 text-green-600'>
                <h3 className='cursor-pointer'>Sign In</h3>
                <h3 className='border px-4 py-1 rounded-full border-green-600 cursor-pointer'>Sign Up</h3>
            </div>
        </header>
    </div>
  )
}

export default Header