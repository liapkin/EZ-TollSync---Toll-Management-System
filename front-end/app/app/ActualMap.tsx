"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { GoogleMap, useLoadScript, CircleF, InfoWindowF } from "@react-google-maps/api"
import { Card, CardContent } from "@/components/ui/card"
import { DateRangePicker } from "@/components/DateRangePicker"
import api from "@/app/api/axios"
import type { DateRange } from "react-day-picker"

interface TollStation {
    tollid: string
    name: string
    lat: number
    long: number
    pass_count: number
    total_charges: number
}

const libraries = ["places"]

const mapContainerStyle = {
    width: "100%",
    height: "600px",
}

const center = {
    lat: 38.2749,
    lng: 23.8087,
}

const mapOptions = {
    fullscreenControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    zoomControl: true,
}

const getCircleOptions = (passes: number, maxPasses: number) => {
    if (passes === 0) return {
        fillColor: '#f3f4f6',
        fillOpacity: 0.7,
        strokeColor: '#e5e7eb',
        strokeWeight: 1
    }

    const intensity = (passes / maxPasses) * 100
    if (intensity < 25) return {
        fillColor: '#dcfce7',
        fillOpacity: 0.7,
        strokeColor: '#bbf7d0',
        strokeWeight: 1
    }
    if (intensity < 50) return {
        fillColor: '#fef9c3',
        fillOpacity: 0.7,
        strokeColor: '#fef08a',
        strokeWeight: 1
    }
    if (intensity < 75) return {
        fillColor: '#ffedd5',
        fillOpacity: 0.7,
        strokeColor: '#fed7aa',
        strokeWeight: 1
    }
    return {
        fillColor: '#fee2e2',
        fillOpacity: 0.7,
        strokeColor: '#fecaca',
        strokeWeight: 1
    }
}

const getCircleRadius = (passes: number, maxPasses: number) => {
    const minRadius = 5000
    const maxRadius = 20000
    const ratio = passes / maxPasses
    return minRadius + (maxRadius - minRadius) * ratio
}

function Map({
                 stations,
                 loading,
                 maxPasses,
                 selectedStation,
                 setSelectedStation
             }: {
    stations: TollStation[],
    loading: boolean,
    maxPasses: number,
    selectedStation: TollStation | null,
    setSelectedStation: (station: TollStation | null) => void
}) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyBno7QRXEjM34HKnClItclTWkqrvH11gDM",
        libraries: libraries as any,
    })

    if (loadError) return <div>Error loading maps</div>
    if (!isLoaded) return <div>Loading maps...</div>

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={7}
            center={center}
            options={mapOptions}
        >
            {!loading && stations.map((station) => (
                <CircleF
                    key={`${station.tollid}-${station.pass_count}`}
                    center={{ lat: station.lat, lng: station.long }}
                    options={getCircleOptions(station.pass_count, maxPasses)}
                    radius={getCircleRadius(station.pass_count, maxPasses)}
                    onClick={() => setSelectedStation(station)}
                />
            ))}
            {selectedStation && (
                <InfoWindowF
                    position={{ lat: selectedStation.lat, lng: selectedStation.long }}
                    onCloseClick={() => setSelectedStation(null)}
                >
                    <div className="p-2">
                        <h3 className="font-semibold">{selectedStation.name}</h3>
                        <p>Station ID: {selectedStation.tollid}</p>
                        <p>Passes: {selectedStation.pass_count}</p>
                        <p>Total Revenue: €{selectedStation.total_charges.toFixed(2)}</p>
                    </div>
                </InfoWindowF>
            )}
        </GoogleMap>
    )
}

export default function ActualMap() {
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date("2022-01-01T00:00"),
        to: new Date("2022-01-31T23:59"),
    })
    const [stations, setStations] = useState<TollStation[]>([])
    const [selectedStation, setSelectedStation] = useState<TollStation | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!dateRange?.from || !dateRange?.to) return

        setLoading(true)
        setError(null)
        setSelectedStation(null)

        try {
            const fromDate = dateRange.from.toISOString().split('T')[0] + " 00:00"
            const toDate = dateRange.to.toISOString().split('T')[0] + " 23:59"

            const response = await api.get(
                `/tollstations/activity/admin/${encodeURIComponent(fromDate)}/${encodeURIComponent(toDate)}/`
            )

            setStations(response.data)
        } catch (err: any) {
            console.error("Error fetching data:", err)
            setError(err.response?.data?.error || "Failed to fetch data")
            setStations([])
        } finally {
            setLoading(false)
        }
    }, [dateRange])

    useEffect(() => {
        let mounted = true

        const load = async () => {
            if (mounted) {
                await fetchData()
            }
        }

        load()

        return () => {
            mounted = false
        }
    }, [fetchData])

    const maxPasses = useMemo(() => Math.max(...stations.map(s => s.pass_count), 0), [stations])

    return (
        <Card className="w-full">
            <CardContent>
                <div className="mb-4">
                    <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                </div>
                <div className="relative h-[600px]">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                            <div className="text-center py-4">Loading...</div>
                        </div>
                    )}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-red-500 text-center py-4">{error}</div>
                        </div>
                    )}
                    <Map
                        stations={stations}
                        loading={loading}
                        maxPasses={maxPasses}
                        selectedStation={selectedStation}
                        setSelectedStation={setSelectedStation}
                    />
                </div>
            </CardContent>
        </Card>
    )
}