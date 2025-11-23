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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-paper-accent/5 via-paper-bg to-paper-bg opacity-40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-6 text-paper-text"
                    >
                        Visualize the <span className="text-paper-accent italic">Future</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-4 text-xl text-paper-text-muted max-w-2xl mx-auto mb-10 font-serif"
                    >
                        Master Machine Learning, Deep Learning, and Algorithms through interactive, stunning visualizations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center gap-4 mb-16"
                    >
                        <Link to="/topics" className="group relative px-8 py-3 bg-paper-accent text-white rounded-full font-semibold hover:bg-paper-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
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
                        <p className="text-sm text-paper-text-muted font-serif italic">Explore Categories</p>
                        <ChevronDown className="w-6 h-6 text-paper-accent animate-bounce" />
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
                        className="py-20 border-t border-paper-border"
                        id={category.id}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 bg-white rounded-xl border border-paper-border shadow-sm`}>
                                        <Icon className={`w-8 h-8 text-paper-accent`} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold font-heading text-paper-text">{category.name}</h2>
                                        <p className="text-paper-text-muted mt-1 font-serif italic">{category.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/topics?category=${encodeURIComponent(category.name)}`)}
                                    className="text-paper-accent hover:text-paper-text transition-colors flex items-center gap-2 font-medium"
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
            className={`paper-card p-6 rounded-xl h-48 flex flex-col justify-between group ${isComingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            onClick={handleClick}
        >
            <div>
                <h3 className={`text-xl font-bold font-heading mb-2 ${isComingSoon ? 'text-paper-text-muted' : 'text-paper-text group-hover:text-paper-accent'} transition-colors`}>
                    {visualization.title}
                </h3>
                <p className="text-sm text-paper-text-muted font-serif">{visualization.description}</p>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs text-paper-text-muted uppercase tracking-wider font-medium">{visualization.difficulty}</span>
                {!isComingSoon && (
                    <ArrowRight className="w-4 h-4 text-paper-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
            </div>
        </motion.div>
    );
};

export default LandingPage;
