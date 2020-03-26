import dotenv from 'dotenv';
import faunadb from 'faunadb';
import fdbConfig from './../../config/faunadb';

dotenv.config();

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("Function `saveSentence` invoked", data);

  const sentenceDocument = {
    data: {
      content: data.content
    }
  };

  return client
    .query(
      q.Create(
        q.Collection(fdbConfig.collections.sentences),
        sentenceDocument
      )
    )
    .then((ret) => {
      console.log(ret);
      console.log("success", ret);

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(ret)
      });
    })
    .catch((e) => {
      console.log("error", e);

      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(e)
      })
    })
};
