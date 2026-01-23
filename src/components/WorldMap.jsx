import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { feature } from 'topojson-client';
import worldData from '../assets/world-countries.json';

export default function WorldMap({ friends, onFriendClick }) {
    const geoData = useMemo(() => {
        // Explicitly convert TopoJSON to GeoJSON features
        if (worldData.type === 'Topology' && worldData.objects.countries) {
            return feature(worldData, worldData.objects.countries);
        }
        return worldData;
    }, []);

    if (!geoData) {
        return null;
    }

    return (
        <div className="w-full h-full absolute inset-0 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 140
                }}
                className="w-full h-full"
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={geoData}>
                    {({ geographies }) => {
                        if (!geographies) return null;

                        return geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="var(--color-card-bg)"
                                stroke="var(--color-border)"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "var(--color-highlight)", outline: "none", transition: "all 250ms" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ));
                    }}
                </Geographies>

                {friends.filter(f => f.lat && f.lon).map((f) => (
                    <Marker key={f.id} coordinates={[f.lon, f.lat]} onClick={() => onFriendClick && onFriendClick(f)}>
                        <motion.g
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            whileHover={{ scale: 1.2 }}
                            className="cursor-pointer"
                        >
                            <circle
                                r={f.isMe ? 6 : 4}
                                fill={f.isMe ? "var(--color-brand)" : "var(--color-text-primary)"}
                                stroke="var(--color-bg-primary)"
                                strokeWidth={2}
                            />
                            {/* Simple tooltip label */}
                            <text
                                textAnchor="middle"
                                y={f.isMe ? -10 : -8}
                                style={{
                                    fontFamily: "system-ui",
                                    fontSize: "8px",
                                    fill: "var(--color-text-primary)",
                                    fontWeight: "bold",
                                    textTransform: "lowercase",
                                    pointerEvents: "none"
                                }}
                            >
                                {f.name}
                            </text>
                        </motion.g>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
