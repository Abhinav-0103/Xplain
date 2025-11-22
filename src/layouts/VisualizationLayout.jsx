import React, { useState } from 'react';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VisualizationLayout = ({ title, controls, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar Controls */}
            <motion.aside
                initial={{ width: 320 }}
                animate={{ width: isSidebarOpen ? 320 : 0 }}
                className="glass-panel border-r border-white/10 relative flex-shrink-0"
            >
                <div className="h-full overflow-y-auto p-6 custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-cosmos-accent-cyan flex items-center gap-2">
                            <Settings className="w-5 h-5" /> Controls
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {controls}
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-cosmos-card border border-white/10 rounded-full p-1 text-gray-400 hover:text-white transition-colors z-10"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            </motion.aside>

            {/* Main Visualization Area */}
            <main className="flex-grow relative overflow-hidden bg-cosmos-bg/50">
                <div className="absolute inset-0 p-8 flex flex-col">
                    <h1 className="text-3xl font-bold mb-6 neon-text">{title}</h1>
                    <div className="flex-grow glass-panel rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VisualizationLayout;
