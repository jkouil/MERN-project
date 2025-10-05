// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/profils', require('./routes/profils'));
app.use('/motdepasse', require('./routes/password'));
app.use('/login', require('./routes/login'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(" Connected to MongoDB"))
.catch(err => console.error(" MongoDB connection error:", err));

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Serveur MERN prêt !' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
