const $ = (s) => document.querySelector(s);

const TOTAL = 30;

const pad = (n) => String(n).padStart(2, "0");

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));


/* ==============================
   YOUTUBE
============================== */

function embed(url) {

  if (!url) return "";

  url = String(url).trim();

  let id = "";


  if (url.includes("youtu.be/")) {

    id = url
      .split("youtu.be/")[1]
      .split("?")[0];

  }


  else if (url.includes("youtube.com/watch")) {

    try {

      id = new URL(url)
        .searchParams
        .get("v");

    } catch (e) {}

  }


  else if (url.includes("youtube.com/shorts/")) {

    id = url
      .split("shorts/")[1]
      .split("?")[0];

  }


  if (!id) return "";


  return `
    <div class="video">
      <iframe
        src="https://www.youtube.com/embed/${id}"
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  `;
}


/* ==============================
   DATA
============================== */

function byDay(n) {

  return DAYS.find((d) =>
    Number(d.day) === Number(n)
  );

}


function hasContent(d) {

  if (!d) return false;

  return Boolean(
    d.image ||
    (d.videos && d.videos.length)
  );

}


const recorded = DAYS
  .filter(hasContent)
  .map((d) => Number(d.day));


const latest =
  recorded.length
    ? Math.max(...recorded)
    : 1;


/* ==============================
   01 ~ 30
============================== */

function strip(active) {

  let html = "";


  for (let i = 1; i <= TOTAL; i++) {

    let cls = "cell";

    if (recorded.includes(i)) {
      cls += " has";
    }

    if (i === active) {
      cls += " on";
    }


    html += `
      <a
        class="${cls}"
        href="#day-${pad(i)}">
        ${pad(i)}
      </a>
    `;

  }


  return `
    <div class="strip">
      ${html}
    </div>
  `;
}


/* ==============================
   CURRENT DAY
============================== */

function currentDay() {

  const match =
    location.hash.match(/#day-(\d+)/);


  if (match) {

    const n =
      Number(match[1]);

    if (n >= 1 && n <= 30) {
      return n;
    }

  }


  return latest;
}


/* ==============================
   DAY
============================== */

function dayHTML(n) {

  const d =
    byDay(n) || {
      day: n,
      date: "",
      title: "",
      image: "",
      videos: []
    };


  /* IMAGE */

  let image = `

    <div class="empty-media">
      <span>IMAGE</span>
      <small>아직 이미지가 없습니다.</small>
    </div>

  `;


  if (d.image) {

    image = `
      <img
        src="${esc(d.image)}"
        alt="DAY ${pad(n)} 작업 이미지">
    `;

  }


  /* VIDEO */

  let video = `

    <div class="empty-media">
      <span>VIDEO</span>
      <small>아직 영상이 없습니다.</small>
    </div>

  `;


  if (
    Array.isArray(d.videos) &&
    d.videos.length > 0
  ) {

    const videos =
      d.videos
        .map(embed)
        .filter(Boolean)
        .join("");


    if (videos) {
      video = videos;
    }

  }


  /* PREV / NEXT */

  const prev =
    n > 1
      ? `<a href="#day-${pad(n - 1)}">← DAY ${pad(n - 1)}</a>`
      : `<span></span>`;


  const next =
    n < 30
      ? `<a href="#day-${pad(n + 1)}">DAY ${pad(n + 1)} →</a>`
      : `<span></span>`;


  return `

    <div class="dayhead">

      <span class="n">
        DAY ${pad(n)}
      </span>

      <div class="day-meta">

        <span class="muted">
          ${esc(d.date || "")}
        </span>

        <span class="t">
          ${esc(d.title || "작업 기록 준비 중")}
        </span>

      </div>

    </div>


    <div class="media-grid">

      <div class="media-column">

        <div class="media-label">
          IMAGE
        </div>

        <div class="image-frame">
          ${image}
        </div>

      </div>


      <div class="media-column">

        <div class="media-label">
          VIDEO
        </div>

        <div class="video-frame">
          ${video}
        </div>

      </div>

    </div>


    <div class="pn">
      ${prev}
      ${next}
    </div>

  `;
}


/* ==============================
   RENDER DAY
============================== */

function renderLogs() {

  const target =
    $("#logs-body");

  if (!target) return;


  const n =
    currentDay();


  target.innerHTML =
    strip(n) +
    dayHTML(n);

}


/* ==============================
   BUILD
============================== */

function build() {

  const site =
    typeof SITE !== "undefined"
      ? SITE
      : {};


  const title =
    site.title || "ADHD";


  const rawMembers =
    Array.isArray(site.members)
      ? site.members
      : [];


  const memberNames =
    rawMembers.map((m) => {

      if (typeof m === "string") {
        return m;
      }

      return m.name || "";

    }).filter(Boolean);


  document.title =
    title + " | 30 DAYS PROJECT";


  const brand =
    $("#brand");

  if (brand) {
    brand.textContent = title;
  }


  const nav =
    $("#nav");

  if (nav) {

    nav.innerHTML = `
      <a href="#team">TEAM</a>
      <a href="#logs">30 DAYS</a>
    `;

  }


  const app =
    $("#app");


  if (!app) return;


  app.innerHTML = `

    <div class="wrap hero">

      <p class="hero-kicker">
        30 DAYS PROJECT · 2026
      </p>

      <h1>
        ${esc(title)}
      </h1>

      <div class="hero-info">

        <p class="hero-members">
          ${memberNames.join(" · ")}
        </p>

        <p class="count">
          RECORDED ${recorded.length} / 30
        </p>

      </div>

      ${strip(0)}

    </div>


    <div class="wrap">

      <section id="team">

        <div class="section-heading">
          <h2>TEAM</h2>
        </div>

        <div class="cols">

          ${memberNames.map((name) => `
            <div class="member">
              <h3>${esc(name)}</h3>
            </div>
          `).join("")}

        </div>

      </section>


      <section id="logs">

        <div class="section-heading">

          <h2>30 DAYS</h2>

          <span>
            DAILY AI VIDEO ARCHIVE
          </span>

        </div>

        <div id="logs-body"></div>

      </section>

    </div>

  `;


  const foot =
    $("#foot");


  if (foot) {

    foot.textContent =
      `${title} · ${memberNames.join(" · ")} · 2026`;

  }


  renderLogs();
}


/* ==============================
   CLICK DAY
============================== */

window.addEventListener(
  "hashchange",
  () => {

    if (
      location.hash.startsWith("#day-")
    ) {

      renderLogs();

      const logs =
        $("#logs");

      if (logs) {

        logs.scrollIntoView({
          behavior: "smooth"
        });

      }

    }

  }
);


/* ==============================
   START
============================== */

build();
