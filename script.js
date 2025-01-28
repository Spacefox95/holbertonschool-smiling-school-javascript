async function Search(keyword) {
  const loader = document.getElementById("quotes-loader");
  const carousel = document.getElementById("carousel-videos");

  loader.classList.remove("d-none");

  try {
    const response = await fetch("https://smileschool-api.hbtn.info/courses");
    const data = await response.json();

    const selectedTopic = document
      .getElementById("topicLabel")
      .textContent.toLowerCase();
    const selectedSort = document
      .getElementById("sortByLabel")
      .textContent.toLowerCase()
      .replace(/ /g, "_");

    const filteredData = filterResults(
      data,
      keyword,
      selectedTopic,
      selectedSort
    );
    displayResults(filteredData);

    loader.classList.add("d-none");
  } catch (error) {
    console.error("Error fetching data:", error);
    loader.classList.add("d-none");
    carousel.innerHTML =
      "<p class='text-white'>Failed to load data. Please try again later.</p>";
  }
}

function filterResults(
  data,
  keyword,
  selectedTopic = "all",
  selectedSort = "most_popular"
) {
  const lowerCaseKeyword = keyword.toLowerCase();

  const filteredTopics = data.topics.filter((topic) =>
    topic.toLowerCase().includes(lowerCaseKeyword)
  );

  const filteredSorts = data.sorts.filter((sort) =>
    sort.toLowerCase().includes(lowerCaseKeyword)
  );

  const filteredCourses = data.courses
    .filter((course) =>
      course.keywords.some((kw) => kw.toLowerCase().includes(lowerCaseKeyword))
    )
    .filter((course) =>
      selectedTopic === "all"
        ? true
        : course.topic.toLowerCase() === selectedTopic.toLowerCase()
    )
    .sort((a, b) => {
      if (selectedSort === "most_popular") {
        return b.views - a.views;
      } else if (selectedSort === "most_recent") {
        return b.published_at - a.published_at;
      } else if (selectedSort === "most_viewed") {
        return b.views - a.views;
      }
      return 0;
    });

  return {
    topics: filteredTopics,
    sorts: filteredSorts,
    courses: filteredCourses,
  };
}

function displayResults(filteredData) {
  const carouselInner = document.getElementById("carousel-videos");
  const videoCount = document.querySelector(".video-count");
  carouselInner.innerHTML = "";

  videoCount.textContent = `${filteredData.courses.length} video${
    filteredData.courses.length !== 1 ? "s" : ""
  }`;

  if (filteredData.courses.length === 0) {
    carouselInner.innerHTML =
      "<p class='text-white'>No courses found matching your search criteria.</p>";
    return;
  }

  filteredData.courses.forEach((course) => {
    const cardHTML = createVideoCard(course);
    carouselInner.innerHTML += cardHTML;
  });
}

