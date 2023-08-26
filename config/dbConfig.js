const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

//varify connection

connection.on("connected", () => {
  console.log("MongoDb connected Successfully");
});

// varify connection error
connection.on("error", (err) => {
  console.log("mongodb connection error", err);
});
