// CNN utility functions for visualization
import { applyConvolution, normalizeMatrix } from './convolution';

// Re-export normalizeMatrix for use in components
export { normalizeMatrix };

// Sample images for testing (28x28 grayscale)
export const sampleImages = {
    digit0: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.8, 0.9, 1, 1, 1, 1, 0.9, 0.8, 0.5, 0.2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.8, 1, 1, 0.7, 0.4, 0.3, 0.3, 0.4, 0.7, 1, 1, 0.8, 0.4, 0.1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0.2, 0.6, 0.9, 1, 0.6, 0.2, 0, 0, 0, 0, 0, 0, 0.2, 0.6, 1, 0.9, 0.6, 0.2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0.1, 0.6, 0.9, 0.8, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.8, 0.9, 0.6, 0.1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0.4, 0.9, 0.7, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.7, 0.9, 0.4, 0, 0, 0, 0],
        [0, 0, 0, 0.1, 0.7, 1, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 1, 0.7, 0.1, 0, 0, 0],
        [0, 0, 0, 0.3, 0.9, 0.9, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.9, 0.9, 0.3, 0, 0, 0],
        [0, 0, 0, 0.4, 1, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 1, 0.4, 0, 0, 0],
        [0, 0, 0, 0.5, 1, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 1, 0.5, 0, 0, 0],
        [0, 0, 0, 0.5, 1, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 1, 0.5, 0, 0, 0],
        [0, 0, 0, 0.5, 1, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 1, 0.5, 0, 0, 0],
        [0, 0, 0, 0.4, 1, 0.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 1, 0.4, 0, 0, 0],
        [0, 0, 0, 0.3, 0.9, 0.9, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.9, 0.9, 0.3, 0, 0, 0],
        [0, 0, 0, 0.1, 0.7, 1, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4, 1, 0.7, 0.1, 0, 0, 0],
        [0, 0, 0, 0, 0.4, 0.9, 0.7, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.7, 0.9, 0.4, 0, 0, 0, 0],
        [0, 0, 0, 0, 0.1, 0.6, 0.9, 0.8, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.8, 0.9, 0.6, 0.1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0.2, 0.6, 0.9, 1, 0.6, 0.2, 0, 0, 0, 0, 0, 0, 0.2, 0.6, 1, 0.9, 0.6, 0.2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.8, 1, 1, 0.7, 0.4, 0.3, 0.3, 0.4, 0.7, 1, 1, 0.8, 0.4, 0.1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.8, 0.9, 1, 1, 1, 1, 0.9, 0.8, 0.5, 0.2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    digit1: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5, 0.8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.9, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.8, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0.2, 0.6, 0.9, 1, 1, 0.8, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0.3, 0.7, 0.9, 0.7, 0.4, 0.6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.4, 0.2, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0.4, 0.2, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    cross: Array(28).fill(null).map((_, i) =>
        Array(28).fill(null).map((_, j) => {
            if (i === 14 || j === 14) return 1;
            if (Math.abs(i - j) < 2 || Math.abs(i + j - 27) < 2) return 0.8;
            return 0;
        })
    ),
};

// Activation functions
const relu = (x) => Math.max(0, x);
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

// Generate random kernel for CNN layers
export const generateRandomKernel = (size = 3, count = 1) => {
    const kernels = [];
    for (let k = 0; k < count; k++) {
        const kernel = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push((Math.random() - 0.5) * 2); // Random weights between -1 and 1
            }
            kernel.push(row);
        }
        kernels.push(kernel);
    }
    return kernels;
};

// Apply max pooling
export const applyMaxPooling = (input, poolSize = 2, stride = 2) => {
    const inputHeight = input.length;
    const inputWidth = input[0].length;
    const outputHeight = Math.floor((inputHeight - poolSize) / stride) + 1;
    const outputWidth = Math.floor((inputWidth - poolSize) / stride) + 1;

    const output = [];
    for (let i = 0; i < outputHeight; i++) {
        const row = [];
        for (let j = 0; j < outputWidth; j++) {
            let max = -Infinity;
            for (let pi = 0; pi < poolSize; pi++) {
                for (let pj = 0; pj < poolSize; pj++) {
                    const val = input[i * stride + pi][j * stride + pj];
                    max = Math.max(max, val);
                }
            }
            row.push(max);
        }
        output.push(row);
    }
    return output;
};

// Apply average pooling
export const applyAvgPooling = (input, poolSize = 2, stride = 2) => {
    const inputHeight = input.length;
    const inputWidth = input[0].length;
    const outputHeight = Math.floor((inputHeight - poolSize) / stride) + 1;
    const outputWidth = Math.floor((inputWidth - poolSize) / stride) + 1;

    const output = [];
    for (let i = 0; i < outputHeight; i++) {
        const row = [];
        for (let j = 0; j < outputWidth; j++) {
            let sum = 0;
            for (let pi = 0; pi < poolSize; pi++) {
                for (let pj = 0; pj < poolSize; pj++) {
                    sum += input[i * stride + pi][j * stride + pj];
                }
            }
            row.push(sum / (poolSize * poolSize));
        }
        output.push(row);
    }
    return output;
};

// Flatten 2D array to 1D
export const flatten = (matrix) => {
    return matrix.flat();
};

