import React, { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Search, Plus, Trash2, X, Move, ChevronRight, Image as ImageIcon, Sparkles, Layout, RotateCw, ZoomIn, ZoomOut, Check, Pencil } from 'lucide-react';

const getStockImages = (query = '') => {
    // Use Picsum for reliable placeholders since active unsplash source API is deprecated/unreliable without key
    // We can add a "seed" to make them consistent but different
    return Array.from({ length: 12 }).map((_, i) => {
        return `https://picsum.photos/seed/${query}${i}/300/400`;
    });
};

// Fallback static images if source.unsplash is unreliable
const STATIC_IMAGES = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1550973886-ef5369682f19?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1518005052357-e9847508d4e4?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1528698782015-ab19f9f59fbf?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=300&q=80"
];

const COLORS = [
    '#FFFFFF', '#FDF2F8', '#FEFCE8', '#F0FDF4', '#ECFEFF', '#F5F3FF', '#FDF4FF',
    '#F87171', '#FB923C', '#FACC15', '#4ADE80', '#22D3EE', '#A78BFA', '#E879F9',
    '#DC2626', '#B45309', '#65A30D', '#166534', '#15803D', '#7E22CE', '#BE185D',
    '#991B1B', '#78350F', '#365314', '#064E3B', '#1E3A8A', '#4C1D95', '#831843', '#000000'
];

