const { splitNames, shuffle, groupNames } = require('./random-team-gen.js');

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

describe('splitNames function', () => {
    it('splits names separated by a single space', () => {
        expect(splitNames('isaac billy')).toEqual(['isaac', 'billy']);
    });

    it('splits names separated by multiple spaces', () => {
        expect(splitNames('isaac  billy')).toEqual(['isaac', 'billy']);
    });

    it('splits names separated by a comma', () => {
        expect(splitNames('isaac,billy')).toEqual(['isaac', 'billy']);
    });

    it('splits names separated by space and comma', () => {
        expect(splitNames('isaac billy, jony')).toEqual(['isaac', 'billy', 'jony']);
    });

    it('handles leading and trailing spaces', () => {
        expect(splitNames(' isaac billy ')).toEqual(['isaac', 'billy']);
    });

    it('returns an empty array for an empty string', () => {
        expect(splitNames('')).toEqual([]);
    });
});
