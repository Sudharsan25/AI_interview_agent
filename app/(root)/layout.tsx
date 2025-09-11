import { LogoutButton } from '@/components/logout'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const RootLayout =  async ({children}: {children: ReactNode}) => {


  return (
    <div className='root-layout'>
      <div>
        <nav className='flex justify-between items-center pt-12 px-24 pb-8'>
        <Link href="/">
            <Image src="/logo.svg" alt='logo' height={28} width={28}/>
        </Link>
        <LogoutButton />
      </nav>
      </div>
     
        <div className='flex-1'>
   
        {children}
      </div>
    
      
      
    </div>
  )
}

export default RootLayout