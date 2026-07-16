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
const suggestedText = document.getElementById("suggestedText");
const copyButton = document.getElementById("copyButton");

const examples = [
  "요즘 애들은 책임감이 없어.",
  "여자는 기계를 잘 못 다뤄.",
  "남자는 힘든 일에도 울면 안 돼.",
  "외국인이라서 일을 잘 못할 것 같아.",
  "장애인인데도 정말 대단하다."
];

const rules = [
  {
    pattern: /요즘\s*애들은|요즘\s*아이들은/g,
    category: "연령에 따른 일반화",
    explanation: "일부 사람의 행동을 청소년 전체의 특성처럼 묶어 말하고 있습니다.",
    transform: (text) =>
      text.replace(/요즘\s*애들은|요즘\s*아이들은/g, "내가 만난 일부 청소년은")
  },
  {
    pattern: /여자는\s*(기계를\s*)?(잘\s*)?못\s*다(뤄|룬다|룰)/g,
    category: "성별 고정관념",
    explanation: "기계 사용 능력을 성별과 연결하고 있습니다. 능력은 개인의 경험과 숙련도에 따라 달라집니다.",
    transform: (text) =>
      text.replace(
        /여자는\s*(기계를\s*)?(잘\s*)?못\s*다(뤄|룬다|룰)/g,
        "기계 사용 능력은 개인의 경험에 따라 달라"
      )
  },
  {
    pattern: /남자는[^.!?]*(울면\s*안\s*돼|울어서는\s*안\s*된다)/g,
    category: "성별 역할 고정관념",
    explanation: "감정 표현의 가능 여부를 성별에 따라 제한하고 있습니다.",
    transform: (text) =>
      text.replace(
        /남자는[^.!?]*(울면\s*안\s*돼|울어서는\s*안\s*된다)/g,
        "누구나 힘들 때 감정을 표현할 수 있어"
      )
  },
  {
    pattern: /외국인이라서[^.!?]*(못할\s*것\s*같아|못한다|서툴)/g,
    category: "출신에 따른 편견",
    explanation: "국적이나 출신을 개인의 업무 능력과 바로 연결하고 있습니다.",
    transform: (text) =>
      text.replace(
        /외국인이라서[^.!?]*(못할\s*것\s*같아|못한다|서툴)/g,
        "업무 능력은 국적보다 개인의 경험과 역량을 기준으로 살펴보는 것이 좋아"
      )
  },
  {
    pattern: /장애인인데도|장애인인데/g,
    category: "장애에 대한 낮은 기대",
    explanation: "장애가 있으면 성취하기 어려울 것이라는 전제가 담긴 표현으로 받아들여질 수 있습니다.",
    transform: (text) =>
      text.replace(/장애인인데도|장애인인데/g, "")
  }
];

function normalizeSpacing(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?,])/g, "$1")
    .trim();
}

function analyzeText(text) {
  let changedText = text;
  const findings = [];

  rules.forEach((rule) => {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(text)) {
      findings.push({
        category: rule.category,
        explanation: rule.explanation
      });
      changedText = rule.transform(changedText);
    }
  });

  return {
    findings,
    suggested: normalizeSpacing(changedText)
  };
}

function renderResult() {
  const text = inputText.value.trim();

  if (!text) {
    alert("점검할 문장을 먼저 입력해 주세요.");
    inputText.focus();
    return;
  }

  const result = analyzeText(text);
  resultSection.classList.remove("hidden");
  issueList.innerHTML = "";

  if (result.findings.length === 0) {
    statusBox.classList.remove("warning");
    statusIcon.textContent = "✓";
    statusTitle.textContent = "등록된 점검 유형이 발견되지 않았어요.";
    statusDescription.textContent =
      "문제가 전혀 없다는 뜻은 아닙니다. 현재 프로그램에 등록된 기준에서는 발견되지 않았습니다.";

    issueList.innerHTML =
      '<p class="issue">문장의 대상과 상황을 구체적으로 표현했는지 한 번 더 확인해 보세요.</p>';
    suggestedText.textContent = text;
  } else {
    statusBox.classList.add("warning");
    statusIcon.textContent = "!";
    statusTitle.textContent = "편견이나 일반화로 받아들여질 수 있는 부분이 있어요.";
    statusDescription.textContent =
      "말하려던 뜻을 유지하면서 사람의 특성을 단정하지 않도록 바꿔 보았습니다.";

    result.findings.forEach((finding) => {
      const item = document.createElement("p");
      item.className = "issue";
      item.innerHTML = `<strong>${finding.category}</strong><br>${finding.explanation}`;
      issueList.appendChild(item);
    });

    suggestedText.textContent = result.suggested;
  }

  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

inputText.addEventListener("input", () => {
  charCount.textContent = `${inputText.value.length} / 300`;
});

checkButton.addEventListener("click", renderResult);

inputText.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    renderResult();
  }
});

exampleButton.addEventListener("click", () => {
  const randomExample = examples[Math.floor(Math.random() * examples.length)];
  inputText.value = randomExample;
  charCount.textContent = `${randomExample.length} / 300`;
  inputText.focus();
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(suggestedText.textContent);
    copyButton.textContent = "복사했어요";
    setTimeout(() => {
      copyButton.textContent = "추천 문장 복사";
    }, 1500);
  } catch {
    alert("복사하지 못했습니다. 문장을 직접 선택해 복사해 주세요.");
  }
});
