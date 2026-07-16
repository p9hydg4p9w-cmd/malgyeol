const inputText = document.getElementById("inputText");
const charCount = document.getElementById("charCount");
const checkButton = document.getElementById("checkButton");
const exampleButton = document.getElementById("exampleButton");
const resultSection = document.getElementById("resultSection");
const statusBox = document.getElementById("statusBox");
const statusIcon = document.getElementById("statusIcon");
const statusTitle = document.getElementById("statusTitle");
const statusDescription = document.getElementById("statusDescription");
const issueList = document.getElementById("issueList");
const suggestionList = document.getElementById("suggestionList");
const highlightedText = document.getElementById("highlightedText");
const scoreText = document.getElementById("scoreText");
const meterBar = document.getElementById("meterBar");
const copyButton = document.getElementById("copyButton");

const examples = [
  "오늘 진짜 웃기노 이기.",
  "게이야 이것 좀 봐라.",
  "요즘 급식충들은 예의가 없어.",
  "맘충 때문에 카페가 시끄럽다.",
  "틀딱들은 인터넷을 못해.",
  "그는 게이다.",
  "어디 가노?",
  "전라도 사람은 믿으면 안 돼."
];

const directRules = [
  {
    terms:["급식충"],
    category:"청소년 비하",
    weight:22,
    reason:"학생·청소년을 벌레에 빗대어 집단 전체를 낮춰 부르는 표현입니다.",
    replacements:["학생","청소년","일부 학생"]
  },
  {
    terms:["맘충"],
    category:"여성·양육자 비하",
    weight:24,
    reason:"일부 양육자의 행동을 어머니 집단 전체의 속성처럼 묶어 비하합니다.",
    replacements:["일부 보호자","아이를 돌보는 일부 손님","해당 보호자"]
  },
  {
    terms:["틀딱","틀딱충"],
    category:"노인 비하",
    weight:24,
    reason:"노인을 나이만으로 낮춰 부르고 부정적인 특성을 일반화하는 표현입니다.",
    replacements:["노인","고령자","일부 고령층"]
  },
  {
    terms:["김치녀"],
    category:"여성 혐오·성별 일반화",
    weight:28,
    reason:"한국 여성 전체에 부정적인 속성을 덧씌우는 성별 비하 표현입니다.",
    replacements:["일부 사람","해당 인물","구체적인 행동을 한 사람"]
  },
  {
    terms:["한남","한남충"],
    category:"남성 비하·성별 일반화",
    weight:28,
    reason:"한국 남성 전체를 하나의 부정적인 집단으로 묶어 비하하는 표현입니다.",
    replacements:["일부 남성","해당 인물","구체적인 행동을 한 사람"]
  },
  {
    terms:["외노자"],
    category:"이주노동자 비하",
    weight:26,
    reason:"외국인 노동자를 축약해 낮춰 부르는 맥락으로 쓰일 수 있습니다.",
    replacements:["이주노동자","외국인 노동자","해당 노동자"]
  },
  {
    terms:["짱깨"],
    category:"중국인·중국계 비하",
    weight:32,
    reason:"국적과 민족을 이유로 사람을 낮춰 부르는 모욕적 표현입니다.",
    replacements:["중국인","중국계 사람","해당 인물"]
  },
  {
    terms:["쪽바리"],
    category:"일본인 비하",
    weight:32,
    reason:"일본인 전체를 모욕적으로 부르는 민족 비하 표현입니다.",
    replacements:["일본인","일본계 사람","해당 인물"]
  },
  {
    terms:["장애인인데도","장애인인데"],
    category:"장애에 대한 낮은 기대",
    weight:20,
    reason:"장애가 있으면 성취하기 어려울 것이라는 전제가 담길 수 있습니다.",
    replacements:["","그 사람은","구체적인 성취를 중심으로"]
  },
  {
    terms:["전라도 사람은","경상도 사람은"],
    category:"지역 일반화",
    weight:22,
    reason:"개인의 성격이나 행동을 출신 지역 전체의 특성으로 일반화합니다.",
    replacements:["그 사람은","내가 만난 일부 사람은","구체적인 행동을 한 사람은"]
  },
  {
    terms:["여자는 다","남자는 다"],
    category:"성별 일반화",
    weight:22,
    reason:"개인의 차이를 지우고 성별 집단 전체를 하나의 성격으로 단정합니다.",
    replacements:["일부 사람은","내가 만난 몇몇 사람은","그 사람은"]
  }
];

