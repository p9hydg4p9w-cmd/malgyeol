const input = document.getElementById("inputText");
const count = document.getElementById("count");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const exampleBtn = document.getElementById("exampleBtn");
const result = document.getElementById("result");
const scoreEl = document.getElementById("score");
const barFill = document.getElementById("barFill");
const summaryBox = document.getElementById("summaryBox");
const summaryTitle = document.getElementById("summaryTitle");
const summaryText = document.getElementById("summaryText");
const highlighted = document.getElementById("highlighted");
const cards = document.getElementById("cards");
const foundCount = document.getElementById("foundCount");
const suggestions = document.getElementById("suggestions");
const copyBtn = document.getElementById("copyBtn");

const examples = [
  "개웃기노 이기.",
  "게이야 이것 좀 봐라.",
  "요즘 급식충들은 예의가 없어.",
  "맘충 때문에 카페가 시끄럽다.",
  "틀딱들은 인터넷을 못해.",
  "그는 게이다.",
  "어디 가노?"
];

const dictionary = [
  { word:"급식충", type:"청소년 비하", level:"danger", score:24, replace:"학생",
    reason:"학생과 청소년을 벌레에 빗대어 낮춰 부르는 표현입니다." },
  { word:"맘충", type:"여성·양육자 비하", level:"danger", score:26, replace:"일부 보호자",
    reason:"일부 양육자의 행동을 어머니 집단 전체의 특성처럼 묶어 비하합니다." },
  { word:"틀딱", type:"노인 비하", level:"danger", score:26, replace:"일부 고령층",
    reason:"노인을 나이만으로 낮춰 부르는 인터넷식 멸칭입니다." },
  { word:"김치녀", type:"여성 혐오·일반화", level:"danger", score:30, replace:"일부 사람",
    reason:"한국 여성 전체에 부정적인 속성을 덧씌우는 표현입니다." },
  { word:"한남", type:"남성 비하·일반화", level:"danger", score:30, replace:"일부 남성",
    reason:"한국 남성 전체를 부정적인 집단으로 묶어 비하하는 표현입니다." },
  { word:"외노자", type:"이주노동자 비하", level:"danger", score:28, replace:"이주노동자",
    reason:"외국인 노동자를 축약해 낮춰 부르는 표현으로 사용될 수 있습니다." },
  { word:"짱깨", type:"중국인 비하", level:"danger", score:34, replace:"중국인",
    reason:"국적과 민족을 이유로 사람을 모욕적으로 부르는 표현입니다." },
  { word:"쪽바리", type:"일본인 비하", level:"danger", score:34, replace:"일본인",
    reason:"일본인 전체를 모욕적으로 부르는 민족 비하 표현입니다." },
  { word:"게이야", type:"정체성을 이용한 인터넷식 호칭", level:"warning", score:15, replace:"친구야",
    reason:"‘게이’는 중립적인 정체성 명칭이지만, 관계없는 상대를 호칭으로 부르면 희화화가 될 수 있습니다." },
  { word:"게이들아", type:"정체성을 이용한 인터넷식 호칭", level:"warning", score:15, replace:"다들",
    reason:"성적 지향을 장난스러운 집단 호칭으로 사용하면 정체성을 희화화할 수 있습니다." },
  { word:"요즘 애들은", type:"세대 일반화", level:"warning", score:18, replace:"내가 만난 일부 청소년은",
    reason:"일부 청소년의 행동을 세대 전체의 특성처럼 묶어 말합니다." },
  { word:"여자는 다", type:"성별 일반화", level:"warning", score:22, replace:"일부 사람은",
    reason:"개인의 차이를 지우고 여성 전체를 하나의 특성으로 단정합니다." },
  { word:"남자는 다", type:"성별 일반화", level:"warning", score:22, replace:"일부 사람은",
    reason:"개인의 차이를 지우고 남성 전체를 하나의 특성으로 단정합니다." }
];

function escapeHtml(text){
  return text.replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
  });
}

