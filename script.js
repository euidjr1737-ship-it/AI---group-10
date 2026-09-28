/* ============================================================
   ADHD · 30 DAYS PROJECT
   script.js
   ============================================================ */

const $ = s => document.querySelector(s);

const esc = s =>
  String(s ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

const pad = n => String(n).padStart(2, "0");

const TOTAL = 30;


/* ============================================================
   YOUTUBE / GOOGLE DRIVE / MP4
   ============================================================ */

function embed(url) {

  url = String(url || "").trim();

  let m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );

  if (m) {
    return `
      <div class="video">
        <iframe
          src="https://www.youtube.com/embed/${m[1]}"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
    `;
  }


  m =
    url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) ||
    url.match(/drive\.google\.com\/.*[?&]id=([\w-]+)/);


  if (m) {
    return `
      <div class="video">
        <iframe
          src="https://drive.google.com/file/d/${m[1]}/preview"
          allow="autoplay; fullscreen"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
    `;
  }


  if (/\.(mp4|webm)(\?|$)/i.test(url)) {
    return `
      <div class="video">
        <video
          src="${esc(url)}"
          controls>
        </video>
      </div>
    `;
  }


  return "";
}


/* ============================================================
   DAY DATA
   ============================================================ */

const byDay = n =>
  DAYS.find(d => d.day === n);


/*
   image 또는 videos가 있으면
   "기록된 날"로 표시
*/

const has = d =>
  d &&
  (
    d.image ||
    (d.videos && d.videos.length)
  );


const recorded =
  DAYS
    .filter(has)
    .map(d => d.day);


const latest =
  recorded.length
    ? Math.max(...recorded)
    : 1;


/* ============================================================
   DAY 01 ~ DAY 30 NAVIGATION
   ============================================================ */

function strip(active) {

  let html = "";


  for (let i = 1; i <= TOTAL; i++) {

    const classes = [
      "cell",
      recorded.includes(i) ? "has" : "",
      i === active ? "on" : ""
    ]
      .filter(Boolean)
      .join(" ");


    html += `
      <a
        class="${classes}"
        href="#day-${pad(i)}"
        aria-label="Day ${pad(i)}">
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


/* ============================================================
   DAY 화면
   ============================================================ */

function dayHTML(n) {

  const d = byDay(n) || {
    day: n,
    title: "",
    date: "",
    image: "",
    videos: []
  };


  const prev =
    n > 1
      ? `<a href="#day-${pad(n - 1)}">← DAY ${pad(n - 1)}</a>`
      : `<span></span>`;


  const next =
    n < TOTAL
      ? `<a href="#day-${pad(n + 1)}">DAY ${pad(n + 1)} →</a>`
      : `<span></span>`;


  /* 이미지 */

  const imageHTML = d.image
    ? `
      <img
        src="${esc(d.image)}"
        alt="DAY ${pad(n)} 작업 이미지"
        loading="lazy">
    `
    : `
      <div class="media-empty">
        IMAGE
      </div>
    `;


  /* 영상 */

  const videoHTML =
    d.videos && d.videos.length
      ? d.videos.map(embed).join("")
      : `
        <div class="media-empty">
          VIDEO
        </div>
      `;


  return `

    <div class="dayhead">

      <span class="n">
        DAY ${pad(n)}
      </span>

      <span class="t">
        ${esc(d.title || "")}
      </span>

      <span class="muted">
        ${esc(d.date || "")}
      </span>

    </div>


    <div class="day-media">


      <!-- 왼쪽 이미지 -->

      <div class="day-media-item">

        <div class="media-title">
          IMAGE
        </div>

        <div class="day-image">
          ${imageHTML}
        </div>

      </div>


      <!-- 오른쪽 영상 -->

      <div class="day-media-item">

        <div class="media-title">
          VIDEO
        </div>

        <div class="day-video">
          ${videoHTML}
        </div>

      </div>


    </div>


    <div class="pn">
      ${prev}
      ${next}
    </div>

  `;
}


/* ============================================================
   현재 DAY 확인
   ============================================================ */

function currentDay() {

  const match =
    location.hash.match(/^#day-(\d+)/);


  if (match) {

    return Math.min(
      TOTAL,
      Math.max(
        1,
        Number(match[1])
      )
    );

  }


  return latest;
}


/* ============================================================
   DAY 다시 그리기
   ============================================================ */

function renderLogs() {

  const n = currentDay();

  const body =
    $("#logs-body");


  if (!body) return;


  body.innerHTML =
    strip(n) +
    dayHTML(n);
}


/* ============================================================
   사이트 전체 생성
   ============================================================ */

function build() {

  const S = SITE;


  /* 브라우저 제목 */

  document.title =
    `${S.title} | 30 DAYS PROJECT`;


  /* 왼쪽 상단 */

  $("#brand").textContent =
    S.title;


  /* 상단 메뉴 */

  $("#nav").innerHTML = `
    <a href="#team">TEAM</a>
    <a href="#logs">30 DAYS</a>
  `;


  /* 팀원 */

  const members =
    (S.members || [])
      .map(m => `

        <div class="member">

          <h3>
            ${esc(
              typeof m === "string"
                ? m
                : m.name
            )}
          </h3>

        </div>

      `)
      .join("");


  /* MAIN */

  $("#app").innerHTML = `


    <!-- ========================================
         HERO
         ======================================== -->

    <div class="wrap hero">

      <p class="project-label">
        30 DAYS PROJECT · 2026
      </p>


      <h1>
        ${esc(S.title)}
      </h1>


      <div class="hero-bottom">

        <p>
          이청하 · 최도준 · 이유민
        </p>


        <p class="count">
          ${recorded.length} / ${TOTAL} DAYS
        </p>

      </div>


      ${strip(0)}

    </div>



    <!-- ========================================
         CONTENT
         ======================================== -->

    <div class="wrap">


      <!-- TEAM -->

      <section id="team">

        <h2>
          TEAM
        </h2>


        <div class="cols members-grid">

          ${members}

        </div>

      </section>



      <!-- 30 DAYS -->

      <section id="logs">

        <div class="section-title">

          <h2>
            30 DAYS
          </h2>

          <span>
            DAILY AI VIDEO ARCHIVE
          </span>

        </div>


        <div id="logs-body"></div>

      </section>


    </div>

  `;


  /* FOOTER */

  $("#foot").textContent =
    `${S.title} · 30 DAYS PROJECT · 2026`;


  renderLogs();
}


/* ============================================================
   DAY 번호 클릭
   ============================================================ */

window.addEventListener(
  "hashchange",
  () => {

    if (/^#day-/.test(location.hash)) {

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


/* ============================================================
   BUILD
   ============================================================ */

build();


if (/^#day-/.test(location.hash)) {

  setTimeout(
    () => {

      const logs =
        $("#logs");


      if (logs) {

        logs.scrollIntoView();

      }

    },
    50
  );

}
