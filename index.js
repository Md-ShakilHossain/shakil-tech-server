const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.SECRET_PASSWORD}@cluster0.yyjzvb3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //  await client.connect();

    const database = client.db("productsDB");
    const productsCollection = database.collection("products");
    const cartCollection = database.collection("Carts");


    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.get('/products/:brandName', async (req, res) => {
      const bName = req.params.brandName;
      const query = { brandName: bName };
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });



    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedInformation = req.body;
      const information = {
        $set: {
          imageURL: updatedInformation.imageURL,
          name: updatedInformation.name,
          brandName: updatedInformation.brandName,
          rating: updatedInformation.rating,
          price: updatedInformation.price,
          type: updatedInformation.type
        }
      }

      const result = await productsCollection.updateOne(query, information, options);
      res.send(result);

    })




    // Carts related api

    app.get('/carts', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/carts/:id', async (req, res) => {
      const id = req.params.id;
      console.log("single id", typeof (id), id);
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.findOne(query);
      console.log(result);
      res.send(result);
    });


    app.post('/carts', async (req, res) => {
      const cartData = req.body;
      console.log(cartData);
      const result = await cartCollection.insertOne(cartData);
      res.send(result);
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Shakil-Tech server is working perfectly');
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})