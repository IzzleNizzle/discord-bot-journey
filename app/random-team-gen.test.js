const groupNames = require('./random-team-gen.js');

describe('groupNames', () => {
    it('should group names into specified number of groups', () => {
        const names = ["Alice", "Bob", "Charlie", "David", "Eva"];
        const numGroups = 2;
        const result = groupNames(names, numGroups);

        // Check if the number of groups is correct
        expect(result.length).toBe(numGroups);

        // Check if the total number of names remains the same
        const totalNames = result.reduce((acc, group) => acc + group.length, 0);
        expect(totalNames).toBe(names.length);
    });

    it('should shuffle names', () => {
        const names = ["Alice", "Bob", "Charlie", "David", "Eva"];
        const numGroups = 1;
        const result = groupNames(names, numGroups)[0];

        // This test is probabilistic: there's a small chance the shuffled version is the same as the original
        // However, in practice, it's highly unlikely for larger arrays
        expect(result).not.toEqual(names);
    });
});
