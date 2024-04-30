const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

   



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tqysnnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const craftCollection = client.db("craftDB").collection('craft');
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

   
    app.get('/craft',async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
   
   
    app.get('/craft/:subcategory',async(req,res)=>{
      const subcategory=req.params.email;
      
      const result= await craftCollection.find({subcategory_Name : subcategory}).toArray();
      res.send(result);


    })
    app.get('/myProduct/:email',async(req,res)=>{
      const email=req.params.email;
      
      const result= await craftCollection.find({User_Email : email}).toArray();
      res.send(result);


    })
    
    app.get('/details/:id',async(req,res)=>{
      const id=req.params.id;
      
      const result= await craftCollection.findOne({_id : new ObjectId(id)});
      res.send(result);


    })
    app.get('/updateCraft/:id',async(req,res)=>{
      const id=req.params.id;
      
      const result= await craftCollection.findOne({_id : new ObjectId(id)});
      res.send(result);


    })
    app.get('/category/:subCategory',async(req,res)=>{
      const subCategory=req.params.subCategory;
      
      const result= await craftCollection.find({subcategory_Name : subCategory}).toArray();
      res.send(result);


    })
    app.put('/updateCraft/:id',async(req,res)=>{
      const id=req.params.id;
      
      const filter = { _id:new ObjectId(id)};
    
    const options = { upsert: true };
    const craft=req.body;
    
    const updateCraft = {     
      $set: {
        

        image:craft.image,
        item_name:craft.item_name,
        subcategory_Name:craft.subcategory_Name,
        short_description:craft.short_description,
        price:craft.price,
        rating:craft.rating,
        customization:craft.customization,
        processing_time:craft.processing_time,
        stockStatus:craft.stockStatus,
        User_Name:craft.User_Name,
        User_Email:craft.User_Email
      },
    };
    
    const result = await craftCollection.updateOne(filter, updateCraft, options);
    res.send(result);
    console.log(result);
    })
    app.delete('/craft/:id',async(req,res)=>{
      const id=req.params.id;
      const query = { _id: new ObjectId(id) };
    const result = await craftCollection.deleteOne(query);
    res.send(result);
    })
    app.post('/craft',async(req,res)=>{
        const newCraft=req.body;
        console.log(newCraft)
        const result=await craftCollection.insertOne(newCraft);
        res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Art & craft server is running')
})

app.listen(port, () => {
    console.log(`Art & craft Server is running on port : ${port}`)
})