// Apply dense layer
export const applyDenseLayer = (input, weights, bias, activation = 'relu') => {
    const output = [];
    for (let i = 0; i < weights.length; i++) {
        let sum = bias[i];
        for (let j = 0; j < input.length; j++) {
            sum += input[j] * weights[i][j];
        }
        const activated = activation === 'relu' ? relu(sum) : sigmoid(sum);
        output.push(activated);
    }
    return output;
};

// Initialize dense layer weights
export const initializeDenseWeights = (inputSize, outputSize) => {
    const weights = [];
    const bias = [];
    for (let i = 0; i < outputSize; i++) {
        const row = [];
        for (let j = 0; j < inputSize; j++) {
            row.push((Math.random() - 0.5) * 0.5);
        }
        weights.push(row);
        bias.push((Math.random() - 0.5) * 0.1);
    }
    return { weights, bias };
};

// Define CNN architecture
export const createCNNArchitecture = () => {
    return [
        {
            type: 'conv',
            filters: 8,
            kernelSize: 3,
            stride: 1,
            padding: 0,
            activation: 'relu',
            kernels: generateRandomKernel(3, 8)
        },
        {
            type: 'pool',
            poolSize: 2,
            stride: 2,
            poolType: 'max'
        },
        {
            type: 'conv',
            filters: 16,
            kernelSize: 3,
            stride: 1,
            padding: 0,
            activation: 'relu',
            kernels: generateRandomKernel(3, 16)
        },
        {
            type: 'pool',
            poolSize: 2,
            stride: 2,
            poolType: 'max'
        },
        {
            type: 'flatten'
        },
        {
            type: 'dense',
            units: 10,
            activation: 'sigmoid',
            weights: null, // Will be initialized dynamically
            bias: null
        }
    ];
};

// Forward pass through CNN
export function* forwardPassCNN(architecture, inputImage) {
    let currentOutput = [inputImage]; // Start with input as a single "feature map"
    const layerOutputs = [];

    for (let layerIdx = 0; layerIdx < architecture.length; layerIdx++) {
        const layer = architecture[layerIdx];
        let nextOutput = [];

        if (layer.type === 'conv') {
            // Apply convolution with each kernel to each input feature map
            for (let filterIdx = 0; filterIdx < layer.kernels.length; filterIdx++) {
                const kernel = layer.kernels[filterIdx];
                // For simplicity, apply to first input feature map (in real CNN, would combine all input maps)
                const inputMap = currentOutput[0];
                const convResult = applyConvolution(inputMap, kernel, layer.stride, layer.padding, 1);
                // Apply ReLU activation
                const activated = convResult.map(row =>
                    row.map(val => layer.activation === 'relu' ? relu(val) : val)
                );
                nextOutput.push(activated);
            }

            layerOutputs.push({
                layerIndex: layerIdx,
                type: 'conv',
                featureMaps: nextOutput,
                layer: layer
            });

            yield {
                activeLayer: layerIdx,
                outputs: layerOutputs,
                finished: false
            };

        } else if (layer.type === 'pool') {
            // Apply pooling to each feature map
            for (let mapIdx = 0; mapIdx < currentOutput.length; mapIdx++) {
                const pooled = layer.poolType === 'max'
                    ? applyMaxPooling(currentOutput[mapIdx], layer.poolSize, layer.stride)
                    : applyAvgPooling(currentOutput[mapIdx], layer.poolSize, layer.stride);
                nextOutput.push(pooled);
            }

            layerOutputs.push({
                layerIndex: layerIdx,
                type: 'pool',
                featureMaps: nextOutput,
                layer: layer
            });

            yield {
                activeLayer: layerIdx,
                outputs: layerOutputs,
                finished: false
            };

        } else if (layer.type === 'flatten') {
            // Flatten all feature maps
            const flattened = currentOutput.flatMap(map => flatten(map));
            nextOutput = flattened;

            layerOutputs.push({
                layerIndex: layerIdx,
                type: 'flatten',
                vector: nextOutput,
                layer: layer
            });

            yield {
                activeLayer: layerIdx,
                outputs: layerOutputs,
                finished: false
            };

        } else if (layer.type === 'dense') {
            // Initialize weights if not done
            if (!layer.weights) {
                const inputSize = currentOutput.length;
                const { weights, bias } = initializeDenseWeights(inputSize, layer.units);
                layer.weights = weights;
                layer.bias = bias;
            }

            // Apply dense layer
            nextOutput = applyDenseLayer(currentOutput, layer.weights, layer.bias, layer.activation);

            layerOutputs.push({
                layerIndex: layerIdx,
                type: 'dense',
                vector: nextOutput,
                layer: layer
            });

            yield {
                activeLayer: layerIdx,
                outputs: layerOutputs,
                finished: false
            };
        }

        currentOutput = nextOutput;
    }

    yield {
        activeLayer: -1,
        outputs: layerOutputs,
        finished: true
    };
}

// Get output dimensions for a layer
export const getLayerOutputDimensions = (layer, inputDim) => {
    if (layer.type === 'conv') {
        const kernelSize = layer.kernelSize;
        const outputSize = Math.floor((inputDim + 2 * layer.padding - kernelSize) / layer.stride) + 1;
        return { width: outputSize, height: outputSize, depth: layer.filters };
    } else if (layer.type === 'pool') {
        const outputSize = Math.floor((inputDim - layer.poolSize) / layer.stride) + 1;
        return { width: outputSize, height: outputSize, depth: null }; // depth stays same
    }
    return inputDim;
};
