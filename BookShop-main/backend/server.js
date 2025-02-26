const express = require("express");
const cors = require("cors");
require("dotenv").config();
const booksRoutes = require("./routes/booksRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", booksRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});