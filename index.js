const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json());
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.lo1ih.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('taskList').collection('task');


        // taskS API
        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        // POST
        app.post('/task', async (req, res) => {
            const newtask = req.body;
            
            const result = await taskCollection.insertOne(newtask);
            res.send(result);
        });

        // DELETE
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
});


app.listen(port, () => {
    console.log('Listening to port', port);
})

