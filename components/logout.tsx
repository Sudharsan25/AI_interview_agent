"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/sign-in')
    }

    return (
        <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-2xl">
            Logout <LogOut className="size-4"/>
        </Button>
    )
}