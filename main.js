const API_KEY = `64f0c14fe2784788a7f198570da11916`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const toggleBtn = document.querySelector(".menu__togleBtn");
const menu_bar = document.querySelector(".menu-bar");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

toggleBtn.addEventListener("click", () => {
  menu_bar.classList.toggle("active");
});

const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}&page=2`
    // `https://curious-piroshki-943f87.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category", category);
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("ddd", data);
  newsList = data.articles;
  render();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("input-area").value;
  console.log("keyword", keyword);
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );

  const response = await fetch(url);
  const data = await response.json();
  console.log("keyword data", data);

  newsList = data.articles;
  render();
};

const render = () => {
  // Clear existing content
  document.querySelector(".first-part .row").innerHTML = "";
  document.getElementById("second-part").innerHTML = "";
  document.querySelector(".third-part .row").innerHTML = "";

  if (newsList.length > 0) {
    // 첫 번째 섹션에 첫 번째 뉴스 데이터 반영
    renderFirstSection(newsList[0]);

    // 마지막 섹션에 마지막 두 개의 뉴스 데이터 반영, 뉴스 리스트가 3개 이상일 때만
    if (newsList.length > 3) {
      renderLastSection(newsList.slice(-3));
    }

    // 두 번째 섹션에 나머지 뉴스 데이터 반영
    if (newsList.length > 4) {
      renderMiddleSection(newsList.slice(1, -3));
    } else if (newsList.length === 2) {
      // 뉴스 리스트가 정확히 2개인 경우, 첫 번째는 이미 처리됐으므로 두 번째 섹션은 비워둠
      renderMiddleSection(newsList.slice(1));
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

const toggleSearchBox = () => {
  const searchBox = document.querySelector(".search-box");
  const searchInput = document.getElementById("search-input");

  searchBox.classList.toggle("active");

  // Toggle the input's display based on the search box's active class
  if (searchBox.classList.contains("active")) {
    searchInput.style.display = "inline-block";
    searchInput.focus(); // Automatically focus on the input when it becomes visible
    getNewsByKeyword(); // Trigger the search when the box is activated
  } else {
    searchInput.style.display = "none";
  }
};
getLatestNews();
