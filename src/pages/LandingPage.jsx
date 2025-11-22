import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Database, Network, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, getVisualizationsByCategory } from '../data/visualizations';

const LandingPage = () => {
    const mlRef = useRef(null);
    const dlRef = useRef(null);
    const dsaRef = useRef(null);
    const navigate = useNavigate();

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const iconMap = {
        Brain: Brain,
        Network: Network,
        Database: Database,
    };

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-32 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cosmos-accent-purple/20 via-cosmos-bg to-cosmos-bg opacity-50"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    >
                        Visualize the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmos-accent-cyan to-cosmos-accent-magenta neon-text">Future</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        Master Machine Learning, Deep Learning, and Algorithms through interactive, stunning visualizations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center gap-4 mb-16"
                    >
                        <Link to="/topics" className="group relative px-8 py-3 bg-cosmos-accent-cyan/10 border border-cosmos-accent-cyan/50 text-cosmos-accent-cyan rounded-full font-semibold hover:bg-cosmos-accent-cyan/20 transition-all neon-border flex items-center gap-2">
                            Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col items-center gap-2 cursor-pointer"
                        onClick={() => scrollToSection(mlRef)}
                    >
                        <p className="text-sm text-gray-400">Explore Categories</p>
                        <ChevronDown className="w-6 h-6 text-cosmos-accent-cyan animate-bounce" />
                    </motion.div>
                </div>
            </section>

            {/* Category Sections */}
            {categories.map((category, idx) => {
                const Icon = iconMap[category.icon];
                const sectionRef = idx === 0 ? mlRef : idx === 1 ? dlRef : dsaRef;
                const visualizations = getVisualizationsByCategory(category.name);

                return (
                    <section
                        key={category.id}
                        ref={sectionRef}
                        className="py-20 bg-cosmos-bg/50 border-t border-white/5"
                        id={category.id}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 bg-white/5 rounded-xl border border-cosmos-accent-${category.color}/30`}>
                                        <Icon className={`w-8 h-8 text-cosmos-accent-${category.color}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                                        <p className="text-gray-400 mt-1">{category.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/topics?category=${encodeURIComponent(category.name)}`)}
                                    className="text-cosmos-accent-cyan hover:text-white transition-colors flex items-center gap-2"
                                >
                                    View All <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {visualizations.slice(0, 3).map((viz) => (
                                    <VisualizationCard key={viz.id} visualization={viz} />
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
};

const VisualizationCard = ({ visualization }) => {
    const navigate = useNavigate();
    const isComingSoon = !visualization.route;

    const handleClick = () => {
        if (!isComingSoon) {
            navigate(visualization.route);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`glass-panel p-6 rounded-xl h-48 flex flex-col justify-between hover:border-cosmos-accent-cyan/30 transition-colors group ${isComingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            onClick={handleClick}
        >
            <div>
                <h3 className={`text-xl font-bold mb-2 ${isComingSoon ? 'text-gray-400' : 'text-white group-hover:text-cosmos-accent-cyan'} transition-colors`}>
                    {visualization.title}
                </h3>
                <p className="text-sm text-gray-400">{visualization.description}</p>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{visualization.difficulty}</span>
                {!isComingSoon && (
                    <ArrowRight className="w-4 h-4 text-cosmos-accent-cyan opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
            </div>
        </motion.div>
    );
};

export default LandingPage;
