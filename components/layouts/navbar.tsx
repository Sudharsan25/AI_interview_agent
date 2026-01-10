"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Create Interview", href: "/interview/create" },
    { name: "Upcoming Interviews", href: "/interview/upcoming" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Interview<span className="text-blue-400">Agent</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-blue-400 px-3 py-2 rounded-md",
                pathname === link.href ? "text-blue-400" : "text-gray-300"
              )}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 h-11 w-11"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Desktop Sign Out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="hidden md:flex text-gray-300 hover:text-white hover:bg-white/10 gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>

          {/* Mobile Sign Out */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 h-11 w-11"
            aria-label="Sign out">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "block px-4 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] flex items-center",
                  pathname === link.href
                    ? "text-blue-400 bg-white/5"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
