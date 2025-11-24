import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button, Slider } from '../../components/UI';
import {
    createInputMatrix,
    createKernel,
    applyConvolution,
    applyPadding,
    getReceptiveField,
    normalizeMatrix,
    kernelPresets
} from '../../utils/convolution';

const ConvolutionVisualization = () => {
    const [inputSize, setInputSize] = useState(8);
    const [kernelType, setKernelType] = useState('edgeDetection');
    const [stride, setStride] = useState(1);
    const [padding, setPadding] = useState(0);
    const [dilation, setDilation] = useState(1);
    const [hoveredOutput, setHoveredOutput] = useState(null);

    const inputMatrix = useMemo(() => createInputMatrix(inputSize), [inputSize]);
    const kernel = useMemo(() => createKernel(kernelType), [kernelType]);
    const paddedInput = useMemo(() => applyPadding(inputMatrix, padding), [inputMatrix, padding]);

    const outputMatrix = useMemo(() => {
        const raw = applyConvolution(inputMatrix, kernel, stride, padding, dilation);
        return normalizeMatrix(raw);
    }, [inputMatrix, kernel, stride, padding, dilation]);

    const receptiveField = useMemo(() => {
        if (!hoveredOutput) return [];
        return getReceptiveField(hoveredOutput.x, hoveredOutput.y, kernel, stride, padding, dilation);
    }, [hoveredOutput, kernel, stride, padding, dilation]);

    const cellSize = 40;
    const gap = 20;

    const renderMatrix = (matrix, label, offsetX = 0, onCellHover = null, highlightCells = []) => {
        if (!matrix || matrix.length === 0 || !matrix[0]) return null;
        const isPadded = matrix.length > inputSize;

        return (
            <div style={{ position: 'absolute', left: offsetX, top: 0 }}>
                <h3 className="text-sm font-medium text-paper-text mb-2">{label}</h3>
                <div className="inline-block">
                    {matrix.map((row, i) => (
                        <div key={i} className="flex">
                            {row.map((value, j) => {
                                const isHighlighted = highlightCells.some(cell => cell.x === i && cell.y === j);
                                const isPaddingCell = isPadded && (i < padding || i >= matrix.length - padding ||
                                    j < padding || j >= matrix[0].length - padding);

                                const bgColor = isPaddingCell ? '#E6E2D6' :
                                    `rgba(224, 122, 95, ${value})`;

                                return (
                                    <motion.div
                                        key={j}
                                        onMouseEnter={() => onCellHover && onCellHover(i, j)}
                                        onMouseLeave={() => onCellHover && onCellHover(null, null)}
                                        className="border border-paper-border flex items-center justify-center font-mono text-xs cursor-pointer"
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            backgroundColor: bgColor,
                                        }}
                                        animate={{
                                            scale: isHighlighted ? 1.1 : 1,
                                            borderWidth: isHighlighted ? 3 : 1,
                                            borderColor: isHighlighted ? '#2A9D8F' : '#2C1810',
                                            zIndex: isHighlighted ? 10 : 1
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isPaddingCell ? '0' : value.toFixed(2)}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderKernel = (offsetX) => {
        if (!kernel || kernel.length === 0 || !kernel[0]) return null;
        return (
            <div style={{ position: 'absolute', left: offsetX, top: 0 }}>
                <h3 className="text-sm font-medium text-paper-text mb-2">Kernel ({kernel.length}x{kernel.length})</h3>
                <div className="inline-block">
                    {kernel.map((row, i) => (
                        <div key={i} className="flex">
                            {row.map((value, j) => {
                                const isHighlighted = receptiveField.some(cell => cell.kernelX === i && cell.kernelY === j);
                                const absValue = Math.abs(value);
                                const bgColor = value > 0
                                    ? `rgba(224, 122, 95, ${absValue})`
                                    : `rgba(42, 157, 143, ${absValue})`;

                                return (
                                    <motion.div
                                        key={j}
                                        className="border border-paper-border flex items-center justify-center font-mono text-xs"
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            backgroundColor: bgColor,
                                        }}
                                        animate={{
                                            scale: isHighlighted ? 1.1 : 1,
                                            borderWidth: isHighlighted ? 3 : 1,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {value.toFixed(2)}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const inputWidth = (paddedInput.length > 0 && paddedInput[0].length > 0) ? paddedInput[0].length * cellSize : 0;
    const kernelWidth = (kernel.length > 0 && kernel[0].length > 0) ? kernel.length * cellSize : 0;
    const outputWidth = (outputMatrix.length > 0 && outputMatrix[0].length > 0) ? outputMatrix[0].length * cellSize : 0;

    const controls = (
        <>
            <ControlGroup label="Parameters">
                <Slider label="Stride" value={stride} min={1} max={3} step={1} onChange={setStride} />
                <Slider label="Padding" value={padding} min={0} max={2} step={1} onChange={setPadding} />
                <Slider label="Dilation" value={dilation} min={1} max={3} step={1} onChange={setDilation} />
            </ControlGroup>

            <ControlGroup label="Kernel Type">
                <select
                    value={kernelType}
                    onChange={(e) => setKernelType(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-bg border border-paper-border rounded-lg text-paper-text focus:outline-none focus:ring-2 focus:ring-paper-accent"
                >
                    {Object.keys(kernelPresets).map(key => (
                        <option key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </option>
                    ))}
                </select>
            </ControlGroup>

            <ControlGroup label="Input Size">
                <Slider label="Size" value={inputSize} min={5} max={10} step={1} onChange={setInputSize} />
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Info</h3>
                <div className="space-y-1 text-xs text-paper-text-muted">
                    <div>Input: {inputSize}x{inputSize}</div>
                    <div>Padded: {paddedInput.length}x{paddedInput[0]?.length || 0}</div>
                    <div>Output: {outputMatrix.length}x{outputMatrix[0]?.length || 0}</div>
                    <div className="pt-2 border-t border-paper-border mt-2">
                        <em>Hover over output cells to see receptive field</em>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Convolution Operation" controls={controls}>
            <div className="relative w-full h-full flex items-center justify-center overflow-auto p-8">
                <div style={{
                    position: 'relative',
                    width: inputWidth + kernelWidth + outputWidth + gap * 4,
                    height: Math.max(paddedInput.length, kernel.length, outputMatrix.length || 0) * cellSize + 60
                }}>
                    {renderMatrix(paddedInput, 'Input (Padded)', 0, null, receptiveField)}
                    {renderKernel(inputWidth + gap)}
                    {outputMatrix.length > 0 ? renderMatrix(
                        outputMatrix,
                        'Output',
                        inputWidth + kernelWidth + gap * 2,
                        (i, j) => i !== null ? setHoveredOutput({ x: i, y: j }) : setHoveredOutput(null)
                    ) : (
                        <div style={{ position: 'absolute', left: inputWidth + kernelWidth + gap * 2, top: 0, width: 200 }} className="text-red-500 text-sm">
                            Invalid parameters: Output size is too small. Try reducing stride/dilation or increasing input size.
                        </div>
                    )}
                </div>
            </div>
        </VisualizationLayout>
    );
};

export default ConvolutionVisualization;
