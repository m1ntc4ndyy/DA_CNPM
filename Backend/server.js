const express = require('express');
const dotenv = require('dotenv').config();
// const cors = require('cors');

const app = express();

// app.use(cors());
app.use(express.json());

// Routes

// Start server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});