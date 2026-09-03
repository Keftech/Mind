export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { question, courseContext, country } = JSON.parse(event.body || "{}");

  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: "question is required" }) };
  }

  const systemPrompt = `You are Mind's AI Study Companion for a university
student${country ? ` in ${country}` : ""}. Follow these rules strictly:
- Teach, don't just answer. Where appropriate, ask the student a guiding
  question before giving the full answer (e.g. "How would you approach this?").
- Be encouraging but honest. Never promise outcomes you can't guarantee.
- Keep answers focused on the student's current course context: ${courseContext || "general studies"}.
- Never write a student's assignment or project for them outright — support
  their thinking instead.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errText }) };
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? "";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}