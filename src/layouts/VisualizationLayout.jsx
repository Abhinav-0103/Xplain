import React, { useState } from 'react';
import { Settings, ChevronLeft, ChevronRight, Menu, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const VisualizationLayout = ({ title, controls, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-paper-bg">
            {/* Sidebar Controls */}
            <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`${isSidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 bg-paper-card border-r border-paper-border transition-all duration-300 overflow-hidden relative z-20 shadow-sm`}
            >
                <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold font-heading text-paper-text">Controls</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-paper-text-muted hover:text-paper-text">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {controls}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-paper-card border-b border-paper-border flex items-center justify-between px-6 z-10 shadow-sm">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="mr-4 p-2 rounded-md hover:bg-paper-bg text-paper-text-muted hover:text-paper-text transition-colors"
                        >
                            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h1 className="text-xl font-bold font-heading text-paper-text">{title}</h1>
                    </div>
                </header>

                {/* Visualization Canvas */}
                <main className="flex-1 relative bg-paper-bg overflow-hidden p-4">
                    <div className="w-full h-full rounded-2xl border border-paper-border bg-white shadow-inner overflow-hidden relative">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VisualizationLayout;
