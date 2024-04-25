const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI;
console.log(DB_URI)

// Middleware to parse URL-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Importing routes
const user = require("./api/userAuthntication");
const campaign = require('./api/campaign');

// Using Routes
app.use('/api/users', user);
app.use('/api/campaign',campaign);


// Coonect DataBase
mongoose.connect(DB_URI).then((data)=>{
    console.log(`Mongodb connected with server:${data.connection.host}`);
})
// Start Server (Listen)
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});
