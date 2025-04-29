import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeFakeNews from "./fakenews.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST endpoint for analyzing news
app.post("/analyze", async (req, res) => {
  const { article } = req.body;

  if (!article || article.trim() === "") {
    return res.status(400).json({ error: "Article text is required" });
  }

  try {
    const result = await analyzeFakeNews(article);
    res.json(result);
  } catch (error) {
    console.error("Error analyzing article:", error.message);
    res
      .status(500)
      .json({ error: "Failed to analyze the article. Please try again." });
  }
});

app.post("/save", async (req, res) => {
  const { article, result } = req.body;

  if (!article || !result) {
    return res.status(400).json({ error: "Article and result are required" });
  }

  try {
    // Save to database logic here (e.g., MongoDB, PostgreSQL, etc.)
    console.log("Article saved:", { article, result });
    res.status(200).json({ message: "Article saved successfully" });
  } catch (error) {
    console.error("Error saving article:", error.message);
    res.status(500).json({ error: "Failed to save the article." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
