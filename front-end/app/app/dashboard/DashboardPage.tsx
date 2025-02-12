"use client"

import Dashboard from "@/components/Dashboard"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
    const { user } = useAuth()
    const router = useRouter()

    // Log the user object from the auth context
    console.log("[DashboardPage] Auth user:", user)

    useEffect(() => {
        if (!user) {
            console.log("[DashboardPage] No user - redirecting to login")
            router.push("/login")
        }
    }, [user, router])

    if (!user) return <div>Loading user session...</div>

    // For admin, pass an empty string for userCode; otherwise, use user.code.
    const userCode = user.role === "admin" ? "" : user.code || ""
    const displayName = user.name

    // Log what we're about to pass as props:
    console.log("[DashboardPage] Passing props to Dashboard:", {
        isAdmin: user.role === "admin",
        userCode,
        displayName,
    })

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen bg-gray-50">
            <Dashboard
                isAdmin={user.role === "admin"}
                userName={displayName}
                userCode={userCode}
            />
        </div>
    )
}
