const API_KEY = `64f0c14fe2784788a7f198570da11916`;
let newsList = [];

const getLatestNews = async () => {
  const url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    `https://curious-piroshki-943f87.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const render = () => {
  if (newsList.length > 0) {
    // 첫 번째 섹션에 첫 번째 뉴스 데이터 반영
    renderFirstSection(newsList[0]);

    // 마지막 섹션에 마지막 두 개의 뉴스 데이터 반영, 뉴스 리스트가 3개 이상일 때만
    if (newsList.length > 3) {
      renderLastSection(newsList.slice(-3));
    }

    // 두 번째 섹션에 나머지 뉴스 데이터 반영
    if (newsList.length > 3) {
      renderMiddleSection(newsList.slice(1, -2));
    } else if (newsList.length === 2) {
      // 뉴스 리스트가 정확히 2개인 경우, 첫 번째는 이미 처리됐으므로 두 번째 섹션은 비워둠
      document.getElementById("second-part").innerHTML = "";
    }
  }
};

const renderFirstSection = (firstNews) => {
  document.querySelector(".first-part .row").innerHTML = `
    <div class="col-lg-6">
      <img
        class="news-img-size"
        src="${firstNews.urlToImage}"
        alt=""
      />
    </div>
    <div class="col-lg-6 content-area">
      <div class="news-title">${firstNews.title}</div>
      <div class="news-content">${firstNews.description}</div>
      <div class="news-date">${firstNews.publishedAt}</div>
    </div>
  `;
};

const renderMiddleSection = (newsItems) => {
  const secondNewsHTML = newsItems
    .map(
      (news) => `
    <div class="col-lg-4">
      <div class="card border-0">
        <img src="${
          news.urlToImage
        }" alt="image/no image.jpg" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${news.title}</h5>
          <p class="card-text-date">${news.publishedAt}</p>
          <div class="card-text">${news.description || ""}</div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
  document.getElementById(
    "second-part"
  ).innerHTML = `<div class="row">${secondNewsHTML}</div>`;
};

const renderLastSection = (lastNewsItems) => {
  const thirdNewsHTML = lastNewsItems
    .map(
      (news) => `
    <div class="col-lg-6">
      <div class="card border-0">
        <div class="card-body">
          <h5 class="card-title">${news.title}</h5>
          <p class="card-text-date">${news.publishedAt}</p>
          <p class="card-text">${news.description || ""}</p>
        </div>
      </div>
    </div>
  `
    )
    .join("");
  document.querySelector(".third-part .row").innerHTML = thirdNewsHTML;
};

getLatestNews();
