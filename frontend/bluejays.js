let cachedArticles = []; // keeps the last successful fetch

function renderArticles(articles) {
  const ul = document.getElementById("news");
  ul.innerHTML = "";

  if (!articles.length) {
    ul.innerHTML = "<li>No articles available right now.</li>";
    return;
  }

  articles.forEach(article => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${article.link}" target="_blank">${article.title}</a>
      <div class="date">${new Date(article.pubDate).toLocaleString()}</div>
    `;
    ul.appendChild(li);
  });
}

async function fetchBlueJaysNews() {
  const ul = document.getElementById("news");
  ul.innerHTML = "Loading...";

  try {
    const res = await fetch("http://localhost:3000/api/bluejays");
    const articles = await res.json();

    if (articles.length > 0) {
      cachedArticles = articles;      // store latest successful fetch
      renderArticles(articles);       // render live articles
    } else if (cachedArticles.length > 0) {
      renderArticles(cachedArticles); // fallback to cached
    } else {
      renderArticles([]);             // truly empty
    }
  } catch (err) {
    console.error(err);
    // fallback to cached articles if fetch fails
    if (cachedArticles.length > 0) {
      renderArticles(cachedArticles);
    } else {
      ul.innerHTML = "<li>Failed to load news.</li>";
    }
  }
}
// Run once on load
window.addEventListener("DOMContentLoaded", fetchBlueJaysNews);

// Refresh every 10 minutes
setInterval(fetchBlueJaysNews, 10 * 60 * 1000);
