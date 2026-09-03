const STORAGE_KEY = "mind_topic_progress_v1";

function key(courseCode, topicId) {
  return `${courseCode}:${topicId}`;
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTopicProgress(courseCode, topicId) {
  const all = readAll();
  return all[key(courseCode, topicId)] ?? { bestScorePct: 0, attempts: 0 };
}

export function recordQuizResult(courseCode, topicId, scorePct) {
  const all = readAll();
  const k = key(courseCode, topicId);
  const current = all[k] ?? { bestScorePct: 0, attempts: 0 };
  const updated = {
    bestScorePct: Math.max(current.bestScorePct, scorePct),
    attempts: current.attempts + 1,
  };
  all[k] = updated;
  writeAll(all);
  return updated;
}

export function getCourseReadiness(courseCode, topics) {
  const assessable = topics.filter((t) => t.quiz && t.quiz.length > 0);
  if (assessable.length === 0) {
    return { readinessPct: null, assessableTopics: 0, totalTopics: topics.length };
  }
  const total = assessable.reduce(
    (sum, t) => sum + getTopicProgress(courseCode, t.id).bestScorePct,
    0
  );
  return {
    readinessPct: Math.round(total / assessable.length),
    assessableTopics: assessable.length,
    totalTopics: topics.length,
  };
}