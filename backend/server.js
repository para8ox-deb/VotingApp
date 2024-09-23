
// creating server
const express = require('express')
const app = express();
const db = require('./db');

require('dotenv').config();

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());


// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

//use the Router
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);




app.listen(PORT, ()=>{
    console.log('Listening to port 3000');
    
})

