import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button, Slider } from '../../components/UI';
import {
    getTokensAndEmbeddings,
    computeMultiHeadAttention
} from '../../utils/attention';

// --- Sub-components ---

const MatrixHeatmap = ({ data, title, rows, cols, activeRow, activeCol, onHover }) => {
    // Find min/max for normalization
    const flatData = data.flat();
    const min = Math.min(...flatData);
    const max = Math.max(...flatData);

    const getColor = (val) => {
        // Normalize to 0-1
        const norm = (val - min) / (max - min || 1);
        // Blue scale
        return `rgba(59, 130, 246, ${norm})`;
    };

    return (
        <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-paper-text mb-2">{title}</span>
            <div
                className="grid gap-[1px] bg-paper-border border border-paper-border"
                style={{
                    gridTemplateColumns: `repeat(${data[0].length}, 1fr)`,
                }}
                onMouseLeave={() => onHover && onHover(null, null)}
            >
                {data.map((row, i) =>
                    row.map((val, j) => (
                        <div
                            key={`${i}-${j}`}
                            className={`w-3 h-3 transition-all duration-200 ${(activeRow === i || activeCol === j) ? 'ring-1 ring-paper-accent z-10' : ''
                                }`}
                            style={{ backgroundColor: getColor(val) }}
                            onMouseEnter={() => onHover && onHover(i, j)}
                            title={val.toFixed(3)}
                        />
                    ))
                )}
            </div>
            <div className="flex justify-between w-full text-[10px] text-paper-text-muted mt-1 px-1">
                <span>{data.length}x{data[0].length}</span>
            </div>
        </div>
    );
};

const ConnectionGraph = ({ tokens, weights, hoveredToken, setHoveredToken }) => {
    return (
        <div className="flex justify-between items-center w-full max-w-2xl px-8 py-4 select-none">
            {/* Left Column (Query) */}
            <div className="flex flex-col gap-2">
                {tokens.map((token, i) => (
                    <div
                        key={`l-${i}`}
                        className={`text-sm font-medium px-2 py-1 rounded cursor-pointer transition-colors ${hoveredToken === i ? 'bg-paper-accent text-white' : 'text-paper-text hover:bg-paper-bg-hover'
                            }`}
                        onMouseEnter={() => setHoveredToken(i)}
                        onMouseLeave={() => setHoveredToken(null)}
                    >
                        {token}
                    </div>
                ))}
            </div>

            {/* SVG Connections */}
            <div className="flex-1 h-full mx-4 relative" style={{ height: `${tokens.length * 32}px` }}>
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {weights.map((row, i) =>
                        row.map((weight, j) => {
                            // Only draw if significant weight or hovered
                            if (weight < 0.05 && hoveredToken !== i) return null;

                            const isActive = hoveredToken === i;
                            const opacity = isActive ? weight : weight * 0.3;
                            const strokeWidth = isActive ? weight * 4 : weight * 1;
                            const color = isActive ? '#2A9D8F' : '#A0AEC0';

                            // Calculate coordinates (approximate based on list height)
                            const y1 = i * 32 + 16;
                            const y2 = j * 32 + 16;

                            return (
                                <line
                                    key={`${i}-${j}`}
                                    x1="0%"
                                    y1={y1}
                                    x2="100%"
                                    y2={y2}
                                    stroke={color}
                                    strokeWidth={Math.max(0.5, strokeWidth)}
                                    strokeOpacity={opacity}
                                    className="transition-all duration-300"
                                />
                            );
                        })
                    )}
                </svg>
            </div>

            {/* Right Column (Key) */}
            <div className="flex flex-col gap-2">
                {tokens.map((token, i) => (
                    <div
                        key={`r-${i}`}
                        className="text-sm font-medium px-2 py-1 rounded text-paper-text"
                    >
                        {token}
                    </div>
                ))}
            </div>
        </div>
    );
};

