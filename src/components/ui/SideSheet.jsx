import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Icons } from './Icons';
import { useFriends } from '../../context/FriendContext';
import BentoGrid from '../bento/Grid';
import CoreIdentityCard from '../bento/modules/CoreIdentityCard';
import MyIdentityCard from '../bento/modules/MyIdentityCard';
import FamilyCard from '../bento/modules/FamilyCard';
import TimelineCard from '../bento/modules/TimelineCard';
import FavoritesCard from '../bento/modules/FavoritesCard';
import WorkCard from '../bento/modules/WorkCard';
import CommunicationCard from '../bento/modules/CommunicationCard';
import StoryCard from '../bento/modules/StoryCard';
import NotesCard from '../bento/modules/NotesCard';
import CollageCard from '../bento/modules/CollageCard';
import BentoCard from '../bento/Card';
import ModuleLibrary from '../bento/ModuleLibrary';
import { Plus, Check, User, Heart, Briefcase, MessageCircle, PenTool } from 'lucide-react';

// Tab configuration with pastel colors
const FRIEND_TABS = [
    { id: 'about', label: 'about', icon: User, modules: ['family', 'timeline'], color: '#fee2e2' }, // rose-100
    { id: 'favorites', label: 'favorites', icon: Heart, modules: ['favorites', 'story'], color: '#dbeafe' }, // blue-100
    { id: 'work', label: 'work', icon: Briefcase, modules: ['work'], color: '#dcfce7' }, // green-100
    { id: 'connect', label: 'connect', icon: MessageCircle, modules: ['communication'], color: '#fef3c7' }, // amber-100
    { id: 'collage', label: 'collage', icon: PenTool, modules: ['collage', 'notes'], color: '#f3e8ff' }, // purple-100
];

const ME_TABS = [
    { id: 'about', label: 'about me', icon: User, modules: ['timeline'], color: '#fee2e2' },
    { id: 'favorites', label: 'my favorites', icon: Heart, modules: ['favorites'], color: '#dbeafe' },
    { id: 'work', label: 'my work', icon: Briefcase, modules: ['work'], color: '#dcfce7' },
    { id: 'collage', label: 'collage', icon: PenTool, modules: ['collage', 'notes'], color: '#f3e8ff' },
];

