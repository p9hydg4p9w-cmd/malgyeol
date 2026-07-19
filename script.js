const input = document.getElementById("inputText");
const count = document.getElementById("count");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const exampleBtn = document.getElementById("exampleBtn");
const result = document.getElementById("result");
const scoreEl = document.getElementById("score");
const scoreLabel = document.getElementById("scoreLabel");
const barFill = document.getElementById("barFill");
const summaryBox = document.getElementById("summaryBox");
const summaryTitle = document.getElementById("summaryTitle");
const summaryText = document.getElementById("summaryText");
const highlighted = document.getElementById("highlighted");
const cards = document.getElementById("cards");
const foundCount = document.getElementById("foundCount");
const suggestions = document.getElementById("suggestions");
const copyBtn = document.getElementById("copyBtn");

const respectMetric = document.getElementById("respectMetric");
const attackMetric = document.getElementById("attackMetric");
const generalMetric = document.getElementById("generalMetric");
const slangMetric = document.getElementById("slangMetric");
const formalMetric = document.getElementById("formalMetric");

const examples = [
  "개웃기노 이기. 게이야 이것 좀 봐라.",
  "개추 박았다. 팩폭 지렸다.",
  "요즘 급식충들은 예의가 없어.",
  "그는 게이다.",
  "어디 가노?",
  "여자들은 원래 운전을 못해.",
  "뇌절 그만하고 억까하지 마."
];

