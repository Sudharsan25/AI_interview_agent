import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-100 flex-col items-center justify-center gap-6 p-6 md:p-10 w-[600]">
      <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <GalleryVerticalEnd className="size-6" />
            <Link href="/" className='flex items-center gap-2'>
              AI Interview Agent
            </Link>
          </div>
        <LoginForm />
      </div>
    </div>
  )
}
