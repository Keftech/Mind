const AI_ENDPOINT = "/.netlify/functions/ask-mind";

export async function askMind({ question, courseContext, country = "Nigeria" }) {
  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, courseContext, country }),
  });

  if (!res.ok) {
    throw new Error(`askMind failed: ${res.status}`);
  }

  return res.json(); // { answer: string }
}
const GRADE_ENDPOINT = "/.netlify/functions/grade-theory-answer";

export async function gradeTheoryAnswer({ question, answerGuide, studentAnswer, courseContext }) {
  const res = await fetch(GRADE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answerGuide, studentAnswer, courseContext }),
  });

  if (!res.ok) {
    throw new Error(`gradeTheoryAnswer failed: ${res.status}`);
  }

  return res.json();
}