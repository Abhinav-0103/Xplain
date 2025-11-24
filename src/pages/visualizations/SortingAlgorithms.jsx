import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Button, Slider } from '../../components/UI';
import { generateRandomArray, bubbleSort, selectionSort, insertionSort } from '../../utils/sorting';

const ALGORITHMS = {
    'Bubble Sort': bubbleSort,
    'Selection Sort': selectionSort,
    'Insertion Sort': insertionSort,
};

const SortingAlgorithms = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(20);
    const [speed, setSpeed] = useState(50);
    const [selectedAlgo, setSelectedAlgo] = useState('Bubble Sort');
    const [isSorting, setIsSorting] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [compareIndices, setCompareIndices] = useState([]);
    const [swapIndices, setSwapIndices] = useState([]);

    const sortingGenerator = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        resetArray();
    }, [arraySize]);

    const resetArray = () => {
        stopSorting();
        const newArray = generateRandomArray(arraySize, 10, 100);
        setArray(newArray);
        setIsSorted(false);
        setCompareIndices([]);
        setSwapIndices([]);
        sortingGenerator.current = null;
    };

    const stopSorting = () => {
        setIsSorting(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startSorting = () => {
        if (isSorting) {
            stopSorting();
            return;
        }

        if (isSorted) {
            resetArray();
            // Need to wait for state update before starting, but for simplicity just reset first
            // In a real app, might want to chain this better. 
            // For now, let's just return and let user click play again or handle it via effect if needed.
            // But actually, we can just re-initialize the generator immediately if we want to restart on sorted.
            // Let's just return to keep it simple.
            return;
        }

        setIsSorting(true);

        if (!sortingGenerator.current) {
            sortingGenerator.current = ALGORITHMS[selectedAlgo](array);
        }

        intervalRef.current = setInterval(() => {
            const { value, done } = sortingGenerator.current.next();

            if (done || value?.sorted) {
                stopSorting();
                setIsSorted(true);
                setCompareIndices([]);
                setSwapIndices([]);
                return;
            }

            if (value) {
                setArray(value.array);
                setCompareIndices(value.compare);
                setSwapIndices(value.swap);
            }
        }, 101 - speed); // Speed mapping: 1 (slow) -> 100ms, 100 (fast) -> 1ms
    };

    const controls = (
        <>
            <ControlGroup label="Configuration">
                <div className="mb-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-paper-text-muted block mb-2">Algorithm</label>
                    <select
                        value={selectedAlgo}
                        onChange={(e) => {
                            setSelectedAlgo(e.target.value);
                            resetArray();
                        }}
                        className="w-full p-2 rounded-md border border-paper-border bg-white text-paper-text focus:outline-none focus:border-paper-accent"
                        disabled={isSorting}
                    >
                        {Object.keys(ALGORITHMS).map(algo => (
                            <option key={algo} value={algo}>{algo}</option>
                        ))}
                    </select>
                </div>
                <Slider label="Array Size" value={arraySize} min={10} max={50} step={1} onChange={setArraySize} disabled={isSorting} />
                <Slider label="Speed" value={speed} min={1} max={100} step={1} onChange={setSpeed} />
            </ControlGroup>

            <ControlGroup label="Controls">
                <div className="flex gap-2">
                    <Button onClick={startSorting} variant="primary" className="flex-1">
                        {isSorting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isSorting ? 'Pause' : 'Sort'}
                    </Button>
                    <Button onClick={resetArray} variant="secondary" className="flex-1">
                        <Shuffle className="w-4 h-4" /> New Array
                    </Button>
                </div>
            </ControlGroup>

            <div className="mt-6 p-4 bg-paper-bg rounded-lg border border-paper-border">
                <h3 className="text-sm font-medium text-paper-text mb-2">Legend</h3>
                <div className="space-y-2 text-xs text-paper-text-muted">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-paper-accent rounded"></div>
                        <span>Comparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#2A9D8F] rounded"></div>
                        <span>Swapping/Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#3D405B] rounded"></div>
                        <span>Default</span>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <VisualizationLayout title={selectedAlgo} controls={controls}>
            <div className="w-full h-full flex items-end justify-center gap-1 p-4">
                <AnimatePresence>
                    {array.map((value, idx) => {
                        let color = '#3D405B'; // Default
                        if (compareIndices.includes(idx)) color = '#E07A5F'; // Comparing (Accent)
                        if (swapIndices.includes(idx)) color = '#2A9D8F'; // Swapping (Green/Teal)
                        if (isSorted) color = '#81B29A'; // Sorted (Green)

                        return (
                            <motion.div
                                key={idx}
                                layout
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: `${value}%`,
                                    opacity: 1,
                                    backgroundColor: color
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="flex-1 rounded-t-md max-w-[40px] min-w-[4px]"
                                style={{ height: `${value}%` }}
                            >
                                {/* Optional: Show value on hover or if bars are wide enough */}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </VisualizationLayout>
    );
};

export default SortingAlgorithms;
