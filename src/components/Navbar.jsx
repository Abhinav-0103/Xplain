import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed w-full z-50 bg-paper-bg/80 backdrop-blur-md border-b border-paper-border transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Brain className="h-8 w-8 text-paper-accent" />
                            <span className="text-2xl font-bold font-heading text-paper-text">
                                Xplain
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-paper-text hover:text-paper-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link to="/topics" className="text-paper-text hover:text-paper-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Topics
                            </Link>
                            <Link to="/about" className="text-paper-text hover:text-paper-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                About
                            </Link>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden glass-panel border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-paper-card border-b border-paper-border">
                        <Link to="/" className="text-paper-text hover:text-paper-accent block px-3 py-2 rounded-md text-base font-medium">
                            Home
                        </Link>
                        <Link to="/topics" className="text-paper-text hover:text-paper-accent block px-3 py-2 rounded-md text-base font-medium">
                            Topics
                        </Link>
                        <Link to="/about" className="text-paper-text hover:text-paper-accent block px-3 py-2 rounded-md text-base font-medium">
                            About
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
