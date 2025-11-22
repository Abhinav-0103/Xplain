import React from 'react';

export const ControlGroup = ({ label, children }) => (
    <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

export const Slider = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cosmos-accent-cyan"
        />
    </div>
);

export const Button = ({ onClick, children, variant = 'primary' }) => {
    const baseStyles = "w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-cosmos-accent-cyan/10 text-cosmos-accent-cyan border border-cosmos-accent-cyan/50 hover:bg-cosmos-accent-cyan/20 neon-border",
        secondary: "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10",
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
            {children}
        </button>
    );
};
