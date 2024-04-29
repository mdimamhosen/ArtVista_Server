const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://artvista-d1084.web.app"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

console.log("process.env.PASS", process.env.PASS);

const uri = `mongodb+srv://mdimamcse9bu:${process.env.PASS}@cluster0.msyopz2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const sixData = await client.db("sixData").collection("sixData");
    const allcategory = await client.db("sixData").collection("allcategory");

    app.get("/sixData", async (req, res) => {
      const cursor = sixData.find({});
      const results = await cursor.toArray();
      res.json(results);
    });
    //
    app.get("/allcategory", async (req, res) => {
      const cursor = allcategory.find({});
      const results = await cursor.toArray();
      res.json(results);
    });

    app.get("/myselecteddata", async (req, res) => {
      let query = {};
      if (req.query?.email && req.query?.subcategory) {
        query = {
          user_email: req.query.email,
          subcategory_Name: req.query.subcategory,
        };
      }
      const results = await sixData.find(query).toArray();
      res.json(results);
    });
    app.get("/mydata", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = {
          user_email: req.query.email,
        };
      }
      const results = await sixData.find(query).toArray();
      res.json(results);
    });
    app.post("/addCraft", async (req, res) => {
      try {
        const newCraftItem = req.body;
        console.log("newCraftItem", newCraftItem);
        const result = await sixData.insertOne(newCraftItem);
        console.log("result", result);

        res.send(result);
      } catch (error) {
        console.error("Error adding craft item:", error);
        res.status(500).json({ error: "Failed to add craft item" });
      }
    });

    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sixData.findOne(query);
      res.json(result);
    });
    app.get("/allcategory/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = { _id: new ObjectId(id) };
      const result = await allcategory.findOne(query);
      res.json(result);
    });
    app.delete("/deleteCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sixData.deleteOne(query);
      res.json(result);
    });

    app.patch("/updateCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedData = req.body;
      const updateDoc = {
        $set: updatedData,
      };
      const result = await sixData.updateOne(query, updateDoc);
      res.json(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(" You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
