const $ = (selector) =>
  document.querySelector(selector);


const pad = (number) =>
  String(number).padStart(2, "0");


function escapeHTML(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character])
  );

}


function textWithBreaks(value) {

  return escapeHTML(value)
    .replace(/\n/g, "<br>");

}



function getDay(number) {

  return DAYS.find(
    item => item.day === number
  ) || {

    day: number,

    date: "",

    video: "",

    shortDescription: "",

    description: "",

    prompt: "",

    promptImage: "",

    promptFile: "",

    note: ""

  };

}



function uploaded(day) {

  return Boolean(
    String(day.video || "").trim()
  );

}



function youtubeID(url) {

  if (!url) return null;


  const match =
    String(url).match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
    );


  return match
    ? match[1]
    : null;

}



function videoHTML(url) {

  const id =
    youtubeID(url);


  if (!id) {

    return `

      <div class="empty-video">

        <div>

          <span>
            NO VIDEO
          </span>

          <p>
            VIDEO NOT UPLOADED YET
          </p>

        </div>

      </div>

    `;

  }


  return `

    <div class="video-frame">

      <iframe
        src="https://www.youtube.com/embed/${id}"
        title="Day video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

    </div>

  `;

}



function hasDetails(day) {

  return Boolean(

    day.description ||

    day.prompt ||

    day.promptImage ||

    day.promptFile ||

    day.note

  );

}



function renderDays(activeDay) {

  let html = "";


  for (
    let number = 1;
    number <= TOTAL_DAYS;
    number++
  ) {

    const day =
      getDay(number);


    const isUploaded =
      uploaded(day);


    html += `

      <button
        class="
          day-select
          ${number === activeDay ? "selected" : ""}
          ${isUploaded ? "has-upload" : ""}
        "
        data-select-day="${number}"
        aria-label="Day ${pad(number)}"
      >

        <span>
          ${pad(number)}
        </span>

        ${
          isUploaded
            ? `<i class="day-dot"></i>`
            : ""
        }

      </button>

    `;

  }


  $("#days-grid").innerHTML =
    html;


  document
    .querySelectorAll("[data-select-day]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const number =
            Number(
              button.dataset.selectDay
            );


          renderDay(number);


          history.replaceState(
            null,
            "",
            `#day-${pad(number)}`
          );


          document
            .querySelector("#archive")
            .scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

        }
      );

    });

}



function renderStatus(day) {

  if (uploaded(day)) {

    $("#current-status").innerHTML = `

      <div class="upload-status">

        <i></i>

        <span>
          UPLOADED
        </span>

      </div>

    `;

  }

  else {

    $("#current-status").innerHTML = `

      <div class="not-uploaded">

        NOT UPLOADED

      </div>

    `;

  }

}



function renderDay(number) {

  const day =
    getDay(number);


  renderStatus(day);


  $("#current-day").innerHTML = `

    <article class="day-feature">


      <div class="day-side">

        <div class="big-day-number">

          ${pad(number)}

        </div>


        <div class="day-small-label">

          DAY ${pad(number)}

        </div>


        <div class="day-date">

          ${
            day.date
              ? escapeHTML(day.date)
              : "—"
          }

        </div>

      </div>



      <div class="day-main">


        <div class="video-label">

          <span>
            FILM
          </span>

          <span>
            ${uploaded(day) ? "PLAY" : "WAITING"}
          </span>

        </div>


        ${videoHTML(day.video)}



        <div class="day-info">


          <div class="day-summary">

            ${
              day.shortDescription

                ? `
                  <p>
                    ${textWithBreaks(
                      day.shortDescription
                    )}
                  </p>
                `

                : `
                  <p class="muted">
                    아직 기록이 없습니다.
                  </p>
                `
            }

          </div>



          <div>

            ${
              hasDetails(day)

                ? `
                  <button
                    class="arrow-link detail-trigger"
                    data-detail="${number}"
                  >
                    VIEW DETAILS
                    <b>↗</b>
                  </button>
                `

                : `
                  <span class="coming">
                    DETAILS COMING SOON
                  </span>
                `
            }

          </div>


        </div>


      </div>


    </article>

  `;


  renderDays(number);


  const trigger =
    document.querySelector(
      "[data-detail]"
    );


  if (trigger) {

    trigger.addEventListener(
      "click",
      () => {

        openDetails(
          Number(
            trigger.dataset.detail
          )
        );

      }
    );

  }

}



