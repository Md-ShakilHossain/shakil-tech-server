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


    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/product/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.get('/products/:brandName', async (req, res) => {
      const bName = req.params.brandName;
      const query = { brandName : bName };
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    

    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })


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