function escapeHtml(text){
  return text.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

function addFinding(findings, data){
  if(!findings.some(item => item.key === data.key)){
    findings.push(data);
  }
}

function detectNoEnding(text, findings){
  const matches = [...text.matchAll(/([가-힣]{2,})노(?=[.!?\\s]|$)/g)];
  matches.forEach(match => {
    const full = match[0];
    const stem = match[1];

    const likelyDialectQuestion =
      /^(어디|뭐|무엇|왜|누가|언제|어째|어떻게|얼마|몇|우째)/.test(stem) ||
      /[?]$/.test(text.trim());

    if(likelyDialectQuestion){
      addFinding(findings,{
        key:`dialect-${full}`,
        hit:full,
        category:"방언일 가능성이 있는 표현",
        level:"context",
        weight:4,
        reason:"문장 끝의 ‘-노’는 경상도 방언의 의문형·종결 표현일 수 있습니다. 이 경우 혐오표현으로 단정하지 않습니다.",
        replacement:full
      });
    }else{
      addFinding(findings,{
        key:`internet-no-${full}`,
        hit:full,
        category:"고인 조롱 문화에서 확산된 인터넷식 종결 표현",
        level:"context",
        weight:10,
        reason:"방언 문맥과 무관하게 평서문 끝에 붙인 ‘-노’는 특정 온라인 커뮤니티의 고인 조롱 문화에서 확산된 말투로 받아들여질 수 있습니다. 다만 실제 방언 사용 가능성도 함께 고려해야 합니다.",
        replacement:stem + "다"
      });
    }
  });
}

function detectIgi(text, findings){
  const pattern = /(?:^|[\\s,.!?])이기(?:야)?(?=[\\s,.!?]|$)/g;
  const matches = [...text.matchAll(pattern)];

  matches.forEach(match => {
    const hit = match[0].trim();
    if(hit){
      addFinding(findings,{
        key:`igi-${match.index}`,
        hit,
        category:"고인 조롱에서 파생된 추임새",
        level:"warning",
        weight:15,
        reason:"‘이기’가 ‘이기다’나 ‘이기적인’의 일부가 아니라 뜻 없는 추임새로 쓰인 경우, 특정 커뮤니티의 고인 조롱 문화에서 확산된 표현일 수 있습니다.",
        replacement:""
      });
    }
  });
}

function detectGeya(text, findings){
  const callingPattern = /게이(야|들아|들아,|들아!|들아\\?)/g;
  const matches = [...text.matchAll(callingPattern)];

  matches.forEach(match => {
    addFinding(findings,{
      key:`geya-${match.index}`,
      hit:match[0],
      category:"정체성을 이용한 인터넷식 호칭",
      level:"warning",
      weight:14,
      reason:"‘게이’는 성적 지향을 나타내는 중립적인 명칭이지만, 관계없는 상대를 장난스러운 호칭으로 부르면 성소수자의 정체성을 희화화하는 효과가 생길 수 있습니다.",
      replacement:match[0].startsWith("게이들") ? "다들" : "친구야"
    });
  });
}

function analyze(text){
  const findings = [];
  let score = 100;
  let changed = text;

  directRules.forEach(rule => {
    rule.terms.forEach(term => {
      if(text.includes(term)){
        addFinding(findings,{
          key:`direct-${term}`,
          hit:term,
          category:rule.category,
          level:"danger",
          weight:rule.weight,
          reason:rule.reason,
          replacement:rule.replacements[0]
        });
      }
    });
  });

  detectNoEnding(text, findings);
  detectIgi(text, findings);
  detectGeya(text, findings);

  findings.forEach(f => {
    score -= f.weight;
    if(f.replacement !== f.hit){
      changed = changed.split(f.hit).join(f.replacement);
    }
  });

  changed = changed
    .replace(/\\s+/g," ")
    .replace(/\\s+([,.!?])/g,"$1")
    .replace(/\\s+$/,"")
    .trim();

  let marked = escapeHtml(text);
  [...findings]
    .sort((a,b) => b.hit.length - a.hit.length)
    .forEach(f => {
      const cls = f.level === "context" ? ' class="context-mark"' : "";
      marked = marked.split(escapeHtml(f.hit)).join(`<mark${cls}>${escapeHtml(f.hit)}</mark>`);
    });

  const hasNo = findings.some(f => f.key.startsWith("internet-no"));
  const hasIgi = findings.some(f => f.key.startsWith("igi"));
  if(hasNo && hasIgi){
    score -= 8;
    addFinding(findings,{
      key:"combo-no-igi",
      hit:"",
      category:"커뮤니티식 표현의 결합",
      level:"warning",
      weight:0,
      reason:"‘-노’와 추임새 ‘이기’가 함께 쓰이면 우연한 방언보다 특정 커뮤니티식 말투일 가능성이 커집니다.",
      replacement:""
    });
  }

  score = Math.max(5, score);

  const suggestions = findings.length ? [
    changed || "해당 추임새를 빼고 문장의 뜻만 전달해 보세요.",
    "상대나 집단을 부르는 말보다 구체적인 행동과 상황을 적어 보세요.",
    "표현의 유래가 조롱 문화와 연결되어 있다면 일반적인 종결어미와 호칭으로 바꿔 보세요."
  ] : [
    text,
    "대상과 상황을 더 구체적으로 적으면 오해를 줄일 수 있습니다."
  ];

  return {findings, score, marked, suggestions:[...new Set(suggestions)]};
}

function render(){
  const text = inputText.value.trim();
  if(!text){
    alert("점검할 문장을 먼저 입력해 주세요.");
    inputText.focus();
    return;
  }

  const result = analyze(text);
  resultSection.classList.remove("hidden");
  issueList.innerHTML = "";
  suggestionList.innerHTML = "";
  highlightedText.innerHTML = result.marked;
  scoreText.textContent = `${result.score}점`;
  meterBar.style.width = `${result.score}%`;

  const dangerCount = result.findings.filter(f => f.level === "danger").length;
  const warningCount = result.findings.filter(f => f.level === "warning").length;
  const contextCount = result.findings.filter(f => f.level === "context").length;

  if(dangerCount > 0 || result.score < 50){
    meterBar.style.background = "#9c3d35";
    statusBox.className = "status-box danger";
    statusIcon.textContent = "!";
    statusTitle.textContent = "직접적인 비하나 강한 집단 일반화가 포함될 수 있어요.";
    statusDescription.textContent = "사람의 정체성보다 구체적인 행동과 상황을 중심으로 바꿔 보세요.";
  }else if(warningCount > 0){
    meterBar.style.background = "#8a5a13";
    statusBox.className = "status-box warning";
    statusIcon.textContent = "!";
    statusTitle.textContent = "조롱 문화에서 퍼진 인터넷식 표현이 보여요.";
    statusDescription.textContent = "뜻 없는 추임새나 호칭도 반복되면 혐오와 조롱을 일상화할 수 있습니다.";
  }else if(contextCount > 0){
    meterBar.style.background = "#5f5a9a";
    statusBox.className = "status-box context";
    statusIcon.textContent = "?";
    statusTitle.textContent = "문맥 확인이 필요한 표현이 있어요.";
    statusDescription.textContent = "방언이나 정상적인 정체성 표현일 수 있으므로 단어만으로 혐오라고 단정하지 않습니다.";
  }else{
    meterBar.style.background = "#2f6652";
    statusBox.className = "status-box";
    statusIcon.textContent = "✓";
    statusTitle.textContent = "등록된 점검 유형은 발견되지 않았어요.";
    statusDescription.textContent = "현재 사전에 없는 표현이거나 더 넓은 문맥 판단이 필요한 문장일 수 있습니다.";
  }

  if(result.findings.length){
    result.findings.forEach(f => {
      const p = document.createElement("p");
      p.className = "issue" + (f.level === "context" ? " context-issue" : "");
      p.innerHTML = `<strong>${escapeHtml(f.category)}</strong><br>${escapeHtml(f.reason)}`;
      issueList.appendChild(p);
    });
  }else{
    issueList.innerHTML = '<p class="issue">현재 등록된 표현 사전에서는 발견되지 않았습니다.</p>';
  }

  result.suggestions.forEach(s => {
    const p = document.createElement("p");
    p.className = "suggestion";
    p.textContent = s;
    suggestionList.appendChild(p);
  });

  resultSection.scrollIntoView({behavior:"smooth",block:"start"});
}

inputText.addEventListener("input",()=>{
  charCount.textContent = `${inputText.value.length} / 300`;
});

checkButton.addEventListener("click",render);

inputText.addEventListener("keydown",event=>{
  if((event.ctrlKey || event.metaKey) && event.key === "Enter"){
    render();
  }
});

exampleButton.addEventListener("click",()=>{
  const ex = examples[Math.floor(Math.random()*examples.length)];
  inputText.value = ex;
  charCount.textContent = `${ex.length} / 300`;
  inputText.focus();
});

copyButton.addEventListener("click",async()=>{
  const first = document.querySelector(".suggestion");
  if(!first) return;
  try{
    await navigator.clipboard.writeText(first.textContent);
    copyButton.textContent = "복사했어요";
    setTimeout(()=>copyButton.textContent="첫 번째 문장 복사",1500);
  }catch{
    alert("복사하지 못했습니다. 문장을 직접 선택해 주세요.");
  }
});
