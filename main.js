const API_KEY = `64f0c14fe2784788a7f198570da11916`;
let news = [];

const getLatestNews = async () => {
  const url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    `https://curious-piroshki-943f87.netlify.app/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}$apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;
  console.log("ddd", news);
};

getLatestNews();
