// Visualization data organized by category
export const visualizations = [
    {
        id: 'linear-regression',
        title: 'Linear Regression',
        description: 'Interactive Least Squares fitting with noise control.',
        category: 'Machine Learning',
        route: '/visualizations/linear-regression',
        difficulty: 'Beginner',
    },
    {
        id: 'gradient-descent',
        title: 'Gradient Descent (2D)',
        description: 'Visualize optimization on a 2D loss surface.',
        category: 'Machine Learning',
        route: '/visualizations/gradient-descent',
        difficulty: 'Intermediate',
    },
    {
        id: 'gradient-descent-3d',
        title: 'Gradient Descent (3D)',
        description: 'Interactive 3D surface with optimization path.',
        category: 'Machine Learning',
        route: '/visualizations/gradient-descent-3d',
        difficulty: 'Intermediate',
    },
    // Placeholders for future content
    {
        id: 'neural-network',
        title: 'Neural Network',
        description: 'Visualize forward propagation in a Multi-Layer Perceptron.',
        category: 'Deep Learning',
        route: '/visualizations/neural-network',
        difficulty: 'Advanced',
    },
    {
        id: 'binary-search-tree',
        title: 'Binary Search Tree',
        description: 'Interactive BST operations: Insert, Search, and Visualize.',
        category: 'Data Structures & Algorithms',
        route: '/visualizations/binary-search-tree',
        difficulty: 'Beginner',
    },
    {
        id: 'sorting-algorithms',
        title: 'Sorting Algorithms',
        description: 'Visualize Bubble, Selection, and Insertion Sort.',
        category: 'Data Structures & Algorithms',
        route: '/visualizations/sorting-algorithms',
        difficulty: 'Beginner',
    },
    {
        id: 'dfs',
        title: 'Depth First Search',
        description: 'Visualize graph traversal using DFS algorithm.',
        category: 'Data Structures & Algorithms',
        route: '/visualizations/dfs',
        difficulty: 'Intermediate',
    },
    {
        id: 'bfs',
        title: 'Breadth First Search',
        description: 'Visualize graph traversal using BFS algorithm.',
        category: 'Data Structures & Algorithms',
        route: '/visualizations/bfs',
        difficulty: 'Intermediate',
    },
    {
        id: 'convolution',
        title: 'Convolution Operation',
        description: 'Visualize 2D convolution with stride, padding, and dilation.',
        category: 'Computer Vision',
        route: '/visualizations/convolution',
        difficulty: 'Intermediate',
    },
    {
        id: 'cnn',
        title: 'Convolutional Neural Network',
        description: 'Interactive CNN with layer-by-layer forward pass visualization.',
        category: 'Deep Learning',
        route: '/visualizations/cnn',
        difficulty: 'Advanced',
    },
];

export const categories = [
    {
        id: 'ml',
        name: 'Machine Learning',
        icon: 'Brain',
        description: 'Understand regression, classification, and optimization algorithms.',
        color: 'magenta',
    },
    {
        id: 'dl',
        name: 'Deep Learning',
        icon: 'Network',
        description: 'Visualize neural networks and deep learning concepts.',
        color: 'cyan',
    },
    {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        icon: 'Database',
        description: 'Explore sorting, searching, trees, and graphs.',
        color: 'purple',
    },
    {
        id: 'cv',
        name: 'Computer Vision',
        icon: 'Eye',
        description: 'Understand image processing and convolution operations.',
        color: 'blue',
    },
];

export const getVisualizationsByCategory = (categoryName) => {
    return visualizations.filter(viz => viz.category === categoryName);
};
