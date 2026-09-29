/* =========================================================
   ELEMENTS
========================================================= */

const daySelector =
  document.getElementById("daySelector");

const dayNumber =
  document.getElementById("dayNumber");

const dayDate =
  document.getElementById("dayDate");

const dayTitle =
  document.getElementById("dayTitle");

const uploadedBadge =
  document.getElementById("uploadedBadge");

const videoContainer =
  document.getElementById("videoContainer");

const completedCount =
  document.getElementById("completedCount");


const detailsButton =
  document.getElementById("detailsButton");

const detailsOverlay =
  document.getElementById("detailsOverlay");

const closeDetails =
  document.getElementById("closeDetails");


const detailDay =
  document.getElementById("detailDay");

const detailTitle =
  document.getElementById("detailTitle");

const detailDescription =
  document.getElementById("detailDescription");

const detailPrompt =
  document.getElementById("detailPrompt");

const detailNote =
  document.getElementById("detailNote");

const promptFile =
  document.getElementById("promptFile");


const detailPrev =
  document.getElementById("detailPrev");

const detailNext =
  document.getElementById("detailNext");



/* =========================================================
   STATE
========================================================= */

let currentDay = 1;



/* =========================================================
   DAY SELECTOR
========================================================= */

function buildDaySelector() {

  daySelector.innerHTML = "";

  projectDays.forEach(item => {

    const button =
      document.createElement("button");

    button.className = "day-button";

    button.textContent =
      String(item.day).padStart(2, "0");

    if (item.uploaded) {
      button.classList.add("available");
    }

    if (item.day === currentDay) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {

      currentDay = item.day;

      renderDay(currentDay);

    });

    daySelector.appendChild(button);

  });

}



/* =========================================================
   RENDER CURRENT DAY
========================================================= */

function renderDay(day) {

  const data =
    projectDays.find(item => item.day === day);

  if (!data) return;


  /* HEADER */

  dayNumber.textContent =
    `DAY ${String(data.day).padStart(2, "0")}`;


  dayDate.textContent =
    data.date || "—";


  dayTitle.textContent =
    data.uploaded
      ? data.title
      : `DAY ${String(data.day).padStart(2, "0")}`;


  /* UPLOADED */

  uploadedBadge.style.display =
    data.uploaded
      ? "inline-flex"
      : "none";


  /* VIDEO */

  renderVideo(data);


  /* DETAIL BUTTON */

  if (data.uploaded) {

    detailsButton.disabled = false;

    detailsButton.style.opacity = "1";

    detailsButton.style.cursor = "pointer";

  } else {

    detailsButton.disabled = true;

    detailsButton.style.opacity = "0.35";

    detailsButton.style.cursor = "default";

  }


  /* SELECTOR */

  document
    .querySelectorAll(".day-button")
    .forEach((button, index) => {

      button.classList.toggle(
        "active",
        index + 1 === day
      );

    });


  updateDetails(data);

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
        title="DAY ${String(data.day).padStart(2, "0")} VIDEO"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share
        "
        allowfullscreen>
      </iframe>
    `;

  } else {

    videoContainer.innerHTML = `

      <div class="video-placeholder">

        <span>
          DAY ${String(data.day).padStart(2, "0")}
        </span>

        <p>
          ${
            data.uploaded
              ? "VIDEO COMING SOON"
              : "NO ARCHIVE YET"
          }
        </p>

      </div>

    `;

  }

}



/* =========================================================
   DETAILS
========================================================= */

function updateDetails(data) {

  detailDay.textContent =
    `DAY ${String(data.day).padStart(2, "0")}`;


  detailTitle.textContent =
    data.title || `Day ${data.day}`;


  detailDescription.textContent =
    data.description ||
    "아직 기록이 없습니다.";


  detailPrompt.textContent =
    data.prompt ||
    "아직 기록이 없습니다.";


  detailNote.textContent =
    data.note ||
    "아직 기록이 없습니다.";


  /* PROMPT FILE */

  if (data.promptFile) {

    promptFile.style.display = "grid";

    promptFile.href =
      data.promptFile;

  } else {

    promptFile.style.display = "none";

  }


  /* PREVIOUS */

  detailPrev.disabled =
    data.day <= 1;


  detailPrev.style.opacity =
    data.day <= 1
      ? "0.25"
      : "1";


  /* NEXT */

  const next =
    projectDays.find(
      item =>
        item.day === data.day + 1 &&
        item.uploaded
    );


  detailNext.disabled =
    !next;


  detailNext.style.opacity =
    next
      ? "1"
      : "0.25";

}



/* =========================================================
   OPEN DETAILS
========================================================= */

detailsButton.addEventListener(
  "click",
  () => {

    const data =
      projectDays.find(
        item => item.day === currentDay
      );

    if (!data || !data.uploaded) {
      return;
    }

    updateDetails(data);

    detailsOverlay.classList.add("open");

    detailsOverlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

  }
);



/* =========================================================
   CLOSE DETAILS
========================================================= */

function closePanel() {

  detailsOverlay.classList.remove("open");

  detailsOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


closeDetails.addEventListener(
  "click",
  closePanel
);


detailsOverlay.addEventListener(
  "click",
  event => {

    if (
      event.target === detailsOverlay
    ) {

      closePanel();

    }

  }
);



/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closePanel();

    }

  }
);



/* =========================================================
   PREVIOUS DAY
========================================================= */

detailPrev.addEventListener(
  "click",
  () => {

    const previous =
      projectDays
        .filter(
          item =>
            item.day < currentDay &&
            item.uploaded
        )
        .sort(
          (a, b) =>
            b.day - a.day
        )[0];


    if (!previous) return;


    currentDay =
      previous.day;


    renderDay(currentDay);

    updateDetails(previous);

  }
);



/* =========================================================
   NEXT DAY
========================================================= */

detailNext.addEventListener(
  "click",
  () => {

    const next =
      projectDays
        .filter(
          item =>
            item.day > currentDay &&
            item.uploaded
        )
        .sort(
          (a, b) =>
            a.day - b.day
        )[0];


    if (!next) return;


    currentDay =
      next.day;


    renderDay(currentDay);

    updateDetails(next);

  }
);



/* =========================================================
   COMPLETED COUNT
========================================================= */

function updateCompletedCount() {

  const count =
    projectDays.filter(
      item => item.uploaded
    ).length;


  completedCount.textContent =
    String(count).padStart(2, "0");

}



/* =========================================================
   INITIALIZE
========================================================= */

buildDaySelector();

renderDay(currentDay);

updateCompletedCount();
