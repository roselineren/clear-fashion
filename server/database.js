const { MongoClient, ServerApiVersion } = require('mongodb');
const products1 = require('./dedicated.json');
const products2 = require('./montlimart.json');
const products3 = require('./circlesportswear2.json');

const products = products1.concat(products2,products3);

const uri = "mongodb+srv://roselineren:Ren750114802@cluster0.rcbfex1.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function run() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    const result = await collection.insertMany(products);
    console.log(result);

  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

run()