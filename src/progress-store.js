const STORAGE_KEY = "werbos.progress.v1";

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
    return parsed;
  } catch {
    return createEmptyProgress();
  }
}

export function recordAttempt(progress, attempt) {
  const next = {
    ...progress,
    updatedAt: new Date().toISOString(),
    attempts: [
      ...progress.attempts,
      {
        verbId: attempt.verbId,
        formId: attempt.formId,
        status: attempt.status,
        completedAt: new Date().toISOString()
      }
    ].slice(-20)
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function createEmptyProgress() {
  return {
    version: 1,
    attempts: [],
    updatedAt: null
  };
}
