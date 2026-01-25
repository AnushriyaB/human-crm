import React, { useRef, useState, useEffect } from 'react';
import BentoCard from '../Card';
import { PenTool, Trash2 } from 'lucide-react';

export default function NotesCard({ module, isEditing, onUpdate, onRemove, isNew }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState(null);
    const data = module.data || {};

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#333';
        context.lineWidth = 2;
        setCtx(context);

        if (data.drawing) {
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0);
            };
            img.src = data.drawing;
        }
    }, []);

    const startDrawing = (e) => {
        if (!isEditing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !isEditing) return;
        e.preventDefault();

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            ctx.closePath();
            setIsDrawing(false);
            saveDrawing();
        }
    };

    const saveDrawing = () => {
        const canvas = canvasRef.current;
        const drawing = canvas.toDataURL('image/png');
        onUpdate?.({ ...data, drawing });
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onUpdate?.({ ...data, drawing: null });
    };

    return (
        <BentoCard
            title="notes"
            icon={PenTool}
            className="col-span-2"
            isEditing={isEditing}
            onRemove={onRemove}
            isNew={isNew}
            headerAction={isEditing && (
                <button
                    onClick={clearCanvas}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                    title="Clear canvas"
                >
                    <Trash2 size={14} />
                </button>
            )}
        >
            <div className="space-y-3">
                <p className="text-xs text-[var(--color-text-secondary)]">
                    {isEditing ? 'Draw or sketch anything here' : 'Free-draw canvas'}
                </p>
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={200}
                        className={`w-full h-[200px] rounded-xl border-2 border-dashed border-[var(--color-border)] ${isEditing ? 'cursor-crosshair bg-white' : 'bg-[var(--color-bg-secondary)]'
                            }`}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />

                    {!isEditing && !data.drawing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-sm text-[var(--color-text-secondary)] italic">
                                click edit to draw
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
    );
}
