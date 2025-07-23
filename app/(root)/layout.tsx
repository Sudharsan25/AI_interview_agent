import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout =  async ({children}: {children: ReactNode}) => {

  const isUserauthenticated = await isAuthenticated();

  if (!isUserauthenticated) redirect('/sign-in');

  return (
    <div className='root-layout'>
      <nav>
        <div className='flex flex-row justify-between gap-4'>
          <Link href="/" className='flex items-center gap-2'>
              <Image src="/logo.svg" alt='Logo' width={38} height={32}/>
              <h2 className='text-primary-100'> AI Interview Agent</h2>
            </Link>
            <div className='flex flex-row gap-6'>
              <Link href="/sign-in" className='flex items-center gap-2 font-extrabold'>
                <span className='text-primary-100'> Login </span>
              </Link>
            </div>
        </div>
        
      </nav>
      
      {children}
    </div>
  )
}

export default RootLayout