async function fetchDropdownData() {
  try {
    const response = await fetch("https://smileschool-api.hbtn.info/courses");
    const data = await response.json();

    const topics = data.topics;
    const sorts = data.sorts;

    const topicDropdown = document.getElementById("dropdown-menu-topic");
    const topicLabel = document.getElementById("topicLabel");
    topicLabel.textContent = "All";

    topicDropdown.innerHTML = "";

    topics.forEach((topic) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
      dropdownItem.addEventListener("click", () => {
        topicLabel.textContent = dropdownItem.textContent;
      });
      topicDropdown.appendChild(dropdownItem);
    });

    const sortDropdown = document.getElementById("dropdown-menu-sort");
    const sortByLabel = document.getElementById("sortByLabel");
    sortByLabel.textContent = "Most popular";

    sortDropdown.innerHTML = "";

    sorts.forEach((sort) => {
      const dropdownItem = document.createElement("a");
      dropdownItem.classList.add("dropdown-item");
      dropdownItem.href = "#";
      dropdownItem.textContent =
        sort.charAt(0).toUpperCase() + sort.slice(1).replace(/_/g, " ");
      dropdownItem.addEventListener("click", () => {
        sortByLabel.textContent = dropdownItem.textContent;
      });
      sortDropdown.appendChild(dropdownItem);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createVideoCard(video) {
  return `
  <div class="col-12 col-sm-6 col-md-3 d-flex justify-content-center">
      <div class="card video-card">
          <img src="${
            video.thumb_url
          }" class="card-img-top" alt="Video thumbnail" />
          <div class="card-img-overlay text-center">
              <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
          </div>
          <div class="card-body">
              <h5 class="card-title font-weight-bold">${video.title}</h5>
              <p class="card-text text-muted">${video["sub-title"]}</p>
              <div class="creator d-flex align-items-center">
                  <img src="${
                    video.author_pic_url
                  }" alt="Creator" width="30px" class="rounded-circle" />
                  <h6 class="pl-3 m-0">${video.author}</h6>
              </div>
              <div class="info pt-3 d-flex justify-content-between">
                  <div class="rating">
                      ${[...Array(video.star)]
                        .map(
                          () =>
                            `<img src="images/star_on.png" alt="star on" width="15px" />`
                        )
                        .join("")}
                      ${[...Array(5 - video.star)]
                        .map(
                          () =>
                            `<img src="images/star_off.png" alt="star off" width="15px" />`
                        )
                        .join("")}
                  </div>
                  <span>${video.duration}</span>
              </div>
          </div>
      </div>
  </div>
`;
}

function addQuotes() {
  const loader = document.getElementById("quotes-loader");
  const carousel = document.getElementById("carouselExampleControls");
  const carouselInner = document.getElementById("carousel-quotes");

  loader.classList.remove("d-none");

  fetch("https://smileschool-api.hbtn.info/quotes")
    .then((response) => response.json())
    .then((quotes) => {
      quotes.forEach((quote, index) => {
        const activeClass = index === 0 ? "active" : "";

        const carouselItem = `
          <div class="carousel-item ${activeClass}">
            <div class="row mx-auto align-items-center">
              <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                <img src="${quote.pic_url}" class="d-block align-self-center rounded-circle" alt="${quote.name}" />
              </div>
              <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                <div class="quote-text">
                  <p class="text-white">« ${quote.text}</p>
                  <h4 class="text-white font-weight-bold">${quote.name}</h4>
                  <span class="text-white">${quote.title}</span>
                </div>
              </div>
            </div>
          </div>`;
        carouselInner.insertAdjacentHTML("beforeend", carouselItem);
      });

      loader.classList.add("d-none");
      carousel.classList.remove("d-none");
    })
    .catch((error) => {
      console.error("Error fetching quotes:", error);
      loader.innerHTML =
        "<p class='text-white'>Failed to load quotes. Please try again later.</p>";
    });
}

function addVideos() {
  const loader = document.getElementById("loader-videos");
  const carousel = document.getElementById("carouselExampleControls2");
  const carouselInner = document.getElementById("carousel-videos");

  loader.classList.remove("d-none");

  fetch("https://smileschool-api.hbtn.info/popular-tutorials")
    .then((response) => response.json())
    .then((data) => {
      const cardsPerSlide = 4;
      let slideContent = "";

      data.forEach((video, index) => {
        const cardHTML = createVideoCard(video);

        if (index % cardsPerSlide === 0) {
          if (index > 0) {
            slideContent += "</div></div>";
          }
          slideContent += `<div class="carousel-item ${
            index === 0 ? "active" : ""
          }">
									<div class="row">`;
        }
        slideContent += cardHTML;
        if (index === data.length - 1) {
          slideContent += "</div></div>";
        }
      });

      carouselInner.innerHTML = slideContent;

      loader.classList.add("d-none");
      carousel.classList.remove("d-none");
    })
    .catch((error) => {
      console.error("Error fetching videos", error);
      loader.innerHTML =
        "<p class='text-white'>Failed to load videos. Please try again later.</p>";
    });
}

function createItem(cardsHTML, index) {
  return `
	<div class="carousel-item ${index === 0 ? "active" : ""}">
		${cardsHTML}
		</div>
		`;
}

function addLatestVideo() {
  const loader = document.getElementById("loader-latestvideos");
  const carousel = document.getElementById("carouselExampleControls3");
  const carouselInner = document.getElementById("carousel-latestvideos");

  loader.classList.remove("d-none");

  fetch("https://smileschool-api.hbtn.info/latest-videos")
    .then((response) => response.json())
    .then((data) => {
      const cardsPerSlide = 4;
      let slideContent = "";

      data.forEach((video, index) => {
        const cardHTML = createVideoCard(video);
        if (index % cardsPerSlide === 0) {
          if (index > 0) {
            slideContent += "</div></div>";
          }
          slideContent += `<div class="carousel-item ${
            index === 0 ? "active" : ""
          }">
									<div class="row">`;
        }
        slideContent += cardHTML;
        if (index === data.length - 1) {
          slideContent += "</div></div>";
        }
      });

      carouselInner.innerHTML = slideContent;

      loader.classList.add("d-none");
      carousel.classList.remove("d-none");
    })
    .catch((error) => {
      console.error("Error fetching videos", error);
      loader.innerHTML =
        "<p class='text-white'>Failed to load videos. Please try again later.</p>";
    });
}
