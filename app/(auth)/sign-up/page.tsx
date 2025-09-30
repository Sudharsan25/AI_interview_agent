import { GalleryVerticalEnd } from "lucide-react"

import Link from "next/link"
import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-100 flex-col items-center rounded-2xl justify-center gap-6 p-6 md:p-10 w-[600]">
      <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
            <GalleryVerticalEnd className="size-6" />
            <Link href="/" className='flex items-center gap-2'>
              AI Interview Agent
            </Link>
          </div>
        <SignUpForm />
      </div>
    </div>
  )
}
