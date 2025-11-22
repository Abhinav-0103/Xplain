import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-cosmos-bg text-cosmos-text flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <footer className="border-t border-white/10 py-8 mt-auto glass-panel">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Xplain. Interactive Learning Platform.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
