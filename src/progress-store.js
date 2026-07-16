const STORAGE_KEY = "werbos.progress.v1";
const REVIEW_DELAYS = {
  failed: 2 * 60 * 1000,
  firstCorrect: 15 * 60 * 1000,
  repeatedCorrect: 24 * 60 * 60 * 1000
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyProgress();
    }

    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) {
      return createEmptyProgress();
    }
    return normalizeProgress(parsed);
  } catch {
    return createEmptyProgress();
  }
}

export function recordAttempt(progress, attempt) {
  const completedAt = new Date();
  const itemKey = getAttemptItemKey(attempt);
  const family = attempt.family ?? attempt.mode;
  const previousFamilyRunCount = progress.current?.family === family ? progress.current?.familyRunCount ?? 0 : 0;
  const previousItem = itemKey ? progress.items?.[itemKey] : null;
  const correct = attempt.status === "completed";
  const correctStreak = correct ? (previousItem?.correctStreak ?? 0) + 1 : 0;
  const missCount = correct ? previousItem?.missCount ?? 0 : (previousItem?.missCount ?? 0) + 1;
  const nextDueAt = new Date(
    completedAt.getTime() +
      (correct
        ? correctStreak > 1
          ? REVIEW_DELAYS.repeatedCorrect
          : REVIEW_DELAYS.firstCorrect
        : REVIEW_DELAYS.failed)
  ).toISOString();
  const next = {
    ...progress,
    updatedAt: completedAt.toISOString(),
    current: {
      family,
      familyRunCount: previousFamilyRunCount + 1,
      mode: attempt.mode,
      itemKey,
      moduleKey: attempt.moduleKey ?? null,
      updatedAt: completedAt.toISOString()
    },
    items: itemKey
      ? {
          ...progress.items,
          [itemKey]: {
            itemKey,
            family,
            parentId: attempt.parentId ?? null,
            direction: attempt.direction ?? null,
            lastResult: attempt.status,
            attemptCount: (previousItem?.attemptCount ?? 0) + 1,
            correctStreak,
            missCount,
            lastPracticedAt: completedAt.toISOString(),
            nextDueAt
          }
        }
      : progress.items,
    attempts: [
      ...progress.attempts,
      {
        ...attempt,
        status: attempt.status,
        itemKey,
        completedAt: completedAt.toISOString()
      }
    ].slice(-20)
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function normalizeProgress(progress) {
  return {
    version: 1,
    attempts: Array.isArray(progress.attempts) ? progress.attempts : [],
    items: progress.items && typeof progress.items === "object" ? progress.items : {},
    seenModules: progress.seenModules && typeof progress.seenModules === "object" ? progress.seenModules : {},
    current: normalizeCurrent(progress.current),
    updatedAt: progress.updatedAt ?? null
  };
}

function normalizeCurrent(current) {
  if (!current) {
    return null;
  }

  return {
    ...current,
    familyRunCount: current.familyRunCount ?? 1
  };
}

export function markModuleSeen(progress, moduleKey) {
  if (!moduleKey || progress.seenModules?.[moduleKey]) {
    return progress;
  }

  const next = {
    ...progress,
    seenModules: {
      ...progress.seenModules,
      [moduleKey]: new Date().toISOString()
    },
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function createEmptyProgress() {
  return {
    version: 1,
    attempts: [],
    items: {},
    seenModules: {},
    current: null,
    updatedAt: null
  };
}

function getAttemptItemKey(attempt) {
  if (attempt.itemKey) {
    return attempt.itemKey;
  }

  if (attempt.mode === "concept") {
    return `concept:${attempt.challengeId}`;
  }

  if (attempt.mode === "quest") {
    return `quest:${attempt.questId}:${attempt.questionId}`;
  }

  if (attempt.mode === "nearPastQuest") {
    return `quest:${attempt.questId}:${attempt.questionId}`;
  }

  if (attempt.mode === "popQuiz") {
    return `popQuiz:${attempt.quizId}:${attempt.questionId}`;
  }

  if (attempt.verbId && attempt.formId) {
    return `verb:${attempt.verbId}:${attempt.formId}`;
  }

  return null;
}
