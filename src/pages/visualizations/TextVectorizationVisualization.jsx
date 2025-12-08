import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Info } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button } from '../../components/UI';
import {
    getVocabulary,
    computeBoW,
    computeTFIDF,
    computeIDF,
    tokenize
} from '../../utils/text_analysis';

const TextVectorizationVisualization = () => {
    const [documents, setDocuments] = useState([
        "The cat sat on the mat",
        "The dog sat on the log",
        "Cats and dogs are great"
    ]);
    const [viewMode, setViewMode] = useState('bow'); // 'bow' or 'tfidf'
    const [hoveredCell, setHoveredCell] = useState(null);

    // Compute analysis data
    const analysisData = useMemo(() => {
        const vocabulary = getVocabulary(documents);
        const bowMatrix = computeBoW(documents, vocabulary);
        const tfidfMatrix = computeTFIDF(documents, vocabulary);
        const idfVector = computeIDF(documents, vocabulary);

        return { vocabulary, bowMatrix, tfidfMatrix, idfVector };
    }, [documents]);

    const { vocabulary, bowMatrix, tfidfMatrix, idfVector } = analysisData;

    // Handlers for document management
    const addDocument = () => {
        if (documents.length < 6) {
            setDocuments([...documents, "New document text"]);
        }
    };

    const removeDocument = (index) => {
        if (documents.length > 1) {
            const newDocs = documents.filter((_, i) => i !== index);
            setDocuments(newDocs);
        }
    };

    const updateDocument = (index, value) => {
        const newDocs = [...documents];
        newDocs[index] = value;
        setDocuments(newDocs);
    };

    // Helper for cell color
    // Helper for cell color
    const getCellColor = (value, isTfidf) => {
        if (value === 0) return '#f9fafb'; // gray-50
        if (!isTfidf) {
            // Count coloring (green scale)
            const intensity = Math.min(value * 0.2 + 0.1, 1);
            return `rgba(42, 157, 143, ${intensity})`;
        } else {
            // TF-IDF coloring (blue scale)
            // Normalize assuming max score around 1.5-2.0 usually
            const intensity = Math.min(value * 0.6 + 0.1, 1);
            return `rgba(59, 130, 246, ${intensity})`;
        }
    };

    const controls = (
        <>
            <ControlGroup label="View Mode">
                <div className="flex bg-paper-bg p-1 rounded-lg border border-paper-border mb-4">
                    <button
                        onClick={() => setViewMode('bow')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'bow' ? 'bg-white text-paper-accent shadow-sm' : 'text-paper-text-muted hover:text-paper-text'
                            }`}
                    >
                        Bag of Words (Count)
                    </button>
                    <button
                        onClick={() => setViewMode('tfidf')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'tfidf' ? 'bg-white text-paper-accent shadow-sm' : 'text-paper-text-muted hover:text-paper-text'
                            }`}
                    >
                        TF-IDF
                    </button>
                </div>
            </ControlGroup>

            <ControlGroup label={`Documents (${documents.length}/6)`}>
                <div className="space-y-2">
                    {documents.map((doc, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                type="text"
                                value={doc}
                                onChange={(e) => updateDocument(i, e.target.value)}
                                className="flex-1 px-2 py-1.5 text-sm bg-paper-bg border border-paper-border rounded text-paper-text focus:outline-none focus:ring-1 focus:ring-paper-accent"
                            />
                            <button
                                onClick={() => removeDocument(i)}
                                disabled={documents.length <= 1}
                                className="p-1.5 text-paper-text-muted hover:text-red-500 disabled:opacity-30 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    {documents.length < 6 && (
                        <Button onClick={addDocument} variant="secondary" className="w-full text-xs mt-2">
                            <Plus size={12} className="mr-1" /> Add Document
                        </Button>
                    )}
                </div>
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">
                    {viewMode === 'bow' ? 'Bag of Words' : 'TF-IDF'}
                </h3>
                <p className="text-xs text-paper-text-muted leading-relaxed">
                    {viewMode === 'bow'
                        ? "Represents text as a multiset of its belonging words, disregarding grammar and word order but keeping multiplicity."
                        : "Reflects how important a word is to a document in a collection. Increases with word frequency in the doc, but offset by frequency in the corpus."
                    }
                </p>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Text Vectorization" controls={controls}>
            <div className="w-full h-full overflow-auto p-8 flex flex-col items-center">

                {/* Vocabulary Display */}
                <div className="w-full max-w-5xl mb-8">
                    <h3 className="text-sm font-bold text-paper-text mb-3 uppercase tracking-wider">Vocabulary ({vocabulary.length} terms)</h3>
                    <div className="flex flex-wrap gap-2">
                        {vocabulary.map((term, i) => (
                            <div
                                key={i}
                                className={`px-2 py-1 text-xs rounded border ${hoveredCell && vocabulary[hoveredCell.col] === term
                                    ? 'bg-paper-accent text-white border-paper-accent'
                                    : 'bg-white border-paper-border text-paper-text-muted'
                                    }`}
                            >
                                {term}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Matrix Visualization */}
                <div className="w-full max-w-5xl bg-white rounded-xl border border-paper-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-paper-text uppercase bg-paper-bg border-b border-paper-border">
                                <tr>
                                    <th className="px-4 py-3 font-medium w-32 sticky left-0 bg-paper-bg z-10">Document</th>
                                    {vocabulary.map((term, i) => (
                                        <th key={i} className="px-2 py-3 font-medium text-center min-w-[60px]">
                                            <div className="flex flex-col items-center gap-1">
                                                <span>{term}</span>
                                                {viewMode === 'tfidf' && (
                                                    <span className="text-[10px] text-paper-text-muted font-normal normal-case" title={`IDF: ${idfVector[i].toFixed(2)}`}>
                                                        idf: {idfVector[i].toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-paper-border">
                                {(viewMode === 'bow' ? bowMatrix : tfidfMatrix).map((row, i) => (
                                    <tr key={i} className="hover:bg-paper-bg/30">
                                        <td className="px-4 py-3 font-medium text-paper-text sticky left-0 bg-white z-10 border-r border-paper-border">
                                            Doc {i + 1}
                                        </td>
                                        {row.map((val, j) => (
                                            <td key={j} className="p-1 text-center">
                                                <motion.div
                                                    className="w-full h-10 rounded flex items-center justify-center text-xs font-medium cursor-help relative group"
                                                    style={{ backgroundColor: getCellColor(val, viewMode === 'tfidf') }}
                                                    onMouseEnter={() => setHoveredCell({ row: i, col: j, val })}
                                                    onMouseLeave={() => setHoveredCell(null)}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <span className={(viewMode === 'bow' ? val > 2 : val > 0.8) ? 'text-white' : 'text-paper-text'}>
                                                        {val > 0 ? (Number.isInteger(val) ? val : val.toFixed(2)) : ''}
                                                    </span>

                                                    {/* Tooltip for TF-IDF Math */}
                                                    {viewMode === 'tfidf' && val > 0 && (
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                                                            <div className="font-bold mb-1 text-center">"{vocabulary[j]}" in Doc {i + 1}</div>
                                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                                <span className="text-gray-400">TF:</span>
                                                                <span className="text-right">{(val / idfVector[j]).toFixed(2)}</span>
                                                                <span className="text-gray-400">IDF:</span>
                                                                <span className="text-right">{idfVector[j].toFixed(2)}</span>
                                                                <div className="col-span-2 border-t border-gray-700 my-1"></div>
                                                                <span className="text-gray-400">Score:</span>
                                                                <span className="text-right font-bold text-blue-400">{val.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </VisualizationLayout>
    );
};

export default TextVectorizationVisualization;
