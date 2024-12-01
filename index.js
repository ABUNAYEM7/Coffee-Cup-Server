const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT ||5000
const app = express()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_KEY}@cluster0.qcus7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"`


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
    const CoffeeCollection =client.db('coffeeDB').collection('Coffee')

    app.get('/coffees',async(req,res)=>{
      const cursor = CoffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.post('/AddCoffee',async(req,res)=>{
      const newCoffee = req.body;
      const result =await CoffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.get('/coffees/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await CoffeeCollection.findOne(query)
      res.send(result)
    })

    app.put('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert : true}
      const updatedCoffee = req.body;
      const coffee ={
        $set:{
          name :updatedCoffee.name,
          chef :updatedCoffee.chef,
          supplier :updatedCoffee.supplier,
          test :updatedCoffee.test,
          category :updatedCoffee.category,
          price :updatedCoffee.price,
          image :updatedCoffee.image,
        }
      }
      const result = await CoffeeCollection.updateOne(filter,coffee,option)
      res.send(result)
    })

   app.delete('/coffees/:id',async(req,res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await CoffeeCollection.deleteOne(query)
    res.send(result)
   })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Coffee Cup Server is running')
})



app.listen(port,()=>{
    console.log('Coffee Cup Server is running on port',port)
})

