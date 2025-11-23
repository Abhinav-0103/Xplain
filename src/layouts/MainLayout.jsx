import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-cosmos-bg text-cosmos-text flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <footer className="border-t border-paper-border py-8 mt-auto bg-paper-card">
                <div className="max-w-7xl mx-auto px-4 text-center text-paper-text-muted text-sm">
                    <p>&copy; {new Date().getFullYear()} Xplain. Interactive Learning Platform.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
