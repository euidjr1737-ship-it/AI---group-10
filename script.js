/* =========================================================
   ELEMENTS
========================================================= */

const archiveDay =
  document.getElementById("archiveDay");

const archiveDate =
  document.getElementById("archiveDate");

const archiveTitle =
  document.getElementById("archiveTitle");

const statusStamp =
  document.getElementById("statusStamp");

const videoContainer =
  document.getElementById("videoContainer");

const viewDetails =
  document.getElementById("viewDetails");

const dayGrid =
  document.getElementById("dayGrid");

const completedDays =
  document.getElementById("completedDays");

const transitionProgress =
  document.getElementById("transitionProgress");


/* DETAIL */

const detailOverlay =
  document.getElementById("detailOverlay");

const detailClose =
  document.getElementById("detailClose");

const detailDay =
  document.getElementById("detailDay");

const detailDate =
  document.getElementById("detailDate");

const detailDescription =
  document.getElementById("detailDescription");

const detailPrompt =
  document.getElementById("detailPrompt");

const detailNote =
  document.getElementById("detailNote");

const promptFile =
  document.getElementById("promptFile");

const promptFileName =
  document.getElementById("promptFileName");

const previousDay =
  document.getElementById("previousDay");

const nextDay =
  document.getElementById("nextDay");


/* =========================================================
   STATE

   가장 최근 업로드 DAY를 첫 화면에 보여줌.
   지금은 DAY 02.
========================================================= */

const uploadedDays =
  projectDays.filter(item => item.uploaded);

let currentDay =
  uploadedDays.length
    ? uploadedDays[uploadedDays.length - 1].day
    : 1;


/* =========================================================
   HELPERS
========================================================= */

function getDay(dayNumber) {

  return projectDays.find(
    item => item.day === dayNumber
  );

}


function formatDay(dayNumber) {

  return `DAY ${String(dayNumber).padStart(2, "0")}`;

}


/* =========================================================
   BUILD DAY BUTTONS
========================================================= */

function buildDayGrid() {

  dayGrid.innerHTML = "";

  projectDays.forEach(item => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "day-button";

    button.textContent =
      String(item.day).padStart(2, "0");


    if (item.uploaded) {

      button.classList.add(
        "available"
      );

    }


    if (item.day === currentDay) {

      button.classList.add(
        "active"
      );

    }


    button.addEventListener(
      "click",
      () => {

        currentDay = item.day;

        renderCurrentDay();

      }
    );


    dayGrid.appendChild(button);

  });

}


/* =========================================================
   VIDEO
========================================================= */

function renderVideo(data) {

  if (
    data.uploaded &&
    data.youtubeId
  ) {

    videoContainer.innerHTML = `

      <iframe
        src="https://www.youtube.com/embed/${data.youtubeId}"
        title="${formatDay(data.day)} video"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share
        "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>

    `;

    return;

  }


  videoContainer.innerHTML = `

    <div class="video-placeholder">

      <span>
        ${formatDay(data.day)}
      </span>

      <strong>
        ${
          data.uploaded
            ? "VIDEO COMING SOON"
            : "NO ARCHIVE YET"
        }
      </strong>

    </div>

  `;

}


/* =========================================================
   RENDER CURRENT DAY
========================================================= */

function renderCurrentDay() {

  const data =
    getDay(currentDay);

  if (!data) return;


  archiveDay.textContent =
    formatDay(data.day);


  archiveTitle.textContent =
    formatDay(data.day);


  archiveDate.textContent =
    data.date || "—";


  /* UPDATED STAMP */

  if (data.uploaded) {

    statusStamp.style.display =
      "inline-flex";

  } else {

    statusStamp.style.display =
      "none";

  }


  /* DETAILS */

  if (data.uploaded) {

    viewDetails.disabled = false;

    viewDetails.style.opacity = "1";

    viewDetails.style.cursor = "pointer";

  } else {

    viewDetails.disabled = true;

    viewDetails.style.opacity = "0.35";

    viewDetails.style.cursor = "default";

  }


  renderVideo(data);


  document
    .querySelectorAll(".day-button")
    .forEach((button, index) => {

      button.classList.toggle(
        "active",
        index + 1 === currentDay
      );

    });

}


