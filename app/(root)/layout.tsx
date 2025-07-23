import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout =  async ({children}: {children: ReactNode}) => {

  const isUserauthenticated = await isAuthenticated();

  if (!isUserauthenticated) redirect('/sign-in');

  return (
    <div className='root-layout'>
      {children}
    </div>
  )
}

export default RootLayout