const express = require('express');
const compression = require('compression');

const app = express();

// Middleware to parse JSON bodies 
app.use(express.json());
// Enable gzip/deflate compression for faster responses
app.use(compression()); 

// setup routes
app.use('/api/employees', require('./routes/api/employees')); 



const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));