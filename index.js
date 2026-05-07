const express = require('express');
const app = express();
const cors = require('cors');
// Fix 1: Environment variables are case-sensitive. Use 'PORT' instead of 'Port'
const port = process.env.PORT || 5000; 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

// Fix 2: Your URI was missing one slash after 'mongodb+srv:'. It must be 'mongodb+srv://'
const uri = `mongodb+srv://simpleCrudUser:SDH2YJWCAv1e2KCD@cluster0.agkguij.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db('simpleCrud')
    const userCollection = db.collection('users')

    app.get('/users', async(req, res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
        
    })
    

    app.get('/users/:id', async(req, res)=>{
        
        const result = await userCollection.findOne({ _id: new ObjectId(req.params.id) });
        res.send(result);

    })
    
    // Fix 3: In a real app, don't put client.close() in 'finally' inside this function.
    // If you close it here, your API routes won't be able to talk to the DB later.
    
    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Example of a Database Collection setup
    // const database = client.db("usersDB");
    // const userCollection = database.collection("users");

  } catch (error) {
    console.error("Connection error:", error);
  }
  // Note: Removed client.close() so the connection stays alive for requests
};

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Simple Crud server is serving');
});

app.listen(port, () => {
  console.log(`Simple Crud server is running on port ${port}`);
});

// try{

// }
// catch(error){
//     console.error(error);
// }
// finally{

// }