// Attention Mechanism Utilities

// Generate random matrix of size rows x cols
export const generateMatrix = (rows, cols) => {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() * 2 - 1)
    );
};

// Matrix multiplication: A (m x n) * B (n x p) -> C (m x p)
export const matMul = (A, B) => {
    const m = A.length;
    const n = A[0].length;
    const p = B[0].length;
    const C = Array.from({ length: m }, () => Array(p).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
            for (let k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
};

// Transpose matrix
export const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

// Softmax function applied to each row of a matrix
export const softmax = (matrix) => {
    return matrix.map(row => {
        const maxVal = Math.max(...row);
        const exps = row.map(val => Math.exp(val - maxVal));
        const sumExps = exps.reduce((a, b) => a + b, 0);
        return exps.map(val => val / sumExps);
    });
};

// Compute Q, K, V matrices
// inputs: [seq_len, d_model]
// Wq, Wk, Wv: [d_model, d_k]
export const computeQKV = (inputs, Wq, Wk, Wv) => {
    const Q = matMul(inputs, Wq);
    const K = matMul(inputs, Wk);
    const V = matMul(inputs, Wv);
    return { Q, K, V };
};

// Compute Scaled Dot-Product Attention
// Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V
export const computeAttention = (Q, K, V) => {
    const d_k = Q[0].length;
    const Kt = transpose(K);
    const scores = matMul(Q, Kt);
    
    // Scale
    const scaledScores = scores.map(row => row.map(val => val / Math.sqrt(d_k)));
    
    // Softmax
    const attentionWeights = softmax(scaledScores);
    
    // Weighted Sum
    const output = matMul(attentionWeights, V);
    
    return {
        scores: scaledScores,
        weights: attentionWeights,
        output: output
    };
};

// Multi-Head Attention Logic
// For visualization, we'll simulate splitting by generating separate W matrices for each head
export const computeMultiHeadAttention = (inputs, numHeads, d_model, d_k) => {
    const heads = [];
    const concatenatedOutput = []; // Placeholder for concatenation logic visualization

    for (let i = 0; i < numHeads; i++) {
        // Generate random weights for this head
        const Wq = generateMatrix(d_model, d_k);
        const Wk = generateMatrix(d_model, d_k);
        const Wv = generateMatrix(d_model, d_k);

        const { Q, K, V } = computeQKV(inputs, Wq, Wk, Wv);
        const attentionResult = computeAttention(Q, K, V);

        heads.push({
            id: i,
            Q, K, V,
            weights: attentionResult.weights,
            output: attentionResult.output
        });
    }

    return heads;
};

// Simple tokenizer (whitespace split) and embedding mock
export const getTokensAndEmbeddings = (text, d_model) => {
    const tokens = text.trim().split(/\s+/);
    // Generate random embeddings for each token
    const embeddings = generateMatrix(tokens.length, d_model);
    return { tokens, embeddings };
};
