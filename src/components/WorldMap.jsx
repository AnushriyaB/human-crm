import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { feature } from 'topojson-client';
import worldData from '../assets/world-countries.json';

// Group friends by location — returns { singles: [...], clusters: [...] }
function groupByLocation(friends) {
    const locationGroups = {};

    friends.filter(f => f.lat && f.lon).forEach(f => {
        const key = `${Math.round(f.lat * 10) / 10},${Math.round(f.lon * 10) / 10}`;
        if (!locationGroups[key]) locationGroups[key] = [];
        locationGroups[key].push(f);
    });

    const singles = [];
    const clusters = [];

    Object.values(locationGroups).forEach(group => {
        if (group.length === 1) {
            singles.push(group[0]);
        } else {
            clusters.push({
                id: `cluster-${group[0].lat}-${group[0].lon}`,
                lat: group[0].lat,
                lon: group[0].lon,
                friends: group,
            });
        }
    });

    return { singles, clusters };
}

const BRAND = 'var(--color-brand)';
const BRAND_HEX = '#3B82F6';
const CARD_BG = '#FFFFFF';
const BORDER = '#E5E5E5';
const TEXT_PRIMARY = '#1A1A1A';
const SHADOW = 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))';

export default function WorldMap({ friends, onFriendClick }) {
    const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
    const [activeCluster, setActiveCluster] = useState(null); // { id, x, y, friends }
    const mapContainerRef = useRef(null);
    const popoverRef = useRef(null);

    const handleMouseMove = useCallback((e, name) => {
        const rect = e.currentTarget.closest('[data-map-container]')?.getBoundingClientRect();
        if (rect) {
            setTooltip({ visible: true, name, x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    }, []);

    // Close popover on outside click
    useEffect(() => {
        function onDown(e) {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setActiveCluster(null);
            }
        }
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    const geoData = useMemo(() => {
        if (worldData.type === 'Topology' && worldData.objects.countries) {
            return feature(worldData, worldData.objects.countries);
        }
        return worldData;
    }, []);

    const { singles, clusters } = useMemo(() => groupByLocation(friends), [friends]);

    // Get pixel position of a cluster marker for popover anchoring
    const handleClusterClick = useCallback((e, cluster) => {
        e.stopPropagation();
        const container = mapContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        // The click target is inside the SVG marker — use the event coords
        setActiveCluster({
            id: cluster.id,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            friends: cluster.friends,
        });
    }, []);

    if (!geoData) {
        return null;
    }

    return (
        <div ref={mapContainerRef} className="w-full h-full absolute inset-0 overflow-hidden relative" data-map-container style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 140 }}
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
                                onMouseMove={(e) => handleMouseMove(e, geo.properties.name)}
                                onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                                style={{
                                    default: { fill: "#f3f4f6", stroke: "#e5e7eb", strokeWidth: 0.5, outline: "none", transition: "fill 200ms ease" },
                                    hover: { fill: "#dbeafe", stroke: "#93c5fd", strokeWidth: 0.8, outline: "none", transition: "fill 200ms ease, stroke 200ms ease", cursor: "default" },
                                    pressed: { fill: "#bfdbfe", outline: "none" },
                                }}
                            />
                        ));
                    }}
                </Geographies>

                {/* Single markers */}
                {singles.map((f) => {
                    const hasPhoto = f.photo && f.photo.length > 0;
                    const labelChars = Math.min(f.name?.length || 1, 8);
                    const labelW = labelChars * 5.5 + 16;
                    const labelH = 16;

                    return (
                        <Marker key={f.id} coordinates={[f.lon, f.lat]}>
                            <motion.g
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                whileHover={{ scale: 1.1 }}
                                className="cursor-pointer"
                                onClick={() => onFriendClick && onFriendClick(f)}
                            >
                                <defs>
                                    {hasPhoto && (
                                        <clipPath id={`clip-${f.id}`}>
                                            <circle cx={0} cy={-24} r={14} />
                                        </clipPath>
                                    )}
                                </defs>

                                {hasPhoto ? (
                                    <>
                                        <circle cx={0} cy={-24} r={16} fill={CARD_BG} style={{ filter: SHADOW }} />
                                        <circle cx={0} cy={-24} r={16} fill="none" stroke={f.isMe ? BRAND_HEX : BORDER} strokeWidth={f.isMe ? 2 : 1.5} />
                                        <image href={f.photo} x={-14} y={-38} width={28} height={28} clipPath={`url(#clip-${f.id})`} preserveAspectRatio="xMidYMid slice" />
                                    </>
                                ) : (
                                    <>
                                        <circle cx={0} cy={-24} r={16} fill={CARD_BG} style={{ filter: SHADOW }} />
                                        <circle cx={0} cy={-24} r={16} fill="none" stroke={f.isMe ? BRAND_HEX : BORDER} strokeWidth={f.isMe ? 2 : 1.5} />
                                        <text x={0} y={-19} textAnchor="middle" style={{ fontFamily: "'Satoshi', system-ui, sans-serif", fontSize: "13px", fill: BRAND_HEX, fontWeight: "600", pointerEvents: "none" }}>
                                            {(f.name || '?').charAt(0).toUpperCase()}
                                        </text>
                                    </>
                                )}

                                {/* Name label */}
                                <rect x={-labelW / 2} y={-8} width={labelW} height={labelH} rx={2} fill={CARD_BG} stroke={BORDER} strokeWidth={0.75} style={{ filter: SHADOW }} />
                                <text x={0} y={3} textAnchor="middle" style={{ fontFamily: "'Satoshi', system-ui, sans-serif", fontSize: "8px", fill: f.isMe ? BRAND_HEX : TEXT_PRIMARY, fontWeight: f.isMe ? "600" : "500", textTransform: "lowercase", pointerEvents: "none" }}>
                                    {f.name?.length > 8 ? f.name.slice(0, 7) + '...' : f.name}
                                </text>

                                {/* Pointer dot */}
                                <circle cx={0} cy={10} r={2.5} fill={BRAND_HEX} />
                            </motion.g>
                        </Marker>
                    );
                })}

                {/* Cluster markers */}
                {clusters.map((cluster) => {
                    const count = cluster.friends.length;
                    // Show up to 2 stacked initials + a +N badge
                    const visible = cluster.friends.slice(0, 2);
                    const stackWidth = 13; // offset per stacked circle

                    return (
                        <Marker key={cluster.id} coordinates={[cluster.lon, cluster.lat]}>
                            <motion.g
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                whileHover={{ scale: 1.1 }}
                                className="cursor-pointer"
                                onClick={(e) => handleClusterClick(e, cluster)}
                            >
                                {/* Stacked avatar circles, rendered back to front */}
                                {visible.map((f, i) => {
                                    const cx = (visible.length - 1 - i) * stackWidth;
                                    return (
                                        <g key={f.id}>
                                            <circle cx={cx} cy={-24} r={14} fill={CARD_BG} style={{ filter: SHADOW }} />
                                            <circle cx={cx} cy={-24} r={14} fill="none" stroke={f.isMe ? BRAND_HEX : BORDER} strokeWidth={1.5} />
                                            <text x={cx} y={-19} textAnchor="middle" style={{ fontFamily: "'Satoshi', system-ui, sans-serif", fontSize: "11px", fill: BRAND_HEX, fontWeight: "600", pointerEvents: "none" }}>
                                                {(f.name || '?').charAt(0).toUpperCase()}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* +N badge — positioned to the right of the stack */}
                                {(() => {
                                    const badgeX = (visible.length - 1) * stackWidth + 22;
                                    const remaining = count - visible.length;
                                    const label = `+${remaining}`;
                                    const badgeW = label.length > 1 ? 18 : 16;
                                    return (
                                        <g>
                                            <circle cx={badgeX} cy={-24} r={badgeW / 2 + 1} fill={BRAND_HEX} style={{ filter: SHADOW }} />
                                            <text x={badgeX} y={-19.5} textAnchor="middle" style={{ fontFamily: "'Satoshi', system-ui, sans-serif", fontSize: "9px", fill: "#FFFFFF", fontWeight: "600", pointerEvents: "none" }}>
                                                {label}
                                            </text>
                                        </g>
                                    );
                                })()}

                                {/* Pointer dot — centered under the stack */}
                                <circle cx={(visible.length - 1) * stackWidth / 2} cy={2} r={2.5} fill={BRAND_HEX} />
                            </motion.g>
                        </Marker>
                    );
                })}
            </ComposableMap>

            {/* Country name tooltip */}
            <AnimatePresence>
                {tooltip.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute pointer-events-none z-50 text-xs font-medium lowercase whitespace-nowrap"
                        style={{ left: tooltip.x, top: tooltip.y - 28, transform: 'translateX(-50%)', color: 'var(--color-text-primary)' }}
                    >
                        {tooltip.name}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cluster popover */}
            <AnimatePresence>
                {activeCluster && (
                    <motion.div
                        ref={popoverRef}
                        initial={{ opacity: 0, scale: 0.92, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 6 }}
                        transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                        className="absolute z-50 rounded-[8px] shadow-lg overflow-hidden"
                        style={{
                            left: activeCluster.x,
                            top: activeCluster.y - 12,
                            transform: 'translate(-50%, -100%)',
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            minWidth: '140px',
                        }}
                    >
                        {/* Arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px]" style={{ width: 10, height: 6 }}>
                            <svg width="10" height="6" viewBox="0 0 10 6">
                                <path d="M0 0 L5 6 L10 0 Z" fill="var(--color-card-bg)" />
                                <path d="M0 0 L5 5 L10 0" fill="none" stroke="var(--color-border)" strokeWidth="1" />
                            </svg>
                        </div>

                        {activeCluster.friends.map((f, i) => (
                            <button
                                key={f.id}
                                onClick={() => {
                                    onFriendClick && onFriendClick(f);
                                    setActiveCluster(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-blue-50"
                                style={{ borderBottom: i < activeCluster.friends.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                            >
                                {/* Mini avatar */}
                                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                                    style={{ backgroundColor: f.isMe ? BRAND_HEX : '#F3F4F6', border: `1.5px solid ${f.isMe ? BRAND_HEX : BORDER}` }}
                                >
                                    {(f.photos && f.photos.length > 0) || f.photo ? (
                                        <img src={f.photos?.[0] || f.photo} alt={f.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span style={{ fontSize: '9px', fontFamily: "'Satoshi', system-ui, sans-serif", color: f.isMe ? '#FFF' : BRAND_HEX, fontWeight: '600' }}>
                                            {(f.name || '?').charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                {/* Name */}
                                <span className="text-xs font-medium lowercase whitespace-nowrap" style={{ color: f.isMe ? BRAND_HEX : 'var(--color-text-primary)', fontFamily: "'Satoshi', system-ui, sans-serif" }}>
                                    {f.name || 'friend'}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
