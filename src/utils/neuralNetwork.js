
export const sigmoid = (x) => 1 / (1 + Math.exp(-x));

export const createNetwork = (layerSizes) => {
    const layers = [];

    // Initialize layers
    for (let i = 0; i < layerSizes.length; i++) {
        const layer = {
            id: i,
            neurons: [],
        };

        for (let j = 0; j < layerSizes[i]; j++) {
            layer.neurons.push({
                id: `${i}-${j}`,
                layerIndex: i,
                neuronIndex: j,
                activation: 0,
                bias: Math.random() * 2 - 1, // Random bias between -1 and 1
                weights: [], // Weights from previous layer to this neuron
            });
        }
        layers.push(layer);
    }

    // Initialize weights (fully connected)
    // Weights are stored in the destination neuron, connecting from the previous layer
    for (let i = 1; i < layers.length; i++) {
        const currentLayer = layers[i];
        const prevLayer = layers[i - 1];

        currentLayer.neurons.forEach(neuron => {
            prevLayer.neurons.forEach(prevNeuron => {
                neuron.weights.push({
                    from: prevNeuron.id,
                    value: Math.random() * 2 - 1, // Random weight between -1 and 1
                });
            });
        });
    }

    return layers;
};

export function* forwardPassGenerator(network, inputs) {
    const layers = JSON.parse(JSON.stringify(network)); // Deep copy to avoid mutating state directly in generator if needed, though we usually want to update state. 
    // Actually, for visualization, yielding the state at each step is better.

    // Set input layer activations
    const inputLayer = layers[0];
    for (let i = 0; i < inputLayer.neurons.length; i++) {
        if (i < inputs.length) {
            inputLayer.neurons[i].activation = inputs[i];
        }
    }

    yield { layers: JSON.parse(JSON.stringify(layers)), activeLayer: 0 };

    // Propagate
    for (let i = 1; i < layers.length; i++) {
        const currentLayer = layers[i];
        const prevLayer = layers[i - 1];

        for (let j = 0; j < currentLayer.neurons.length; j++) {
            const neuron = currentLayer.neurons[j];
            let weightedSum = neuron.bias;

            for (let k = 0; k < neuron.weights.length; k++) {
                const weight = neuron.weights[k];
                const prevNeuron = prevLayer.neurons.find(n => n.id === weight.from);
                weightedSum += prevNeuron.activation * weight.value;
            }

            neuron.activation = sigmoid(weightedSum);
        }

        yield { layers: JSON.parse(JSON.stringify(layers)), activeLayer: i };
    }

    yield { layers: JSON.parse(JSON.stringify(layers)), activeLayer: -1, finished: true };
}

export const sigmoidDerivative = (x) => {
    const s = sigmoid(x);
    return s * (1 - s);
};

export function* backwardPassGenerator(network, targets, learningRate) {
    const layers = JSON.parse(JSON.stringify(network));

    // Calculate output layer error
    const outputLayer = layers[layers.length - 1];
    for (let i = 0; i < outputLayer.neurons.length; i++) {
        const neuron = outputLayer.neurons[i];
        const target = targets[i] !== undefined ? targets[i] : 0;
        // Error = (Output - Target) * SigmoidDerivative(WeightedSum)
        // Note: We need the weighted sum (z) to calculate derivative correctly.
        // However, sigmoidDerivative(z) = sigmoid(z) * (1 - sigmoid(z)) = activation * (1 - activation)
        // So we can use activation directly.
        const error = (neuron.activation - target) * (neuron.activation * (1 - neuron.activation));
        neuron.delta = error;
    }

    yield { layers: JSON.parse(JSON.stringify(layers)), activeLayer: layers.length - 1 };

    // Backpropagate error
    for (let i = layers.length - 2; i >= 0; i--) { // Start from last hidden layer
        const currentLayer = layers[i];
        const nextLayer = layers[i + 1];

        for (let j = 0; j < currentLayer.neurons.length; j++) {
            const neuron = currentLayer.neurons[j];
            let errorSum = 0;

            // Sum errors from next layer weighted by connection weights
            for (let k = 0; k < nextLayer.neurons.length; k++) {
                const nextNeuron = nextLayer.neurons[k];
                // Find weight connecting this neuron to nextNeuron
                // Weights are stored in nextNeuron, pointing FROM this neuron
                const weight = nextNeuron.weights.find(w => w.from === neuron.id);
                if (weight) {
                    errorSum += nextNeuron.delta * weight.value;
                }
            }

            neuron.delta = errorSum * (neuron.activation * (1 - neuron.activation));
        }

        yield { layers: JSON.parse(JSON.stringify(layers)), activeLayer: i };
    }

    // Update weights and biases
    for (let i = 1; i < layers.length; i++) {
        const currentLayer = layers[i];
        const prevLayer = layers[i - 1];

        for (let j = 0; j < currentLayer.neurons.length; j++) {
            const neuron = currentLayer.neurons[j];

            // Update bias
            neuron.bias -= learningRate * neuron.delta;

            // Update weights
            for (let k = 0; k < neuron.weights.length; k++) {
                const weight = neuron.weights[k];
                const prevNeuron = prevLayer.neurons.find(n => n.id === weight.from);

                // Weight gradient = delta * prevActivation
                weight.value -= learningRate * neuron.delta * prevNeuron.activation;
            }
        }
    }

    yield { layers: JSON.parse(JSON.stringify(layers)), activeLayer: -1, finished: true };
}
