function substringChecker(sentences, inputSentence) {
    let output = [];
    for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].toLowerCase().includes(inputSentence.toLowerCase())) {
            output.push(i);
        }
    }
    return output;
}

function findIndicesOfExactMatchesSorted(sentences, inputSentence) {
    const inputWords = inputSentence.toLowerCase().split(/\s+/);
    const matchCounts = sentences.map((sentence) => {
        const sentenceWords = sentence.toLowerCase().split(/\s+/);
        return inputWords.reduce((count, word) => {
            return count + (sentenceWords.includes(word) ? 1 : 0);
        }, 0);
    });

    return matchCounts
        .map((count, index) => ({ index, count }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .map(item => item.index);
}

module.exports = {
    substringChecker,
    findIndicesOfExactMatchesSorted
};