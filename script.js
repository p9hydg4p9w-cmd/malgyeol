const $ = (id) => document.getElementById(id);

const inputText = $("inputText");
const charCount = $("charCount");
const checkButton = $("checkButton");
const clearButton = $("clearButton");
const exampleButton = $("exampleButton");
const resultSection = $("resultSection");
const statusBox = $("statusBox");
const statusIcon = $("statusIcon");
const statusTitle = $("statusTitle");
const statusDescription = $("statusDescription");
const highlightedText = $("highlightedText");
const scoreText = $("scoreText");
const scoreLabel = $("scoreLabel");
const meterBar = $("meterBar");
const findingCards = $("findingCards");
const findingCount = $("findingCount");
const suggestionList = $("suggestionList");
const copyButton = $("copyButton");

const examples = [
  "개웃기노 이기.",
  "오늘 날씨 좋노 이기야.",
  "게이야 이것 좀 봐라.",
  "요즘 급식충들은 예의가 없어.",
  "맘충 때문에 카페가 시끄럽다.",
  "틀딱들은 인터넷을 못해.",
  "그는 게이다.",
  "어디 가노?",
  "전라도 사람은 믿으면 안 돼.",
  "여자는 다 운전을 못해."
];

const directRules = [
  {
    terms:["급식충"], category:"청소년 비하", level:"danger", weight:24,
    reason:"학생이나 청소년을 벌레에 빗대어 집단 전체를 낮춰 부르는 표현입니다.",
    origin:"일부 온라인 공간에서 청소년을 조롱하는 멸칭으로 널리 사용됩니다.",
    replacement:"학생"
  },
  {
    terms:["맘충"], category:"여성·양육자 비하", level:"danger", weight:26,
    reason:"일부 양육자의 행동을 어머니 집단 전체의 속성처럼 묶어 비하합니다.",
    origin:"특정 행동을 비판하는 말에서 출발해 어머니 전체를 낮춰 부르는 표현으로 확장되었습니다.",
    replacement:"일부 보호자"
  },
  {
    terms:["틀딱","틀딱충"], category:"노인 비하", level:"danger", weight:26,
    reason:"노인을 나이만으로 낮춰 부르고 부정적인 특성을 일반화하는 표현입니다.",
    origin:"고령자를 조롱하는 인터넷 멸칭으로 사용됩니다.",
    replacement:"일부 고령층"
  },
  {
    terms:["김치녀"], category:"여성 혐오·성별 일반화", level:"danger", weight:30,
    reason:"한국 여성 전체에 부정적인 속성을 덧씌우는 성별 비하 표현입니다.",
    origin:"여성을 하나의 부정적인 유형으로 묶는 인터넷식 멸칭입니다.",
    replacement:"일부 사람"
  },
  {
    terms:["한남","한남충"], category:"남성 비하·성별 일반화", level:"danger", weight:30,
    reason:"한국 남성 전체를 하나의 부정적인 집단으로 묶어 비하하는 표현입니다.",
    origin:"남성을 집단적으로 조롱하는 인터넷식 멸칭으로 사용됩니다.",
    replacement:"일부 남성"
  },
  {
    terms:["외노자"], category:"이주노동자 비하", level:"danger", weight:28,
    reason:"외국인 노동자를 축약해 낮춰 부르는 맥락으로 쓰일 수 있습니다.",
    origin:"이주노동자의 정체성과 노동을 낮춰 보는 표현으로 사용되는 경우가 많습니다.",
    replacement:"이주노동자"
  },
  {
    terms:["짱깨"], category:"중국인·중국계 비하", level:"danger", weight:34,
    reason:"국적과 민족을 이유로 사람을 모욕적으로 부르는 표현입니다.",
    origin:"중국인과 중국계 사람을 낮춰 부르는 멸칭입니다.",
    replacement:"중국인"
  },
  {
    terms:["쪽바리"], category:"일본인 비하", level:"danger", weight:34,
    reason:"일본인 전체를 모욕적으로 부르는 민족 비하 표현입니다.",
    origin:"일본인과 일본계 사람을 낮춰 부르는 멸칭입니다.",
    replacement:"일본인"
  },
  {
    terms:["장애인인데도","장애인인데"], category:"장애에 대한 낮은 기대", level:"warning", weight:20,
    reason:"장애가 있으면 성취하기 어려울 것이라는 전제가 담길 수 있습니다.",
    origin:"칭찬처럼 보이지만 장애를 낮은 기대와 연결할 수 있는 표현입니다.",
    replacement:""
  },
  {
    terms:["전라도 사람은","경상도 사람은"], category:"지역 일반화", level:"warning", weight:22,
    reason:"개인의 성격이나 행동을 출신 지역 전체의 특성으로 일반화합니다.",
    origin:"지역 정체성을 개인의 성격과 연결하는 편견을 강화할 수 있습니다.",
    replacement:"그 사람은"
  },
  {
    terms:["여자는 다","남자는 다"], category:"성별 일반화", level:"warning", weight:22,
    reason:"개인의 차이를 지우고 성별 집단 전체를 하나의 성격으로 단정합니다.",
    origin:"성별 고정관념을 반복하고 강화할 수 있는 문장 구조입니다.",
    replacement:"일부 사람은"
  },
  {
    terms:["요즘 애들은","요즘 아이들은"], category:"세대 일반화", level:"warning", weight:18,
    reason:"일부 청소년의 행동을 세대 전체의 특성처럼 묶어 말합니다.",
    origin:"세대 간 갈등을 강화하는 대표적인 일반화 문장입니다.",
    replacement:"내가 만난 일부 청소년은"
  }
];

