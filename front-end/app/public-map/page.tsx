import TollHeatMap from '@/components/TollHeatMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PublicMap() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Public Toll Usage Map</h1>
      <Card>
        <CardHeader>
          <CardTitle>Toll Usage Heat Map</CardTitle>
        </CardHeader>
        <CardContent>
          <TollHeatMap />
        </CardContent>
      </Card>
    </div>
  )
}

