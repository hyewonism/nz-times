const API_KEY = `64f0c14fe2784788a7f198570da11916`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const toggleBtn = document.querySelector(".menu__toggleBtn");
const menu_bar = document.querySelector(".menu-bar");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

toggleBtn.addEventListener("click", () => {
  menu_bar.classList.toggle("active");
});

let url = new URL(
  // `https://newsapi.org/v2/top-headlines?country=nz&apiKey=${API_KEY}`
  `https://curious-piroshki-943f87.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // => &page=page
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);

    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=nz&apiKey=${API_KEY}`
    `https://curious-piroshki-943f87.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=nz&category=${category}&apiKey=${API_KEY}`
    `https://curious-piroshki-943f87.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("input-area").value;
  url = new URL(
    // `https://newsapi.org/v2/top-headlines?country=nz&q=${keyword}&apiKey=${API_KEY}`
    `https://curious-piroshki-943f87.netlify.app/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );

  getNews();
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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
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

const paginationRender = () => {
  //totalResult
  //page
  //pageSize
  //groupSize
  //totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  //pageGroup
  const pageGroup = Math.ceil(page / groupSize);

  //lastPage
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  //firstPage
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = `<li class="page-item" onclick="moveToPage(${page - 1})">
  <a class="page-link" href="#" style="color:black;">
 &lt;
  </a>
  </li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})">
    <a class="page-link" style="color: black; ${
      i === page ? "background-color:#ecad0dd8; border: none;" : ""
    }">${i}</a>
  </li>`;
  }

  paginationHTML += `<li class="page-item" onclick="moveToPage(${
    page + 1
  })"><a class="page-link" href="#" style="color:black;">
   &gt;
  </a>
  </li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};
getLatestNews();