const dictionary = [
  // 직접 비하
  ["급식충","청소년 비하","danger",24,"학생","학생·청소년을 벌레에 빗대어 낮춰 부르는 표현입니다."],
  ["맘충","여성·양육자 비하","danger",26,"일부 보호자","일부 양육자의 행동을 어머니 전체의 특성처럼 묶어 비하합니다."],
  ["틀딱충","노인 비하","danger",28,"일부 고령층","고령자를 벌레에 빗대어 낮춰 부르는 표현입니다."],
  ["틀딱","노인 비하","danger",26,"일부 고령층","노인을 나이만으로 낮춰 부르는 인터넷식 멸칭입니다."],
  ["김치녀","여성 혐오·일반화","danger",30,"일부 여성","한국 여성 전체에 부정적인 속성을 덧씌우는 표현입니다."],
  ["한녀","여성 비하·일반화","danger",28,"일부 여성","한국 여성 전체를 하나의 부정적인 집단처럼 묶는 표현입니다."],
  ["한남충","남성 비하·일반화","danger",30,"일부 남성","한국 남성을 벌레에 빗대어 비하하는 표현입니다."],
  ["한남","남성 비하·일반화","danger",28,"일부 남성","한국 남성 전체를 부정적으로 묶어 부르는 표현입니다."],
  ["된장녀","여성에 대한 소비 고정관념","danger",25,"과소비하는 일부 사람","소비 습관에 대한 비판을 여성 전체의 특성으로 연결합니다."],
  ["김여사","여성 운전자 고정관념","warning",19,"해당 운전자","운전 실수를 여성 전체의 능력과 연결할 수 있습니다."],
  ["외노자","이주노동자 비하","danger",28,"이주노동자","외국인 노동자를 축약해 낮춰 부르는 표현으로 사용될 수 있습니다."],
  ["짱깨","중국인·중국계 비하","danger",34,"중국인","국적과 민족을 이유로 사람을 모욕적으로 부르는 표현입니다."],
  ["쪽바리","일본인 비하","danger",34,"일본인","일본인 전체를 모욕적으로 부르는 민족 비하 표현입니다."],
  ["전라디언","지역 비하","danger",28,"전라도 출신 사람","출신 지역을 이유로 사람을 낮춰 부르는 표현입니다."],
  ["경상디언","지역 비하","danger",28,"경상도 출신 사람","출신 지역을 이유로 사람을 낮춰 부르는 표현입니다."],
  ["개독","종교 집단 비하","danger",26,"일부 기독교인","일부의 행동을 종교인 전체의 특성처럼 묶어 비하합니다."],
  ["병신","장애 비하에서 유래한 욕설","rough",18,"어리석은 행동","장애를 욕설의 재료로 사용해 상대를 낮추는 표현입니다."],
  ["정신병자","정신질환 비하","danger",28,"공격적인 사람","정신질환을 타인을 모욕하는 말로 사용합니다."],
  ["벙어리","장애 관련 낡은 표현","warning",20,"언어장애인","사람을 장애 특성만으로 부르는 낡고 비하적으로 받아들여질 수 있는 표현입니다."],
  ["장님","장애 관련 낡은 표현","warning",20,"시각장애인","사람을 장애 특성만으로 부르는 낡고 비하적으로 받아들여질 수 있는 표현입니다."],

  // 인터넷식 호칭·조롱
  ["게이들아","정체성을 이용한 인터넷식 호칭","warning",15,"다들","성적 지향을 장난스러운 집단 호칭으로 사용하면 정체성을 희화화할 수 있습니다."],
  ["게이야","정체성을 이용한 인터넷식 호칭","warning",15,"친구야","‘게이’는 중립적인 정체성 명칭이지만 관계없는 상대를 호칭으로 부르면 희화화가 될 수 있습니다."],
  ["잼민이충","아동 비하","danger",23,"일부 어린이","어린이를 벌레에 빗대어 낮춰 부르는 표현입니다."],
  ["잼민이","아동을 낮춰 부를 수 있는 은어","context",10,"어린이","친근한 별명처럼 쓰이기도 하지만 어린이를 무시하는 맥락에서는 비하가 될 수 있습니다."],
  ["꼰대","권위적 태도를 비판하는 속어","context",9,"권위적인 사람","나이 자체가 아니라 행동을 비판하는지 문맥을 확인할 필요가 있습니다."],
  ["찐따","개인 모욕 표현","rough",16,"소외된 사람","사회적 관계나 성격을 이유로 개인을 낮춰 부르는 표현입니다."],
  ["관종","개인 모욕성 은어","rough",12,"관심을 받고 싶어 하는 사람","상대의 행동을 조롱하는 인터넷식 표현입니다."],

  // 비격식 은어
  ["개추 눌렀다","온라인 은어·비격식 표현","informal",5,"추천했다","‘개추’는 온라인 커뮤니티에서 추천을 뜻하는 은어입니다."],
  ["개추 박았다","온라인 은어·거친 표현","informal",7,"추천을 눌렀다","‘개추’와 ‘박았다’가 결합된 거친 인터넷식 표현입니다."],
  ["개추","온라인 은어","informal",4,"추천","온라인 커뮤니티에서 게시글 추천을 뜻하는 줄임말입니다."],
  ["비추 박았다","온라인 은어·거친 표현","informal",7,"비추천을 눌렀다","비추천 행동을 거칠게 표현한 인터넷식 말투입니다."],
  ["비추","온라인 은어","informal",4,"비추천","온라인 커뮤니티에서 비추천을 뜻하는 줄임말입니다."],
  ["추천 박는다","거친 인터넷식 표현","informal",6,"추천한다","‘박는다’가 행동을 거칠게 표현합니다."],
  ["댓글 박았다","거친 인터넷식 표현","informal",6,"댓글을 남겼다","댓글 작성 행동을 거칠게 표현합니다."],
  ["팩트 박았다","거친 인터넷식 표현","informal",7,"사실을 분명히 말했다","‘박았다’가 행동을 과장되고 거칠게 표현합니다."],
  ["팩폭","온라인 은어","informal",6,"핵심을 찌르는 지적","‘팩트 폭력’ 또는 ‘팩트 폭격’을 줄인 비격식 표현입니다."],
  ["뇌절","온라인 은어","informal",7,"지나치게 반복함","같은 말이나 행동을 지나치게 반복한다는 뜻의 인터넷 은어입니다."],
  ["억까","온라인 은어","informal",7,"억지스러운 비판","근거 없이 억지로 비판한다는 뜻의 인터넷 은어입니다."],
  ["억빠","온라인 은어","informal",7,"근거 없이 지나치게 옹호함","근거 없이 과도하게 옹호한다는 뜻의 인터넷 은어입니다."],
  ["긁혔네","도발성 인터넷 표현","rough",10,"기분이 상한 것 같다","상대가 화났음을 조롱하듯 표현하는 말입니다."],
  ["긁?","도발성 인터넷 표현","rough",10,"기분이 상했어?","상대의 감정을 자극하려는 짧은 도발 표현입니다."],
  ["꼽주다","거친 구어 표현","rough",9,"면박을 주다","상대에게 불쾌감이나 수치심을 주는 행동을 거칠게 표현합니다."],
  ["후려치다","과격한 비유 표현","informal",7,"가치를 낮게 평가하다","가치나 능력을 지나치게 낮게 평가한다는 뜻의 비격식 표현입니다."],
  ["레전드","인터넷식 감탄 표현","informal",3,"정말 대단하다","공식적인 상황에서는 뜻이 분명한 표현으로 바꿀 수 있습니다."],
  ["실화냐","인터넷식 감탄 표현","informal",4,"정말이야?","놀람을 나타내는 비격식 인터넷 표현입니다."],
  ["ㄹㅇ","초성 은어","informal",4,"정말","‘레알’을 초성으로 줄인 비격식 표현입니다."],
  ["ㅇㅈ","초성 은어","informal",4,"인정","‘인정’을 초성으로 줄인 비격식 표현입니다."],

  // 거친 표현
  ["쳐먹다","거친 표현","rough",16,"먹다","먹는 행동을 거칠고 공격적으로 표현합니다."],
  ["아가리","거친 비속어","rough",18,"입","사람의 입을 낮춰 부르는 공격적인 표현입니다."],
  ["닥쳐","공격적 명령 표현","rough",18,"잠시 조용히 해 줘","상대의 발언을 강하게 막는 공격적인 표현입니다."],
  ["지랄","거친 욕설","rough",20,"과도하게 행동하다","상대의 행동을 모욕적으로 비난하는 욕설입니다."],
  ["염병","거친 욕설","rough",20,"과도하게 행동하다","질병을 욕설로 사용한 거친 표현입니다."],
  ["개새끼","강한 개인 모욕","rough",28,"매우 무례한 사람","상대를 동물에 빗대어 모욕하는 강한 욕설입니다."],
  ["존나","강한 비속어 강조","rough",12,"정말","강조를 위해 사용되는 거친 비속어입니다."],
  ["씹","거친 강조 표현","rough",11,"매우","다른 말 앞에 붙어 강한 비속어 느낌을 만드는 표현입니다."]
].map(function(x){
  return {word:x[0],type:x[1],level:x[2],score:x[3],replace:x[4],reason:x[5]};
});

