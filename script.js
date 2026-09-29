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

 
