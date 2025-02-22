const express = require("express");
const app = express();
const port = 3000;

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello from the Node.js backend!");
});

// Start the server
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