function escapeHtml(text){
  return text.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function addFinding(list, item){
  if(!list.some(x => x.key === item.key)) list.push(item);
}

function detectInternetNo(text, findings){
  // 핵심 수정: '개웃기노', '좋노', '레전드노'처럼 평서형에 붙은 -노를 안정적으로 탐지
  const regex = /([가-힣]+?)노(?=($|[\s,.!?]))/g;
  let match;

  while((match = regex.exec(text)) !== null){
    const full = match[0];
    const stem = match[1];
    const before = text.slice(0, match.index);
    const sentenceEnd = text.slice(match.index + full.length).trim();
    const hasQuestionMark = sentenceEnd.startsWith("?") || text.trim().endsWith("?");
    const questionWord = /(어디|뭐|무엇|왜|누가|언제|어째|어떻게|얼마|몇|우째)$/;
    const likelyDialectQuestion = hasQuestionMark && questionWord.test(stem);

    if(likelyDialectQuestion){
      addFinding(findings,{
        key:`dialect-no-${match.index}`,
        hit:full, category:"방언일 가능성이 있는 표현", level:"context", weight:3,
        reason:"문장 끝의 ‘-노’는 경상도 방언의 의문형이나 종결 표현일 수 있습니다. 이 경우 혐오표현으로 단정하지 않습니다.",
        origin:"방언과 인터넷식 모방 표현은 표면적으로 같을 수 있어 화자의 지역과 문장 기능을 함께 봐야 합니다.",
        replacement:full
      });
    }else{
      const natural = makeNaturalEnding(stem);
      addFinding(findings,{
        key:`internet-no-${match.index}`,
        hit:full, category:"인터넷식 ‘-노’ 종결 표현", level:"context", weight:12,
        reason:"평서문 끝에 붙인 ‘-노’는 실제 방언일 수도 있지만, 방언과 무관하게 반복될 경우 특정 온라인 조롱 문화와 연결된 표현으로 받아들여질 수 있습니다.",
        origin:"방언에서 온 형태와 온라인 커뮤니티식 말투가 겹쳐 있으므로 사용 맥락을 확인해야 합니다.",
        replacement:natural
      });
    }
  }
}

function makeNaturalEnding(stem){
  if(stem.endsWith("기")) return stem + "다";
  if(stem.endsWith("하")) return stem + "다";
  if(stem.endsWith("좋")) return stem + "다";
  if(stem.endsWith("맞")) return stem + "다";
  return stem + "다";
}

function detectIgi(text, findings){
  // '이기다', '이기적인' 제외. 문장 끝/쉼표 뒤 추임새만 탐지
  const regex = /(^|[\s,.!?])(이기(?:야)?)(?=($|[\s,.!?]))/g;
  let match;
  while((match = regex.exec(text)) !== null){
    addFinding(findings,{
      key:`igi-${match.index}`,
      hit:match[2], category:"인터넷식 추임새 ‘이기’", level:"warning", weight:16,
      reason:"‘이기다’의 일부가 아니라 의미 없는 추임새로 사용된 경우, 특정 온라인 조롱 문화에서 확산된 말투로 받아들여질 수 있습니다.",
      origin:"뜻이 없는 추임새라도 반복되면 조롱의 유래가 지워진 채 일상화될 수 있습니다.",
      replacement:""
    });
  }
}

function detectGeya(text, findings){
  const regex = /게이(야|들아)/g;
  let match;
  while((match = regex.exec(text)) !== null){
    addFinding(findings,{
      key:`geya-${match.index}`,
      hit:match[0], category:"정체성을 이용한 인터넷식 호칭", level:"warning", weight:15,
      reason:"‘게이’는 성적 지향을 나타내는 중립적인 명칭이지만, 관계없는 상대를 장난스러운 호칭으로 부르면 정체성을 희화화할 수 있습니다.",
      origin:"정체성 자체를 농담이나 호칭으로 소비하는 방식은 성소수자를 조롱의 대상으로 만들 수 있습니다.",
      replacement:match[0].includes("들") ? "다들" : "친구야"
    });
  }
}

function analyze(text){
  const findings = [];
  let changed = text;
  let score = 100;

  directRules.forEach(rule => {
    rule.terms.forEach(term => {
      if(text.includes(term)){
        addFinding(findings,{
          key:`direct-${term}`, hit:term, category:rule.category, level:rule.level,
          weight:rule.weight, reason:rule.reason, origin:rule.origin, replacement:rule.replacement
        });
      }
    });
  });

  detectInternetNo(text, findings);
  detectIgi(text, findings);
  detectGeya(text, findings);

  const hasInternetNo = findings.some(f => f.key.startsWith("internet-no"));
  const hasIgi = findings.some(f => f.key.startsWith("igi"));
  if(hasInternetNo && hasIgi){
    addFinding(findings,{
      key:"combo-no-igi", hit:"-노 + 이기", category:"커뮤니티식 표현의 결합",
      level:"warning", weight:8,
      reason:"‘-노’와 추임새 ‘이기’가 함께 쓰이면 우연한 방언보다 인터넷 커뮤니티식 말투일 가능성이 커집니다.",
      origin:"표현 하나보다 여러 특징이 함께 나타날 때 조롱 문화의 말투가 더 분명하게 드러날 수 있습니다.",
      replacement:""
    });
  }

  findings.forEach(f => {
    score -= f.weight;
    if(f.hit && f.replacement !== f.hit && !f.key.startsWith("combo")){
      changed = changed.split(f.hit).join(f.replacement);
    }
  });

  changed = changed
    .replace(/\s+/g," ")
    .replace(/\s+([,.!?])/g,"$1")
    .replace(/([.!?]){2,}/g,"$1")
    .trim();

  let marked = escapeHtml(text);
  [...findings]
    .filter(f => f.hit && !f.key.startsWith("combo"))
    .sort((a,b) => b.hit.length - a.hit.length)
    .forEach(f => {
      const cls = f.level === "danger" ? "danger-mark" :
                  f.level === "warning" ? "warning-mark" : "context-mark";
      marked = marked.split(escapeHtml(f.hit))
        .join(`<mark class="${cls}">${escapeHtml(f.hit)}</mark>`);
    });

  score = Math.max(5, score);

  const suggestions = findings.length ? [
    changed || "해당 추임새와 호칭을 빼고 문장의 뜻만 전달해 보세요.",
    buildMeaningSuggestion(text),
    "집단이나 정체성을 부르는 말보다 구체적인 행동과 상황을 중심으로 표현해 보세요."
  ] : [
    text,
    "대상과 상황을 더 구체적으로 적으면 오해를 줄일 수 있습니다."
  ];

  return {findings, score, marked, suggestions:[...new Set(suggestions)]};
}

function buildMeaningSuggestion(text){
  if(/웃기노/.test(text)) return "진짜 웃기다.";
  if(/좋노/.test(text)) return "정말 좋다.";
  if(/맛있노/.test(text)) return "정말 맛있다.";
  if(/게이야/.test(text)) return text.replace(/게이야/g,"친구야");
  return "원래 전하려던 뜻을 일반적인 종결어미와 호칭으로 표현해 보세요.";
}

function setScoreUI(score){
  scoreText.textContent = `${score}점`;

  if(score >= 85){
    scoreLabel.textContent = "존중 표현";
    meterBar.style.background = "#2f6652";
  }else if(score >= 60){
    scoreLabel.textContent = "문맥 확인";
    meterBar.style.background = "#5f5a9a";
  }else if(score >= 40){
    scoreLabel.textContent = "주의 필요";
    meterBar.style.background = "#8a5a13";
  }else{
    scoreLabel.textContent = "강한 비하 가능성";
    meterBar.style.background = "#9c3d35";
  }

  meterBar.style.width = `${score}%`;
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
  highlightedText.innerHTML = result.marked;
  findingCards.innerHTML = "";
  suggestionList.innerHTML = "";
  findingCount.textContent = `${result.findings.length}개`;
  setScoreUI(result.score);

  const danger = result.findings.some(f => f.level === "danger");
  const warning = result.findings.some(f => f.level === "warning");
  const context = result.findings.some(f => f.level === "context");

  if(danger){
    statusBox.className = "status-box danger";
    statusIcon.textContent = "!";
    statusTitle.textContent = "직접적인 비하나 집단 일반화가 포함될 수 있어요.";
    statusDescription.textContent = "사람의 정체성보다 구체적인 행동과 상황을 중심으로 바꿔 보세요.";
  }else if(warning){
    statusBox.className = "status-box warning";
    statusIcon.textContent = "!";
    statusTitle.textContent = "조롱 문화에서 퍼진 인터넷식 표현이 보여요.";
    statusDescription.textContent = "가벼운 추임새나 호칭도 반복되면 혐오와 조롱을 일상화할 수 있습니다.";
  }else if(context){
    statusBox.className = "status-box context";
    statusIcon.textContent = "?";
    statusTitle.textContent = "문맥 확인이 필요한 표현이 있어요.";
    statusDescription.textContent = "방언일 가능성도 있으므로 단어 하나만으로 혐오라고 단정하지 않습니다.";
  }else{
    statusBox.className = "status-box";
    statusIcon.textContent = "✓";
    statusTitle.textContent = "등록된 점검 유형은 발견되지 않았어요.";
    statusDescription.textContent = "현재 사전에 없는 표현이거나 더 넓은 문맥 판단이 필요한 문장일 수 있습니다.";
  }

  if(result.findings.length === 0){
    findingCards.innerHTML = `
      <article class="finding-card context">
        <header><h4>현재 사전에서는 발견되지 않음</h4><span class="hit">안내</span></header>
        <p>문제가 전혀 없다는 뜻은 아닙니다. 현재 프로그램에 등록된 기준에서는 발견되지 않았습니다.</p>
      </article>`;
  }else{
    result.findings.forEach(f => {
      const article = document.createElement("article");
      article.className = `finding-card ${f.level}`;
      article.innerHTML = `
        <header>
          <h4>${escapeHtml(f.category)}</h4>
          <span class="hit">${escapeHtml(f.hit || "결합 표현")}</span>
        </header>
        <p>${escapeHtml(f.reason)}</p>
        <p class="origin"><strong>맥락·유래</strong><br>${escapeHtml(f.origin)}</p>
      `;
      findingCards.appendChild(article);
    });
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

clearButton.addEventListener("click",()=>{
  inputText.value = "";
  charCount.textContent = "0 / 300";
  resultSection.classList.add("hidden");
  inputText.focus();
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
