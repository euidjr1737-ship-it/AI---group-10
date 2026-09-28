const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nl = s => esc(s).replace(/\n/g, "<br>");
const pad = n => String(n).padStart(2, "0");
const empty = '<span class="muted">아직 기록이 없어요.</span>';
const TOTAL = 30;

// YouTube / Google Drive / mp4 링크를 재생 가능한 영상으로 바꿈
function embed(url) {
  url = String(url || "").trim();
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (m) return `<div class="video"><iframe src="https://www.youtube.com/embed/${m[1]}" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || url.match(/drive\.google\.com\/.*[?&]id=([\w-]+)/);
  if (m) return `<div class="video"><iframe src="https://drive.google.com/file/d/${m[1]}/preview" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe></div>`;
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return `<div class="video"><video src="${esc(url)}" controls></video></div>`;
  return url ? `<p><a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a></p>` : "";
}

const boardHTML = list => (list && list.length)
  ? `<div class="boards">${list.map(b => `<figure><div class="frame">${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.caption)}" loading="lazy">` : "이미지 없음"}</div><figcaption>${esc(b.caption)}</figcaption></figure>`).join("")}</div>`
  : empty;

const has = d => d && (d.work || d.intent || d.prompt || d.result || d.fix || (d.videos || []).length || (d.storyboard || []).length);
const byDay = n => DAYS.find(d => d.day === n);
const recorded = DAYS.filter(has).map(d => d.day);
const latest = recorded.length ? Math.max(...recorded) : 1;

function strip(active) {
  let h = "";
  for (let i = 1; i <= TOTAL; i++) {
    const cls = "cell" + (recorded.includes(i) ? " has" : "") + (i === active ? " on" : "");
    h += `<a class="${cls}" href="#day-${pad(i)}" aria-label="Day ${pad(i)}">${pad(i)}</a>`;
  }
  return `<div class="strip">${h}</div>`;
}

function dayHTML(n) {
  const d = byDay(n) || { day: n };
  const rows = [
    ["오늘의 작업", d.work ? nl(d.work) : empty],
    ["기획 의도", d.intent ? nl(d.intent) : empty],
    ["콘티", boardHTML(d.storyboard)],
    ["프롬프트", d.prompt ? `<pre>${esc(d.prompt)}</pre><button data-copy="${n}">프롬프트 복사</button>` : empty],
    ["AI 영상", (d.videos || []).length ? d.videos.map(embed).join("") : empty],
    ["결과", d.result ? nl(d.result) : empty],
    ["수정할 점", d.fix ? nl(d.fix) : empty]
  ];
  const prev = n > 1 ? `<a href="#day-${pad(n - 1)}">← Day ${pad(n - 1)}</a>` : "<span></span>";
  const next = n < TOTAL ? `<a href="#day-${pad(n + 1)}">Day ${pad(n + 1)} →</a>` : "<span></span>";
  return `<div class="dayhead"><span class="n">DAY ${pad(n)}</span><span class="t">${esc(d.title || "")}</span><span class="muted">${esc(d.date || "")}</span></div>
    ${rows.map(r => `<div class="row"><h3>${r[0]}</h3><div>${r[1]}</div></div>`).join("")}
    <div class="pn">${prev}${next}</div>`;
}

function currentDay() {
  const m = location.hash.match(/^#day-(\d+)/);
  return m ? Math.min(TOTAL, Math.max(1, +m[1])) : latest;
}

function renderLogs() {
  const n = currentDay();
  $("#logs-body").innerHTML = strip(n) + dayHTML(n);
}

function build() {
  const S = SITE;
  document.title = S.title + " | 30 DAYS PROJECT";
  $("#brand").textContent = "30 DAYS";
  const nav = [["team","팀"],["world","세계관"],["scenario","시나리오"],["board","콘티"],["shots","Shot List"],["logs","작업 기록"],["final","결과물"],["review","회고"]];
  $("#nav").innerHTML = nav.map(a => `<a href="#${a[0]}">${a[1]}</a>`).join("");

  const prompts = DAYS.filter(d => d.prompt);
  const flows = DAYS.filter(d => d.result || d.fix);
  const list = a => a.map(x => `<li>${esc(x)}</li>`).join("");

  $("#app").innerHTML = `
  <div class="wrap hero">
    <h1>${esc(S.title)}</h1>
    <p class="sub">${esc(S.subtitle)}</p>
    <p class="logline">${esc(S.logline)}</p>
    <p class="count">기록된 날 ${recorded.length} / ${TOTAL}</p>
    ${strip(0)}
  </div>
  <div class="wrap">
    <section id="team"><h2>${esc(S.team.name)}</h2><p>${nl(S.team.intro)}</p>
      <div class="cols">${S.members.map(m => `<div><div class="role">${esc(m.role)}</div><h3>${esc(m.name)}</h3><p class="muted">${esc(m.bio)}</p></div>`).join("")}</div></section>
    <section id="world"><h2>세계관 및 규칙</h2><p>${nl(S.world.intro)}</p><ol class="rules">${list(S.world.rules)}</ol></section>
    <section id="scenario"><h2>시나리오</h2>${S.scenario.map(s => `<h3>${esc(s.title)}</h3><p>${nl(s.text)}</p>`).join("")}</section>
    <section id="board"><h2>콘티</h2>${boardHTML(S.storyboard)}</section>
    <section id="shots"><h2>Shot List</h2><div class="tw"><table><tr><th>No.</th><th>사이즈</th><th>앵글</th><th>움직임</th><th>설명</th><th>초</th></tr>
      ${S.shotlist.map(r => `<tr><td>${esc(r.no)}</td><td>${esc(r.size)}</td><td>${esc(r.angle)}</td><td>${esc(r.move)}</td><td>${esc(r.desc)}</td><td>${esc(r.sec)}</td></tr>`).join("")}</table></div></section>
    <section id="logs"><h2>날짜별 작업 기록</h2><div id="logs-body"></div></section>
    <section id="prompts"><h2>영상 생성 프롬프트</h2>${prompts.length ? prompts.map(d => `<details><summary>Day ${pad(d.day)} ${esc(d.title || "")}</summary><pre>${esc(d.prompt)}</pre></details>`).join("") : empty}</section>
    <section id="process"><h2>생성 결과 및 수정 과정</h2>${flows.length ? flows.map(d => `<div class="flow"><b>${pad(d.day)}</b><div><h3>결과</h3>${nl(d.result)}</div><div><h3>수정할 점</h3>${nl(d.fix)}</div></div>`).join("") : empty}</section>
    <section id="final"><h2>AI 영상 결과물</h2>${S.finalVideos.length ? S.finalVideos.map(v => `<h3>${esc(v.title)}</h3>${embed(v.url)}<p>${esc(v.desc)}</p>`).join("") : "<p class='muted'>최종 영상이 완성되면 이곳에 표시됩니다.</p>"}</section>
    <section id="review" style="border:0"><div class="two"><div><h2>잘 구현된 부분</h2><ul>${list(S.strengths)}</ul></div><div><h2>수정하고 싶은 부분</h2><ul>${list(S.improvements)}</ul></div></div></section>
  </div>`;
  $("#foot").textContent = S.team.name + " · " + S.title;
  renderLogs();
}

window.addEventListener("hashchange", () => {
  if (/^#day-/.test(location.hash)) {
    renderLogs();
    $("#logs").scrollIntoView();
  }
});
document.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  const d = byDay(+b.dataset.copy);
  navigator.clipboard.writeText(d.prompt).then(() => { b.textContent = "복사됨"; setTimeout(() => b.textContent = "프롬프트 복사", 1500); });
});

build();
if (/^#day-/.test(location.hash)) setTimeout(() => $("#logs").scrollIntoView(), 50);
