import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, RotateCcw } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button } from '../../components/UI';
import { insertNode, searchNode, getSearchPath, calculateTreeLayout, flattenTree, TreeNode } from '../../utils/tree';

const BinarySearchTree = () => {
    const [root, setRoot] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('Enter a number to insert or search.');
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);

    // Initial tree
    useEffect(() => {
        let initialRoot = new TreeNode(50);
        initialRoot = insertNode(initialRoot, 30);
        initialRoot = insertNode(initialRoot, 70);
        initialRoot = insertNode(initialRoot, 20);
        initialRoot = insertNode(initialRoot, 40);
        initialRoot = insertNode(initialRoot, 60);
        initialRoot = insertNode(initialRoot, 80);
        updateTree(initialRoot);
    }, []);

    const updateTree = (newRoot) => {
        calculateTreeLayout(newRoot);
        setRoot({ ...newRoot }); // Force re-render
    };

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setMessage('Please enter a valid number.');
            return;
        }

        if (searchNode(root, val)) {
            setMessage(`${val} already exists in the tree.`);
            return;
        }

        const newRoot = insertNode(root, val);
        updateTree(newRoot);
        setMessage(`Inserted ${val}.`);
        setInputValue('');
        setHighlightedNodeId(null);
    };

    const handleSearch = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setMessage('Please enter a valid number.');
            return;
        }

        setMessage(`Searching for ${val}...`);
        setHighlightedNodeId(null);

        const { found, path } = getSearchPath(root, val);

        // Animate path
        for (let i = 0; i < path.length; i++) {
            setHighlightedNodeId(path[i]);
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay per step
        }

        if (found) {
            setMessage(`Found ${val}!`);
        } else {
            setMessage(`${val} not found.`);
            // Optional: clear highlight after not found
            setTimeout(() => setHighlightedNodeId(null), 1000);
        }
    };

    const handleReset = () => {
        setRoot(null);
        setMessage('Tree reset.');
        setInputValue('');
    };

    const { nodes, edges } = root ? flattenTree(root) : { nodes: [], edges: [] };

    const controls = (
        <>
            <ControlGroup label="Operations">
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Value"
                        className="w-full px-3 py-2 bg-paper-bg border border-paper-border rounded-md text-paper-text focus:outline-none focus:border-paper-accent"
                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleInsert} variant="primary" className="flex-1">
                        <Plus className="w-4 h-4" /> Insert
                    </Button>
                    <Button onClick={handleSearch} variant="secondary" className="flex-1">
                        <Search className="w-4 h-4" /> Search
                    </Button>
                </div>
                <Button onClick={handleReset} variant="danger" className="w-full">
                    <RotateCcw className="w-4 h-4" /> Reset Tree
                </Button>
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Status</h3>
                <p className="text-xs text-paper-text-muted font-mono">{message}</p>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Binary Search Tree" controls={controls}>
            <svg width="100%" height="100%" viewBox="0 0 800 600" className="overflow-visible">
                <AnimatePresence>
                    {/* Edges */}
                    {edges.map((edge) => (
                        <motion.line
                            key={edge.id}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                x1: edge.from.x,
                                y1: edge.from.y,
                                x2: edge.to.x,
                                y2: edge.to.y,
                                opacity: 1,
                                pathLength: 1
                            }}
                            transition={{ duration: 0.5 }}
                            stroke="#E6E2D6"
                            strokeWidth="2"
                        />
                    ))}

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <motion.g
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                x: node.x,
                                y: node.y,
                                scale: 1,
                                opacity: 1
                            }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        >
                            <circle
                                r="20"
                                fill="#F9F7F1"
                                stroke={highlightedNodeId === node.id ? "#E07A5F" : "#3D405B"}
                                strokeWidth="2"
                                className="cursor-pointer hover:fill-paper-bg transition-colors"
                            />
                            <text
                                textAnchor="middle"
                                dy=".3em"
                                fill="#2C1810"
                                fontSize="12"
                                fontWeight="bold"
                                className="pointer-events-none font-mono"
                            >
                                {node.value}
                            </text>
                        </motion.g>
                    ))}
                </AnimatePresence>
            </svg>
        </VisualizationLayout>
    );
};

export default BinarySearchTree;
