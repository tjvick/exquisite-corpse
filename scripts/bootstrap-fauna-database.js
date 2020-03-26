require('dotenv').config();
const readline = require('readline');
const fdb = require('../src/util/faunadb');
const fdbConfig = require('../config/faunadb');
const insideNetlify = insideNetlifyBuildContext();

console.log('Creating your FaunaDB Database...\n');

if (!process.env.FAUNADB_SERVER_SECRET) {
    console.log('Required FAUNADB_SERVER_SECRET environment variable not found.');
    if (insideNetlify) {
        console.log('Set a `FAUNADB_SERVER_SECRET` value in the "Build environment variables" section');
        process.exit(1)
    }

    if (!insideNetlify) {
        console.log('You can create fauna DB keys here: https://dashboard.fauna.com/db/keys');
        ask('Enter your faunaDB server key', (err, answer) => {
            if (!answer) {
                console.log('Please supply a faunaDB server key');
                process.exit(1)
            }
            setupFaunaDB(process.env.FAUNADB_SERVER_SECRET).then(() => {
                console.log('Database setup complete!')
            })
        });
    }
}

if (process.env.FAUNADB_SERVER_SECRET) {
    setupFaunaDB(process.env.FAUNADB_SERVER_SECRET).then(() => {
        console.log('Database setup complete!')
    })
}

function setupFaunaDB(key) {
    console.log('Setup the database!');
    const client = fdb.getClient(key);

    const createIndexSimple = (client, index) => {
        return fdb.createIndex(client, index.collection, index.name, index.dataField)
    };

    console.log('\nCreate collections...\n');
    return fdb.createCollection(client, fdbConfig.collections.sentences)
        .then(() => fdb.createCollection(client, fdbConfig.collections.persons))
        .then(() => fdb.createCollection(client, fdbConfig.collections.drawings))
        .then(() => fdb.createCollection(client, fdbConfig.collections.stories))
        .then(() => fdb.createCollection(client, fdbConfig.collections.games))
        .catch((e) => console.error(e.message))
        .then(() => console.log('\nCreate indices...\n'))
        .then(() => createIndexSimple(client, fdbConfig.indices[0]))
        .catch((e) => console.error(e.message))
}

function insideNetlifyBuildContext() {
    return !!process.env.DEPLOY_PRIME_URL;
}

function ask(question, callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(question + '\n', function(answer) {
        rl.close();
        callback(null, answer);
    });
}
