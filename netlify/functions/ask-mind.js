import dotenv from "dotenv";
import path from "path";

// Forcing dotenv to look at the absolute root of your project
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const groqApiKey = process.env.GROQ_API_KEY?.trim();

export async function handler(event) {
  // Only allow POST requests.
  if (event.httpMethod !== "POST") {

    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Method Not Allowed",
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const question = body.question?.trim();
    const courseContext = body.courseContext?.trim();
    const country = body.country?.trim() || "Nigeria";

    if (!question) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "question is required",
        }),
      };
    }

    if (!groqApiKey) {
      console.error("GROQ_API_KEY is not configured.");

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Ask MIND is not configured correctly on the server.",
        }),
      };
    }

    const systemPrompt = `You are MIND's AI Study Companion for a university student in ${country}.

Your purpose is to help the student understand and prepare for examinations.

Follow these rules strictly:

- Teach rather than simply giving short answers.
- Explain concepts clearly and at an appropriate university level.
- Where useful, guide the student with a question before revealing the complete explanation.
- Be encouraging but academically honest.
- Do not invent facts.
- Keep the answer focused on the student's course context. Except otherwise: Where the stuedent's course context is not provided or seeking for expalanation/contents outside the course content, default to general university studies.
- Use clear headings, bullets, examples, and step-by-step explanations where appropriate.
- When discussing examination preparation, identify important points the student should remember.
- Never claim that a student is guaranteed to pass an examination.
- Never write a student's assignment or project for them outright. Support their thinking instead.

Current course context:
${courseContext || "General university studies"}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: question,
            },
          ],
          max_tokens: 700,
          temperature: 0.4,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Groq API error:", response.status, errorText);

      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "The AI service could not process the request.",
        }),
      };
    }

    const data = await response.json();

    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "The AI service returned an empty response.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    };
  } catch (error) {
    console.error("Ask MIND function error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Ask MIND encountered an unexpected server error.",
      }),
    };
  }
}