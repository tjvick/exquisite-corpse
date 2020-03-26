const collections = {
    sentences: 'sentences',
    persons: 'persons',
    drawings: 'drawings',
    stories: 'stories',
    games: 'games'
};

const indices = [
    {
        collection: collections.sentences,
        name: 'sentence_ids',
        dataField: 'id'
    }
];

module.exports = {
    collections,
    indices,
};
