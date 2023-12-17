const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const indexPath = 'C:\\Users\\25472\\sit725-t2-prac4';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = "mongodb://localhost:27017";
const dbName = "mydb";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName); 

    // Serve static files from the specified directory
    app.use(express.static(indexPath));

    app.post("/submit-form", async (req, res) => {
      const { first_name, last_name, email, message } = req.body;

      try {
        const collection = db.collection("formData");
        await collection.insertOne({ first_name, last_name, email, message });
        console.log("Form data inserted into MongoDB");
        res.send("Form submitted and data inserted into MongoDB!");
      } catch (err) {
        console.error("Error inserting form data into MongoDB:", err);
        res.status(500).send("Error inserting form data into MongoDB");
      }
    });

    const port = process.env.PORT || 2010;
    app.listen(port, () => {
      console.log("App listening on port: " + port);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });