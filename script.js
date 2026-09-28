/* ============================================================
   YOUTUBE 링크 → EMBED 주소 변환
   ============================================================ */

function getYoutubeEmbed(url) {

  if (!url) return "";

  let videoId = "";

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }

  else if (url.includes("youtube.com/watch")) {
    const params = new URL(url).searchParams;
    videoId = params.get("v");
  }

  else if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("shorts/")[1].split("?")[0];
  }

  return videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : "";
}


/* ============================================================
   DAY 화면 만들기
   ============================================================ */

const app = document.getElementById("app");


DAYS.forEach(day => {

  const section = document.createElement("section");

  section.className = "day";


  const youtubeEmbed = getYoutubeEmbed(day.youtube);


  section.innerHTML = `

    <div class="day-header">

      <div class="day-number">
        DAY ${String(day.day).padStart(2, "0")}
      </div>

      <div class="day-info">

        <div class="date">
          ${day.date}
        </div>

        <h2>
          ${day.title}
        </h2>

      </div>

    </div>


    <div class="media-grid">


      <!-- 왼쪽 : 이미지 -->

      <div class="media-box image-box">

        <div class="media-label">
          CHARACTER
        </div>

        <img
          src="${day.image}"
          alt="DAY ${day.day} 캐릭터 이미지"
        >

      </div>


      <!-- 오른쪽 : 유튜브 -->

      <div class="media-box video-box">

        <div class="media-label">
          VIDEO
        </div>

        ${
          youtubeEmbed
            ? `
              <iframe
                src="${youtubeEmbed}"
                title="DAY ${day.day} VIDEO"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            `
            : `
              <div class="empty">
                VIDEO
              </div>
            `
        }

      </div>


    </div>

  `;


  app.appendChild(section);

});