function promptHTML(day) {

  let output = "";


  if (day.prompt) {

    output += `

      <pre class="prompt-box">${escapeHTML(
        day.prompt
      )}</pre>

    `;

  }



  if (day.promptImage) {

    output += `

      <div class="prompt-reference">

        <div class="prompt-reference-label">

          PROMPT REFERENCE

        </div>

        <img
          src="${escapeHTML(day.promptImage)}"
          alt="Day ${pad(day.day)} prompt reference"
        >

      </div>

    `;

  }



  if (day.promptFile) {

    output += `

      <a
        class="prompt-file"
        href="${escapeHTML(day.promptFile)}"
        target="_blank"
        rel="noopener"
      >

        <div>

          <span>
            PROMPT DOCUMENT
          </span>

          <small>
            DAY ${pad(day.day)} · FILE
          </small>

        </div>


        <strong>
          VIEW FILE ↗
        </strong>

      </a>

    `;

  }



  if (!output) {

    output = `

      <p class="detail-empty">
        No prompt archive yet.
      </p>

    `;

  }


  return output;

}



function openDetails(number) {

  const day =
    getDay(number);


  $("#detail-content").innerHTML = `


    <header class="detail-head">


      <div class="detail-eyebrow">

        DAY ${pad(number)}

      </div>


      <h2>

        PROCESS<br>
        ARCHIVE

      </h2>


      <div class="detail-head-bottom">

        <span>
          ${
            day.date
              ? escapeHTML(day.date)
              : ""
          }
        </span>

        <span>
          A DOZEN HEAD DISTRACTIONS
        </span>

      </div>


    </header>



    <!-- 01 DESCRIPTION -->

    <section class="detail-section">


      <div class="detail-number">

        01

      </div>


      <div class="detail-body">


        <h3>
          DESCRIPTION
        </h3>


        ${
          day.description

            ? `
              <p>
                ${textWithBreaks(
                  day.description
                )}
              </p>
            `

            : `
              <p class="detail-empty">
                No description yet.
              </p>
            `
        }


      </div>


    </section>



    <!-- 02 PROMPT -->

    <section class="detail-section">


      <div class="detail-number">

        02

      </div>


      <div class="detail-body">


        <h3>
          PROMPT
        </h3>


        ${promptHTML(day)}


      </div>


    </section>



    <!-- 03 NOTE -->

    <section class="detail-section">


      <div class="detail-number">

        03

      </div>


      <div class="detail-body">


        <h3>
          NOTE
        </h3>


        ${
          day.note

            ? `
              <p>
                ${textWithBreaks(
                  day.note
                )}
              </p>
            `

            : `
              <p class="detail-empty">
                No note yet.
              </p>
            `
        }


      </div>


    </section>


  `;


  const overlay =
    $("#detail-overlay");


  overlay.classList.add("open");


  overlay.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "no-scroll"
  );

}



function closeDetails() {

  const overlay =
    $("#detail-overlay");


  overlay.classList.remove("open");


  overlay.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "no-scroll"
  );

}



document.addEventListener(
  "click",
  event => {

    if (
      event.target.closest(
        "[data-close]"
      )
    ) {

      closeDetails();

    }

  }
);



document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeDetails();

    }

  }
);



function getInitialDay() {

  const hashMatch =
    location.hash.match(
      /^#day-(\d+)/
    );


  if (hashMatch) {

    return Math.min(
      TOTAL_DAYS,
      Math.max(
        1,
        Number(hashMatch[1])
      )
    );

  }


  const uploadedDays =
    DAYS
      .filter(uploaded)
      .map(day => day.day);


  if (uploadedDays.length) {

    return Math.max(
      ...uploadedDays
    );

  }


  return 1;

}



renderDay(
  getInitialDay()
);
