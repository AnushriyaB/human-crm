import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Icons } from './Icons';
import { useFriends } from '../../context/FriendContext';
import BentoGrid from '../bento/Grid';
import CoreIdentityCard from '../bento/modules/CoreIdentityCard';
import FinancialCard from '../bento/modules/FinancialCard';
import DateCard from '../bento/modules/DateCard';
import SocialCard from '../bento/modules/SocialCard';
import FamilyCard from '../bento/modules/FamilyCard';
import WorkCard from '../bento/modules/WorkCard';
import PreferencesCard from '../bento/modules/PreferencesCard';
import MemoriesCard from '../bento/modules/MemoriesCard';
import BentoCard from '../bento/Card';
import ModuleLibrary from '../bento/ModuleLibrary';
import { Plus, Check } from 'lucide-react';

export default function SideSheet({ isOpen, onClose, friend }) {
    const navigate = useNavigate();
    const { updateFriend } = useFriends();

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const [view, setView] = useState('details'); // details | audit
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Reset edit mode when sheet closes or friend changes
    useEffect(() => {
        setIsEditing(false);
    }, [isOpen, friend?.id]);

    if (!isOpen || !friend) return null;

    // Helper to find specific module type
    const getModule = (type) => friend.modules?.find(m => m.type === type) || { type, data: {} };
    // Helper to check existence for conditional rendering
    const hasModule = (type) => friend.modules?.some(m => m.type === type);

    const handleAddModule = (type) => {
        const newModule = { type, data: {} };
        const updatedModules = [...(friend.modules || []), newModule];
        updateFriend(friend.id, { modules: updatedModules });
        setIsLibraryOpen(false);
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

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveEdit = () => {
        setIsEditing(false);
        // Data is already saved via handleModuleUpdate
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 250 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl shadow-2xl z-50 overflow-y-auto border-l"
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            borderColor: 'var(--color-border)'
                        }}
                    >
                        <div className="p-6 md:p-8 space-y-8">
                            {/* Header Actions */}
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs uppercase tracking-widest opacity-50 font-semibold">Profile</h4>
                                <div className="flex items-center p-1 rounded-full border shadow-sm gap-1"
                                    style={{
                                        backgroundColor: 'var(--color-button-bg)',
                                        borderColor: 'var(--color-border)'
                                    }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setView(view === 'details' ? 'audit' : 'details')}
                                        className="rounded-full w-9 h-9 hover:bg-black/5"
                                        title="Audit Trail"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        {view === 'details' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M8 12h4" /><path d="M16 8h4" /><path d="M12 16h4" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        )}
                                    </Button>

                                    <div className="w-px h-4 bg-gray-200" />

                                    {/* Edit/Save Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={isEditing ? handleSaveEdit : handleToggleEdit}
                                        className={`rounded-full w-9 h-9 ${isEditing ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'hover:bg-black/5'}`}
                                        title={isEditing ? "Save" : "Edit"}
                                        style={{ color: isEditing ? undefined : 'var(--color-text-secondary)' }}
                                    >
                                        {isEditing ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Icons.Pencil className="w-4 h-4" />
                                        )}
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
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 flex items-center justify-between"
                                >
                                    <span>✏️ Editing mode — click tiles to add data</span>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="font-medium hover:underline"
                                    >
                                        Done
                                    </button>
                                </motion.div>
                            )}

                            {view === 'details' ? (
                                <>
                                    <BentoGrid>
                                        {/* 1. Core Identity (Always First) */}
                                        <CoreIdentityCard
                                            friend={friend}
                                            isEditing={isEditing}
                                            onUpdate={(data) => updateFriend(friend.id, data)}
                                        />

                                        {/* 2. Dynamic Modules */}
                                        {hasModule('family') && (
                                            <FamilyCard
                                                module={getModule('family')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('family', data)}
                                            />
                                        )}
                                        {hasModule('dates') && (
                                            <DateCard
                                                module={getModule('dates')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('dates', data)}
                                            />
                                        )}
                                        {hasModule('work') && (
                                            <WorkCard
                                                module={getModule('work')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('work', data)}
                                            />
                                        )}
                                        {hasModule('preferences') && (
                                            <PreferencesCard
                                                module={getModule('preferences')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('preferences', data)}
                                            />
                                        )}
                                        {hasModule('memories') && (
                                            <MemoriesCard
                                                module={getModule('memories')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('memories', data)}
                                            />
                                        )}
                                        {hasModule('social') && (
                                            <SocialCard
                                                module={getModule('social')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('social', data)}
                                            />
                                        )}
                                        {hasModule('financial') && (
                                            <FinancialCard
                                                module={getModule('financial')}
                                                isEditing={isEditing}
                                                onUpdate={(data) => handleModuleUpdate('financial', data)}
                                            />
                                        )}

                                        {/* 3. Add Module Placeholder */}
                                        <BentoCard
                                            className="flex items-center justify-center min-h-[160px] border-dashed border-2 bg-transparent hover:bg-[var(--color-bg-secondary)] cursor-pointer group"
                                            onClick={() => setIsLibraryOpen(true)}
                                        >
                                            <div className="text-center space-y-2 group-hover:scale-105 transition-transform">
                                                <div className="mx-auto w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center group-hover:bg-[var(--color-highlight)] group-hover:text-white transition-colors">
                                                    <Plus size={20} />
                                                </div>
                                                <p className="text-xs font-semibold uppercase tracking-wider opacity-50">Add Tile</p>
                                            </div>
                                        </BentoCard>
                                    </BentoGrid>

                                    <ModuleLibrary
                                        isOpen={isLibraryOpen}
                                        onClose={() => setIsLibraryOpen(false)}
                                        onSelect={handleAddModule}
                                        existingModules={friend.modules || []}
                                    />
                                </>
                            ) : (
                                // Audit Trail / Gantt View
                                <div className="space-y-6">
                                    <h3 className="text-sm font-medium text-text-secondary lowercase tracking-wider mb-4">interaction history</h3>
                                    <div className="space-y-0">
                                        {[
                                            { date: 'Today', event: 'Viewed profile', Icon: Icons.Eye },
                                            { date: '2 weeks ago', event: 'Sent a gift', Icon: Icons.Gift },
                                            { date: '1 month ago', event: 'Met for coffee', Icon: Icons.Coffee },
                                            { date: '3 months ago', event: 'Added to Human.', Icon: Icons.Sparkles },
                                        ].map((item, i, arr) => (
                                            <div key={i} className="flex gap-4">
                                                {/* Stepper Column */}
                                                <div className="flex flex-col items-center">
                                                    <div className="relative z-10 bg-white p-1">
                                                        <item.Icon className="w-5 h-5 text-brand" />
                                                    </div>
                                                    {/* Line connects to next item */}
                                                    {i !== arr.length - 1 && (
                                                        <div className="w-px flex-1 bg-gray-200 my-1" />
                                                    )}
                                                </div>
                                                {/* Content Column */}
                                                <div className="pb-8 pt-1.5">
                                                    <p className="text-xs text-text-secondary mb-1 lowercase tracking-wide">{item.date}</p>
                                                    <p className="font-medium text-text-primary leading-tight lowercase">{item.event}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
