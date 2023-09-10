function teamsToString(teams) {
    return teams.map((team, index) => {
        return `Team ${index + 1}: ${team.join(', ')}`;
    }).join('\n');
}

function splitNames(input) {
    // If the input is an empty string, return an empty array
    if (!input.trim()) {
        return [];
    }

    // Split the string by comma or one or more spaces
    let names = input.split(/[\s,]+/);

    // Trim each name in the resulting array and filter out any empty strings
    return names.map(name => name.trim()).filter(name => name !== '');
}

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    let newArray = [];

    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return newArray;
}

function groupNames(names, numGroups) {
    names = shuffle(names);

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

module.exports = { splitNames, shuffle, groupNames, teamsToString };
