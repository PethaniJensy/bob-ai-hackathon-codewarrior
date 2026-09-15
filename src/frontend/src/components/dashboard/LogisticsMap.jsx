import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const truckIcon = L.divIcon({ className: '', html: '🚛', iconSize: [24, 24] })

export default function LogisticsMap({ shipments = [], fleet = [] }) {
  return (
    <div className="card">
      <div className="card-header">...</div>
      <MapContainer center={[41.14, -104.82]} zoom={8} style={{ height: 280 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {shipments.map(s => (
          <Marker key={s.id} position={[s.current_location.lat, s.current_location.lng]} icon={truckIcon}>
            <Popup>
              <b>{s.id}</b><br/>
              {s.carrier}<br/>
              Driver: {s.driver_name}<br/>
              Phone: {s.driver_phone}<br/>
              Vehicle: {s.vehicle_number}
            </Popup>
          </Marker>
        ))}
        {fleet.map(f => (
          <Marker key={f.asset_id} position={[f.location.lat, f.location.lng]} icon={truckIcon}>
            <Popup>
              <b>{f.asset_id}</b><br/>
              Driver: {f.driver_name}<br/>
              Phone: {f.driver_phone}<br/>
              Vehicle: {f.vehicle_number}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}