'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import TollHeatMap from '@/components/TollHeatMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('heatmap')
  const [tollLocation, setTollLocation] = useState('all')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Toll {user.role === 'admin' ? 'Admin' : 'Operator'} Dashboard</h1>
        <Button variant="destructive" onClick={() => { logout(); router.push('/login'); }}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$123,456</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">98,765</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2.5 minutes</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Select onValueChange={setTollLocation} defaultValue={tollLocation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Toll Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="toll1">Toll 1</SelectItem>
            <SelectItem value="toll2">Toll 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Toll Usage Heat Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '400px' }}>
                <TollHeatMap />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle>Toll Usage Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Graph content goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Toll Usage Table</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Table content goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

