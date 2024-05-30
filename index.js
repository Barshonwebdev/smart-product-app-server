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
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);