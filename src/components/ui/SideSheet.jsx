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
import BentoCard from '../bento/Card';
import ModuleLibrary from '../bento/ModuleLibrary';
import { Plus, Check, User, Heart, Briefcase, MessageCircle, PenTool } from 'lucide-react';

// Tab configuration for friends
const FRIEND_TABS = [
    { id: 'about', label: 'About', icon: User, modules: ['family', 'timeline'] },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart, modules: ['favorites', 'story'] },
    { id: 'work', label: 'Work', icon: Briefcase, modules: ['work'] },
    { id: 'connect', label: 'Connect', icon: MessageCircle, modules: ['communication'] },
    { id: 'notes', label: 'Notes', icon: PenTool, modules: ['notes'] },
];

// Tab configuration for "me" (personal profile)
const ME_TABS = [
    { id: 'about', label: 'About Me', icon: User, modules: ['timeline'] },
    { id: 'lifestyle', label: 'My Lifestyle', icon: Heart, modules: ['favorites'] },
    { id: 'work', label: 'My Work', icon: Briefcase, modules: ['work'] },
    { id: 'notes', label: 'Notes', icon: PenTool, modules: ['notes'] },
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
        setEnabledTabs(newEnabledTabs);
        updateFriend(friend.id, { enabledTabs: newEnabledTabs });
        setActiveTab(tabId);
    };

    if (!isOpen || !friend) return null;

    const getModule = (type) => friend.modules?.find(m => m.type === type) || { type, data: {} };
    const hasModule = (type) => friend.modules?.some(m => m.type === type);

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
            case 'notes': return <NotesCard key={type} {...props} />;
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 250 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-4xl shadow-2xl z-50 overflow-hidden border-l flex flex-col"
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            borderColor: 'var(--color-border)'
                        }}
                    >
                        {/* Fixed Header */}
                        <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs uppercase tracking-widest opacity-50 font-semibold">
                                    {isMe ? 'My Profile' : 'Profile'}
                                </h4>
                                <div className="flex items-center p-1 rounded-full border shadow-sm gap-1"
                                    style={{
                                        backgroundColor: 'var(--color-button-bg)',
                                        borderColor: 'var(--color-border)'
                                    }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={isEditing ? handleSaveEdit : handleToggleEdit}
                                        className={`rounded-full w-9 h-9 ${isEditing ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'hover:bg-black/5'}`}
                                        title={isEditing ? "Save" : "Edit"}
                                        style={{ color: isEditing ? undefined : 'var(--color-text-secondary)' }}
                                    >
                                        {isEditing ? <Check className="w-4 h-4" /> : <Icons.Pencil className="w-4 h-4" />}
                                    </Button>

                                    <div className="w-px h-4 bg-gray-200" />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onClose}
                                        className="rounded-full w-9 h-9 hover:bg-red-50 hover:text-red-500"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>

                            {/* Edit Mode Banner */}
                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800 flex items-center justify-between"
                                    >
                                        <span>✏️ Editing mode — click 🗑️ on tiles to remove them</span>
                                        <button onClick={handleSaveEdit} className="font-semibold hover:underline">Done</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tab Navigation - Fixed, not scrollable */}
                        <div className="px-6 border-b relative z-20" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
                            <div className="flex gap-6">
                                {TABS.filter(tab => enabledTabs.includes(tab.id)).map(tab => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className="relative pb-3 pt-3 text-sm font-medium whitespace-nowrap transition-colors duration-200"
                                            style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                                        >
                                            {isActive && <span className="absolute inset-x-0 top-1 bottom-3 rounded-lg -z-10" style={{ backgroundColor: 'var(--color-button-bg)' }} />}
                                            <span className="relative px-3 py-1">{tab.label}</span>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="activeTabIndicator"
                                                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                                                    style={{ backgroundColor: 'var(--color-brand)' }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                                {TABS.filter(tab => !enabledTabs.includes(tab.id)).length > 0 && (
                                    <div className="relative group pb-3 pt-3">
                                        <button className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors">
                                            <Plus size={14} />
                                            <span>Add</span>
                                        </button>
                                        <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                                            {TABS.filter(tab => !enabledTabs.includes(tab.id)).map(tab => (
                                                <button key={tab.id} onClick={() => handleAddTab(tab.id)} className="w-full px-4 py-2 text-sm text-left hover:bg-[var(--color-bg-secondary)] transition-colors">
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
                                                    <div className="py-12 text-center text-[var(--color-text-secondary)]">
                                                        <p className="text-sm">No content in this section yet</p>
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
                            existingModules={friend.modules || []}
                            isMe={isMe}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
