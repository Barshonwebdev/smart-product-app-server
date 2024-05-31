// server node packages 

const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT || 3100;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware 
app.use(cors());
app.use(express.json());

// routes
app.get('/',(req,res)=>{
    res.send('running');
})

app.listen(port,()=>{
    console.log(`listening at port: ${port}`);
})

// mongoDB 
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.7di2jdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const smartProductDB=client.db('smart-product-db');
      const productCollection=smartProductDB.collection('product-collection');

      // add product 
      app.post('/gadgets', async(req,res)=>{
        const productData=req.body;
        const result=await productCollection.insertOne(productData);
        res.send(result);
      })

      // get all products
      app.get('/gadgets',async(req,res)=>{
        const result=await productCollection.find().toArray();
        res.send(result);
      })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);