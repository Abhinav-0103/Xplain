import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Slider, Button } from '../../components/UI';
import { generateData, calculateRegression } from '../../utils/math';

const LinearRegression = () => {
    // State
    const [numPoints, setNumPoints] = useState(20);
    const [noiseLevel, setNoiseLevel] = useState(1.5);
    const [trueSlope, setTrueSlope] = useState(0.5);
    const [trueIntercept, setTrueIntercept] = useState(2);
    const [data, setData] = useState([]);
    const [showResiduals, setShowResiduals] = useState(false);

    // Generate data on init or when parameters change (debounced ideally, but direct for now)
    useEffect(() => {
        handleGenerateData();
    }, []);

    const handleGenerateData = () => {
        const newData = generateData(numPoints, trueSlope, trueIntercept, noiseLevel);
        setData(newData);
    };

    // Calculate Regression Line
    const regressionLine = useMemo(() => {
        const result = calculateRegression(data);
        return result || { slope: 0, intercept: 0, mse: 0 };
    }, [data]);

    // SVG Dimensions & Scaling
    const width = 600;
    const height = 400;
    const padding = 40;

    // Helper to map data coordinates to SVG coordinates
    const xScale = (x) => padding + (x / 10) * (width - 2 * padding);
    const yScale = (y) => height - padding - (y / 10) * (height - 2 * padding); // Assuming y range 0-10 roughly

    // Regression Line Points
    const x1 = 0;
    const y1 = regressionLine.slope * x1 + regressionLine.intercept;
    const x2 = 10;
    const y2 = regressionLine.slope * x2 + regressionLine.intercept;

    const controls = (
        <>
            <ControlGroup label="Data Generation">
                <Slider label="Points" value={numPoints} min={5} max={50} step={1} onChange={setNumPoints} />
                <Slider label="Noise" value={noiseLevel} min={0} max={5} step={0.1} onChange={setNoiseLevel} />
                <Slider label="True Slope" value={trueSlope} min={-2} max={2} step={0.1} onChange={setTrueSlope} />
                <Slider label="True Intercept" value={trueIntercept} min={0} max={5} step={0.5} onChange={setTrueIntercept} />
            </ControlGroup>

            <ControlGroup label="Actions">
                <Button onClick={handleGenerateData} variant="primary">
                    <RefreshCw className="w-4 h-4" /> Regenerate Data
                </Button>
                <Button onClick={() => setShowResiduals(!showResiduals)} variant="secondary">
                    {showResiduals ? 'Hide Residuals' : 'Show Residuals'}
                </Button>
            </ControlGroup>

            <div className="mt-4 p-3 bg-paper-bg rounded-lg border border-paper-border text-xs text-paper-text-muted">
                <p>💡 Adjust sliders to see real-time fitting.</p>
            </div>
            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Model Fit</h3>
                <div className="space-y-1 text-xs font-mono text-paper-text-muted">
                    <p>Slope (m): {regressionLine.slope?.toFixed(3) || '0.000'}</p>
                    <p>Intercept (b): {regressionLine.intercept?.toFixed(3) || '0.000'}</p>
                    <p>MSE: {regressionLine.mse?.toFixed(3) || '0.000'}</p>
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Linear Regression" controls={controls}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid Lines (Optional) */}
                <line
                    x1={0}
                    y1={height - padding}
                    x2={width}
                    y2={height - padding}
                    stroke="#E6E2D6"
                    strokeWidth="2"
                />
                <line
                    x1={padding}
                    y1={0}
                    x2={padding}
                    y2={height}
                    stroke="#E6E2D6"
                    strokeWidth="2"
                />

                {/* Residuals */}
                <AnimatePresence>
                    {showResiduals && data.map((point) => {
                        const predictedY = regressionLine.slope * point.x + regressionLine.intercept;
                        return (
                            <motion.line
                                key={`res-${point.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                x1={xScale(point.x)}
                                y1={yScale(point.y)}
                                x2={xScale(point.x)}
                                y2={yScale(predictedY)}
                                stroke="#8D8D8D"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                        );
                    })}
                </AnimatePresence>

                {/* Regression Line */}
                <motion.line
                    animate={{
                        x1: xScale(x1),
                        y1: yScale(y1),
                        x2: xScale(x2),
                        y2: yScale(y2),
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    stroke="#2A9D8F"
                    strokeWidth="3"
                    className="neon-border"
                />

                {/* Data Points */}
                <AnimatePresence>
                    {data.map((point, idx) => (
                        <motion.circle
                            key={point.id}
                            cx={xScale(point.x)}
                            cy={yScale(point.y)}
                            r={6}
                            fill="#E07A5F"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.01 }}
                        />
                    ))}
                </AnimatePresence>
            </svg>
        </VisualizationLayout>
    );
};

export default LinearRegression;