const InteractiveFormula = ({ activeTerm, setActiveTerm }) => {
    const terms = {
        softmax: { label: 'softmax', desc: 'Normalizes scores to probabilities (0-1)' },
        qkt: { label: 'QK^T', desc: 'Dot product of Query and Key matrices (Raw Scores)' },
        scale: { label: '√d_k', desc: 'Scaling factor to prevent vanishing gradients' },
        v: { label: 'V', desc: 'Value matrix containing content information' }
    };

    const Term = ({ id, children, className = "" }) => (
        <span
            className={`cursor-pointer transition-colors px-1 rounded ${activeTerm === id ? 'bg-paper-accent text-white' : 'hover:bg-paper-bg-hover'
                } ${className}`}
            onMouseEnter={() => setActiveTerm(id)}
            onMouseLeave={() => setActiveTerm(null)}
        >
            {children}
        </span>
    );

    return (
        <div className="bg-white p-6 rounded-xl border border-paper-border shadow-sm mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-serif text-paper-text">
                <span className="font-bold italic">Attention(Q, K, V)</span>
                <span>=</span>

                <div className="flex items-center">
                    <Term id="softmax">softmax</Term>

                    <div className="flex items-center mx-1">
                        <span className="text-4xl font-light text-paper-text-muted">(</span>
                        <div className="flex flex-col items-center justify-center mx-1">
                            <Term id="qkt" className="border-b-2 border-paper-text mb-0.5 px-2">
                                QK<sup className="text-sm">T</sup>
                            </Term>
                            <Term id="scale" className="px-2">
                                <span className="text-lg">√</span>d<sub className="text-xs">k</sub>
                            </Term>
                        </div>
                        <span className="text-4xl font-light text-paper-text-muted">)</span>
                    </div>

                    <Term id="v">V</Term>
                </div>
            </div>

            <div className="h-8 text-center mt-4">
                <AnimatePresence mode="wait">
                    {activeTerm && (
                        <motion.div
                            key={activeTerm}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center justify-center gap-2 text-sm text-paper-text-muted"
                        >
                            <span className="font-bold text-paper-accent">
                                {terms[activeTerm].id === 'qkt' ? 'QKᵀ' : terms[activeTerm].label}:
                            </span>
                            <span>{terms[activeTerm].desc}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Main Component ---

const AttentionVisualization = () => {
    const [inputText, setInputText] = useState("The cat sat on the mat");
    const [numHeads, setNumHeads] = useState(1);
    const [activeHead, setActiveHead] = useState(0);
    const [hoveredToken, setHoveredToken] = useState(null);
    const [activeFormulaTerm, setActiveFormulaTerm] = useState(null);
    const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'graph'

    const [dModel] = useState(64);
    const [dK] = useState(8); // Reduced dim for better visualization

    // Recalculate attention
    const attentionData = useMemo(() => {
        const { tokens, embeddings } = getTokensAndEmbeddings(inputText, dModel);
        const heads = computeMultiHeadAttention(embeddings, numHeads, dModel, dK);
        return { tokens, heads };
    }, [inputText, numHeads, dModel, dK]);

    const { tokens, heads } = attentionData;
    const currentHead = heads[activeHead] || heads[0];

    const controls = (
        <>
            <ControlGroup label="Input Sequence">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-bg border border-paper-border rounded-lg text-paper-text focus:outline-none focus:ring-2 focus:ring-paper-accent"
                />
            </ControlGroup>

            <ControlGroup label="Configuration">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-paper-text-muted">Heads: {numHeads}</span>
                </div>
                <div className="flex gap-2 mb-4">
                    {[1, 2, 4, 8].map(n => (
                        <Button
                            key={n}
                            onClick={() => { setNumHeads(n); setActiveHead(0); }}
                            variant={numHeads === n ? 'primary' : 'secondary'}
                            className="flex-1 text-xs"
                        >
                            {n}
                        </Button>
                    ))}
                </div>

                {numHeads > 1 && (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-paper-text-muted">Active Head</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: numHeads }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveHead(i)}
                                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${activeHead === i
                                        ? 'bg-paper-accent text-white shadow-md scale-110'
                                        : 'bg-paper-bg border border-paper-border text-paper-text hover:border-paper-accent'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </ControlGroup>

            <ControlGroup label="View Mode">
                <div className="flex bg-paper-bg p-1 rounded-lg border border-paper-border">
                    <button
                        onClick={() => setViewMode('heatmap')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'heatmap' ? 'bg-white text-paper-accent shadow-sm' : 'text-paper-text-muted hover:text-paper-text'
                            }`}
                    >
                        Heatmap
                    </button>
                    <button
                        onClick={() => setViewMode('graph')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'graph' ? 'bg-white text-paper-accent shadow-sm' : 'text-paper-text-muted hover:text-paper-text'
                            }`}
                    >
                        Connection Graph
                    </button>
                </div>
            </ControlGroup>
        </>
    );

    return (
        <VisualizationLayout title="Multi-Head Attention" controls={controls}>
            <div className="w-full h-full overflow-auto p-8 flex flex-col items-center">

                <InteractiveFormula
                    activeTerm={activeFormulaTerm}
                    setActiveTerm={setActiveFormulaTerm}
                />

                <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl items-start">

                    {/* Main Visualization Area */}
                    <div className="flex-1 w-full flex flex-col items-center">
                        <h3 className="text-lg font-bold font-heading text-paper-text mb-6">
                            {viewMode === 'heatmap' ? 'Attention Weights Heatmap' : 'Token Connections'}
                        </h3>

                        <div className="bg-white p-6 rounded-xl border border-paper-border shadow-sm min-h-[400px] w-full flex items-center justify-center">
                            {viewMode === 'heatmap' ? (
                                <div className="relative">
                                    {/* Column Labels */}
                                    <div className="flex ml-24 mb-2">
                                        {tokens.map((token, i) => (
                                            <div key={i} className="w-10 text-xs text-center -rotate-45 origin-bottom-left text-paper-text-muted truncate">
                                                {token}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Heatmap Rows */}
                                    {currentHead.weights.map((row, i) => (
                                        <div key={i} className="flex items-center mb-1">
                                            <div className="w-24 text-right pr-3 text-sm font-medium text-paper-text truncate">
                                                {tokens[i]}
                                            </div>
                                            <div className="flex gap-1">
                                                {row.map((val, j) => (
                                                    <motion.div
                                                        key={j}
                                                        className={`w-10 h-10 rounded cursor-pointer relative group ${(hoveredToken === i || hoveredToken === j) ? 'ring-2 ring-paper-accent z-10' : ''
                                                            }`}
                                                        style={{ backgroundColor: `rgba(42, 157, 143, ${val})` }}
                                                        whileHover={{ scale: 1.15, zIndex: 20 }}
                                                        onMouseEnter={() => setHoveredToken(i)}
                                                        onMouseLeave={() => setHoveredToken(null)}
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-[10px] font-mono font-bold bg-white/90 px-1 rounded shadow-sm">
                                                                {val.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ConnectionGraph
                                    tokens={tokens}
                                    weights={currentHead.weights}
                                    hoveredToken={hoveredToken}
                                    setHoveredToken={setHoveredToken}
                                />
                            )}
                        </div>
                    </div>

                    {/* Matrix Internals Sidebar */}
                    <div className="w-full lg:w-64 flex flex-col gap-6">
                        <h3 className="text-lg font-bold font-heading text-paper-text text-center">
                            Internal State
                        </h3>

                        <div className="space-y-6">
                            <MatrixHeatmap
                                title="Query Matrix (Q)"
                                data={currentHead.Q}
                                activeRow={hoveredToken}
                            />
                            <div className="text-center text-paper-text-muted">×</div>
                            <MatrixHeatmap
                                title="Key Matrix (K)"
                                data={currentHead.K}
                                activeCol={hoveredToken} // Highlight column when token hovered
                            />
                            <div className="text-center text-paper-text-muted">×</div>
                            <MatrixHeatmap
                                title="Value Matrix (V)"
                                data={currentHead.V}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </VisualizationLayout>
    );
};

export default AttentionVisualization;
