const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbjez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
   try{
       await client.connect();

       const database = client.db('hotel_exodia');
       const roomCollection = database.collection('rooms');
       const bookingCollection =  database.collection('booking_details');
        

       
       app.get('/rooms', async (req, res)=>{
           const cursor = roomCollection.find({});
           const room =  await cursor.toArray();
           res.send(room)
       })
       app.get('/bookings', async (req, res)=>{
           const cursor = bookingCollection.find({});
           const booking =  await cursor.toArray();
           res.send(booking)
       })

    

       app.post('/rooms', async(req, res)=>{
           const room = req.body;
        const result = await roomCollection.insertOne(room);

        res.json(result )
       })

      app.get('/rooms/:id', async (req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await roomCollection.findOne(query);
          res.send(result)
      })
      
      app.get('/bookings/:id', async (req, res)=>{
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const result = await bookingCollection.findOne(query);
          res.send(result)
      })

      app.put('/bookings/:id' , async (req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const updatedoc = {

                $set : {
                    status : 'Approved'
                }
            };

            const result = await bookingCollection.updateOne(filter, updatedoc)

            res.json(result)

            console.log(result)
            
            
            
      })


      app.delete('/bookings/:id', async (req, res)=>{
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const result = await bookingCollection.deleteOne(query);
          res.send(result)
      })
      

      app.post('/bookings', async(req, res)=>{
          const booking = req.body;
          const result = await bookingCollection.insertOne(booking);
          res.json(result)
      })

       
   }
   finally{

   }
}

run().catch(console.dir)



app.get('/', (req, res)=>{
    res.send("Server Founded");
})

app.listen(port, ()=>{
    console.log("Listening form", port)
})