function analyzeText(text){
  const found = [];
  let changed = text;
  let score = 100;

  dictionary.forEach(function(item){
    if(text.includes(item.word)){
      found.push({...item, hit:item.word});
      score -= item.score;
      changed = changed.split(item.word).join(item.replace);
    }
  });

  if(/(^|[\s,.!?])이기(?:야)?(?=$|[\s,.!?])/.test(text)){
    found.push({
      hit:"이기", type:"인터넷식 추임새", level:"warning", score:16, replace:"",
      reason:"‘이기다’의 일부가 아니라 뜻 없는 추임새로 사용되면 온라인 조롱 문화에서 퍼진 말투로 받아들여질 수 있습니다."
    });
    score -= 16;
    changed = changed.replace(/(^|[\s,.!?])이기(?:야)?(?=$|[\s,.!?])/g, "$1");
  }

  const noMatch = text.match(/([가-힣]+)노(?=$|[\s,.!?])/);
  if(noMatch){
    const full = noMatch[0];
    const stem = noMatch[1];
    const isQuestion = text.trim().endsWith("?") && /^(어디|뭐|왜|누가|언제|어떻게)/.test(stem);

    if(isQuestion){
      found.push({
        hit:full, type:"방언일 가능성이 있는 표현", level:"context", score:3, replace:full,
        reason:"문장 끝의 ‘-노’는 실제 경상도 방언의 의문형이나 종결 표현일 수 있으므로 혐오표현으로 단정하지 않습니다."
      });
      score -= 3;
    }else{
      found.push({
        hit:full, type:"인터넷식 ‘-노’ 종결 표현", level:"context", score:12, replace:stem+"다",
        reason:"실제 방언일 수도 있지만, 방언과 무관한 평서문에 반복될 경우 온라인 조롱 문화와 연결된 말투로 받아들여질 수 있습니다."
      });
      score -= 12;
      changed = changed.replace(full, stem+"다");
    }
  }

  if(found.some(x=>x.type.includes("‘-노’")) && found.some(x=>x.type==="인터넷식 추임새")){
    found.push({
      hit:"-노 + 이기", type:"커뮤니티식 표현의 결합", level:"warning", score:8, replace:"",
      reason:"‘-노’와 추임새 ‘이기’가 함께 쓰이면 실제 방언보다 온라인 커뮤니티식 말투일 가능성이 커집니다."
    });
    score -= 8;
  }

  score = Math.max(5, score);
  changed = changed.replace(/\s+/g," ").replace(/\s+([,.!?])/g,"$1").trim();

  let marked = escapeHtml(text);
  found.filter(x=>x.hit && x.hit!=="-노 + 이기")
    .sort((a,b)=>b.hit.length-a.hit.length)
    .forEach(function(item){
      marked = marked.split(escapeHtml(item.hit)).join(
        '<mark class="'+item.level+'">'+escapeHtml(item.hit)+'</mark>'
      );
    });

  const suggestionList = found.length ? [
    changed || "추임새와 호칭을 빼고 문장의 뜻만 전달해 보세요.",
    text.includes("웃기노") ? "진짜 웃기다." : "집단보다 구체적인 행동과 상황을 중심으로 말해 보세요.",
    "원래 뜻을 일반적인 종결어미와 호칭으로 표현해 보세요."
  ] : [
    text,
    "대상과 상황을 더 구체적으로 적으면 오해를 줄일 수 있습니다."
  ];

  return {found, score, marked, suggestionList};
}

function render(){
  const text = input.value.trim();
  if(!text){
    alert("점검할 문장을 입력해 주세요.");
    return;
  }

  const data = analyzeText(text);
  result.classList.remove("hidden");
  scoreEl.textContent = data.score+"점";
  barFill.style.width = data.score+"%";
  foundCount.textContent = data.found.length+"개";
  highlighted.innerHTML = data.marked;
  cards.innerHTML = "";
  suggestions.innerHTML = "";

  const hasDanger = data.found.some(x=>x.level==="danger");
  const hasWarning = data.found.some(x=>x.level==="warning");
  const hasContext = data.found.some(x=>x.level==="context");

  summaryBox.className = "summary";
  if(hasDanger){
    summaryBox.classList.add("danger");
    summaryTitle.textContent = "직접적인 비하나 집단 일반화가 포함될 수 있어요.";
    summaryText.textContent = "사람의 정체성보다 구체적인 행동과 상황을 중심으로 바꿔 보세요.";
    barFill.style.background = "#9b3f37";
  }else if(hasWarning){
    summaryBox.classList.add("warning");
    summaryTitle.textContent = "조롱 문화에서 퍼진 인터넷식 표현이 보여요.";
    summaryText.textContent = "가벼운 추임새와 호칭도 반복되면 조롱을 일상화할 수 있습니다.";
    barFill.style.background = "#8a5a13";
  }else if(hasContext){
    summaryBox.classList.add("context");
    summaryTitle.textContent = "문맥 확인이 필요한 표현이 있어요.";
    summaryText.textContent = "방언일 가능성도 있으므로 단어 하나만으로 혐오라고 단정하지 않습니다.";
    barFill.style.background = "#5f5a9a";
  }else{
    summaryTitle.textContent = "등록된 점검 유형은 발견되지 않았어요.";
    summaryText.textContent = "현재 사전에 없는 표현이거나 더 넓은 문맥 판단이 필요할 수 있습니다.";
    barFill.style.background = "#2f6652";
  }

  if(data.found.length===0){
    cards.innerHTML = '<div class="finding context"><strong>현재 사전에서는 발견되지 않음</strong><p>문제가 전혀 없다는 뜻은 아닙니다.</p></div>';
  }else{
    data.found.forEach(function(item){
      const div = document.createElement("div");
      div.className = "finding "+item.level;
      div.innerHTML = "<strong>"+escapeHtml(item.type)+"</strong><p>"+escapeHtml(item.reason)+"</p>";
      cards.appendChild(div);
    });
  }

  data.suggestionList.forEach(function(text){
    const p = document.createElement("p");
    p.className = "suggestion";
    p.textContent = text;
    suggestions.appendChild(p);
  });

  result.scrollIntoView({behavior:"smooth"});
}

input.addEventListener("input", function(){
  count.textContent = input.value.length+" / 300";
});
analyzeBtn.addEventListener("click", render);
clearBtn.addEventListener("click", function(){
  input.value = "";
  count.textContent = "0 / 300";
  result.classList.add("hidden");
});
exampleBtn.addEventListener("click", function(){
  const ex = examples[Math.floor(Math.random()*examples.length)];
  input.value = ex;
  count.textContent = ex.length+" / 300";
});
copyBtn.addEventListener("click", async function(){
  const first = document.querySelector(".suggestion");
  if(!first) return;
  try{
    await navigator.clipboard.writeText(first.textContent);
    copyBtn.textContent = "복사했어요";
    setTimeout(()=>copyBtn.textContent="첫 문장 복사",1200);
  }catch{
    alert("복사하지 못했습니다.");
  }
});