// 문장 패턴
const patterns = [
  {regex:/여자(들)?은 원래/g, hit:"여자들은 원래", type:"성별 일반화", level:"warning", score:22, replace:"일부 사람은", reason:"여성 전체를 하나의 성격이나 능력으로 단정합니다."},
  {regex:/남자(들)?은 원래/g, hit:"남자들은 원래", type:"성별 일반화", level:"warning", score:22, replace:"일부 사람은", reason:"남성 전체를 하나의 성격이나 능력으로 단정합니다."},
  {regex:/여자(들)?은 다/g, hit:"여자들은 다", type:"성별 일반화", level:"warning", score:22, replace:"일부 여성은", reason:"여성 전체의 특성을 단정하는 표현입니다."},
  {regex:/남자(들)?은 다/g, hit:"남자들은 다", type:"성별 일반화", level:"warning", score:22, replace:"일부 남성은", reason:"남성 전체의 특성을 단정하는 표현입니다."},
  {regex:/요즘 (애|아이)들은/g, hit:"요즘 애들은", type:"세대 일반화", level:"warning", score:18, replace:"내가 만난 일부 청소년은", reason:"일부 청소년의 행동을 세대 전체의 특성처럼 묶어 말합니다."},
  {regex:/노인(들)?은 다/g, hit:"노인들은 다", type:"연령 일반화", level:"warning", score:20, replace:"일부 고령층은", reason:"고령자 전체의 특성을 단정하는 표현입니다."},
  {regex:/외국인이라서/g, hit:"외국인이라서", type:"국적·출신 편견 가능성", level:"context", score:12, replace:"개인의 경험을 고려하면", reason:"국적을 개인의 능력이나 성격과 직접 연결할 수 있습니다."},
  {regex:/장애인인데도/g, hit:"장애인인데도", type:"장애에 대한 낮은 기대", level:"warning", score:20, replace:"", reason:"장애가 있으면 성취하기 어려울 것이라는 전제가 담길 수 있습니다."},
  {regex:/여자치고/g, hit:"여자치고", type:"성별에 따른 낮은 기대", level:"warning", score:20, replace:"", reason:"성별을 기준으로 능력의 기대치를 낮게 설정합니다."},
  {regex:/외국인치고/g, hit:"외국인치고", type:"출신에 따른 낮은 기대", level:"warning", score:20, replace:"", reason:"출신을 기준으로 능력의 기대치를 낮게 설정합니다."}
];

function escapeHtml(text){
  return text.replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
  });
}

function addUnique(found,item){
  if(!found.some(function(x){return x.type===item.type && x.hit===item.hit;})){
    found.push(item);
  }
}

