import React, { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Search, Plus, Trash2, X, Move, ChevronRight, Image as ImageIcon, Sparkles, Layout, RotateCw, RotateCcw, ZoomIn, ZoomOut, Check, Pencil, Upload } from 'lucide-react';
import { Button } from '../../ui/Button';

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const searchUnsplashImages = async (query) => {
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn('Unsplash API key not found. Using fallback images.');
        return getStockImages(query);
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=portrait`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Unsplash API request failed');
        }

        const data = await response.json();
        return data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.small,
            thumb: photo.urls.thumb,
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html
        }));
    } catch (error) {
        console.error('Error fetching from Unsplash:', error);
        return getStockImages(query);
    }
};

const getStockImages = (query = '') => {
    // Fallback to Picsum for placeholders if Unsplash API fails or key is missing
    return Array.from({ length: 12 }).map((_, i) => ({
        id: `picsum-${i}`,
        url: `https://picsum.photos/seed/${query}${i}/300/400`,
        thumb: `https://picsum.photos/seed/${query}${i}/150/200`
    }));
};

// Decorative and relationship-focused default images
const STATIC_IMAGES = [
    // Aesthetic decorative elements
    { id: 'static-1', url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=300&q=80" }, // Flowers
    { id: 'static-2', url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80" }, // Hearts/Love
    { id: 'static-3', url: "https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=300&q=80" }, // Coffee/moments
    { id: 'static-4', url: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=300&q=80" }, // Flowers aesthetic
    { id: 'static-5', url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=300&q=80" }, // Sunflowers/bright
    { id: 'static-6', url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=300&q=80" }, // Polaroids/memories
    { id: 'static-7', url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=300&q=80" }, // Decorative hearts
    { id: 'static-8', url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80" }, // Aesthetic vibes
    { id: 'static-9', url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80" }, // Pastel aesthetic
    { id: 'static-10', url: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=300&q=80" }, // Stickers/decorative
    { id: 'static-11', url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80" }, // Stars/decorative
    { id: 'static-12', url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=300&q=80" }  // Minimal aesthetic
];

const COLORS = [
    '#FFFFFF', '#FDF2F8', '#FEFCE8', '#F0FDF4', '#ECFEFF', '#F5F3FF', '#FDF4FF',
    '#F87171', '#FB923C', '#FACC15', '#4ADE80', '#22D3EE', '#A78BFA', '#E879F9',
    '#DC2626', '#B45309', '#65A30D', '#166534', '#15803D', '#7E22CE', '#BE185D',
    '#991B1B', '#78350F', '#365314', '#064E3B', '#1E3A8A', '#4C1D95', '#831843', '#000000'
];

export default function ScrapbookCard({ module, isEditing, onUpdate, onRemove }) {
    // Mode: 'list' (default) or 'editor' (when creating)
    // If no scrapbooks exist, default to 'list' which will show empty state with create button
    const [mode, setMode] = useState(module.data?.scrapbooks?.length > 0 ? 'list' : 'editor');

    // Editor State
    const [activeTab, setActiveTab] = useState('ideas');
    const [searchQuery, setSearchQuery] = useState('');
    const [bgOpen, setBgOpen] = useState(false);
    const [images, setImages] = useState(STATIC_IMAGES);
    const [isSearching, setIsSearching] = useState(false);
    const [scrapbookName, setScrapbookName] = useState('Untitled Scrapbook');
    const [isEditingName, setIsEditingName] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const canvasRef = useRef(null);
    const nameInputRef = useRef(null);
    const fileInputRef = useRef(null);

    // Get current items/bg from module data or defaults
    const items = module.data?.currentItems || [];
    const backgroundColor = module.data?.backgroundColor || '#FFFFFF';
    const savedScrapbooks = module.data?.scrapbooks || [];

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setImages(STATIC_IMAGES);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchUnsplashImages(searchQuery);
            setImages(results);
            setActiveTab('search_results');
        } catch (error) {
            console.error('Search failed:', error);
            setImages(STATIC_IMAGES);
        } finally {
            setIsSearching(false);
        }
    };

    const updateEditorData = (updates) => {
        onUpdate?.({ ...module.data, ...updates });
    };

    const addToHistory = (newItems) => {
        // Remove any future history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newItems);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const updateItems = (newItems) => {
        addToHistory(newItems);
        updateEditorData({ currentItems: newItems });
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            updateEditorData({ currentItems: history[newIndex] });
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            updateEditorData({ currentItems: history[newIndex] });
        }
    };

    const addItem = (imageData) => {
        // Handle both string URLs and image objects
        const src = typeof imageData === 'string' ? imageData : imageData.url;

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
        // Free-flowing - no clamping, let users place images anywhere
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, x: newX, y: newY } : item
        );
        updateItems(updatedItems);
    };

    const updateItemRotation = (id, rotation) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, rotation } : item
        );
        updateItems(updatedItems);
    };

    const updateItemScale = (id, scale) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, scale } : item
        );
        updateItems(updatedItems);
    };

    const bringToFront = (id) => {
        const maxZ = Math.max(...items.map(i => i.zIndex), 0);
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, zIndex: maxZ + 1 } : item
        );
        updateItems(updatedItems);
    };

    const sendToBack = (id) => {
        const minZ = Math.min(...items.map(i => i.zIndex), 1);
        // Keep z-index at minimum of 1 to stay above canvas
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, zIndex: Math.max(1, minZ - 1) } : item
        );
        updateItems(updatedItems);
    };

    const removeItem = (id) => {
        updateItems(items.filter(item => item.id !== id));
    };

    const handleSaveScrapbook = () => {
        // Save current state as a new scrapbook
        const newScrapbook = {
            id: Date.now(),
            name: scrapbookName,
            items: [...items],
            backgroundColor,
            date: new Date().toISOString()
        };

        const newScrapbooks = [newScrapbook, ...savedScrapbooks];

        onUpdate?.({
            ...module.data,
            scrapbooks: newScrapbooks,
            currentItems: [], // Clear editor
            backgroundColor: '#FFFFFF'
        });

        setScrapbookName('Untitled Scrapbook');
        setMode('list');
    };

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Undo: Cmd/Ctrl + Z
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Redo: Cmd/Ctrl + Shift + Z
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
            }
        };

        if (mode === 'editor') {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [mode, historyIndex, history]);

    // LIST VIEW
    if (mode === 'list' && savedScrapbooks.length > 0) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] lowercase">your scrapbooks ({savedScrapbooks.length})</h3>
                    <button
                        onClick={() => setMode('editor')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[2px] text-xs font-medium transition-all lowercase
                            bg-[var(--color-button-bg)] text-[var(--color-text-primary)]
                            shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                            hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                            active:shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.15)]"
                    >
                        <Plus size={14} />
                        new scrapbook
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {savedScrapbooks.map(scrapbook => (
                        <div key={scrapbook.id} className="flex flex-col rounded-[2px] border border-[var(--color-border)] overflow-hidden bg-white shadow-sm group">
                            {/* Scrapbook preview */}
                            <div className="aspect-[3/4] relative" style={{ backgroundColor: scrapbook.backgroundColor }}>
                                {/* Mini preview of items */}
                                {(scrapbook.items || []).map((item) => (
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
                                            // Load scrapbook into editor
                                            updateEditorData({
                                                currentItems: [...scrapbook.items],
                                                backgroundColor: scrapbook.backgroundColor
                                            });
                                            // Remove from saved list (editing = destructive to original)
                                            const newScrapbooks = savedScrapbooks.filter(c => c.id !== scrapbook.id);
                                            onUpdate?.({ ...module.data, scrapbooks: newScrapbooks, currentItems: [...scrapbook.items], backgroundColor: scrapbook.backgroundColor });
                                            setMode('editor');
                                        }}
                                        className="p-2 rounded-[2px] transition-all
                                        bg-[var(--color-button-bg)] text-[var(--color-text-secondary)]
                                        shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:text-[var(--color-text-primary)]"
                                        title="Edit scrapbook"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newScrapbooks = savedScrapbooks.filter(c => c.id !== scrapbook.id);
                                            onUpdate?.({ ...module.data, scrapbooks: newScrapbooks });
                                        }}
                                        className="p-2 rounded-[2px] transition-all
                                        bg-[var(--color-button-bg)] text-red-400
                                        shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                                        hover:text-red-500"
                                        title="Delete scrapbook"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Scrapbook name at bottom */}
                            <div className="px-3 py-2 bg-gray-50 border-t border-[var(--color-border)]">
                                <p className="text-sm font-medium text-[var(--color-text-primary)] lowercase truncate">
                                    {scrapbook.name || 'Untitled Scrapbook'}
                                </p>
                                <p className="text-xs text-[var(--color-text-tertiary)] lowercase">
                                    {new Date(scrapbook.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // EMPTY STATE (List view but no items) -> Redirect to Editor or specific empty UI?
    // User requested: "The default view ... would be to 'create a collage' ... otherwise it would show the scrapbooks"
    // So if no scrapbooks, show editor directly? Or an empty state button? 
    // Let's stick to logic: if scrapbooks.length === 0, we set mode='editor' initially. 
    // But if user deletes all scrapbooks, we might end up here.
    if (mode === 'list' && savedScrapbooks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-[2px] bg-[var(--color-bg-secondary)]/30">
                <div className="w-16 h-16 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="text-[var(--color-brand)]" size={32} />
                </div>
                <h3 className="font-medium text-[var(--color-text-primary)] mb-1 lowercase">no scrapbooks yet</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">start collecting your ideas</p>
                <button
                    onClick={() => setMode('editor')}
                    className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm lowercase"
                >
                    create scrapbook
                </button>
            </div>
        );
    }

    // EDITOR VIEW
    return (
        <div className="flex h-[650px] w-full bg-white border border-[var(--color-border)] rounded-[2px] shadow-sm relative">
            {/* Main Canvas Area */}
            <div className="flex-1 relative" style={{ backgroundColor, overflow: 'visible' }}>

                {/* Background Dotted Pattern - White background with light dots */}
                <div className="absolute inset-0 pointer-events-none bg-white"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #e5e7eb 1.5px, transparent 1.5px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Header Overlay - Back button & Name only */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto">
                        {savedScrapbooks.length > 0 && (
                            <button onClick={() => setMode('list')} className="p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full shadow-sm text-[var(--color-text-secondary)] hover:text-black transition-colors">
                                <ChevronRight className="rotate-180" size={18} />
                            </button>
                        )}
                        {isEditingName ? (
                            <input
                                ref={nameInputRef}
                                type="text"
                                value={scrapbookName}
                                onChange={(e) => setScrapbookName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setIsEditingName(false);
                                }}
                                className="text-lg font-bold lowercase bg-white/90 backdrop-blur px-3 py-1 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
                                autoFocus
                            />
                        ) : (
                            <h2
                                onClick={() => setIsEditingName(true)}
                                className="text-lg font-bold lowercase bg-white/80 backdrop-blur px-3 py-1 rounded-full cursor-pointer hover:bg-white transition-colors truncate max-w-[200px]"
                                title="Click to edit name"
                            >
                                {scrapbookName}
                            </h2>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="pointer-events-auto">
                        {items.length > 0 && (
                            <Button
                                onClick={handleSaveScrapbook}
                                variant="primary"
                                size="sm"
                                className="shadow-sm lowercase gap-2"
                            >
                                save
                                <Check size={14} />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Canvas Items */}
                <div ref={canvasRef} className="absolute inset-0" style={{ overflow: 'visible' }}>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            drag
                            dragConstraints={false} // Free flow
                            dragMomentum={false} // No floating/drifting
                            dragElastic={0} // No elasticity
                            dragTransition={{ power: 0, timeConstant: 0 }} // Instant stop
                            onDragEnd={(e, info) => {
                                if (canvasRef.current) {
                                    const rect = canvasRef.current.getBoundingClientRect();
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
                            onClick={() => bringToFront(item.id)}
                        >
                            {/* Image with decorative border */}
                            <div className="relative shadow-lg group-hover:shadow-2xl transition-all">
                                <div className="absolute -inset-2 bg-white rounded-[4px] shadow-md" />
                                <img src={item.src} className="relative w-40 h-auto rounded-[2px] pointer-events-none" />

                                {/* Item Controls */}
                                <div className="absolute -top-3 -right-3 hidden group-hover:flex gap-1 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateItemRotation(item.id, item.rotation - 15); }}
                                        className="p-1.5 bg-white rounded-full text-gray-700 shadow-md hover:scale-110 hover:text-blue-500 transition-all"
                                    >
                                        <RotateCcw size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateItemRotation(item.id, item.rotation + 15); }}
                                        className="p-1.5 bg-white rounded-full text-gray-700 shadow-md hover:scale-110 hover:text-blue-500 transition-all"
                                    >
                                        <RotateCw size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateItemScale(item.id, Math.min(item.scale + 0.1, 2)); }}
                                        className="p-1.5 bg-white rounded-full text-gray-700 shadow-md hover:scale-110 hover:text-green-500 transition-all"
                                    >
                                        <ZoomIn size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateItemScale(item.id, Math.max(item.scale - 0.1, 0.3)); }}
                                        className="p-1.5 bg-white rounded-full text-gray-700 shadow-md hover:scale-110 hover:text-orange-500 transition-all"
                                    >
                                        <ZoomOut size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                        className="p-1.5 bg-white rounded-full text-red-500 shadow-md hover:scale-110 hover:bg-red-50 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>

                                {/* Layer Controls */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 z-10">
                                    <button onClick={(e) => { e.stopPropagation(); bringToFront(item.id); }} className="px-2 py-1 bg-white rounded-full text-gray-700 shadow-md hover:scale-105 text-[10px] lowercase">front</button>
                                    <button onClick={(e) => { e.stopPropagation(); sendToBack(item.id); }} className="px-2 py-1 bg-white rounded-full text-gray-700 shadow-md hover:scale-105 text-[10px] lowercase">back</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {items.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                            <Sparkles size={48} className="mb-4 opacity-50" />
                            <p className="text-sm lowercase">drag images from sidebar</p>
                        </div>
                    )}
                </div>

                {/* Floating Bottom Menu */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1.5 bg-white/90 backdrop-blur rounded-full shadow-xl border border-white/20 z-50 pointer-events-auto">
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                        <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700" title="Undo"><RotateCcw size={16} /></button>
                        <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700" title="Redo"><RotateCw size={16} /></button>
                    </div>
                    <div className="relative px-1">
                        <button onClick={() => setBgOpen(!bgOpen)} className="w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform" style={{ backgroundColor }} title="Background color" />
                        {bgOpen && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white rounded-[16px] shadow-xl border border-gray-100 grid grid-cols-7 gap-2 w-[280px]">
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => { updateEditorData({ backgroundColor: c }); setBgOpen(false); }} className="w-8 h-8 rounded-full border border-gray-100 hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="pl-2 border-l border-gray-200">
                        <button onClick={() => { if (window.confirm('Clear all images?')) { updateItems([]); } }} disabled={items.length === 0} className="p-2 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Clear all"><Trash2 size={16} /></button>
                    </div>
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
                                disabled={isSearching}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors focus:outline-none disabled:opacity-50"
                            >
                                {isSearching ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <RotateCw size={14} />
                                    </motion.div>
                                ) : (
                                    <Search size={14} />
                                )}
                            </button>
                            <input
                                type="text"
                                placeholder="search photos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isSearching) {
                                        handleSearch();
                                    }
                                }}
                                disabled={isSearching}
                                className="w-full bg-[var(--color-bg-secondary)] pl-9 pr-4 py-2 text-sm rounded-[2px] border border-transparent focus:bg-white focus:border-[var(--color-border)] focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-muted)] transition-all placeholder:text-[var(--color-text-tertiary)] lowercase disabled:opacity-50"
                            />
                        </div>
                    )}
                </div>

                {activeTab !== 'search_results' && (
                    <div className="px-4 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex p-1.5 gap-1.5 bg-[var(--color-button-bg)] rounded-[2px] shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.12)]">
                                {[
                                    { id: 'ideas', label: 'more ideas' },
                                    { id: 'myscrapbooks', label: 'my scrapbooks' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex-1 py-1.5 text-xs font-medium transition-all rounded-[2px] focus:outline-none z-10 lowercase ${activeTab === tab.id
                                            ? ''
                                            : 'hover:shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.08)]'
                                            }`}
                                        style={{
                                            color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                                        }}
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="scrapbookSidebarTab"
                                                className="absolute inset-0 bg-white rounded-[2px] shadow-[0_2px_8px_0_rgba(0,0,0,0.08),inset_0_-1px_2px_0_rgba(0,0,0,0.1),inset_0_1px_2px_0_rgba(255,255,255,0.8)] z-[-1]"
                                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                            />
                                        )}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-full transition-all bg-[var(--color-button-bg)] text-[var(--color-text-secondary)]
                        shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                        hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                        active:shadow-active
                        hover:text-[var(--color-text-primary)]"
                                title="Upload image"
                            >
                                <Upload size={14} />
                            </button>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => addItem(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                    // Reset input so same file can be uploaded again
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">

                    {(activeTab === 'ideas' || activeTab === 'search_results') && (
                        <div className="columns-2 gap-3 space-y-3">
                            {images.map((image, i) => {
                                const imgSrc = typeof image === 'string' ? image : image?.url || image;
                                const imgKey = typeof image === 'string' ? i : image?.id || i;

                                return (
                                    <button
                                        key={imgKey}
                                        onClick={() => addItem(image)}
                                        className="block w-full rounded-[2px] overflow-hidden relative group hover:opacity-90 transition-opacity"
                                    >
                                        <img src={imgSrc} className="w-full h-auto" loading="lazy" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="text-white drop-shadow-md" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {activeTab === 'myscrapbooks' && (
                        <div className="space-y-3">
                            {savedScrapbooks.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {savedScrapbooks.map(scrapbook => (
                                        <button
                                            key={scrapbook.id}
                                            onClick={() => {
                                                updateEditorData({
                                                    currentItems: [...scrapbook.items],
                                                    backgroundColor: scrapbook.backgroundColor
                                                });
                                                const newScrapbooks = savedScrapbooks.filter(c => c.id !== scrapbook.id);
                                                onUpdate?.({ ...module.data, scrapbooks: newScrapbooks, currentItems: [...scrapbook.items], backgroundColor: scrapbook.backgroundColor });
                                            }}
                                            className="aspect-[3/4] rounded-[2px] border border-[var(--color-border)] overflow-hidden relative group bg-white hover:border-[var(--color-brand)] transition-colors"
                                            style={{ backgroundColor: scrapbook.backgroundColor }}
                                        >
                                            {scrapbook.items.slice(0, 3).map((item) => (
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
                                    <p>no scrapbooks yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