export default function CollageCard({ module, isEditing, onUpdate, onRemove }) {
    // Mode: 'list' (default) or 'editor' (when creating)
    // If no collages exist, default to 'list' which will show empty state with create button
    const [mode, setMode] = useState(module.data?.collages?.length > 0 ? 'list' : 'editor');

    // Editor State
    const [activeTab, setActiveTab] = useState('ideas');
    const [searchQuery, setSearchQuery] = useState('');
    const [bgOpen, setBgOpen] = useState(false);
    const [images, setImages] = useState(STATIC_IMAGES);
    const canvasRef = useRef(null);

    // Get current items/bg from module data or defaults
    const items = module.data?.currentItems || [];
    const backgroundColor = module.data?.backgroundColor || '#FFFFFF';
    const savedCollages = module.data?.collages || [];

    const handleSearch = () => {
        if (!searchQuery) {
            setImages(STATIC_IMAGES);
            return;
        }
        setImages(getStockImages(searchQuery));
        setActiveTab('search_results');
    };

    const updateEditorData = (updates) => {
        onUpdate?.({ ...module.data, ...updates });
    };

    const updateItems = (newItems) => {
        updateEditorData({ currentItems: newItems });
    };

    const addItem = (src) => {
        // Center position with slight random offset
        const newItem = {
            id: Date.now().toString(),
            type: 'image',
            src,
            x: 40 + Math.random() * 20, // 40-60% range for centered placement
            y: 40 + Math.random() * 20,
            rotation: (Math.random() - 0.5) * 10, // Slight rotation
            scale: 1,
            zIndex: items.length + 1
        };
        updateItems([...items, newItem]);
    };

    const updateItemPosition = (id, newX, newY) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, x: newX, y: newY } : item
        );
        updateItems(updatedItems);
    };

    const removeItem = (id) => {
        updateItems(items.filter(item => item.id !== id));
    };

    const handleSaveCollage = () => {
        // Save current state as a new collage
        const newCollage = {
            id: Date.now(),
            items: [...items],
            backgroundColor,
            date: new Date().toISOString()
        };

        const newCollages = [newCollage, ...savedCollages];

        onUpdate?.({
            ...module.data,
            collages: newCollages,
            currentItems: [], // Clear editor
            backgroundColor: '#FFFFFF'
        });

        setMode('list');
    };

    // LIST VIEW
    if (mode === 'list' && savedCollages.length > 0) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] lowercase">your collages ({savedCollages.length})</h3>
                    <button
                        onClick={() => setMode('editor')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-xs font-medium transition-all lowercase
                            bg-[var(--color-button-bg)] text-[var(--color-text-primary)]
                            shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                            hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                            active:shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.15)]"
                    >
                        <Plus size={14} />
                        new collage
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {savedCollages.map(collage => (
                        <div key={collage.id} className="aspect-[3/4] rounded-2xl border border-[var(--color-border)] overflow-hidden relative group bg-white shadow-sm" style={{ backgroundColor: collage.backgroundColor }}>
                            {/* Mini preview of items */}
                            {(collage.items || []).map((item) => (
                                <div
                                    key={item.id}
                                    className="absolute"
                                    style={{
                                        left: `${item.x}%`,
                                        top: `${item.y}%`,
                                        width: '40%',
                                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale * 0.5})`,
                                        zIndex: item.zIndex
                                    }}
                                >
                                    <img src={item.src} className="w-full rounded-sm shadow-sm" />
                                </div>
                            ))}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        // Load collage into editor
                                        updateEditorData({
                                            currentItems: [...collage.items],
                                            backgroundColor: collage.backgroundColor
                                        });
                                        // Remove from saved list (editing = destructive to original)
                                        const newCollages = savedCollages.filter(c => c.id !== collage.id);
                                        onUpdate?.({ ...module.data, collages: newCollages, currentItems: [...collage.items], backgroundColor: collage.backgroundColor });
                                        setMode('editor');
                                    }}
                                    className="p-2 rounded-[6px] transition-all
                                        bg-[var(--color-button-bg)] text-[var(--color-text-secondary)]
                                        shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:text-[var(--color-text-primary)]"
                                    title="Edit collage"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        const newCollages = savedCollages.filter(c => c.id !== collage.id);
                                        onUpdate?.({ ...module.data, collages: newCollages });
                                    }}
                                    className="p-2 rounded-[6px] transition-all
                                        bg-[var(--color-button-bg)] text-red-400
                                        shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:text-red-500"
                                    title="Delete collage"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // EMPTY STATE (List view but no items) -> Redirect to Editor or specific empty UI?
    // User requested: "The default view ... would be to 'create a collage' ... otherwise it would show the collages"
    // So if no collages, show editor directly? Or an empty state button? 
    // Let's stick to logic: if collages.length === 0, we set mode='editor' initially. 
    // But if user deletes all collages, we might end up here.
    if (mode === 'list' && savedCollages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-secondary)]/30">
                <div className="w-16 h-16 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="text-[var(--color-brand)]" size={32} />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1 lowercase">no collages yet</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">start collecting your ideas</p>
                <button
                    onClick={() => setMode('editor')}
                    className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm lowercase"
                >
                    create collage
                </button>
            </div>
        );
    }

    // EDITOR VIEW
    return (
        <div className="flex h-[600px] w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm relative">
            {/* Main Canvas Area */}
            <div className="flex-1 relative overflow-hidden" style={{ backgroundColor }}>
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        {savedCollages.length > 0 && (
                            <button onClick={() => setMode('list')} className="p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full shadow-sm text-[var(--color-text-secondary)] hover:text-black transition-colors">
                                <ChevronRight className="rotate-180" size={18} />
                            </button>
                        )}
                        <h2 className="text-lg font-bold lowercase">create collage</h2>
                    </div>
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <div className="relative">
                            <button
                                onClick={() => setBgOpen(!bgOpen)}
                                className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor }}
                            />
                            {bgOpen && (
                                <div className="absolute top-full right-0 mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-100 grid grid-cols-7 gap-1.5 w-[280px]">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => { updateEditorData({ backgroundColor: c }); setBgOpen(false); }}
                                            className="w-8 h-8 rounded-full border border-gray-100 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSaveCollage}
                            disabled={items.length === 0}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm lowercase flex items-center gap-2 ${items.length === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            {items.length === 0 ? 'empty' : 'save'}
                            <Check size={14} className={items.length === 0 ? 'hidden' : 'block'} />
                        </button>
                    </div>
                </div>

                {/* Canvas Items */}
                <div ref={canvasRef} className="absolute inset-0">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            drag
                            dragMomentum={false}
                            dragConstraints={canvasRef}
                            dragElastic={0.1}
                            onDragEnd={(e, info) => {
                                // Calculate new percentage position based on drag offset
                                if (canvasRef.current) {
                                    const rect = canvasRef.current.getBoundingClientRect();
                                    // Current position + offset converted to percentage (no clamping for free flow)
                                    const newX = item.x + (info.offset.x / rect.width) * 100;
                                    const newY = item.y + (info.offset.y / rect.height) * 100;
                                    updateItemPosition(item.id, newX, newY);
                                }
                            }}
                            className="absolute cursor-move group"
                            style={{
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                                transform: `translate(-50%, -50%)`,
                                rotate: item.rotation,
                                scale: item.scale,
                                zIndex: item.zIndex
                            }}
                        >
                            {/* ... Content ... */}
                            <div className="relative shadow-lg group-hover:shadow-xl transition-shadow">
                                <img src={item.src} className="w-40 h-auto rounded-lg pointer-events-none" />
                                <div className="absolute -top-3 -right-3 hidden group-hover:flex gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                        className="p-1.5 bg-white rounded-full text-red-500 shadow-md hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {items.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                            <Sparkles size={48} className="mb-4 opacity-50" />
                            <p className="text-sm lowercase">drag images from the sidebar</p>
                        </div>
                    )}
                </div>

                {/* Footer Tools */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white p-1.5 rounded-full shadow-lg border border-gray-100 pointer-events-auto">
                    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-600"><Layout size={18} /></button>
                    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-600"><RotateCw size={18} /></button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button onClick={() => updateItems([])} className="p-2 hover:bg-gray-50 rounded-full text-gray-600 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[320px] bg-white border-l flex flex-col z-20">
                <div className="p-4 border-b border-[var(--color-border)]">
                    {activeTab === 'search_results' ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setActiveTab('ideas');
                                    setSearchQuery('');
                                }}
                                className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors lowercase"
                            >
                                <ChevronRight className="rotate-180" size={14} />
                                back
                            </button>
                            <span className="text-xs text-[var(--color-text-tertiary)] ml-auto lowercase">results for "{searchQuery}"</span>
                        </div>
                    ) : (
                        <div className="relative group">
                            <button
                                onClick={handleSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors focus:outline-none"
                            >
                                <Search size={14} />
                            </button>
                            <input
                                type="text"
                                placeholder="search photos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="w-full bg-[var(--color-bg-secondary)] pl-9 pr-4 py-2 text-sm rounded-[8px] border border-transparent focus:bg-white focus:border-[var(--color-border)] focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-muted)] transition-all placeholder:text-[var(--color-text-tertiary)] lowercase"
                            />
                        </div>
                    )}
                </div>

                {activeTab !== 'search_results' && (
                    <div className="px-4 pt-4 pb-2">
                        <div className="flex p-1 gap-1 bg-[var(--color-button-bg)] rounded-[8px] shadow-[inset_0_1px_4px_0_rgba(0,0,0,0.05)]">
                            {[
                                { id: 'ideas', label: 'more ideas' },
                                { id: 'mycollages', label: 'my collages' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative flex-1 py-1.5 text-xs font-medium transition-colors rounded-[6px] focus:outline-none z-10 lowercase"
                                    style={{
                                        color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                                    }}
                                >
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="collageSidebarTab"
                                            className="absolute inset-0 bg-white rounded-[6px] shadow-sm z-[-1]"
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">

                    {(activeTab === 'ideas' || activeTab === 'search_results') && (
                        <div className="columns-2 gap-3 space-y-3">
                            {images.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => addItem(src)}
                                    className="block w-full rounded-lg overflow-hidden relative group hover:opacity-90 transition-opacity"
                                >
                                    <img src={src} className="w-full h-auto" loading="lazy" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="text-white drop-shadow-md" />
                                    </div>
                                </button>
                            ))}

                            {/* Upload Button */}
                            <label className="flex flex-col items-center justify-center w-full aspect-[3/4] rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50 text-gray-400">
                                <ImageIcon size={24} className="mb-2" />
                                <span className="text-xs lowercase">upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => addItem(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                    )}
                    {activeTab === 'mycollages' && (
                        <div className="space-y-3">
                            {savedCollages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {savedCollages.map(collage => (
                                        <button
                                            key={collage.id}
                                            onClick={() => {
                                                updateEditorData({
                                                    currentItems: [...collage.items],
                                                    backgroundColor: collage.backgroundColor
                                                });
                                                const newCollages = savedCollages.filter(c => c.id !== collage.id);
                                                onUpdate?.({ ...module.data, collages: newCollages, currentItems: [...collage.items], backgroundColor: collage.backgroundColor });
                                            }}
                                            className="aspect-[3/4] rounded-[8px] border border-[var(--color-border)] overflow-hidden relative group bg-white hover:border-[var(--color-brand)] transition-colors"
                                            style={{ backgroundColor: collage.backgroundColor }}
                                        >
                                            {collage.items.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="absolute"
                                                    style={{
                                                        left: `${item.x}%`,
                                                        top: `${item.y}%`,
                                                        width: '50%',
                                                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale * 0.4})`,
                                                        zIndex: item.zIndex
                                                    }}
                                                >
                                                    <img src={item.src} className="w-full rounded-sm shadow-sm" />
                                                </div>
                                            ))}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm lowercase">
                                    <p>no collages yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
