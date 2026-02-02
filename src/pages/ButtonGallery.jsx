import React from 'react';
import { Button } from '../components/ui/Button';
import { RotateCcw, RotateCw, Trash2, ChevronRight, Search, Upload, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ButtonGallery() {
    return (
        <div className="min-h-screen p-8 bg-[var(--color-background)] space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-2">Button Gallery</h1>
                <p className="text-[var(--color-text-secondary)]">A collection of all button styles currently used in the application.</p>
            </div>

            {/* Standard Button Component */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Standard &lt;Button /&gt; Component</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Variants</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Sizes</h3>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon"><Search size={18} /></Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ad-hoc Buttons from ScrapbookCard */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Ad-hoc: Scrapbook Card Controls</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Floating Menu Buttons */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Floating Menu (Round)</h3>
                        <div className="flex items-center gap-2 p-4 bg-gray-100/50 rounded-xl">
                            <button className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-all text-gray-700 bg-white shadow-sm border border-gray-100" title="Undo">
                                <RotateCcw size={16} />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-all text-gray-700 bg-white shadow-sm border border-gray-100" title="Redo">
                                <RotateCw size={16} />
                            </button>
                            <button className="p-2 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-500 transition-all bg-white shadow-sm border border-gray-100" title="Clear all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Switchers */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Tab Switchers</h3>
                        <div className="w-64 flex p-1.5 gap-1.5 bg-[var(--color-button-bg)] rounded-[2px] shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.12)]">
                            <button className="relative flex-1 py-1.5 text-xs font-medium transition-all rounded-[2px] focus:outline-none z-10 lowercase text-[var(--color-text-primary)]">
                                <div className="absolute inset-0 bg-white rounded-[2px] shadow-[0_2px_8px_0_rgba(0,0,0,0.08),inset_0_-1px_2px_0_rgba(0,0,0,0.1),inset_0_1px_2px_0_rgba(255,255,255,0.8)] z-[-1]" />
                                ideas
                            </button>
                            <button className="relative flex-1 py-1.5 text-xs font-medium transition-all rounded-[2px] focus:outline-none z-10 lowercase text-[var(--color-text-secondary)] hover:shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.08)]">
                                my scrapbooks
                            </button>
                        </div>
                    </div>

                    {/* Layer Controls */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Layer Controls (Hover)</h3>
                        <div className="flex gap-2 p-4 bg-gray-200 rounded-lg">
                            <button className="px-2 py-1 bg-white rounded-full text-gray-700 shadow-md hover:scale-105 text-[10px] lowercase">front</button>
                            <button className="px-2 py-1 bg-white rounded-full text-gray-700 shadow-md hover:scale-105 text-[10px] lowercase">back</button>
                        </div>
                    </div>


                </div>
            </section>

            {/* Ad-hoc Buttons from AddFriendDropdown */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Ad-hoc: Add Friend Dropdown</h2>
                <div className="flex flex-wrap gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Icon & Text Copy</h3>
                        <div className="p-3 bg-gray-50 rounded-[2px] border border-dashed border-gray-200 cursor-copy hover:border-brand/30 w-64 text-center">
                            <div className="flex items-center justify-center gap-2 text-brand">
                                <span className="text-lg font-mono tracking-wider">sun9moon1</span>
                                <Copy className="w-4 h-4 text-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Text Link Button</h3>
                        <button
                            className="text-xs hover:opacity-80 transition-colors lowercase text-[var(--color-text-secondary)]"
                        >
                            done, close this
                        </button>
                    </div>
                </div>
            </section>

            {/* Tactile / Neuromorphic Styles */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Tactile / Neuromorphic</h2>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <button
                            className="p-2 rounded-[2px] transition-all bg-[var(--color-button-bg)] text-[var(--color-text-secondary)]
                            shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                            hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                            active:shadow-active
                            hover:text-[var(--color-text-primary)]"
                        >
                            <Upload size={14} />
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-[2px] transition-all bg-[var(--color-button-bg)] text-[var(--color-text-secondary)] lowercase
                            shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.9)]
                            hover:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1),inset_0_-2px_4px_0_rgba(255,255,255,0.9)]
                            active:shadow-active
                            hover:text-[var(--color-text-primary)]"
                        >
                            <Upload size={14} /> upload
                        </button>
                    </div>

                    <div className="text-sm text-gray-500 border-l-4 border-brand pl-4">
                        <strong>Note:</strong> This tactile style has been applied to the Primary and Secondary Button variants above.
                        The shadows flip on hover to create a "pressed in" → "raised" effect.
                    </div>
                </div>
            </section>

            {/* Global Header Controls */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Global Header Controls</h2>
                <div className="flex gap-4 items-center p-6 bg-gray-50 rounded-xl">

                    {/* Add Friend Button */}
                    <div className="space-y-2 text-center">
                        <span className="text-xs text-gray-400 uppercase">Add Friend</span>
                        <div className="flex justify-center">
                            <button className="w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-inner hover:shadow-sm"
                                style={{
                                    backgroundColor: 'var(--color-button-bg)',
                                    borderColor: 'var(--color-border)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    color: 'var(--color-text-secondary)'
                                }}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Theme Toggle (Light/Dark) */}
                    <div className="space-y-2 text-center">
                        <span className="text-xs text-gray-400 uppercase">Theme Toggle</span>
                        <div className="flex justify-center">
                            {/* Moon Icon */}
                            <button
                                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 text-text-secondary hover:text-text-primary hover:bg-white transition-all flex items-center justify-center shadow-inner hover:shadow-sm"
                                style={{
                                    backgroundColor: 'var(--color-button-bg)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-secondary)'
                                }}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Settings Button */}
                    <div className="space-y-2 text-center">
                        <span className="text-xs text-gray-400 uppercase">Settings</span>
                        <div className="flex justify-center">
                            <button className="w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-inner hover:shadow-sm"
                                style={{
                                    backgroundColor: 'var(--color-button-bg)',
                                    borderColor: 'var(--color-border)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    color: 'var(--color-text-secondary)'
                                }}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}