/* =========================================================
   COMPLETED
========================================================= */

function renderCompletedCount() {

  const completed =
    projectDays.filter(
      item => item.uploaded
    ).length;


  const formatted =
    String(completed).padStart(2, "0");


  completedDays.textContent =
    formatted;


  transitionProgress.textContent =
    `${formatted} / 30`;

}


/* =========================================================
   DETAIL CONTENT
========================================================= */

function populateDetail(data) {

  detailDay.textContent =
    formatDay(data.day);


  detailDate.textContent =
    data.date || "—";


  detailDescription.textContent =
    data.description ||
    "아직 기록이 없습니다.";


  detailPrompt.textContent =
    data.prompt ||
    "아직 기록이 없습니다.";


  detailNote.textContent =
    data.note ||
    "아직 기록이 없습니다.";


  /* PDF */

  if (data.promptFile) {

    promptFile.style.display =
      "grid";

    promptFile.href =
      data.promptFile;

    promptFileName.textContent =
      data.promptFileName ||
      "PROMPT PDF";

  } else {

    promptFile.style.display =
      "none";

  }


  /* PREVIOUS AVAILABLE DAY */

  const previous =
    projectDays
      .filter(
        item =>
          item.uploaded &&
          item.day < data.day
      )
      .sort(
        (a, b) =>
          b.day - a.day
      )[0];


  /* NEXT AVAILABLE DAY */

  const next =
    projectDays
      .filter(
        item =>
          item.uploaded &&
          item.day > data.day
      )
      .sort(
        (a, b) =>
          a.day - b.day
      )[0];


  previousDay.disabled =
    !previous;


  nextDay.disabled =
    !next;

}


/* =========================================================
   OPEN DETAIL
========================================================= */

function openDetail() {

  const data =
    getDay(currentDay);

  if (
    !data ||
    !data.uploaded
  ) {
    return;
  }


  populateDetail(data);


  detailOverlay.classList.add(
    "open"
  );


  detailOverlay.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "detail-open"
  );

}


/* =========================================================
   CLOSE DETAIL
========================================================= */

function closeDetail() {

  detailOverlay.classList.remove(
    "open"
  );


  detailOverlay.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "detail-open"
  );

}


/* =========================================================
   EVENTS
========================================================= */

viewDetails.addEventListener(
  "click",
  openDetail
);


detailClose.addEventListener(
  "click",
  closeDetail
);


detailOverlay.addEventListener(
  "click",
  event => {

    if (
      event.target === detailOverlay
    ) {

      closeDetail();

    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeDetail();

    }

  }
);


/* =========================================================
   PREVIOUS DETAIL DAY
========================================================= */

previousDay.addEventListener(
  "click",
  () => {

    const previous =
      projectDays
        .filter(
          item =>
            item.uploaded &&
            item.day < currentDay
        )
        .sort(
          (a, b) =>
            b.day - a.day
        )[0];


    if (!previous) return;


    currentDay =
      previous.day;


    renderCurrentDay();

    populateDetail(previous);

  }
);


/* =========================================================
   NEXT DETAIL DAY
========================================================= */

nextDay.addEventListener(
  "click",
  () => {

    const next =
      projectDays
        .filter(
          item =>
            item.uploaded &&
            item.day > currentDay
        )
        .sort(
          (a, b) =>
            a.day - b.day
        )[0];


    if (!next) return;


    currentDay =
      next.day;


    renderCurrentDay();

    populateDetail(next);

  }
);


/* =========================================================
   INIT
========================================================= */

buildDayGrid();

renderCurrentDay();

renderCompletedCount();
