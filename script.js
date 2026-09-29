/* ==========================================
   ELEMENTS
   ========================================== */

const archivePage = document.getElementById("archive-page");
const detailPage = document.getElementById("detail-page");

const dayGrid = document.getElementById("day-grid");

const dayNumber = document.getElementById("day-number");
const dayDate = document.getElementById("day-date");

const imageBox = document.getElementById("image-box");
const videoBox = document.getElementById("video-box");

const currentCount = document.getElementById("current-count");

const imageDayLabel = document.getElementById("image-day-label");
const videoDayLabel = document.getElementById("video-day-label");

const detailsButton = document.getElementById("details-button");
const detailsCardNumber = document.querySelector(".details-card-number");

const backButton = document.getElementById("back-button");

const detailDate = document.getElementById("detail-date");
const detailDay = document.getElementById("detail-day");
const detailTitle = document.getElementById("detail-title");

const detailDescription = document.getElementById("detail-description");
const detailPrompt = document.getElementById("detail-prompt");
const detailNote = document.getElementById("detail-note");

const copyButton = document.getElementById("copy-button");

const detailPrev = document.getElementById("detail-prev");
const detailNext = document.getElementById("detail-next");


let selectedDay = 1;



/* ==========================================
   HELPERS
   ========================================== */

function pad(number) {

  return String(number).padStart(2, "0");

}


function getDay(number) {

  return DAYS.find(
    item => item.day === number
  );

}


function hasContent(day) {

  if (!day) return false;

  return Boolean(
    day.title ||
    day.date ||
    day.image ||
    day.video
  );

}



/* ==========================================
   YOUTUBE
   ========================================== */

function getYoutubeID(url) {

  if (!url) {
    return null;
  }


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



/* ==========================================
   CREATE DAY 01 ~ 30
   ========================================== */

function createDayNavigation() {

  dayGrid.innerHTML = "";


  DAYS.forEach(day => {

    const button =
      document.createElement("button");


    button.type = "button";

    button.className = "day-button";

    button.textContent = pad(day.day);

    button.dataset.day = day.day;


    if (hasContent(day)) {

      button.classList.add(
        "available"
      );

    }


    button.addEventListener(
      "click",
      () => {

        showArchiveDay(day.day);


        history.replaceState(
          null,
          "",
          `#day-${pad(day.day)}`
        );


        document
          .querySelector(".featured")
          .scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

      }
    );


    dayGrid.appendChild(button);

  });

}



/* ==========================================
   SHOW DAY ON MAIN ARCHIVE
   ========================================== */

function showArchiveDay(number) {

  const day = getDay(number);


  if (!day) {
    return;
  }


  selectedDay = number;


  const formatted = pad(number);



  /* ACTIVE DAY */

  document
    .querySelectorAll(".day-button")
    .forEach(button => {

      const active =
        Number(button.dataset.day) === number;


      button.classList.toggle(
        "active",
        active
      );

    });



  /* TEXT */

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


  detailsCardNumber.textContent =
    formatted;



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

        <span>
          ${formatted}
        </span>

        <p>
          IMAGE COMING SOON
        </p>

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

        <span>
          ${formatted}
        </span>

        <p>
          VIDEO COMING SOON
        </p>

      </div>

    `;

  }

}



/* ==========================================
   OPEN DETAIL PAGE
   ========================================== */

function openDetails(number) {

  const day = getDay(number);


  if (!day) {
    return;
  }


  selectedDay = number;


  const formatted = pad(number);


  archivePage.classList.add(
    "hidden"
  );


  detailPage.classList.remove(
    "hidden"
  );


  detailDate.textContent =
    day.date || "COMING SOON";


  detailDay.textContent =
    `DAY ${formatted}`;


  detailTitle.textContent =
    day.title || "작업 기록";


  detailDescription.textContent =
    day.description ||
    "아직 DESCRIPTION이 작성되지 않았습니다.";


  detailPrompt.textContent =
    day.prompt ||
    "아직 PROMPT가 작성되지 않았습니다.";


  detailNote.textContent =
    day.note ||
    "아직 NOTE가 작성되지 않았습니다.";



  detailPrev.disabled =
    number <= 1;


  detailNext.disabled =
    number >= 30;


  history.replaceState(
    null,
    "",
    `#day-${formatted}/details`
  );


  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

}



/* ==========================================
   CLOSE DETAILS
   ========================================== */

function closeDetails() {

  detailPage.classList.add(
    "hidden"
  );


  archivePage.classList.remove(
    "hidden"
  );


  history.replaceState(
    null,
    "",
    `#day-${pad(selectedDay)}`
  );


  showArchiveDay(
    selectedDay
  );


  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

}



/* ==========================================
   BUTTON EVENTS
   ========================================== */

detailsButton.addEventListener(
  "click",
  () => {

    openDetails(
      selectedDay
    );

  }
);


backButton.addEventListener(
  "click",
  () => {

    closeDetails();

  }
);



/* ==========================================
   COPY PROMPT
   ========================================== */

copyButton.addEventListener(
  "click",
  async () => {

    const day =
      getDay(selectedDay);


    if (!day || !day.prompt) {

      copyButton.textContent =
        "NO PROMPT";


      setTimeout(
        () => {

          copyButton.textContent =
            "COPY PROMPT";

        },
        1200
      );


      return;

    }


    try {

      await navigator.clipboard.writeText(
        day.prompt
      );


      copyButton.textContent =
        "COPIED ✓";


      setTimeout(
        () => {

          copyButton.textContent =
            "COPY PROMPT";

        },
        1500
      );

    }

    catch (error) {

      copyButton.textContent =
        "COPY FAILED";


      setTimeout(
        () => {

          copyButton.textContent =
            "COPY PROMPT";

        },
        1500
      );

    }

  }
);



/* ==========================================
   DETAIL PREVIOUS / NEXT
   ========================================== */

detailPrev.addEventListener(
  "click",
  () => {

    if (selectedDay > 1) {

      openDetails(
        selectedDay - 1
      );

    }

  }
);


detailNext.addEventListener(
  "click",
  () => {

    if (selectedDay < 30) {

      openDetails(
        selectedDay + 1
      );

    }

  }
);



/* ==========================================
   INITIAL ROUTE
   ========================================== */

function startSite() {

  createDayNavigation();


  const hash = location.hash;


  const match =
    hash.match(/day-(\d+)/);


  let initialDay = 1;


  if (match) {

    const number =
      Number(match[1]);


    if (
      number >= 1 &&
      number <= 30
    ) {

      initialDay = number;

    }

  }

  else {

    const completed =
      DAYS.filter(hasContent);


    if (completed.length) {

      initialDay =
        completed[
          completed.length - 1
        ].day;

    }

  }


  showArchiveDay(
    initialDay
  );


  if (
    hash.includes("/details")
  ) {

    openDetails(
      initialDay
    );

  }

}


startSite();
