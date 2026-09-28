/* ============================================================
   ADHD · 30 DAYS PROJECT
   ============================================================ */


const $ = selector =>
  document.querySelector(selector);


const esc = value =>
  String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char])
  );


const pad = number =>
  String(number).padStart(2, "0");


const TOTAL = 30;



/* ============================================================
   VIDEO EMBED

   YouTube
   Google Drive
   MP4
   ============================================================ */


function embed(url) {

  url = String(url || "").trim();


  if (!url) {
    return "";
  }


  /* YouTube */

  let match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/
  );


  if (match) {

    return `

      <div class="video">

        <iframe
          src="https://www.youtube.com/embed/${match[1]}"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>

      </div>

    `;

  }



  /* Google Drive */

  match =
    url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) ||
    url.match(/drive\.google\.com\/.*[?&]id=([\w-]+)/);


  if (match) {

    return `

      <div class="video">

        <iframe
          src="https://drive.google.com/file/d/${match[1]}/preview"
          allow="autoplay"
          allowfullscreen>
        </iframe>

      </div>

    `;

  }



  /* MP4 / WEBM */

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


function byDay(number) {

  return DAYS.find(
    item => item.day === number
  );

}



function hasContent(day) {

  if (!day) return false;


  return Boolean(

    day.image ||

    (
      Array.isArray(day.videos) &&
      day.videos.length
    )

  );

}



const recorded = DAYS
  .filter(hasContent)
  .map(day => day.day);



const latest = recorded.length
  ? Math.max(...recorded)
  : 1;



/* ============================================================
   DAY 01 ~ 30 STRIP
   ============================================================ */


function strip(active) {

  let html = "";


  for (
    let day = 1;
    day <= TOTAL;
    day++
  ) {

    const classes = [
      "cell",

      recorded.includes(day)
        ? "has"
        : "",

      day === active
        ? "on"
        : ""

    ]
      .filter(Boolean)
      .join(" ");


    html += `

      <a
        class="${classes}"
        href="#day-${pad(day)}"
        aria-label="Day ${pad(day)}">

        ${pad(day)}

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
   CURRENT DAY
   ============================================================ */


function currentDay() {

  const match =
    location.hash.match(
      /^#day-(\d+)/
    );


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
   DAY PAGE
   ============================================================ */


function dayHTML(number) {

  const day =
    byDay(number) || {
      day: number,
      date: "",
      title: "",
      image: "",
      videos: []
    };



  /* IMAGE */


  let imageHTML;


  if (day.image) {

    imageHTML = `

      <img
        src="${esc(day.image)}"
        alt="DAY ${pad(number)} 작업 이미지"
      >

    `;

  }

  else {

    imageHTML = `

      <div class="empty-media">

        <span>IMAGE</span>

        <small>
          작업 이미지가 아직 없습니다.
        </small>

      </div>

    `;

  }



  /* VIDEO */


  let videoHTML;


  if (
    Array.isArray(day.videos) &&
    day.videos.length
  ) {

    videoHTML =
      day.videos
        .map(embed)
        .join("");

  }

  else {

    videoHTML = `

      <div class="empty-media">

        <span>VIDEO</span>

        <small>
          작업 영상이 아직 없습니다.
        </small>

      </div>

    `;

  }



  /* PREVIOUS */


  const previous = number > 1

    ? `

      <a href="#day-${pad(number - 1)}">

        ← DAY ${pad(number - 1)}

      </a>

    `

    : `<span></span>`;



  /* NEXT */


  const next = number < TOTAL

    ? `

      <a href="#day-${pad(number + 1)}">

        DAY ${pad(number + 1)} →

      </a>

    `

    : `<span></span>`;



  return `


    <div class="dayhead">


      <span class="n">

        DAY ${pad(number)}

      </span>


      <div class="day-meta">

        <span class="muted">

          ${esc(day.date || "")}

        </span>


        <span class="t">

          ${
            esc(
              day.title ||
              "작업 기록 준비 중"
            )
          }

        </span>

      </div>


    </div>



    <div class="media-grid">


      <!-- IMAGE -->


      <div class="media-column">


        <div class="media-label">

          IMAGE

        </div>


        <div class="image-frame">

          ${imageHTML}

        </div>


      </div>



      <!-- VIDEO -->


      <div class="media-column">


        <div class="media-label">

          VIDEO

        </div>


        <div class="video-frame">

          ${videoHTML}

        </div>


      </div>


    </div>



    <div class="pn">

      ${previous}

      ${next}

    </div>


  `;

}



/* ============================================================
   RENDER DAY
   ============================================================ */


function renderLogs() {

  const number =
    currentDay();


  const target =
    $("#logs-body");


  if (!target) {
    return;
  }


  target.innerHTML =

    strip(number) +

    dayHTML(number);

}



/* ============================================================
   BUILD WEBSITE
   ============================================================ */


function build() {

  const site = SITE;



  /* Browser title */


  document.title =
    `${site.title} | 30 DAYS PROJECT`;



  /* Header */


  $("#brand").textContent =
    site.title;


  $("#nav").innerHTML = `

    <a href="#team">
      TEAM
    </a>

    <a href="#logs">
      30 DAYS
    </a>

  `;



  /* Members */


  const members =
    (site.members || [])
      .map(name => `

        <div class="member">

          <h3>
            ${esc(name)}
          </h3>

        </div>

      `)
      .join("");



  /* Main */


  $("#app").innerHTML = `


    <!-- HERO -->


    <div class="wrap hero">


      <p class="hero-kicker">

        30 DAYS PROJECT · 2026

      </p>


      <h1>

        ${esc(site.title)}

      </h1>


      <div class="hero-info">


        <p class="hero-members">

          ${site.members.map(esc).join(" · ")}

        </p>


        <p class="count">

          RECORDED

          ${recorded.length}

          / ${TOTAL}

        </p>


      </div>


      ${strip(0)}


    </div>



    <!-- CONTENT -->


    <div class="wrap">


      <!-- TEAM -->


      <section id="team">


        <div class="section-heading">

          <h2>
            TEAM
          </h2>

        </div>


        <div class="cols members-grid">

          ${members}

        </div>


      </section>



      <!-- 30 DAYS -->


      <section id="logs">


        <div class="section-heading">


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



  /* Footer */


  $("#foot").textContent =

    `${site.title} · ${site.members.join(" · ")} · 2026`;



  renderLogs();

}



/* ============================================================
   HASH CHANGE
   ============================================================ */


window.addEventListener(
  "hashchange",
  () => {

    if (
      /^#day-/.test(
        location.hash
      )
    ) {

      renderLogs();


      const section =
        $("#logs");


      if (section) {

        section.scrollIntoView({
          behavior: "smooth"
        });

      }

    }

  }
);



/* ============================================================
   START
   ============================================================ */


build();


if (
  /^#day-/.test(
    location.hash
  )
) {

  setTimeout(
    () => {

      const section =
        $("#logs");


      if (section) {

        section.scrollIntoView();

      }

    },

    50
  );

}
