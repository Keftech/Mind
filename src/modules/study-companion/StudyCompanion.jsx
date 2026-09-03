import { useState } from "react";
import { askMind } from "../../lib/api";
import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import NextBestStep from "../../components/NextBestStep";

export default function StudyCompanion() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const activeCourse = getCourse(mockStudent.departmentId, mockStudent.nextBestStep.courseCode);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await askMind({
        question,
        courseContext: activeCourse
          ? `${activeCourse.code} ${activeCourse.title}`
          : "general studies",
      });
      setAnswer(res.answer);
    } catch (e) {
      setAnswer("Something went wrong reaching Mind. Check your Netlify function and GROQ_API_KEY.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[color:var(--color-ink)]">Ask Mind</h1>
      <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about a concept from your courses..."
          className="w-full resize-none rounded-lg border border-[color:var(--color-line)] p-3 text-sm outline-none focus:border-[color:var(--color-accent)]"
          rows={3}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="mt-3 rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-accent-soft)] p-4 text-sm text-[color:var(--color-ink)]">
          {answer}
        </div>
      )}

      <NextBestStep
        label="Try today's planned topic instead"
        reason={activeCourse ? `Your planner has a session queued for ${activeCourse.title}.` : undefined}
        actionLabel="Go to Planner"
        onAction={() => (window.location.href = "/planner")}
      />
    </div>
  );
}