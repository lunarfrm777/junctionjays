import express from "express";
import fetch from "node-fetch";
import { load } from "cheerio";

const app = express();

// Allow frontend to fetch
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/bluejays", async (req, res) => {
  console.log("BLUEJAYS ROUTE HIT");

  try {
    const response = await fetch(
      "https://api.allorigins.win/raw?url=https://www.mlb.com/bluejays/feeds/news/rss.xml",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const xml = await response.text();

    const $ = load(xml, { xmlMode: true });
    const items = $("item");
    const articles = [];

    items.each((i, el) => {
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      articles.push({ title, link, pubDate });
    });

    console.log("ARTICLES FOUND:", articles.length); // debug
    res.json(articles);
  } catch (err) {
    console.error("RSS FETCH ERROR:", err.message);
    res.status(500).json({ error: "RSS fetch failed" });
  }
});

app.listen(3000, () => console.log("Server listening on port 3000"));
