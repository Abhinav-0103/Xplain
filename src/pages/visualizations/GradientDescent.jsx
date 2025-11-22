import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Pause } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Slider, Button } from '../../components/UI';
import { lossFunction, runGradientDescent } from '../../utils/math';

const GradientDescent = () => {
    // State
    const [startX, setStartX] = useState(-2);
    const [startY, setStartY] = useState(3);
    const [learningRate, setLearningRate] = useState(0.1);
    const [steps, setSteps] = useState(50);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Compute path
    const path = useMemo(() => runGradientDescent(startX, startY, learningRate, steps), [startX, startY, learningRate, steps]);

    // Animation
    React.useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= path.length - 1) {
                    setIsAnimating(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isAnimating, path.length]);

    const handlePlay = () => {
        if (currentStep >= path.length - 1) {
            setCurrentStep(0);
        }
        setIsAnimating(true);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsAnimating(false);
    };

    // SVG Dimensions
    const width = 600;
    const height = 500;
    const padding = 50;

    // Coordinate mapping (centered at minimum (2, 1))
    const xScale = (x) => padding + ((x + 4) / 8) * (width - 2 * padding); // Range -4 to 4
    const yScale = (y) => height - padding - ((y + 2) / 6) * (height - 2 * padding); // Range -2 to 4

    // Generate contour lines
    const contours = [];
    const levels = [0.5, 1, 2, 4, 8, 12, 16];
    const resolution = 100;

    levels.forEach((level) => {
        const points = [];
        for (let i = 0; i <= resolution; i++) {
            const angle = (i / resolution) * 2 * Math.PI;
            const radius = Math.sqrt(level);
            const x = 2 + radius * Math.cos(angle);
            const y = 1 + radius * Math.sin(angle);
            points.push(`${xScale(x)},${yScale(y)}`);
        }
        contours.push({ level, points: points.join(' ') });
    });

    const currentPoint = path[currentStep] || path[0];
    const visiblePath = path.slice(0, currentStep + 1);

    const controls = (
        <>
            <ControlGroup label="Starting Position">
                <Slider label="Start X" value={startX} min={-4} max={4} step={0.5} onChange={setStartX} />
                <Slider label="Start Y" value={startY} min={-2} max={4} step={0.5} onChange={setStartY} />
            </ControlGroup>

            <ControlGroup label="Algorithm">
                <Slider label="Learning Rate" value={learningRate} min={0.01} max={0.5} step={0.01} onChange={setLearningRate} />
                <Slider label="Max Steps" value={steps} min={10} max={100} step={5} onChange={setSteps} />
            </ControlGroup>

            <ControlGroup label="Animation">
                <div className="flex gap-2">
                    <Button onClick={handlePlay} variant="primary">
                        {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isAnimating ? 'Pause' : 'Play'}
                    </Button>
                    <Button onClick={handleReset} variant="secondary">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </Button>
                </div>
            </ControlGroup>

            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Current State</h3>
                <div className="space-y-1 text-xs font-mono text-cosmos-accent-cyan">
                    <p>Step: {currentStep}/{path.length - 1}</p>
                    <p>X: {currentPoint.x.toFixed(3)}</p>
                    <p>Y: {currentPoint.y.toFixed(3)}</p>
                    <p>Loss: {currentPoint.loss.toFixed(3)}</p>
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Gradient Descent (2D)" controls={controls}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Contour lines */}
                {contours.map((contour, idx) => (
                    <polyline
                        key={idx}
                        points={contour.points}
                        fill="none"
                        stroke={`rgba(0, 243, 255, ${0.1 + idx * 0.05})`}
                        strokeWidth="1.5"
                    />
                ))}

                {/* Minimum point (optimal) */}
                <circle
                    cx={xScale(2)}
                    cy={yScale(1)}
                    r="8"
                    fill="var(--color-cosmos-accent-cyan)"
                    opacity="0.6"
                    filter="drop-shadow(0 0 8px var(--color-cosmos-accent-cyan))"
                >
                    <title>Minimum at (2, 1)</title>
                </circle>

                {/* Optimization Path */}
                {visiblePath.length > 1 && (
                    <motion.polyline
                        points={visiblePath.map(p => `${xScale(p.x)},${yScale(p.y)}`).join(' ')}
                        fill="none"
                        stroke="var(--color-cosmos-accent-magenta)"
                        strokeWidth="2"
                        strokeDasharray="5 3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                )}

                {/* Path Points */}
                <AnimatePresence>
                    {visiblePath.map((point, idx) => (
                        <motion.circle
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{
                                cx: xScale(point.x),
                                cy: yScale(point.y),
                                scale: idx === currentStep ? 1.5 : 0.7
                            }}
                            exit={{ scale: 0 }}
                            r="4"
                            fill={idx === currentStep ? "var(--color-cosmos-accent-magenta)" : "rgba(189, 0, 255, 0.5)"}
                            filter={idx === currentStep ? "drop-shadow(0 0 6px var(--color-cosmos-accent-magenta))" : "none"}
                        />
                    ))}
                </AnimatePresence>

                {/* Axes Labels */}
                <text x={width / 2} y={height - 10} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">X</text>
                <text x={20} y={height / 2} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">Y</text>
            </svg>
        </VisualizationLayout>
    );
};

export default GradientDescent;
