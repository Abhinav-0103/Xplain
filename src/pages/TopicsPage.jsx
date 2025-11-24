import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { visualizations, categories } from '../data/visualizations';
import { ArrowRight } from 'lucide-react';

const TopicsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    const filteredVisualizations = selectedCategory === 'All'
        ? visualizations
        : visualizations.filter(viz => viz.category === selectedCategory);

    const handleCategoryChange = (categoryName) => {
        setSelectedCategory(categoryName);
        if (categoryName === 'All') {
            navigate('/topics');
        } else {
            navigate(`/topics?category=${encodeURIComponent(categoryName)}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-heading mb-8 text-paper-text">All Topics</h1>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-3">
                <CategoryButton
                    label="All"
                    isActive={selectedCategory === 'All'}
                    onClick={() => handleCategoryChange('All')}
                />
                {categories.map((category) => (
                    <CategoryButton
                        key={category.id}
                        label={category.name}
                        isActive={selectedCategory === category.name}
                        onClick={() => handleCategoryChange(category.name)}
                    />
                ))}
            </div>

            {/* Visualization Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVisualizations.map((viz) => (
                    <VisualizationCard key={viz.id} visualization={viz} />
                ))}
            </div>

            {filteredVisualizations.length === 0 && (
                <div className="text-center py-20 text-paper-text-muted font-serif italic">
                    No visualizations found in this category yet.
                </div>
            )}
        </div>
    );
};

const CategoryButton = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${isActive
            ? 'bg-paper-accent text-white shadow-md border border-transparent hover:bg-white hover:text-paper-accent hover:border-paper-accent'
            : 'bg-white border border-paper-border text-paper-text-muted hover:bg-paper-bg hover:text-paper-text'
            }`}
    >
        {label}
    </button>
);

const VisualizationCard = ({ visualization }) => {
    const isComingSoon = !visualization.route;

    if (isComingSoon) {
        return (
            <div className="paper-card p-6 rounded-xl h-48 flex flex-col justify-between opacity-60 cursor-not-allowed">
                <div>
                    <h2 className="text-xl font-bold font-heading text-paper-text-muted mb-2">{visualization.title}</h2>
                    <p className="text-sm text-paper-text-muted font-serif">{visualization.description}</p>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-paper-text-muted uppercase tracking-wider font-medium">{visualization.difficulty}</span>
                    <span className="text-xs text-paper-text-muted font-serif italic">Coming Soon</span>
                </div>
            </div>
        );
    }

    return (
        <Link
            to={visualization.route}
            className="paper-card p-6 rounded-xl h-48 flex flex-col justify-between group cursor-pointer"
        >
            <div>
                <h2 className="text-xl font-bold font-heading text-paper-text mb-2 group-hover:text-paper-accent transition-colors">
                    {visualization.title}
                </h2>
                <p className="text-sm text-paper-text-muted font-serif">{visualization.description}</p>
                <span className="inline-block mt-2 text-xs text-paper-accent uppercase tracking-wider font-medium">
                    {visualization.category}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs text-paper-text-muted uppercase tracking-wider font-medium">{visualization.difficulty}</span>
                <ArrowRight className="w-4 h-4 text-paper-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
};

export default TopicsPage;
