import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Image as ImageIcon } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button, Slider } from '../../components/UI';
import {
    sampleImages,
    createCNNArchitecture,
    forwardPassCNN,
    normalizeMatrix
} from '../../utils/cnn';

const CNNVisualization = () => {
    const [selectedImage, setSelectedImage] = useState('digit0');
    const [architecture, setArchitecture] = useState(createCNNArchitecture());
    const [layerOutputs, setLayerOutputs] = useState([]);
    const [activeLayer, setActiveLayer] = useState(-1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(800);
    const [hoveredFeatureMap, setHoveredFeatureMap] = useState(null);

    const generatorRef = useRef(null);
    const intervalRef = useRef(null);

    const inputImage = useMemo(() => sampleImages[selectedImage], [selectedImage]);

    const resetVisualization = () => {
        stopAnimation();
        setLayerOutputs([]);
        setActiveLayer(-1);
        setArchitecture(createCNNArchitecture());
    };

    const stopAnimation = () => {
        setIsAnimating(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const runForwardPass = () => {
        if (isAnimating) return;

        stopAnimation();
        setLayerOutputs([]);
        setActiveLayer(-1);
        setIsAnimating(true);

        generatorRef.current = forwardPassCNN(architecture, inputImage);

        intervalRef.current = setInterval(() => {
            const { value, done } = generatorRef.current.next();

            if (value) {
                setActiveLayer(value.activeLayer);
                setLayerOutputs(value.outputs);
            }

            if (done || value?.finished) {
                clearInterval(intervalRef.current);
                setIsAnimating(false);
                setActiveLayer(-1);
                return;
            }
        }, animationSpeed);
    };

    const renderInputImage = () => {
        const cellSize = 8;
        const maxDisplay = 28;

        return (
            <div className="flex flex-col items-center mb-6">
                <h3 className="text-sm font-medium text-paper-text mb-2">Input Image</h3>
                <div className="inline-block border-2 border-paper-border rounded-lg p-2 bg-white">
                    {inputImage.slice(0, maxDisplay).map((row, i) => (
                        <div key={i} className="flex">
                            {row.slice(0, maxDisplay).map((val, j) => (
                                <div
                                    key={j}
                                    style={{
                                        width: cellSize,
                                        height: cellSize,
                                        backgroundColor: `rgba(224, 122, 95, ${val})`,
                                    }}
                                    className="border border-paper-border/20"
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-paper-text-muted mt-2">28×28 pixels</p>
            </div>
        );
    };

    const renderFeatureMap = (matrix, index, isActive = false) => {
        if (!matrix || matrix.length === 0) return null;

        const normalized = normalizeMatrix(matrix);
        const cellSize = Math.max(3, Math.min(8, 200 / normalized.length));
        const mapSize = normalized.length;

        return (
            <motion.div
                key={index}
                className="inline-block border border-paper-border rounded bg-white m-1 cursor-pointer"
                animate={{
                    scale: hoveredFeatureMap === index ? 1.05 : 1,
                    borderColor: isActive ? '#E07A5F' : '#2C1810',
                    borderWidth: isActive ? 2 : 1,
                }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredFeatureMap(index)}
                onMouseLeave={() => setHoveredFeatureMap(null)}
                title={`Feature map ${index + 1} (${mapSize}×${mapSize})`}
            >
                {normalized.map((row, i) => (
                    <div key={i} className="flex">
                        {row.map((val, j) => (
                            <div
                                key={j}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    backgroundColor: `rgba(42, 157, 143, ${val})`,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </motion.div>
        );
    };

    const renderDenseVector = (vector, isActive = false) => {
        if (!vector || vector.length === 0) return null;

        const cellHeight = 20;
        const cellWidth = 100;

        return (
            <div className="flex flex-col gap-1">
                {vector.map((val, i) => (
                    <motion.div
                        key={i}
                        className="relative border border-paper-border rounded overflow-hidden bg-white"
                        style={{ height: cellHeight, width: cellWidth }}
                        animate={{
                            borderColor: isActive ? '#E07A5F' : '#2C1810',
                            borderWidth: isActive ? 2 : 1,
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 h-full"
                            style={{
                                width: `${val * 100}%`,
                                backgroundColor: '#2A9D8F',
                                opacity: 0.6,
                            }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-paper-text">
                            {val.toFixed(3)}
                        </span>
                    </motion.div>
                ))}
            </div>
        );
    };

    const renderLayerOutput = (layerOutput, idx) => {
        const isActive = activeLayer === layerOutput.layerIndex;

        return (
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`paper-card p-4 rounded-xl mb-4 ${isActive ? 'ring-2 ring-paper-accent' : ''}`}
            >
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold font-heading text-paper-text">
                            Layer {layerOutput.layerIndex + 1}: {layerOutput.type.toUpperCase()}
                        </h3>
                        {layerOutput.type === 'conv' && (
                            <p className="text-xs text-paper-text-muted">
                                {layerOutput.layer.filters} filters, {layerOutput.layer.kernelSize}×{layerOutput.layer.kernelSize} kernel
                            </p>
                        )}
                        {layerOutput.type === 'pool' && (
                            <p className="text-xs text-paper-text-muted">
                                {layerOutput.layer.poolType} pooling, {layerOutput.layer.poolSize}×{layerOutput.layer.poolSize}
                            </p>
                        )}
                        {layerOutput.type === 'dense' && (
                            <p className="text-xs text-paper-text-muted">
                                {layerOutput.layer.units} units
                            </p>
                        )}
                    </div>
                    {isActive && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-paper-accent rounded-full"
                        />
                    )}
                </div>

                <div className="overflow-x-auto">
                    {layerOutput.type === 'conv' || layerOutput.type === 'pool' ? (
                        <div className="flex flex-wrap gap-2">
                            {layerOutput.featureMaps.slice(0, 16).map((map, i) =>
                                renderFeatureMap(map, i, isActive)
                            )}
                            {layerOutput.featureMaps.length > 16 && (
                                <div className="text-xs text-paper-text-muted self-center ml-2">
                                    +{layerOutput.featureMaps.length - 16} more
                                </div>
                            )}
                        </div>
                    ) : layerOutput.type === 'flatten' ? (
                        <div className="text-sm text-paper-text-muted">
                            Flattened to vector of length {layerOutput.vector.length}
                        </div>
                    ) : layerOutput.type === 'dense' ? (
                        renderDenseVector(layerOutput.vector, isActive)
                    ) : null}
                </div>
            </motion.div>
        );
    };

    const controls = (
        <>
            <ControlGroup label="Sample Images">
                <div className="grid grid-cols-3 gap-2">
                    {Object.keys(sampleImages).map(key => (
                        <Button
                            key={key}
                            onClick={() => {
                                setSelectedImage(key);
                                resetVisualization();
                            }}
                            variant={selectedImage === key ? 'primary' : 'secondary'}
                            className="text-xs"
                        >
                            <ImageIcon className="w-3 h-3" />
                            {key.replace(/([A-Z])/g, ' $1').replace('digit', '')}
                        </Button>
                    ))}
                </div>
            </ControlGroup>

            <ControlGroup label="Animation">
                <Button
                    onClick={runForwardPass}
                    variant="primary"
                    className="w-full mb-3"
                    disabled={isAnimating}
                >
                    <Play className="w-4 h-4" />
                    {isAnimating ? 'Running...' : 'Forward Pass'}
                </Button>
                <Button
                    onClick={resetVisualization}
                    variant="secondary"
                    className="w-full mb-3"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </Button>
                <Slider
                    label="Speed (ms)"
                    value={animationSpeed}
                    min={300}
                    max={2000}
                    step={100}
                    onChange={setAnimationSpeed}
                    disabled={isAnimating}
                />
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Architecture</h3>
                <div className="space-y-1 text-xs text-paper-text-muted">
                    {architecture.map((layer, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span>{i + 1}. {layer.type.toUpperCase()}</span>
                            {layer.type === 'conv' && <span>{layer.filters} filters</span>}
                            {layer.type === 'dense' && <span>{layer.units} units</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Legend</h3>
                <div className="space-y-2 text-xs text-paper-text-muted">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(224, 122, 95, 0.8)' }} />
                        <span>Input intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(42, 157, 143, 0.8)' }} />
                        <span>Feature activation</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Convolutional Neural Network" controls={controls}>
            <div className="w-full h-full overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {renderInputImage()}

                    {layerOutputs.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold font-heading text-paper-text mb-4">
                                Network Activations
                            </h2>
                            {layerOutputs.map((output, idx) => renderLayerOutput(output, idx))}
                        </div>
                    )}

                    {layerOutputs.length === 0 && !isAnimating && (
                        <div className="text-center py-12">
                            <p className="text-paper-text-muted italic">
                                Click "Forward Pass" to see the network process the input image
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </VisualizationLayout>
    );
};

export default CNNVisualization;
