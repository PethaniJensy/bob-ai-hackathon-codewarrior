import { MapPin, Truck, Snowflake, Navigation, AlertTriangle } from 'lucide-react'

/**
 * LogisticsMap — Static SVG map component designed for Leaflet/Mapbox integration.
 * Shows the logistics scenario visually without external map dependencies.
 */
export default function LogisticsMap() {
  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-surface-500" />
          <span className="text-sm font-bold text-navy-950">Logistics Situation Map</span>
        </div>
        <span className="label-upper text-surface-400">Wyoming Corridor — Live View</span>
      </div>

      <div className="relative bg-[#EEF2F7] rounded-b-lg overflow-hidden" style={{ height: 280 }}>
        {/* SVG map */}
        <svg viewBox="0 0 700 280" className="w-full h-full" aria-label="Logistics map showing shipment route, disruption zone, and rescue unit">
          {/* Background regions */}
          <rect x="0" y="0" width="700" height="280" fill="#EEF2F7" />
          <rect x="0" y="160" width="700" height="120" fill="#E8EEF5" />

          {/* Grid lines */}
          {[0,1,2,3,4,5,6].map(i => (
            <line key={`v${i}`} x1={i*100+50} y1="0" x2={i*100+50} y2="280" stroke="#D8E4F0" strokeWidth="0.5" />
          ))}
          {[0,1,2,3,4].map(i => (
            <line key={`h${i}`} x1="0" y1={i*60+30} x2="700" y2={i*60+30} stroke="#D8E4F0" strokeWidth="0.5" />
          ))}

          {/* I-80 highway */}
          <path
            d="M 50 155 Q 200 145 300 148 Q 360 150 400 152"
            fill="none" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round"
          />
          <path
            d="M 50 155 Q 200 145 300 148 Q 360 150 400 152"
            fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round"
          />
          <text x="120" y="143" fontSize="9" fill="#64748B" fontWeight="600">I-80</text>

          {/* Closed I-80 section */}
          <path
            d="M 400 152 Q 440 154 480 158 Q 520 162 550 165"
            fill="none" stroke="#FCA5A5" strokeWidth="5" strokeLinecap="round"
          />
          <path
            d="M 400 152 Q 440 154 480 158 Q 520 162 550 165"
            fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round"
          />

          {/* CLOSED label */}
          <rect x="430" y="130" width="60" height="16" rx="3" fill="#DC2626" opacity="0.9" />
          <text x="460" y="141" fontSize="9" fill="white" fontWeight="700" textAnchor="middle">CLOSED</text>

          {/* Alternative route */}
          <path
            d="M 400 152 Q 380 100 350 75 Q 320 50 280 65 Q 250 78 230 100"
            fill="none" stroke="#16A34A" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round"
          />
          <text x="290" y="68" fontSize="8" fill="#16A34A" fontWeight="600">Alt Route</text>

          {/* Storm zone */}
          <ellipse cx="490" cy="150" rx="120" ry="75" fill="#DBEAFE" opacity="0.5" />
          <ellipse cx="490" cy="150" rx="120" ry="75" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="490" y="108" fontSize="9" fill="#2563EB" fontWeight="600" textAnchor="middle">Winter Storm Boreas</text>
          <text x="490" y="120" fontSize="8" fill="#2563EB" textAnchor="middle">I-80 Closure Zone</text>

          {/* Snowflake icons in storm zone */}
          {[[455,140],[510,155],[480,165],[520,130]].map(([x,y],i) => (
            <text key={i} x={x} y={y} fontSize="11" fill="#93C5FD" textAnchor="middle">❄</text>
          ))}

          {/* Shipment truck (Cheyenne position) */}
          <circle cx="380" cy="152" r="16" fill="#0B1F3A" />
          <text x="380" y="157" fontSize="11" fill="white" textAnchor="middle">🚛</text>
          <rect x="345" y="118" width="70" height="22" rx="4" fill="#0B1F3A" />
          <text x="380" y="132" fontSize="8" fill="white" textAnchor="middle" fontWeight="700">SHP-8801 ⚠</text>

          {/* Rescue reefer */}
          <circle cx="360" cy="205" r="14" fill="#16A34A" />
          <text x="360" y="210" fontSize="10" fill="white" textAnchor="middle">🚚</text>
          <rect x="322" y="222" width="76" height="20" rx="4" fill="#16A34A" />
          <text x="360" y="235" fontSize="8" fill="white" textAnchor="middle" fontWeight="700">REEFER-WY-04</text>

          {/* Distance line */}
          <line x1="360" y1="191" x2="378" y2="167" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3 2" />
          <rect x="327" y="184" width="42" height="14" rx="3" fill="white" stroke="#16A34A" strokeWidth="1" />
          <text x="348" y="194" fontSize="8" fill="#16A34A" fontWeight="700" textAnchor="middle">14.2 mi</text>

          {/* Cold storage */}
          <rect x="270" y="90" width="14" height="14" rx="2" fill="#2563EB" />
          <text x="277" y="100" fontSize="8" fill="white" textAnchor="middle" fontWeight="700">CS</text>
          <text x="277" y="115" fontSize="7.5" fill="#2563EB" textAnchor="middle">Cold Storage</text>

          {/* Origin marker */}
          <circle cx="60" cy="155" r="6" fill="#334155" />
          <text x="60" y="173" fontSize="8" fill="#334155" textAnchor="middle" fontWeight="600">Omaha</text>

          {/* Destination marker */}
          <circle cx="635" cy="158" r="6" fill="#334155" />
          <text x="635" y="175" fontSize="8" fill="#334155" textAnchor="middle" fontWeight="600">Salt Lake</text>

          {/* Legend */}
          <rect x="10" y="10" width="180" height="80" rx="6" fill="white" opacity="0.9" />
          <text x="20" y="28" fontSize="9" fill="#0B1F3A" fontWeight="700">LEGEND</text>
          <circle cx="22" cy="40" r="5" fill="#0B1F3A" />
          <text x="32" y="44" fontSize="8" fill="#334155">SHP-8801 (Critical)</text>
          <circle cx="22" cy="56" r="5" fill="#16A34A" />
          <text x="32" y="60" fontSize="8" fill="#334155">REEFER-WY-04 (Rescue)</text>
          <rect x="17" y="65" width="10" height="6" rx="1" fill="#DC2626" opacity="0.7" />
          <text x="32" y="73" fontSize="8" fill="#334155">Storm / Closure Zone</text>
          <line x1="17" y1="83" x2="27" y2="83" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="32" y="86" fontSize="8" fill="#334155">Alternative Route</text>
        </svg>

        {/* Overlay labels */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/90 border border-surface-200 rounded-md px-2 py-1">
          <Navigation size={10} className="text-brand-blue" />
          <span className="text-xs text-surface-600 font-medium">Cheyenne, WY Region</span>
        </div>
      </div>
    </div>
  )
}
