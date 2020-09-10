const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => {
  res.send('API Running');
});

// Init Middleware Body-parse
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users')); // Register
app.use('/api/auth', require('./routes/api/auth')); // Login & get user which is logined
app.use('/api/profile', require('./routes/api/profile')); // Post, put, del profile
app.use('/api/posts', require('./routes/api/posts')); // Comment

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
