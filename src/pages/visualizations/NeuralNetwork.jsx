import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Plus, Minus, Shuffle } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button, Slider } from '../../components/UI';
import { createNetwork, forwardPassGenerator, backwardPassGenerator } from '../../utils/neuralNetwork';

const NeuralNetwork = () => {
    const [layerConfig, setLayerConfig] = useState([3, 4, 4, 2]);
    const [network, setNetwork] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeLayer, setActiveLayer] = useState(-1);
    const [inputs, setInputs] = useState([0.5, 0.8, 0.2]); // Default inputs
    const [targets, setTargets] = useState([0.1, 0.9]); // Default targets
    const [learningRate, setLearningRate] = useState(0.5);
    const [epochs, setEpochs] = useState(5);
    const [isBackpropagating, setIsBackpropagating] = useState(false);

    const generatorRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        resetNetwork();
    }, [layerConfig]);

    const resetNetwork = () => {
        stopAnimation();
        const newNetwork = createNetwork(layerConfig);
        setNetwork(newNetwork);
        setActiveLayer(-1);
        setIsBackpropagating(false);
        generatorRef.current = null;
    };

    const randomizeWeights = () => {
        resetNetwork();
    };

    const addLayer = () => {
        if (layerConfig.length < 6) {
            const newConfig = [...layerConfig];
            newConfig.splice(newConfig.length - 1, 0, 4); // Insert before output
            setLayerConfig(newConfig);
        }
    };

    const removeLayer = () => {
        if (layerConfig.length > 2) {
            const newConfig = [...layerConfig];
            newConfig.splice(newConfig.length - 2, 1); // Remove second to last
            setLayerConfig(newConfig);
        }
    };

    const stopAnimation = () => {
        setIsAnimating(false);
        setIsBackpropagating(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const runSimulation = async () => {
        if (isAnimating) return;

        stopAnimation();

        // Loop through epochs
        for (let epoch = 0; epoch < epochs; epoch++) {
            let updatedNetwork = network;

            // Forward pass
            setIsAnimating(true);
            setIsBackpropagating(false);
            generatorRef.current = forwardPassGenerator(updatedNetwork, inputs);

            await new Promise((resolve) => {
                intervalRef.current = setInterval(() => {
                    const { value, done } = generatorRef.current.next();

                    if (value) {
                        updatedNetwork = value.layers;
                        setNetwork(value.layers);
                        setActiveLayer(value.activeLayer);
                    }

                    if (done || value?.finished) {
                        clearInterval(intervalRef.current);
                        setActiveLayer(-1);
                        resolve();
                        return;
                    }
                }, 500);
            });

            // Wait a bit before starting backward pass
            await new Promise(resolve => setTimeout(resolve, 500));

            // Backward pass - use the updated network from forward pass
            setIsBackpropagating(true);
            generatorRef.current = backwardPassGenerator(updatedNetwork, targets, learningRate);

            await new Promise((resolve) => {
                intervalRef.current = setInterval(() => {
                    const { value, done } = generatorRef.current.next();

                    if (value) {
                        updatedNetwork = value.layers;
                        setNetwork(value.layers);
                        setActiveLayer(value.activeLayer);
                    }

                    if (done || value?.finished) {
                        clearInterval(intervalRef.current);
                        setActiveLayer(-1);
                        resolve();
                        return;
                    }
                }, 500);
            });

            // Wait before next epoch (unless it's the last one)
            if (epoch < epochs - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        stopAnimation();
    };

    // Calculate positions for visualization
    const getNeuronPosition = (layerIndex, neuronIndex, totalLayers, neuronsInLayer) => {
        const x = (layerIndex + 0.5) * (800 / totalLayers);
        const y = (neuronIndex + 0.5) * (600 / neuronsInLayer);
        return { x, y };
    };

    const controls = (
        <>
            <ControlGroup label="Architecture">
                <div className="flex gap-2 mb-4">
                    <Button onClick={addLayer} variant="secondary" className="flex-1">
                        <Plus className="w-4 h-4" /> Add Layer
                    </Button>
                    <Button onClick={removeLayer} variant="secondary" className="flex-1">
                        <Minus className="w-4 h-4" /> Remove Layer
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button onClick={randomizeWeights} variant="secondary" className="flex-1">
                        <Shuffle className="w-4 h-4" /> Randomize Weights
                    </Button>
                </div>
            </ControlGroup>

            <ControlGroup label="Training">
                <Button onClick={runSimulation} variant="primary" className="w-full mb-4">
                    <Play className="w-4 h-4" /> Simulate Training
                </Button>
                <Slider label="Epochs" value={epochs} min={1} max={10} step={1} onChange={setEpochs} />
                <Slider label="Learning Rate" value={learningRate} min={0.01} max={1.0} step={0.01} onChange={setLearningRate} />
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Legend</h3>
                <div className="space-y-2 text-xs text-paper-text-muted">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-paper-accent rounded-full opacity-100"></div>
                        <span>High Activation (~1.0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-paper-accent rounded-full opacity-20"></div>
                        <span>Low Activation (~0.0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-paper-text opacity-50"></div>
                        <span>Connection Weight</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-[#2A9D8F] opacity-100"></div>
                        <span>Backpropagation</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Neural Network (MLP)" controls={controls}>
            <svg width="100%" height="100%" viewBox="0 0 800 600" className="overflow-visible">
                {/* Connections */}
                {network.map((layer, i) => {
                    if (i === 0) return null; // No incoming connections for input layer
                    const prevLayer = network[i - 1];

                    return layer.neurons.map((neuron, j) => {
                        const { x: x2, y: y2 } = getNeuronPosition(i, j, network.length, layer.neurons.length);

                        return neuron.weights.map((weight, k) => {
                            const prevNeuronIndex = prevLayer.neurons.findIndex(n => n.id === weight.from);
                            const { x: x1, y: y1 } = getNeuronPosition(i - 1, prevNeuronIndex, network.length, prevLayer.neurons.length);

                            // Highlight active connections
                            const isActive = activeLayer === i || (isBackpropagating && activeLayer === i - 1);
                            let strokeColor = "#2C1810";
                            if (isActive) {
                                strokeColor = isBackpropagating ? "#2A9D8F" : "#E07A5F";
                            }

                            const opacity = Math.abs(weight.value) * (isActive ? 1 : 0.2);

                            return (
                                <motion.line
                                    key={`${weight.from}-${neuron.id}`}
                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke={strokeColor}
                                    strokeWidth={Math.abs(weight.value) * 3}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity, stroke: strokeColor }}
                                    transition={{ duration: 0.5 }}
                                />
                            );
                        });
                    });
                })}

                {/* Neurons */}
                {network.map((layer, i) => (
                    layer.neurons.map((neuron, j) => {
                        const { x, y } = getNeuronPosition(i, j, network.length, layer.neurons.length);
                        const isActive = activeLayer === i;

                        return (
                            <motion.g key={neuron.id}>
                                <motion.circle
                                    cx={x} cy={y} r="20"
                                    fill="#FFFFFF"
                                    stroke="#2C1810"
                                    strokeWidth="2"
                                />
                                {/* Activation Fill */}
                                <motion.circle
                                    cx={x} cy={y} r="18"
                                    fill="#E07A5F"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: neuron.activation }}
                                    transition={{ duration: 0.3 }}
                                />
                                {/* Value Label */}
                                <text
                                    x={x} y={y} dy=".3em"
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill={neuron.activation > 0.5 ? "#FFFFFF" : "#2C1810"}
                                    className="pointer-events-none font-mono"
                                >
                                    {neuron.activation.toFixed(2)}
                                </text>
                            </motion.g>
                        );
                    })
                ))}
            </svg>
        </VisualizationLayout>
    );
};

export default NeuralNetwork;
