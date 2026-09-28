/* ============================================================
   이 파일 하나만 고치면 웹사이트 내용이 전부 바뀝니다.
   - 따옴표("") 안의 글만 바꾸세요. 쉼표(,)와 중괄호({ })는 지우지 마세요.
   - 줄바꿈은 글 안에 \n 을 쓰세요.
   - 영상: YouTube 또는 Google Drive 공유 링크를 그대로 붙여넣으세요.
   - 이미지: images 폴더에 넣고 "images/파일이름.jpg" 로 적으세요.
   ※ 아래 내용은 전부 예시입니다. 팀 내용으로 바꿔 주세요.
   ============================================================ */

const SITE = {
  title: "프로젝트 제목",
  subtitle: "30 DAYS PROJECT · team 10 · AI기반영상제작워크샵 · 2026",
  logline: "한 문장으로 요약한 로그라인을 여기에 적으세요.",

  team: {
    name: "팀 이름",
    intro: "우리 팀이 어떤 팀인지, 이 프로젝트를 왜 시작했는지 적으세요."
  },
  members: [
    { name: "팀원 1", role: "연출 / 프롬프트", bio: "맡은 일과 한 줄 소개" },
    { name: "팀원 2", role: "시나리오 / 콘티", bio: "맡은 일과 한 줄 소개" },
    { name: "팀원 3", role: "편집 / 사운드", bio: "맡은 일과 한 줄 소개" }
  ],

  world: {
    intro: "세계관을 설명하는 글을 적으세요.",
    rules: [
      "규칙 1: 이 세계에서 절대 바뀌지 않는 것",
      "규칙 2: 등장인물이 지켜야 하는 것",
      "규칙 3: 영상 전체에 유지할 비주얼 룩(색감, 질감 등)"
    ]
  },

  scenario: [
    { title: "시퀀스 1", text: "시나리오 내용을 적으세요." },
    { title: "시퀀스 2", text: "시나리오 내용을 적으세요." }
  ],

  // 전체 콘티 (image 는 비워두면 빈 칸으로 표시됩니다)
  storyboard: [
    { image: "", caption: "S#1 오프닝" },
    { image: "", caption: "S#2 전개" }
  ],

  shotlist: [
    { no: "1", size: "Wide", angle: "Eye level", move: "Slow push-in", desc: "샷 설명", sec: "5" },
    { no: "2", size: "Close-up", angle: "Low angle", move: "Static", desc: "샷 설명", sec: "4" }
  ],

  // 최종 결과물 (완성되면 추가)
  finalVideos: [
    // { title: "최종본", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", desc: "설명" }
  ],

  strengths: [
    "잘 구현된 부분을 적으세요."
  ],
  improvements: [
    "수정하고 싶은 부분을 적으세요."
  ]
};

/* 날짜별 기록: 새 날이 되면 { } 블록 하나를 복사해서 아래에 붙여넣고 day 숫자만 바꾸세요. */
const DAYS = [
  {
    day: 1,
    date: "2026-10-01",
    title: "아이디어 회의와 방향 정하기",
    work: "팀 회의로 주제를 정하고 레퍼런스를 모았다.",
    intent: "왜 이 주제를 골랐는지 적으세요.",
    storyboard: [{ image: "", caption: "첫 러프 콘티" }],
    prompt: "여기에 영상 생성에 사용한 프롬프트를 그대로 붙여넣으세요.",
    videos: [],   // 예: ["https://youtu.be/XXXXXXXXXXX", "https://drive.google.com/file/d/파일ID/view"]
    result: "생성 결과가 어땠는지 적으세요.",
    fix: "다음에 고칠 점을 적으세요."
  },
  {
    day: 2,
    date: "2026-10-02",
    title: "캐릭터 룩 테스트",
    work: "",
    intent: "",
    storyboard: [],
    prompt: "",
    videos: [],
    result: "",
    fix: ""
  }
];