export default function SideSheet({ isOpen, onClose, friend }) {
    const navigate = useNavigate();
    const { updateFriend } = useFriends();

    const [isEditing, setIsEditing] = useState(false);
    const [view, setView] = useState('details');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('about');
    const [recentlyAdded, setRecentlyAdded] = useState(new Set());
    const [enabledTabs, setEnabledTabs] = useState(['about']); // Only 'about' enabled by default
    const scrollContainerRef = useRef(null);

    // Determine if this is the "me" profile
    const isMe = friend?.name?.toLowerCase() === 'me' || friend?.isMe;
    const TABS = isMe ? ME_TABS : FRIEND_TABS;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup on unmount to prevent stuck scrolling
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        setIsEditing(false);
        setActiveTab('about');
        setRecentlyAdded(new Set());
        // Load enabled tabs from friend data or default to just 'about'
        setEnabledTabs(friend?.enabledTabs || ['about']);
    }, [isOpen, friend?.id]);

    const handleAddTab = (tabId) => {
        const newEnabledTabs = [...enabledTabs, tabId];

        // Auto-add primary module if missing
        const tabDef = TABS.find(t => t.id === tabId);
        let updatedModules = friend.modules || [];

        if (tabDef && tabDef.modules.length > 0) {
            // Check if any of the tab's modules exist
            const hasExistingModule = tabDef.modules.some(type =>
                updatedModules.some(m => m.type === type)
            );

            if (!hasExistingModule) {
                // Add the first module type defined for this tab
                const primaryType = tabDef.modules[0];
                updatedModules = [...updatedModules, { type: primaryType, data: {} }];
                setRecentlyAdded(prev => new Set([...prev, primaryType]));
            }
        }

        setEnabledTabs(newEnabledTabs);
        updateFriend(friend.id, {
            enabledTabs: newEnabledTabs,
            modules: updatedModules
        });
        setActiveTab(tabId);
    };

    // Early return removed to allow AnimatePresence to work
    // if (!isOpen || !friend) return null;

    const getModule = (type) => friend?.modules?.find(m => m.type === type) || { type, data: {} };
    const hasModule = (type) => friend?.modules?.some(m => m.type === type);

    const handleAddModule = (type) => {
        const newModule = { type, data: {} };
        const updatedModules = [...(friend.modules || []), newModule];
        updateFriend(friend.id, { modules: updatedModules });
        setIsLibraryOpen(false);

        // Track recently added module for blue highlight
        setRecentlyAdded(prev => new Set([...prev, type]));

        // Find which tab this module belongs to and switch to it
        const tab = TABS.find(t => t.modules.includes(type));
        if (tab) {
            setActiveTab(tab.id);
        }
    };

    const handleRemoveModule = (type) => {
        const updatedModules = (friend.modules || []).filter(m => m.type !== type);
        updateFriend(friend.id, { modules: updatedModules });
        setRecentlyAdded(prev => {
            const next = new Set(prev);
            next.delete(type);
            return next;
        });

        // Check if the tab is now empty (excluding the just-removed module)
        const tab = TABS.find(t => t.modules.includes(type));
        if (tab) {
            const remainingModules = updatedModules.filter(m => tab.modules.includes(m.type));
            if (remainingModules.length === 0 && tab.id !== 'about') {
                // Remove tab from enabledTabs
                setEnabledTabs(prev => prev.filter(id => id !== tab.id));
                updateFriend(friend.id, {
                    modules: updatedModules,
                    enabledTabs: enabledTabs.filter(id => id !== tab.id)
                });

                // If we were on this tab, switch to about
                if (activeTab === tab.id) {
                    setActiveTab('about');
                }
            }
        }
    };

    const handleModuleUpdate = (type, newData) => {
        const updatedModules = (friend.modules || []).map(m => {
            if (m.type === type) {
                return { ...m, data: newData };
            }
            return m;
        });
        updateFriend(friend.id, { modules: updatedModules });
    };

    const handleToggleEdit = () => setIsEditing(!isEditing);
    const handleSaveEdit = () => setIsEditing(false);

    const renderModule = (type) => {
        if (!friend) return null; // Safety check
        const module = getModule(type);
        const isNew = recentlyAdded.has(type);
        const props = {
            module,
            isEditing,
            isNew,
            onUpdate: (data) => handleModuleUpdate(type, data),
            onRemove: () => handleRemoveModule(type)
        };

        switch (type) {
            case 'family': return <FamilyCard key={type} {...props} />;
            case 'timeline': return <TimelineCard key={type} {...props} />;
            case 'favorites': return <FavoritesCard key={type} {...props} />;
            case 'work': return <WorkCard key={type} {...props} />;
            case 'communication': return <CommunicationCard key={type} {...props} />;
            case 'story': return <StoryCard key={type} {...props} />;
            case 'collage': return <CollageCard key={type} {...props} />;
            case 'notes': return <CollageCard key={type} {...props} />;
            default: return null;
        }
    };

    // Get modules for current tab
    const currentTabModules = TABS.find(t => t.id === activeTab)?.modules || [];
    const activeModulesInTab = currentTabModules.filter(type => hasModule(type));

    // Count modules per tab for badge
    const getTabModuleCount = (tabId) => {
        const tab = TABS.find(t => t.id === tabId);
        return tab?.modules.filter(type => hasModule(type)).length || 0;
    };

    // Don't render anything if not open
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - simple conditional render, no AnimatePresence needed */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] transition-opacity duration-200"
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 300,
                    mass: 0.8
                }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-4xl z-50 overflow-hidden border-l flex flex-col"
                style={{
                    backgroundColor: 'var(--color-card-bg)',
                    borderColor: 'var(--color-border)',
                    boxShadow: '-20px 0 50px -12px rgba(0, 0, 0, 0.2)'
                }}
            >
                {/* Fixed Header */}
                <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex justify-between items-center">
                        {/* Header Text / Legend */}
                        {isEditing ? (
                            <div className="text-xs text-amber-600 font-medium lowercase flex flex-col gap-0.5">
                                <span>• editing mode</span>
                                <span>• click 🗑️ to remove</span>
                            </div>
                        ) : (
                            <h4 className="text-xs uppercase tracking-widest opacity-50 font-semibold">
                                {isMe ? 'my profile' : 'profile'}
                            </h4>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                onClick={isEditing ? handleSaveEdit : handleToggleEdit}
                                className={`w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-inner hover:shadow-sm border border-[var(--color-border)] bg-[var(--color-button-bg)]`}
                                title={isEditing ? "Save" : "Edit"}
                                style={{ color: isEditing ? 'var(--color-brand)' : 'var(--color-text-secondary)' }}
                            >
                                {isEditing ? <Check className="w-4 h-4" /> : <Icons.Pencil className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-inner hover:shadow-sm border border-[var(--color-border)] bg-[var(--color-button-bg)] text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation - Tactical Design */}
                <div className="px-6 py-4 border-b relative z-20" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
                    <div className="flex p-1 gap-1 bg-[var(--color-button-bg)] rounded-[4px] shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.1)]">
                        {TABS.filter(tab => enabledTabs.includes(tab.id)).map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-[2px] focus:outline-none"
                                    style={{
                                        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-[2px] shadow-sm"
                                            initial={false}
                                            animate={{ backgroundColor: tab.color }}
                                            transition={{ type: "spring", stiffness: 250, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 lowercase">{tab.label}</span>
                                </button>
                            );
                        })}
                        {TABS.filter(tab => !enabledTabs.includes(tab.id)).length > 0 && (
                            <div className="relative group flex items-center">
                                <button className="flex items-center justify-center w-8 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors rounded-[2px] hover:bg-white/50">
                                    <Plus size={16} />
                                </button>
                                <div className="absolute top-full right-0 mt-2 py-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                                    {TABS.filter(tab => !enabledTabs.includes(tab.id)).map(tab => (
                                        <button key={tab.id} onClick={() => handleAddTab(tab.id)} className="w-full px-4 py-2 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors lowercase">
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Show Identity Card only on 'about' tab */}
                                {activeTab === 'about' ? (
                                    isMe ? (
                                        <MyIdentityCard
                                            friend={friend}
                                            isEditing={isEditing}
                                            onUpdate={(data) => updateFriend(friend.id, data)}
                                            scrollContainerRef={scrollContainerRef}
                                        />
                                    ) : (
                                        <CoreIdentityCard
                                            friend={friend}
                                            isEditing={isEditing}
                                            onUpdate={(data) => updateFriend(friend.id, data)}
                                        />
                                    )
                                ) : (
                                    /* Other tabs show their module content directly */
                                    <div className="space-y-6">
                                        {activeModulesInTab.map(type => renderModule(type))}

                                        {activeModulesInTab.length === 0 && (
                                            <div className="py-12 text-center text-[var(--color-text-secondary)] flex flex-col items-center gap-4">
                                                <p className="text-sm">No content in this section yet</p>
                                                {currentTabModules.length > 0 && (
                                                    <Button
                                                        onClick={() => handleAddModule(currentTabModules[0])}
                                                        className="capitalize"
                                                    >
                                                        Start {TABS.find(t => t.id === activeTab)?.label || 'Section'}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <ModuleLibrary
                    isOpen={isLibraryOpen}
                    onClose={() => setIsLibraryOpen(false)}
                    onSelect={handleAddModule}
                    existingModules={friend?.modules || []}
                    isMe={isMe}
                />
            </motion.div>
        </>
    );
}
