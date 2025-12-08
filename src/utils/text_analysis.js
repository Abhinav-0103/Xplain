// Text Analysis Utilities for BoW and TF-IDF

// Tokenize text: lowercase, remove punctuation, split by whitespace
export const tokenize = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(token => token.length > 0); // Remove empty strings
};

// Extract unique sorted vocabulary from a list of documents
export const getVocabulary = (documents) => {
    const allTokens = documents.flatMap(doc => tokenize(doc));
    return [...new Set(allTokens)].sort();
};

// Compute Bag-Of-Words (Count Matrix)
export const computeBoW = (documents, vocabulary) => {
    return documents.map(doc => {
        const tokens = tokenize(doc);
        return vocabulary.map(term => {
            return tokens.filter(t => t === term).length;
        });
    });
};

// Compute Term Frequency (TF)
// TF(t, d) = count of t in d / number of words in d
export const computeTF = (document, vocabulary) => {
    const tokens = tokenize(document);
    const docLength = tokens.length;

    if (docLength === 0) return vocabulary.map(() => 0);

    return vocabulary.map(term => {
        const count = tokens.filter(t => t === term).length;
        return count / docLength;
    });
};

// Compute Inverse Document Frequency (IDF)
// IDF(t) = log(N / (df + 1)) + 1 (standard sklearn-like variant to avoid div by zero)
// N: Total number of documents
// df: Number of documents containing term t
export const computeIDF = (documents, vocabulary) => {
    const N = documents.length;

    return vocabulary.map(term => {
        const df = documents.filter(doc => tokenize(doc).includes(term)).length;
        return Math.log((N + 1) / (df + 1)) + 1; // Smoothing
    });
};

// Compute TF-IDF Matrix
export const computeTFIDF = (documents, vocabulary) => {
    const idfVector = computeIDF(documents, vocabulary);

    return documents.map(doc => {
        const tfVector = computeTF(doc, vocabulary);
        return tfVector.map((tf, index) => tf * idfVector[index]);
    });
};
