"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Welcome() {
    const [name, setName] = useState("")

    // On mount, read the stored user from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser)
                    // Use the user's name if available; otherwise, use a fallback
                    setName(user.name || user.email || "User")
                } catch (e) {
                    console.error("Error parsing stored user:", e)
                    setName("User")
                }
            } else {
                setName("User")
            }
        }
    }, [])

    // Determine if the user is admin by checking the name
    const isAdmin = name.toLowerCase() === "admin"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center">
                        {isAdmin ? `Welcome, ${name}!` : `Welcome, ${name}!`}
                        <motion.span
                            className="ml-2 inline-block origin-bottom-right cursor-pointer"
                            animate={{ rotate: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        >
                            👋
                        </motion.span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">
                        {isAdmin
                            ? "As an admin, you have full access to the Ez-Toll system. You can view and manage all data and operations."
                            : "As an operator, you have access only to your own data and related reports. Manage your operations efficiently!"}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    )
}
