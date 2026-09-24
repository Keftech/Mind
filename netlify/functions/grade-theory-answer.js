export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { question, answerGuide, studentAnswer, courseContext } = JSON.parse(event.body || "{}");

  if (!question || !studentAnswer) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "question and studentAnswer are required" }),
    };
  }

  const hasGuide = Array.isArray(answerGuide) && answerGuide.length > 0;
  const groundingNote = hasGuide
    ? `A good answer should cover these points:\n${answerGuide.map((p) => `- ${p}`).join("\n")}\n` +
      `Check the student's answer against these points specifically.`
    : `No answer guide was provided for this question — use your general subject knowledge, ` +
      `but be conservative and hedge appropriately since you have no course-specific standard to check against.`;

  const systemPrompt = `You are Mind's theory-answer reviewer for a university student
studying ${courseContext || "their course"}. ${groundingNote}

Respond with ONLY valid JSON, no other text, no markdown formatting, in exactly this shape:
{
  "bucket": "needs_work" | "getting_there" | "strong",
  "percentEstimate": <a number 0-100>,
  "feedback": "<2-4 sentences: which of the expected points they covered, what's missing or vague, and one concrete thing to improve>"
}

Rules:
- Be honest, not falsely encouraging — a genuinely weak or incomplete answer should get "needs_work".
- The percentage is a rough estimate, not a precise exam grade — round to the nearest 10.
- Reference the specific points from the answer guide when explaining what's missing, don't just speak generally.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Question: ${question}\n\nStudent's answer: ${studentAnswer}` },
        ],
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: errText }),
      };
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { bucket: null, percentEstimate: null, feedback: raw };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}