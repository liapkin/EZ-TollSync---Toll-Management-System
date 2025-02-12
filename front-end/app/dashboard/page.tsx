"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Welcome from "../Welcome"
import DebtReport from "../DebtReport"
import HeatMap from "../HeatMap"
import ActualMap from "../ActualMap"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface DashboardProps {
    isAdmin: boolean
    userName: string
    userCode: string
}

export default function Dashboard({ isAdmin, userName, userCode }: DashboardProps) {
    const [activeTab, setActiveTab] = useState("welcome")
    const router = useRouter()
    const { logout } = useAuth()

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            {/* Header with Navbar and Logout */}
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <CardTitle className="text-3xl font-bold text-white">Ez-Toll Dashboard</CardTitle>
                <Button
                    variant="destructive"
                    onClick={() => {
                        logout()
                        router.push('/login')
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </Button>
            </div>
            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        <TabsTrigger value="welcome">Welcome</TabsTrigger>
                        <TabsTrigger value="debt-report">Debt Report</TabsTrigger>
                        <TabsTrigger value="heat-map">Heat Map</TabsTrigger>
                        <TabsTrigger value="actual-map">Actual Map</TabsTrigger>
                    </TabsList>
                    <TabsContent value="welcome">
                        <Welcome isAdmin={isAdmin} userName={userName} />
                    </TabsContent>
                    <TabsContent value="debt-report">
                        <DebtReport isAdmin={isAdmin} userCode={userCode} />
                    </TabsContent>
                    <TabsContent value="heat-map">
                        <HeatMap />
                    </TabsContent>
                    <TabsContent value="actual-map">
                        <ActualMap isAdmin={isAdmin} userCode={userCode} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}