
export const generateRandomArray = (length, min = 10, max = 100) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));
};

export function* bubbleSort(array) {
    let arr = [...array];
    let n = arr.length;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            // Yield current comparison state: [indices being compared], [swapped indices], current array
            yield { compare: [i, i + 1], swap: [], array: [...arr] };

            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
                // Yield swap state
                yield { compare: [], swap: [i, i + 1], array: [...arr] };
            }
        }
        n--; // Optimization: last element is already sorted
    } while (swapped);
    yield { compare: [], swap: [], array: [...arr], sorted: true };
}

export function* selectionSort(array) {
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            yield { compare: [minIdx, j], swap: [], array: [...arr] };
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
            yield { compare: [], swap: [i, minIdx], array: [...arr] };
        }
    }
    yield { compare: [], swap: [], array: [...arr], sorted: true };
}

export function* insertionSort(array) {
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        yield { compare: [i, j], swap: [], array: [...arr] };

        while (j >= 0 && arr[j] > key) {
            yield { compare: [j + 1, j], swap: [], array: [...arr] }; // Visualizing the shift check
            arr[j + 1] = arr[j];
            yield { compare: [], swap: [j + 1, j], array: [...arr] }; // Visualizing the shift
            j = j - 1;
        }
        arr[j + 1] = key;
        yield { compare: [], swap: [], array: [...arr] }; // Key placed
    }
    yield { compare: [], swap: [], array: [...arr], sorted: true };
}
