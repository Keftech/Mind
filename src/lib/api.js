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