const { splitNames, shuffle, groupNames, teamsToString } = require('./random-team-gen.js');

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


    it('does not duplicate names in the result', () => {
        const names = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Helen"];
        const numGroups = 3;
        const groupedNames = groupNames(names, numGroups);

        // Flatten the grouped array
        const allNames = [].concat(...groupedNames);

        // Check for duplicates
        const hasDuplicates = allNames.some((name, index) => allNames.indexOf(name) !== index);
        expect(hasDuplicates).toBe(false);
    });
});


describe('shuffle function', () => {
    it('returns an array of the same length', () => {
        const array = [1, 2, 3, 4, 5];
        const shuffled = shuffle(array);
        expect(shuffled.length).toBe(array.length);
    });

    it('returns an array with the same elements', () => {
        const array = [1, 2, 3, 4, 5];
        const shuffled = shuffle(array);
        expect(shuffled).toEqual(expect.arrayContaining(array));
        expect(array).toEqual(expect.arrayContaining(shuffled));
    });

    it('does not duplicate items in the shuffled array', () => {
        const array = [1, 2, 3, 4, 5];
        const shuffled = shuffle(array);
        const uniqueItems = new Set(shuffled);
        expect(uniqueItems.size).toBe(shuffled.length);
    });

    it('returns a shuffled array (probabilistic)', () => {
        const array = [1, 2, 3, 4, 5];
        const shuffled1 = shuffle([...array]);
        const shuffled2 = shuffle([...array]);
        // This test might fail occasionally due to the probabilistic nature of shuffling
        // but for most cases, two consecutive shuffles should be different
        expect(shuffled1).not.toEqual(shuffled2);
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


describe('teamsToString function', () => {
    it('converts a 2D array of teams to a human-readable string', () => {
        const teams = [["john"], ["john", "billy"]];
        const expected = "Team 1: john\nTeam 2: john, billy";
        expect(teamsToString(teams)).toBe(expected);
    });

    it('handles single team', () => {
        const teams = [["john", "billy"]];
        const expected = "Team 1: john, billy";
        expect(teamsToString(teams)).toBe(expected);
    });

    it('handles multiple teams with multiple members', () => {
        const teams = [["john", "billy"], ["alice", "eve", "grace"]];
        const expected = "Team 1: john, billy\nTeam 2: alice, eve, grace";
        expect(teamsToString(teams)).toBe(expected);
    });

    it('returns an empty string for an empty array', () => {
        const teams = [];
        expect(teamsToString(teams)).toBe('');
    });
});
