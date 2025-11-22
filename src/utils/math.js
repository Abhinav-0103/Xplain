/**
 * Generates random data points based on a true slope and intercept with added noise.
 * @param {number} n - Number of points
 * @param {number} slope - True slope
 * @param {number} intercept - True intercept
 * @param {number} noiseLevel - Magnitude of random noise
 * @returns {Array} Array of objects {x, y, id}
 */
export const generateData = (n, slope, intercept, noiseLevel) => {
    const data = [];
    for (let i = 0; i < n; i++) {
        const x = Math.random() * 10; // Range 0-10
        const noise = (Math.random() - 0.5) * noiseLevel * 5;
        const y = slope * x + intercept + noise;
        data.push({ id: i, x, y });
    }
    return data;
};

/**
 * Calculates the Ordinary Least Squares (OLS) regression line.
 * @param {Array} data - Array of objects {x, y}
 * @returns {Object} { slope, intercept }
 */
export const calculateRegression = (data) => {
    if (data.length === 0) return { slope: 0, intercept: 0 };

    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
        sumX += data[i].x;
        sumY += data[i].y;
        sumXY += data[i].x * data[i].y;
        sumXX += data[i].x * data[i].x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;


    return { slope, intercept };
};

/**
 * Simple 2D loss function (quadratic bowl)
 * f(x, y) = (x - 2)^2 + (y - 1)^2
 */
export const lossFunction = (x, y) => {
    return Math.pow(x - 2, 2) + Math.pow(y - 1, 2);
};

/**
 * Compute gradient of the loss function
 * ∇f = [2(x - 2), 2(y - 1)]
 */
export const computeGradient = (x, y) => {
    return {
        dx: 2 * (x - 2),
        dy: 2 * (y - 1)
    };
};

/**
 * Run gradient descent for a given number of steps
 * @param {number} startX - Starting x position
 * @param {number} startY - Starting y position
 * @param {number} learningRate - Step size
 * @param {number} steps - Number of iterations
 * @returns {Array} Path of {x, y, loss} objects
 */
export const runGradientDescent = (startX, startY, learningRate, steps) => {
    const path = [];
    let x = startX;
    let y = startY;

    for (let i = 0; i < steps; i++) {
        const loss = lossFunction(x, y);
        path.push({ x, y, loss, step: i });

        const grad = computeGradient(x, y);
        x = x - learningRate * grad.dx;
        y = y - learningRate * grad.dy;
    }


    return path;
};

/**
 * 3D loss function (Rosenbrock-like or paraboloid)
 * f(x, y, z) = (x - 2)^2 + (y - 1)^2 + z^2
 * But we'll compute z FROM x,y for surface: z = (x - 2)^2 + (y - 1)^2
 */
export const lossFunction3D = (x, y) => {
    return Math.pow(x - 2, 2) + Math.pow(y - 1, 2);
};

/**
 * Run 3D gradient descent (z is determined by x, y)
 * @param {number} startX - Starting x position
 * @param {number} startY - Starting y position
 * @param {number} learningRate - Step size
 * @param {number} steps - Number of iterations
 * @returns {Array} Path of {x, y, z, loss} objects
 */
export const runGradientDescent3D = (startX, startY, learningRate, steps) => {
    const path = [];
    let x = startX;
    let y = startY;

    for (let i = 0; i < steps; i++) {
        const z = lossFunction3D(x, y);
        path.push({ x, y, z, loss: z, step: i });

        const grad = computeGradient(x, y); // Same gradient as 2D
        x = x - learningRate * grad.dx;
        y = y - learningRate * grad.dy;
    }

    return path;
};
