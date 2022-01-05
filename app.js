const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const { resolve } = require("path");
const PORT = process.env.PORT || 5000;

// keys file
const { MONGOURI } = require("./config/keys");

// database connection
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error: ", err);
});

// models
require("./models/User");
require("./models/Post");

// middleware for json data
app.use(express.json());

// routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
