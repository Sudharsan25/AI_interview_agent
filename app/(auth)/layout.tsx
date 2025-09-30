import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const AuthLayout = async ({children}: {children: ReactNode}) => {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
    // 2. If no session, redirect to the login page.
    if (session) {
      redirect("/");
    }
  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout