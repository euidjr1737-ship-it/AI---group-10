const projectDays = [

  /* =====================================================
     DAY 01
  ====================================================== */

 {
  day: 1,

  date: "2026.09.28",

  title: "First Motion Test",

  uploaded: true,

  youtubeId: "ehvclCeThqU",

  description:
    "캐릭터와 공간의 시각적 방향을 설정하고, 이를 실제 움직임으로 연결하기 위한 첫 번째 영상 생성 테스트를 진행했다.",

  prompt:
    "DAY 01에서는 캐릭터의 외형과 장면의 기본 구성을 유지하면서 움직임을 생성하는 테스트를 진행했다. 전체 프롬프트 기록은 아래 PDF 파일에서 확인할 수 있다.",

  promptFile: "./day1-prompt.pdf",

  note:
    "정지 이미지에서 설정한 캐릭터의 형태와 재질이 영상에서도 어느 정도 유지되는지 확인했다. 이후 작업에서는 캐릭터의 일관성과 움직임의 자연스러움을 중심으로 테스트를 이어갈 예정이다."
},

{
  day: 2,

  date: "2026.09.29",

  title: "Day 02",

  uploaded: true,

  youtubeId: "yj5tk5_3hyc",

  description: "",

  prompt: "",

  promptFile: "",

  note: ""
},

  /* =====================================================
     DAY 03
  ====================================================== */

  {
    day: 3,

    date: "",

    title: "Day 03",

    uploaded: false,

    youtubeId: "",

    description: "",

    prompt: "",

    promptFile: "",

    note: ""
  }

];


/*
  DAY 04 ~ DAY 30 자동 생성
*/

for (let i = 4; i <= 30; i++) {

  projectDays.push({

    day: i,

    date: "",

    title: `Day ${String(i).padStart(2, "0")}`,

    uploaded: false,

    youtubeId: "",

    description: "",

    prompt: "",

    promptFile: "",

    note: ""

  });

}
