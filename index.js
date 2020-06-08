require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 1234 || process.env.PORT;
app.listen(PORT, () => console.log("Server is running on " + PORT));
app.use(express.json());

mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log("Connected to DB :)");
})
mongoose.connection.on('error', (err) => {
    console.log("Error connecting to DB :(", err);
})
require('./models/user');
require('./models/post');
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
