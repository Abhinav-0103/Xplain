import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button, Slider } from '../../components/UI';
import { generateSampleGraph, bfs } from '../../utils/graph';

const BFS = () => {
    const [graph, setGraph] = useState({ nodes: [], edges: [], adjacencyList: {} });
    const [visited, setVisited] = useState(new Set());
    const [queue, setQueue] = useState([]);
    const [currentNode, setCurrentNode] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [speed, setSpeed] = useState(50);

    const generatorRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        resetGraph();
    }, []);

    const resetGraph = () => {
        stopBFS();
        const newGraph = generateSampleGraph();
        setGraph(newGraph);
        setVisited(new Set());
        setQueue([]);
        setCurrentNode(null);
        setIsFinished(false);
        generatorRef.current = null;
    };

    const stopBFS = () => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startBFS = () => {
        if (isRunning) {
            stopBFS();
            return;
        }

        if (isFinished) {
            resetGraph();
            return;
        }

        setIsRunning(true);

        if (!generatorRef.current) {
            generatorRef.current = bfs(graph.adjacencyList, 0); // Start at node 0
        }

        intervalRef.current = setInterval(() => {
            const { value, done } = generatorRef.current.next();

            if (done || value?.finished) {
                stopBFS();
                setIsFinished(true);
                setCurrentNode(null);
                return;
            }

            if (value) {
                setVisited(value.visited);
                setQueue(value.queue);
                setCurrentNode(value.current);
            }
        }, 1000 - (speed * 9)); // Speed mapping
    };

    const controls = (
        <>
            <ControlGroup label="Controls">
                <div className="flex gap-2">
                    <Button onClick={startBFS} variant="primary" className="flex-1">
                        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isRunning ? 'Pause' : 'Start BFS'}
                    </Button>
                    <Button onClick={resetGraph} variant="secondary" className="flex-1">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </Button>
                </div>
            </ControlGroup>
            <ControlGroup label="Settings">
                <Slider label="Speed" value={speed} min={1} max={100} step={1} onChange={setSpeed} />
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Legend</h3>
                <div className="space-y-2 text-xs text-paper-text-muted">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-paper-accent rounded-full"></div>
                        <span>Current Node</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#2A9D8F] rounded-full"></div>
                        <span>Visited</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#E9C46A] rounded-full"></div>
                        <span>In Queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border border-paper-text rounded-full"></div>
                        <span>Unvisited</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Queue</h3>
                <div className="flex flex-wrap gap-2">
                    {queue.length === 0 ? <span className="text-xs text-paper-text-muted italic">Empty</span> :
                        queue.map((nodeId, idx) => (
                            <div key={idx} className="px-2 py-1 bg-[#E9C46A] text-paper-text text-xs rounded font-mono">
                                {nodeId}
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Breadth First Search (BFS)" controls={controls}>
            <svg width="100%" height="100%" viewBox="0 0 800 600" className="overflow-visible">
                {/* Edges */}
                {graph.edges.map((edge, idx) => (
                    <line
                        key={idx}
                        x1={graph.nodes[edge.from].x}
                        y1={graph.nodes[edge.from].y}
                        x2={graph.nodes[edge.to].x}
                        y2={graph.nodes[edge.to].y}
                        stroke="#E6E2D6"
                        strokeWidth="2"
                    />
                ))}

                {/* Nodes */}
                <AnimatePresence>
                    {graph.nodes.map((node) => {
                        let fillColor = "#FFFFFF";
                        let strokeColor = "#2C1810";
                        let scale = 1;

                        if (currentNode === node.id) {
                            fillColor = "#E07A5F"; // Accent
                            scale = 1.2;
                            strokeColor = "#E07A5F";
                        } else if (visited.has(node.id)) {
                            fillColor = "#2A9D8F"; // Visited
                            strokeColor = "#2A9D8F";
                        } else if (queue.includes(node.id)) {
                            fillColor = "#E9C46A"; // In Queue
                            strokeColor = "#E9C46A";
                        }

                        return (
                            <motion.g
                                key={node.id}
                                animate={{ scale }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="20"
                                    fill={fillColor}
                                    stroke={strokeColor}
                                    strokeWidth="2"
                                    className="transition-colors duration-300"
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    dy=".3em"
                                    textAnchor="middle"
                                    fill={currentNode === node.id || visited.has(node.id) ? "#FFFFFF" : "#2C1810"}
                                    fontWeight="bold"
                                    fontSize="12"
                                    className="pointer-events-none"
                                >
                                    {node.label}
                                </text>
                            </motion.g>
                        );
                    })}
                </AnimatePresence>
            </svg>
        </VisualizationLayout>
    );
};

export default BFS;
