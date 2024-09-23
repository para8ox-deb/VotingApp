

const mongoose = require('mongoose');

require('dotenv').config();

// Define the MongoDB connection URL

//Below is for Local db connection
const mongoURL = process.env.MONGODB_URL_LOCAL; // Replace 'hotels' with your db name

// Below connection is of MongoDB Atlast
//const mongoURL = process.env.MONGODB_URL;

// Set up MongoDB connection

mongoose.connect(mongoURL, {
    // useNewUrlParse:true,    - This one is not supported in new mongodb
    // useUnifiedTopology: true
})



// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection

const db = mongoose.connection;


// Define event Listeners for database connection

db.on('connected', ()=>{
    console.log('Connected to MongoDB server');
})

db.on('error', (err)=>{
    console.log('MongoDB connection error', err);
})

db.on('disconnected', ()=>{
    console.log('MongoDB disconnected');
})


// Export the database connection

module.exports = db;









