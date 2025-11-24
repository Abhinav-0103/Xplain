// Kernel presets for different operations
export const kernelPresets = {
    identity: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ],
    edgeDetection: [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1]
    ],
    sharpen: [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ],
    blur: [
        [1 / 9, 1 / 9, 1 / 9],
        [1 / 9, 1 / 9, 1 / 9],
        [1 / 9, 1 / 9, 1 / 9]
    ],
    sobelX: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ],
    sobelY: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ]
};

export const createInputMatrix = (size = 8) => {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // Create a pattern with some variation
            const value = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 0.5 + 0.5;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
};

export const createKernel = (type = 'identity') => {
    return kernelPresets[type] || kernelPresets.identity;
};

export const calculateOutputSize = (inputSize, kernelSize, stride, padding, dilation) => {
    const effectiveKernelSize = kernelSize + (kernelSize - 1) * (dilation - 1);
    return Math.floor((inputSize + 2 * padding - effectiveKernelSize) / stride) + 1;
};

export const applyPadding = (input, padding) => {
    if (padding === 0) return input;

    const paddedSize = input.length + 2 * padding;
    const padded = [];

    for (let i = 0; i < paddedSize; i++) {
        const row = [];
        for (let j = 0; j < paddedSize; j++) {
            if (i < padding || i >= paddedSize - padding ||
                j < padding || j >= paddedSize - padding) {
                row.push(0); // Padding value
            } else {
                row.push(input[i - padding][j - padding]);
            }
        }
        padded.push(row);
    }

    return padded;
};

export const getReceptiveField = (outputX, outputY, kernel, stride, padding, dilation) => {
    const kernelSize = kernel.length;
    const positions = [];

    for (let ki = 0; ki < kernelSize; ki++) {
        for (let kj = 0; kj < kernelSize; kj++) {
            const x = outputX * stride + ki * dilation;
            const y = outputY * stride + kj * dilation;
            positions.push({ x, y, kernelX: ki, kernelY: kj });
        }
    }

    return positions;
};

export const applyConvolution = (input, kernel, stride = 1, padding = 0, dilation = 1) => {
    const paddedInput = applyPadding(input, padding);
    const kernelSize = kernel.length;
    const outputSize = calculateOutputSize(input.length, kernelSize, stride, padding, dilation);

    const output = [];

    for (let i = 0; i < outputSize; i++) {
        const row = [];
        for (let j = 0; j < outputSize; j++) {
            let sum = 0;

            // Apply convolution at this position
            for (let ki = 0; ki < kernelSize; ki++) {
                for (let kj = 0; kj < kernelSize; kj++) {
                    const inputX = i * stride + ki * dilation;
                    const inputY = j * stride + kj * dilation;

                    if (inputX < paddedInput.length && inputY < paddedInput[0].length) {
                        sum += paddedInput[inputX][inputY] * kernel[ki][kj];
                    }
                }
            }

            row.push(sum);
        }
        output.push(row);
    }

    return output;
};

// Normalize output for visualization (map to 0-1 range)
export const normalizeMatrix = (matrix) => {
    let min = Infinity;
    let max = -Infinity;

    matrix.forEach(row => {
        row.forEach(val => {
            min = Math.min(min, val);
            max = Math.max(max, val);
        });
    });

    const range = max - min;
    if (range === 0) return matrix.map(row => row.map(() => 0.5));

    return matrix.map(row =>
        row.map(val => (val - min) / range)
    );
};
