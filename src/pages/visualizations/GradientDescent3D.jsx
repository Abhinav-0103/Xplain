import React, { useState, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import { Play, RotateCcw, Pause } from 'lucide-react';
import VisualizationLayout from '../../layouts/VisualizationLayout';
import { ControlGroup, Slider, Button } from '../../components/UI';
import { lossFunction3D, runGradientDescent3D } from '../../utils/math';
import * as THREE from 'three';

const GradientDescent3D = () => {
    // State
    const [startX, setStartX] = useState(-2);
    const [startY, setStartY] = useState(3);
    const [learningRate, setLearningRate] = useState(0.1);
    const [steps, setSteps] = useState(50);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Compute path
    const path = useMemo(() => runGradientDescent3D(startX, startY, learningRate, steps), [startX, startY, learningRate, steps]);

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

            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-400">
                <p>💡 Use mouse to rotate, scroll to zoom</p>
            </div>
        </>
    );

    return (
        <VisualizationLayout title="Gradient Descent (3D)" controls={controls}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[8, 8, 8]} />
                <OrbitControls enableDamping />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Surface */}
                <Surface />

                {/* Minimum point */}
                <mesh position={[2, 1, 0]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} />
                </mesh>

                {/* Path Line */}
                {visiblePath.length > 1 && (
                    <Line
                        points={visiblePath.map(p => [p.x, p.y, p.z])}
                        color="#ff00ff"
                        lineWidth={3}
                        dashed
                        dashScale={10}
                        dashSize={0.5}
                        gapSize={0.3}
                    />
                )}

                {/* Path Points */}
                {visiblePath.map((point, idx) => (
                    <mesh key={idx} position={[point.x, point.y, point.z]}>
                        <sphereGeometry args={[idx === currentStep ? 0.15 : 0.08, 16, 16]} />
                        <meshStandardMaterial
                            color={idx === currentStep ? "#ff00ff" : "#bd00ff"}
                            emissive={idx === currentStep ? "#ff00ff" : "#000000"}
                            emissiveIntensity={idx === currentStep ? 0.5 : 0}
                        />
                    </mesh>
                ))}

                {/* Axes */}
                <axesHelper args={[5]} />
            </Canvas>
        </VisualizationLayout>
    );
};

// Surface component
const Surface = () => {
    const meshRef = useRef();
    const resolution = 40;
    const range = 6;

    const geometry = useMemo(() => {
        const vertices = [];
        const indices = [];

        for (let i = 0; i <= resolution; i++) {
            for (let j = 0; j <= resolution; j++) {
                const x = (i / resolution) * range - range / 2 + 2; // Center around (2, 1)
                const y = (j / resolution) * range - range / 2 + 1;
                const z = lossFunction3D(x, y);

                vertices.push(x, y, z);
            }
        }

        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const a = i * (resolution + 1) + j;
                const b = a + 1;
                const c = a + resolution + 1;
                const d = c + 1;

                indices.push(a, b, c);
                indices.push(b, d, c);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }, [resolution, range]);

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                color="#0f0f25"
                wireframe={false}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default GradientDescent3D;
