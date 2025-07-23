"use client"; // This directive is crucial for client-side components in Next.js App Router

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Assuming your Button component path
import { isAuthenticated, signOut } from '@/lib/actions/auth.action';
import { toast } from 'sonner';

const AuthButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null initially for loading state
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Function to check authentication status
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const authenticated = await isAuthenticated();
        setIsLoggedIn(authenticated);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false); // Assume not logged in on error
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname]); // Run once on component mount

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(); // Call the server action to clear the cookie
      setIsLoggedIn(false); // Update local state
      toast("Logged out Successfully!!")
      router.refresh(); // Revalidate data on the current page
      router.push('/sign-in'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // You can render a loading spinner or placeholder here
    return (
      <div className='flex items-center gap-2 font-extrabold text-primary-100'>
        Loading...
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <Button
          onClick={handleLogout}
          className='flex items-center gap-2 font-extrabold bg-transparent text-primary-100 hover:bg-primary-100/10' // Style the button to look like a link
          disabled={loading} // Disable button while logging out
        >
          Logout
        </Button>
      ) : (
        <Link href="/sign-in" className='flex items-center gap-2 font-extrabold'>
          <span className='text-primary-100'> Login </span>
        </Link>
      )}
    </>
  );
};

export default AuthButton;