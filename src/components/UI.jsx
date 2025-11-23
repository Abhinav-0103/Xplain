import React from 'react';

export const ControlGroup = ({ label, children }) => (
    <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-paper-text-muted">{label}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const Slider = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-sm">
            <label className="text-paper-text font-medium">{label}</label>
            <span className="text-paper-text-muted font-mono">{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-paper-accent"
        />
    </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyles = "px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5";
    const variants = {
        primary: "bg-paper-accent text-white hover:bg-paper-accent/90",
        secondary: "bg-white border border-paper-border text-paper-text hover:bg-paper-bg hover:border-paper-accent",
        danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
