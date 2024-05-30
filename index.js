// server node packages 

const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT || 3100;

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
