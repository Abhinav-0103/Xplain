export class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = 0;
        this.y = 0;
    }
}

export const insertNode = (root, value) => {
    if (!root) {
        return new TreeNode(value);
    }

    if (value < root.value) {
        root.left = insertNode(root.left, value);
    } else if (value > root.value) {
        root.right = insertNode(root.right, value);
    }
    return root;
};

export const searchNode = (root, value) => {
    if (!root) return false;
    if (root.value === value) return true;
    if (value < root.value) return searchNode(root.left, value);
    return searchNode(root.right, value);
    return searchNode(root.right, value);
};

export const getSearchPath = (root, value) => {
    const path = [];
    let current = root;
    while (current) {
        path.push(current.id);
        if (value === current.value) {
            return { found: true, path };
        }
        if (value < current.value) {
            current = current.left;
        } else {
            current = current.right;
        }
    }
    return { found: false, path };
};

// Simple tree layout algorithm
export const calculateTreeLayout = (root, width = 800, height = 600, level = 0, x = width / 2, offset = width / 4) => {
    if (!root) return;

    root.x = x;
    root.y = level * 80 + 50; // 80px vertical spacing

    calculateTreeLayout(root.left, width, height, level + 1, x - offset, offset / 2);
    calculateTreeLayout(root.right, width, height, level + 1, x + offset, offset / 2);

    return root;
};

export const flattenTree = (root) => {
    const nodes = [];
    const edges = [];

    const traverse = (node) => {
        if (!node) return;
        nodes.push(node);
        if (node.left) {
            edges.push({ from: node, to: node.left, id: `${node.id}-${node.left.id}` });
            traverse(node.left);
        }
        if (node.right) {
            edges.push({ from: node, to: node.right, id: `${node.id}-${node.right.id}` });
            traverse(node.right);
        }
    };

    traverse(root);
    return { nodes, edges };
};
