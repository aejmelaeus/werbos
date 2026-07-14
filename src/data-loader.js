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
