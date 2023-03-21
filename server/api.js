const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://roselineren:Ren750114802@cluster0.rcbfex1.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "clearfashion";

const PORT = 8092;
const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.get('/products', (request, response) => {
  response.send({'ack': true});
});

/*app.get("/products/:id", (request, response) => {
  collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      response.send(result);
  });
});*/


/*app.get('/products/search', (request, response) => {
  const { limit = 12, brand = 'All_brands', price = 10000 } = request.query;
  const query = {
    "brand": brand !== "All_brands" ? brand : { $exists: true }, // Filter by brand if specified, otherwise return all brands
    "price": { $lte: parseFloat(price)} // Filter by price if specified, otherwise return all prices
  };
  collection.find(query).sort({price : -1}).limit(parseInt(limit)).toArray((err, result) => {
    if (err) throw err;
    response.send(result);
  });
});*/


/*app.listen(PORT, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
      if(error) {
          throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("products");
      console.log("Connected to `" + DATABASE_NAME + "`!");
  });
});*/

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