function analyzeText(text){
  let found = [];
  let changed = text;
  let score = 100;

  const ordered = [...dictionary].sort(function(a,b){return b.word.length-a.word.length;});
  ordered.forEach(function(item){
    if(text.includes(item.word)){
      addUnique(found,{...item,hit:item.word});
      score -= item.score;
      changed = changed.split(item.word).join(item.replace);
    }
  });

  patterns.forEach(function(item){
    item.regex.lastIndex = 0;
    if(item.regex.test(text)){
      addUnique(found,{...item});
      score -= item.score;
      changed = changed.replace(item.regex,item.replace);
    }
  });

  // 추임새 '이기' (이기다, 이기적 제외)
  if(/(^|[\s,.!?])이기(?:야)?(?=$|[\s,.!?])/.test(text)){
    addUnique(found,{
      hit:"이기",type:"인터넷식 추임새",level:"warning",score:16,replace:"",
      reason:"‘이기다’의 일부가 아닌 추임새로 사용되면 온라인 조롱 문화에서 퍼진 말투로 받아들여질 수 있습니다."
    });
    score -= 16;
    changed = changed.replace(/(^|[\s,.!?])이기(?:야)?(?=$|[\s,.!?])/g,"$1");
  }

  // '-노' 문맥 판별
  const noMatch = text.match(/([가-힣]+)노(?=$|[\s,.!?])/);
  if(noMatch){
    const full = noMatch[0];
    const stem = noMatch[1];
    const dialectQuestion = text.trim().endsWith("?") &&
      /^(어디|뭐|왜|누가|언제|어떻게|얼마|몇)/.test(stem);

    if(dialectQuestion){
      addUnique(found,{
        hit:full,type:"방언일 가능성이 있는 표현",level:"context",score:3,replace:full,
        reason:"문장 끝의 ‘-노’는 실제 경상도 방언일 수 있으므로 혐오표현으로 단정하지 않습니다."
      });
      score -= 3;
    }else{
      addUnique(found,{
        hit:full,type:"인터넷식 ‘-노’ 종결 표현",level:"context",score:12,replace:stem+"다",
        reason:"실제 방언일 수도 있지만 평서문에서 반복되면 온라인 조롱 문화와 연결된 말투로 받아들여질 수 있습니다."
      });
      score -= 12;
      changed = changed.replace(full,stem+"다");
    }
  }

  if(found.some(x=>x.type.includes("‘-노’")) && found.some(x=>x.type==="인터넷식 추임새")){
    addUnique(found,{
      hit:"-노 + 이기",type:"커뮤니티식 표현의 결합",level:"warning",score:8,replace:"",
      reason:"‘-노’와 ‘이기’가 함께 쓰이면 실제 방언보다 특정 인터넷 커뮤니티식 말투일 가능성이 커집니다."
    });
    score -= 8;
  }

  score = Math.max(5,score);
  changed = changed.replace(/\s+/g," ").replace(/\s+([,.!?])/g,"$1").trim();

  let marked = escapeHtml(text);
  found.filter(x=>x.hit && x.hit!=="-노 + 이기")
    .sort((a,b)=>b.hit.length-a.hit.length)
    .forEach(function(item){
      marked = marked.split(escapeHtml(item.hit)).join(
        '<mark class="'+item.level+'">'+escapeHtml(item.hit)+'</mark>'
      );
    });

  const counts = {
    danger:found.filter(x=>x.level==="danger").length,
    warning:found.filter(x=>x.level==="warning").length,
    context:found.filter(x=>x.level==="context").length,
    informal:found.filter(x=>x.level==="informal").length,
    rough:found.filter(x=>x.level==="rough").length
  };

  const metrics = {
    respect:Math.max(0,100-(counts.danger*24+counts.warning*14+counts.rough*12)),
    attack:Math.min(100,counts.danger*28+counts.rough*22+counts.warning*8),
    general:Math.min(100,found.filter(x=>x.type.includes("일반화")||x.type.includes("낮은 기대")).length*25),
    slang:Math.min(100,(counts.informal*18+counts.context*12+counts.warning*7)),
    formal:Math.max(0,100-(counts.informal*20+counts.rough*18+counts.context*8))
  };

  let suggestionList = [];
  if(found.length){
    suggestionList.push(changed || "거친 추임새와 호칭을 빼고 문장의 뜻만 전달해 보세요.");
    if(text.includes("웃기노")) suggestionList.push("진짜 웃기다.");
    else suggestionList.push("집단 전체보다 구체적인 사람과 행동을 중심으로 표현해 보세요.");
    suggestionList.push("공식적인 상황에서는 줄임말과 거친 표현을 뜻이 분명한 말로 바꿔 보세요.");
  }else{
    suggestionList=[text,"대상과 상황을 더 구체적으로 적으면 오해를 줄일 수 있습니다."];
  }

  return {found,score,marked,suggestionList:[...new Set(suggestionList)],counts,metrics};
}

