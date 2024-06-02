// server node packages

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3100;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// jwt create token function
function createToken(user) {
  const token = jwt.sign(
    {
      email: user.email,
    },
    "secret",
    { expiresIn: "7d" }
  );
  
  return token;
}

// jwt token verify function 
function verifyToken(req,res,next){
  const token=req.headers.authorization.split(' ')[1];
  const verify=jwt.verify(token,"secret");
  if(!verify?.email){
   return res.send('You are not authorized');
  }
  req.user=verify.email;
  console.log(verify);
  next();
}

// routes
app.get("/", (req, res) => {
  res.send("running");
});

app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});

// mongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.7di2jdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const smartProductDB = client.db("smart-product-db");
    const productCollection = smartProductDB.collection("product-collection");
    const userCollection = smartProductDB.collection("user-collection");
    // product APIs

    // add product
    app.post("/gadgets", async (req, res) => {
      const productData = req.body;
      const result = await productCollection.insertOne(productData);
      res.send(result);
    });

    // get all products
    app.get("/gadgets", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // get specific product
    app.get("/gadgets/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // update specific product
    app.patch("/gadgets/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;

      const filter = {
        _id: new ObjectId(id),
      };

      const updateDoc = {
        $set: updatedProduct,
      };

      const result = await productCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete specific product
    app.delete("/gadgets/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // user APIs

    app.post("/user", async (req, res) => {
      const user = req.body;
      const token=createToken(user);
      console.log(token);
      const isUserExist = await userCollection.findOne({ email: user.email });
      if (isUserExist) {
        return res.send({
          message: "user already exists on database",
          token
        });
      }
      const result = await userCollection.insertOne(user);
      res.send({token});
    });

    app.get("/user/get/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    app.patch("/user/:email", async (req, res) => {
      const email = req.params.email;
      const userData = req.body;
      const result = await userCollection.updateOne(
        { email },
        { $set: userData },
        { upsert: true }
      );
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
