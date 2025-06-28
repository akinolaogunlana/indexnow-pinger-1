const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const INDEXNOW_KEY = "9b1fb73319b04fb3abb5ed09be53d65e";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20
});
app.use("/ping", limiter);

app.post("/ping", async (req, res) => {
  const url = req.body.url;
  if (!url || !/^https?:\/\/.+\..+/.test(url)) {
    return res.status(400).json({ error: "Invalid or missing 'url'" });
  }

  try {
    const pingUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`;
    await axios.get(pingUrl);
    console.log("✅ Pinged:", url);
    res.status(200).json({ success: true, pinged: url });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ IndexNow Pinger is active.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
