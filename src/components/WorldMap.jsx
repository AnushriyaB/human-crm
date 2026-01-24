import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { feature } from 'topojson-client';
import worldData from '../assets/world-countries.json';

// Spread out overlapping markers
function spreadOverlappingMarkers(friends) {
    const processed = [];
    const locationGroups = {};

    // Group friends by approximate location (rounded to 2 decimal places)
    friends.filter(f => f.lat && f.lon).forEach(f => {
        const key = `${Math.round(f.lat * 100) / 100},${Math.round(f.lon * 100) / 100}`;
        if (!locationGroups[key]) {
            locationGroups[key] = [];
        }
        locationGroups[key].push(f);
    });

    // Spread out groups with multiple friends
    Object.values(locationGroups).forEach(group => {
        if (group.length === 1) {
            processed.push({ ...group[0], offsetX: 0, offsetY: 0 });
        } else {
            // Spread in a circle around the center
            const angleStep = (2 * Math.PI) / group.length;
            const radius = 20; // pixels offset
            group.forEach((f, i) => {
                const angle = i * angleStep - Math.PI / 2; // Start from top
                processed.push({
                    ...f,
                    offsetX: Math.cos(angle) * radius,
                    offsetY: Math.sin(angle) * radius
                });
            });
        }
    });

    return processed;
}

// Generate gradient color based on name
function getGradientColors(name) {
    const gradients = [
        ['#8B5CF6', '#A855F7'], // violet-purple
        ['#3B82F6', '#6366F1'], // blue-indigo
        ['#10B981', '#14B8A6'], // emerald-teal
        ['#F97316', '#F43F5E'], // orange-rose
        ['#EC4899', '#D946EF'], // pink-fuchsia
    ];
    const hash = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
}

export default function WorldMap({ friends, onFriendClick }) {
    const geoData = useMemo(() => {
        if (worldData.type === 'Topology' && worldData.objects.countries) {
            return feature(worldData, worldData.objects.countries);
        }
        return worldData;
    }, []);

    // Process friends to spread overlapping ones
    const processedFriends = useMemo(() => spreadOverlappingMarkers(friends), [friends]);

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

                {processedFriends.map((f) => {
                    const [gradStart, gradEnd] = getGradientColors(f.name);
                    const hasPhoto = f.photo && f.photo.length > 0;

                    return (
                        <Marker key={f.id} coordinates={[f.lon, f.lat]}>
                            <motion.g
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                whileHover={{ scale: 1.15 }}
                                className="cursor-pointer"
                                onClick={() => onFriendClick && onFriendClick(f)}
                                style={{ transform: `translate(${f.offsetX}px, ${f.offsetY}px)` }}
                            >
                                <defs>
                                    <linearGradient id={`grad-${f.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={gradStart} />
                                        <stop offset="100%" stopColor={gradEnd} />
                                    </linearGradient>
                                    {hasPhoto && (
                                        <clipPath id={`clip-${f.id}`}>
                                            <circle cx={0} cy={-28} r={18} />
                                        </clipPath>
                                    )}
                                </defs>

                                {hasPhoto ? (
                                    <>
                                        {/* Photo circle - no background card */}
                                        <image
                                            href={f.photo}
                                            x={-18}
                                            y={-46}
                                            width={36}
                                            height={36}
                                            clipPath={`url(#clip-${f.id})`}
                                            preserveAspectRatio="xMidYMid slice"
                                        />
                                        {/* Subtle ring around photo */}
                                        <circle
                                            cx={0}
                                            cy={-28}
                                            r={18}
                                            fill="none"
                                            stroke={f.isMe ? gradStart : "rgba(255,255,255,0.8)"}
                                            strokeWidth={2}
                                            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* Subtle pastel circle for no-photo avatars */}
                                        <circle
                                            cx={0}
                                            cy={-28}
                                            r={18}
                                            fill={`url(#grad-${f.id})`}
                                            opacity={0.9}
                                            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" }}
                                        />
                                        <text
                                            x={0}
                                            y={-23}
                                            textAnchor="middle"
                                            style={{
                                                fontFamily: "system-ui",
                                                fontSize: "14px",
                                                fill: "white",
                                                fontWeight: "bold",
                                                pointerEvents: "none"
                                            }}
                                        >
                                            {(f.name || '?').charAt(0).toUpperCase()}
                                        </text>
                                    </>
                                )}

                                {/* Name label with subtle background pill */}
                                <rect
                                    x={-(Math.min(f.name?.length || 1, 8) * 3.5 + 8)}
                                    y={-12}
                                    width={Math.min(f.name?.length || 1, 8) * 7 + 16}
                                    height={14}
                                    rx={7}
                                    fill="rgba(255,255,255,0.85)"
                                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
                                />
                                <text
                                    x={0}
                                    y={-2}
                                    textAnchor="middle"
                                    style={{
                                        fontFamily: "system-ui",
                                        fontSize: "9px",
                                        fill: f.isMe ? gradStart : "#374151",
                                        fontWeight: f.isMe ? "bold" : "600",
                                        textTransform: "lowercase",
                                        pointerEvents: "none"
                                    }}
                                >
                                    {f.name?.length > 8 ? f.name.slice(0, 7) + '...' : f.name}
                                </text>

                                {/* Small pointer dot */}
                                <circle
                                    cx={0}
                                    cy={4}
                                    r={3}
                                    fill={hasPhoto ? "rgba(255,255,255,0.9)" : `url(#grad-${f.id})`}
                                    stroke={hasPhoto ? "rgba(0,0,0,0.1)" : "none"}
                                    strokeWidth={1}
                                />
                            </motion.g>
                        </Marker>
                    );
                })}
            </ComposableMap>
        </div>
    );
}
