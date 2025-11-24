
export const generateSampleGraph = () => {
    // Fixed sample graph for clear visualization
    const nodes = [
        { id: 0, x: 400, y: 100, label: '0' },
        { id: 1, x: 250, y: 200, label: '1' },
        { id: 2, x: 550, y: 200, label: '2' },
        { id: 3, x: 150, y: 350, label: '3' },
        { id: 4, x: 350, y: 350, label: '4' },
        { id: 5, x: 450, y: 350, label: '5' },
        { id: 6, x: 650, y: 350, label: '6' },
        { id: 7, x: 350, y: 500, label: '7' },
    ];

    const edges = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 5 },
        { from: 2, to: 6 },
        { from: 4, to: 7 },
        { from: 5, to: 7 }, // Cycle/Multiple paths
    ];

    const adjacencyList = {};
    nodes.forEach(node => adjacencyList[node.id] = []);
    edges.forEach(edge => {
        adjacencyList[edge.from].push(edge.to);
        adjacencyList[edge.to].push(edge.from); // Undirected
    });

    return { nodes, edges, adjacencyList };
};

export function* dfs(adjacencyList, startNode) {
    const visited = new Set();
    const stack = [startNode];
    const path = []; // Order of traversal

    visited.add(startNode);
    yield { current: startNode, visited: new Set(visited), stack: [...stack], path: [...path] };

    while (stack.length > 0) {
        const node = stack.pop();
        path.push(node);

        yield { current: node, visited: new Set(visited), stack: [...stack], path: [...path] };

        const neighbors = adjacencyList[node] || [];
        // Sort neighbors to ensure deterministic order (e.g., smallest ID first) or reverse for stack order
        const sortedNeighbors = [...neighbors].sort((a, b) => b - a);

        for (const neighbor of sortedNeighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                stack.push(neighbor);
                yield { current: null, visited: new Set(visited), stack: [...stack], path: [...path] };
            }
        }
    }

    yield { current: null, visited: new Set(visited), stack: [], path: [...path], finished: true };
}

export function* bfs(adjacencyList, startNode) {
    const visited = new Set();
    const queue = [startNode];
    const path = [];

    visited.add(startNode);
    yield { current: startNode, visited: new Set(visited), queue: [...queue], path: [...path] };

    while (queue.length > 0) {
        const node = queue.shift();
        path.push(node);

        yield { current: node, visited: new Set(visited), queue: [...queue], path: [...path] };

        const neighbors = adjacencyList[node] || [];
        const sortedNeighbors = [...neighbors].sort((a, b) => a - b);

        for (const neighbor of sortedNeighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                yield { current: null, visited: new Set(visited), queue: [...queue], path: [...path] };
            }
        }
    }
    yield { current: null, visited: new Set(visited), queue: [], path: [...path], finished: true };
}
