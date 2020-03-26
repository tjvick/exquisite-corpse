const faunadb = require('faunadb');
const q = faunadb.query;

function getClient(key) {
    return new faunadb.Client({secret: key});
}

function createCollection(client, collectionName) {
    return client
        .query(
            q.CreateCollection({ name: collectionName })
        )
        .then((ret) => console.log(ret))
        .catch((e) => console.log(e.message));
}

function createIndex(client, collectionName, indexName, dataField) {
    return client
        .query(
            q.CreateIndex({
                name: indexName,
                source: q.Collection(collectionName),
                values: [{ field: ['data', dataField]}]
            })
        )
        .then((ret) => console.log(ret))
        .catch((e) => console.log(e.message));
}

module.exports = {
    getClient,
    createCollection,
    createIndex
};
