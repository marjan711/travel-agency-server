const { MongoClient } = require('mongodb');
const express = require('express');
const cors =require('cors');
require('dotenv').config()
const objectId = require('mongodb').ObjectId;
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;

// use middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojbxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("jTravel");
      const servicesCollection = database.collection("services");
      const orderCollection = database.collection("orders");

    //   Post api  for add services
    app.post('/services', async(req,res)=>{
          
        const service=req.body;
        const result = await servicesCollection.insertOne(service);
         console.log('got new user', req.body);
         console.log('added user', result); 
        res.json(result);

  });

  //   get api for all services
  app.get('/allServices', async(req,res)=>{
    const cursor =servicesCollection.find({});
    const services=await cursor.toArray();
    res.send(services);
})

  // for single service info
app.get('/service/:id',async(req,res)=>{
    const id =req.params.id;
    const querry = {_id:objectId(id)};
    const service = await servicesCollection.findOne(querry);
    console.log('load user with id',id)
    res.send(service)
})

//   post api for orders

app.post('/confirmOrder', async(req,res)=>{
          
    const order=req.body;
    console.log(order);
    const result = await orderCollection.insertOne(order);
    res.json(result);
     

});

// for delete Services
app.delete('/deleteService/:id',async(req,res)=>{
    const id =req.params.id;
    const query = {_id:objectId(id)}
    
    const result =await servicesCollection.deleteOne(query)
    console.log("deleting order with id",result);
    res.send(result.acknowledged);
})

// for myorders

app.get("/myorders/:email",async(req,res)=>{
    const result = await orderCollection
    .find({email: req.params.email})
    .toArray();
    res.send(result)
})

// for all orders

app.get('/allOrders', async(req,res)=>{
    const cursor =orderCollection.find({});
    const orders=await cursor.toArray();
    res.send(orders);
})

// for update orders
app.put('/updateStatus/:id',(req,res)=>{
    const id =req.params.id;
    const newstatus =req.body.status;
    const filter ={_id:objectId(id)};
    orderCollection.updateOne(filter,{
        $set:{status:newstatus},

    })
    .then((result)=>{
                res.send(result)
    })
    
    // const result = await orderCollection.
})

// delete orders
app.delete('/deleteOrder/:id',async(req,res)=>{
    const id =req.params.id;
    const query = {_id:objectId(id)}
    
    const result =await orderCollection.deleteOne(query)
    console.log("deleting order with id",result);
    res.send(result.acknowledged);
})









    


      
    } finally {
    //   await client.close();
    }
  }

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('its working')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })