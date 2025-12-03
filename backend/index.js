// index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001; // backend su questa porta

app.use(cors());
app.use(express.json());

// Endpoint di test
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
