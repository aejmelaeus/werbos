export async function loadVerbData() {
  const response = await fetch("./data/verbs.v1.json");
  if (!response.ok) {
    throw new Error(`Could not load verb data: ${response.status}`);
  }

  const data = await response.json();
  validateVerbData(data);
  return data;
}

export async function loadSerEstarQuest() {
  const response = await fetch("./data/quests/ser-estar.v1.json");
  if (!response.ok) {
    throw new Error(`Could not load ser estar quest: ${response.status}`);
  }

  const data = await response.json();
  validateQuestData(data);
  return data;
}

export async function loadNearPastQuest() {
  const response = await fetch("./data/quests/near-past.v1.json");
  if (!response.ok) {
    throw new Error(`Could not load near past quest: ${response.status}`);
  }

  const data = await response.json();
  validateNearPastQuestData(data);
  return data;
}

export async function loadConceptData() {
  const response = await fetch("./data/concepts.v1.json");
  if (!response.ok) {
    throw new Error(`Could not load concept data: ${response.status}`);
  }

  const data = await response.json();
  validateConceptData(data);
  return data;
}

export async function loadSmallWordsPopQuiz() {
  const response = await fetch("./data/pop-quizzes/small-words.v1.json");
  if (!response.ok) {
    throw new Error(`Could not load small words pop quiz: ${response.status}`);
  }

  const data = await response.json();
  validateSmallWordsPopQuiz(data);
  return data;
}

function validateVerbData(data) {
  if (data.version !== 1 || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Unexpected verb data shape.");
  }
}

function validateQuestData(data) {
  if (data.version !== 1 || data.id !== "ser-estar" || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Unexpected ser estar quest data shape.");
  }
}

function validateNearPastQuestData(data) {
  if (data.version !== 1 || data.id !== "near-past" || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Unexpected near past quest data shape.");
  }
}

function validateConceptData(data) {
  if (data.version !== 1 || data.id !== "concepts" || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Unexpected concept data shape.");
  }
}

function validateSmallWordsPopQuiz(data) {
  if (data.version !== 1 || data.id !== "small-words" || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Unexpected small words pop quiz data shape.");
  }
}
