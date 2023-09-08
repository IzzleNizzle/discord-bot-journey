function groupNames(names, numGroups) {
    // Shuffle the array of names
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]]; // Swap elements
    }

    const groupSize = Math.floor(names.length / numGroups);
    const groups = [];
    let start = 0;
    let end = groupSize;

    // Divide the shuffled array into groups
    for (let i = 0; i < numGroups; i++) {
        // If this is the last group, include any remaining names
        if (i === numGroups - 1) {
            groups.push(names.slice(start));
        } else {
            groups.push(names.slice(start, end));
        }

        // Update start and end indices for the next slice
        start = end;
        end += groupSize;
    }

    return groups;
}

// Test the function
const names = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Helen"];
const numGroups = 3;
const groupedNames = groupNames(names, numGroups);
console.log(groupedNames);
