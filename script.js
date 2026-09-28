const dayGrid = document.getElementById("day-grid");

const dayNumber = document.getElementById("day-number");
const dayDate = document.getElementById("day-date");
const dayTitle = document.getElementById("day-title");

const imageBox = document.getElementById("image-box");
const videoBox = document.getElementById("video-box");

const currentCount = document.getElementById("current-count");

const imageDayLabel = document.getElementById("image-day-label");
const videoDayLabel = document.getElementById("video-day-label");


function pad(number) {
  return String(number).padStart(2, "0");
}


function getYoutubeID(url) {

  if (!url) return null;

  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?.*v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/
  ];

  for (const pattern of patterns) {

    const match = url.match(pattern);

    if (match) {
      return match[1];
    }

  }

  return null;
}


function hasContent(day) {

  return Boolean(
    day.image ||
    day.video ||
    day.title ||
    day.date
  );

}


function createDayNavigation() {

  DAYS.forEach(day => {

    const button = document.createElement("button");

    button.className = "day-button";

    button.textContent = pad(day.day);

    button.dataset.day = day.day;


    if (hasContent(day)) {
      button.classList.add("available");
    }


    button.addEventListener("click", () => {

      showDay(day.day);

      history.replaceState(
        null,
        "",
        `#day-${pad(day.day)}`
      );

      window.scrollTo({
        top: document.querySelector(".featured").offsetTop - 70,
        behavior: "smooth"
      });

    });


    dayGrid.appendChild(button);

  });

}


function showDay(number) {

  const day = DAYS.find(
    item => item.day === number
  );

  if (!day) return;


  /* ACTIVE BUTTON */

  document
    .querySelectorAll(".day-button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        Number(button.dataset.day) === number
      );

    });


  /* TEXT */

  const formatted = pad(number);

  dayNumber.textContent =
    `DAY ${formatted}`;

  currentCount.textContent =
    formatted;

  imageDayLabel.textContent =
    `DAY ${formatted}`;

  videoDayLabel.textContent =
    `DAY ${formatted}`;


  dayDate.textContent =
    day.date || "COMING SOON";

  dayTitle.textContent =
    day.title || "작업 기록 준비 중";


  /* IMAGE */

  if (day.image) {

    imageBox.innerHTML = `
      <img
        src="${day.image}"
        alt="DAY ${formatted} 작업 이미지"
      >
    `;

  }

  else {

    imageBox.innerHTML = `
      <div class="empty">
        <span>${formatted}</span>
        <p>IMAGE COMING SOON</p>
      </div>
    `;

  }


  /* VIDEO */

  const youtubeID =
    getYoutubeID(day.video);


  if (youtubeID) {

    videoBox.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${youtubeID}"
        title="DAY ${formatted} VIDEO"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;

  }

  else {

    videoBox.innerHTML = `
      <div class="empty dark">
        <span>${formatted}</span>
        <p>VIDEO COMING SOON</p>
      </div>
    `;

  }

}


function getInitialDay() {

  const match =
    location.hash.match(/day-(\d+)/);

  if (match) {

    const number =
      Number(match[1]);

    if (
      number >= 1 &&
      number <= 30
    ) {
      return number;
    }

  }


  const completed =
    DAYS.filter(hasContent);


  if (completed.length) {
    return completed[completed.length - 1].day;
  }


  return 1;
}


createDayNavigation();

showDay(
  getInitialDay()
);
