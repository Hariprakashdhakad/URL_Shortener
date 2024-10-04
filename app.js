const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
