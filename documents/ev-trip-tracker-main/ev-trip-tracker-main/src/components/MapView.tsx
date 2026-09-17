"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DecoratedCharge } from "@/lib/charges";

// Phase 2 — route map. Loaded dynamically (ssr:false) since Leaflet needs the
// DOM. Plots every charge that has coordinates and links them in trip order.

interface Point {
  id: string;
  pos: [number, number];
  charge: DecoratedCharge;
}

// Flag emoji in a teardrop pin (avoids Leaflet's broken default-icon paths).
function flagIcon(flag: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
        width:34px;height:34px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);background:#fff;border:2px solid #ff5a3c;
        box-shadow:0 4px 10px rgba(22,49,74,0.35);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);font-size:16px;">${flag}</span>
      </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

// Fit the viewport to all points whenever they change.
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 9);
      return;
    }
    map.fitBounds(points, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export function MapView({
  charges,
  onOpen,
}: {
  charges: DecoratedCharge[];
  onOpen: (id: string) => void;
}) {
  // Parse coordinates (Postgres numeric can arrive as string) and drop blanks.
  const points: Point[] = useMemo(() => {
    return charges
      .map((c) => {
        const lat = Number(c.raw.latitude);
        const lng = Number(c.raw.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { id: c.raw.id, pos: [lat, lng] as [number, number], charge: c };
      })
      .filter((p): p is Point => p !== null);
  }, [charges]);

  // `charges` is newest-first; reverse for a chronological route line.
  const line = useMemo(
    () => [...points].reverse().map((p) => p.pos),
    [points],
  );
  const bounds = useMemo(() => points.map((p) => p.pos), [points]);

  if (points.length === 0) {
    return (
      <div className="bg-white border-[1.5px] border-dashed border-[#e2d8c7] rounded-[20px] px-6 py-[40px] text-center">
        <div className="text-[34px]">🗺️</div>
        <div className="text-base font-extrabold mt-2">No mapped stops yet</div>
        <div className="text-[13px] text-[#8a93a0] mt-1 leading-relaxed">
          Add coordinates to a charge (tap{" "}
          <b className="text-accent">📍 Use my location</b> in the form) to see
          it here.
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={points[0].pos}
      zoom={7}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {line.length > 1 && (
        <Polyline
          positions={line}
          pathOptions={{ color: "#ff5a3c", weight: 3, opacity: 0.85 }}
        />
      )}
      {points.map((p) => (
        <Marker key={p.id} position={p.pos} icon={flagIcon(p.charge.flag)}>
          <Popup>
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              {p.charge.raw.city}
            </div>
            <div style={{ color: "#8a93a0", fontSize: 12, fontWeight: 600 }}>
              {p.charge.costEur} · {p.charge.kwhLabel} kWh
            </div>
            <button
              onClick={() => onOpen(p.id)}
              style={{
                marginTop: 6,
                color: "#ff5a3c",
                fontWeight: 800,
                fontSize: 12,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Open details →
            </button>
          </Popup>
        </Marker>
      ))}
      <FitBounds points={bounds} />
    </MapContainer>
  );
}
