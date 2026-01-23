import React, { useState } from 'react';
import BentoCard from '../Card';
import { CreditCard, DollarSign, Eye, EyeOff, Lock } from 'lucide-react';

export default function FinancialCard({ module, onUpdate }) {
    const [isRevealed, setIsRevealed] = useState(false);

    // Fallback if data is missing
    const data = module.data || {};
    const handles = data.handles || { venmo: '', cashapp: '' };

    return (
        <BentoCard
            title="Financial Vault"
            icon={DollarSign}
            className="row-span-1"
            onEdit={() => {/* TODO: Open Edit Modal */ }}
        >
            <div className="space-y-4">
                {/* Bank Card Graphic */}
                <div className="relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 text-white shadow-lg border border-neutral-700/50 group/card">
                    <div className="absolute top-0 right-0 p-3 opacity-50">
                        <CreditCard size={48} strokeWidth={1} className="text-neutral-600" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Bank Details</span>
                            <button
                                onClick={() => setIsRevealed(!isRevealed)}
                                className="hover:bg-white/10 p-1 rounded transition-colors"
                            >
                                {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>

                        <div>
                            <div className="text-[10px] uppercase opacity-50 mb-1">Account Number</div>
                            <div className="font-mono text-lg tracking-widest flex items-center gap-2">
                                {isRevealed ? (
                                    <span>{data.accountNumber || 'NOT SET'}</span>
                                ) : (
                                    <>
                                        <span className="text-xs">•••• ••••</span>
                                        <span>{data.accountNumber ? data.accountNumber.slice(-4) : '0000'}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] uppercase opacity-50 mb-1">Routing</div>
                                <div className="font-mono text-sm">{isRevealed ? (data.routing || '---') : '••• •••'}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm">{data.bankName || 'Unknown Bank'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Handles */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {handles.venmo && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] rounded-lg">
                            <span className="text-[var(--color-brand)] font-bold text-xs">V</span>
                            <span className="truncate">{handles.venmo}</span>
                        </div>
                    )}
                    {handles.cashapp && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-bg-secondary)] rounded-lg">
                            <span className="text-green-500 font-bold text-xs">$</span>
                            <span className="truncate">{handles.cashapp}</span>
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
