const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const cors = require('cors')
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.DB

app.use(cors({
    origin: "*"
}))

app.use(express.json())

app.get("/DbContent", async function (req, res) {
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("music")
        let data = await db.collection("songs").find().toArray();
        await client.close()
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.post("/addSong/:id", async function (req, res) {
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("music")
        let insert = await db.collection("songs").findOne({ albumid: { $eq: `${req.params.id}` } })
        if (insert) {
            res.status(400).json({
                message: "Already in playlist"
            })  
        } else {
            let data = await db.collection("songs").insertOne(req.body.data)
            await client.close();
            res.json({
                message: "Success"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.delete("/deletesong/:id", async function (req, res) {
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("music")
        let data = await db.collection("songs").findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
        await client.close();
        res.json({
            message: "Music Deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

app.listen(PORT, function (req, res) {
    console.log(`this app is listnening to ${PORT}`)
})