function render(){
  const text=input.value.trim();
  if(!text){alert("점검할 문장을 입력해 주세요.");return;}

  const data=analyzeText(text);
  result.classList.remove("hidden");
  scoreEl.textContent=data.score+"점";
  barFill.style.width=data.score+"%";
  foundCount.textContent=data.found.length+"개";
  highlighted.innerHTML=data.marked;
  cards.innerHTML="";
  suggestions.innerHTML="";

  respectMetric.textContent=data.metrics.respect;
  attackMetric.textContent=data.metrics.attack;
  generalMetric.textContent=data.metrics.general;
  slangMetric.textContent=data.metrics.slang;
  formalMetric.textContent=data.metrics.formal;

  summaryBox.className="summary";
  if(data.counts.danger){
    summaryBox.classList.add("danger");
    summaryTitle.textContent="직접적인 집단 비하 표현이 포함될 수 있어요.";
    summaryText.textContent="정체성보다 구체적인 행동과 상황을 중심으로 표현해 보세요.";
    scoreLabel.textContent="강한 비하 가능성";
    barFill.style.background="#9b3f37";
  }else if(data.counts.warning){
    summaryBox.classList.add("warning");
    summaryTitle.textContent="일반화하거나 조롱하는 표현이 보여요.";
    summaryText.textContent="가벼운 호칭과 말투도 반복되면 편견과 조롱을 일상화할 수 있습니다.";
    scoreLabel.textContent="주의 필요";
    barFill.style.background="#8a5a13";
  }else if(data.counts.rough){
    summaryBox.classList.add("rough");
    summaryTitle.textContent="거칠거나 공격적인 표현이 보여요.";
    summaryText.textContent="뜻은 유지하면서 상대를 직접 공격하지 않는 말로 바꿀 수 있습니다.";
    scoreLabel.textContent="거친 표현";
    barFill.style.background="#555b54";
  }else if(data.counts.context){
    summaryBox.classList.add("context");
    summaryTitle.textContent="문맥 확인이 필요한 표현이 있어요.";
    summaryText.textContent="방언이나 다른 뜻일 수 있으므로 단어 하나만으로 혐오라고 단정하지 않습니다.";
    scoreLabel.textContent="문맥 확인";
    barFill.style.background="#5f5a9a";
  }else if(data.counts.informal){
    summaryBox.classList.add("informal");
    summaryTitle.textContent="비격식 인터넷 은어가 보여요.";
    summaryText.textContent="혐오표현은 아니지만 공식적인 글에서는 뜻이 분명한 표현이 더 적절합니다.";
    scoreLabel.textContent="비격식 표현";
    barFill.style.background="#3d6477";
  }else{
    summaryTitle.textContent="등록된 점검 유형은 발견되지 않았어요.";
    summaryText.textContent="현재 사전에 없는 표현이거나 더 넓은 문맥 판단이 필요할 수 있습니다.";
    scoreLabel.textContent="존중 표현";
    barFill.style.background="#2f6652";
  }

  if(!data.found.length){
    cards.innerHTML='<div class="finding context"><strong>현재 사전에서는 발견되지 않음</strong><p>문제가 전혀 없다는 뜻은 아닙니다.</p></div>';
  }else{
    data.found.forEach(function(item){
      const div=document.createElement("div");
      div.className="finding "+item.level;
      div.innerHTML="<strong>"+escapeHtml(item.type)+"</strong><p>"+escapeHtml(item.reason)+"</p><small>추천: "+escapeHtml(item.replace||"문장 전체를 부드럽게 바꾸기")+"</small>";
      cards.appendChild(div);
    });
  }

  data.suggestionList.forEach(function(text){
    const p=document.createElement("p");
    p.className="suggestion";
    p.textContent=text;
    suggestions.appendChild(p);
  });

  result.scrollIntoView({behavior:"smooth"});
}

input.addEventListener("input",()=>count.textContent=input.value.length+" / 400");
analyzeBtn.addEventListener("click",render);
clearBtn.addEventListener("click",()=>{
  input.value="";count.textContent="0 / 400";result.classList.add("hidden");
});
exampleBtn.addEventListener("click",()=>{
  const ex=examples[Math.floor(Math.random()*examples.length)];
  input.value=ex;count.textContent=ex.length+" / 400";
});
copyBtn.addEventListener("click",async()=>{
  const first=document.querySelector(".suggestion");
  if(!first)return;
  try{
    await navigator.clipboard.writeText(first.textContent);
    copyBtn.textContent="복사했어요";
    setTimeout(()=>copyBtn.textContent="첫 문장 복사",1200);
  }catch{alert("복사하지 못했습니다.");}
});
