import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface TollStation {
    id: number
    name: string
    lat: number
    lng: number
    passes: number
}

interface MapProps {
    tollStations: TollStation[]
}

const getColor = (passes: number) => {
    if (passes < 1000) return "#00ff00"
    if (passes < 2000) return "#ffff00"
    if (passes < 3000) return "#ff9900"
    return "#ff0000"
}

export default function Map({ tollStations }: MapProps) {
    return (
        <MapContainer center={[38.2749, 23.8087]} zoom={7} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {tollStations.map((station) => (
                <CircleMarker
                    key={station.id}
                    center={[station.lat, station.lng]}
                    radius={10}
                    fillColor={getColor(station.passes)}
                    color="#000"
                    weight={1}
                    opacity={1}
                    fillOpacity={0.8}
                >
                    <Tooltip>
                        <div>
                            <strong>{station.name}</strong>
                            <br />
                            Passes: {station.passes}
                        </div>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}