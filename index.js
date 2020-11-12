require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log("Server is running on " + PORT));
app.use(express.json());

mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to DB :)");
});

require("./models/user");
require("./models/post");
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
