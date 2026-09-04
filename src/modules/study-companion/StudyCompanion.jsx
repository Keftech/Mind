import { useState } from "react";
import { askMind } from "../../lib/api";
import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import NextBestStep from "../../components/NextBestStep";

export default function StudyCompanion() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use the student's first available course as the current context.
  // This avoids depending on a missing nextBestStep property.
  const activeCourseCode = mockStudent.courseCodes?.[0] ?? null;

  const activeCourse = activeCourseCode
    ? getCourse(mockStudent.departmentId, activeCourseCode)
    : null;

  async function handleAsk() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await askMind({
        question: trimmedQuestion,
        courseContext: activeCourse
          ? `${activeCourse.code} ${activeCourse.title}`
          : "general studies",
      });

      if (!res?.answer) {
        throw new Error("Mind returned an empty response.");
      }

      setAnswer(res.answer);
    } catch (e) {
      console.error("Ask MIND error:", e);

      setError(
        "Ask MIND is temporarily unavailable. Please check the connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleAsk();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[color:var(--color-ink)]">
          Ask MIND
        </h1>

        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
          Ask questions about your courses and get guided explanations from
          MIND.
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a concept from your courses..."
          className="w-full resize-none rounded-lg border border-[color:var(--color-line)] p-3 text-sm outline-none focus:border-[color:var(--color-accent)]"
          rows={5}
          disabled={loading}
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-[color:var(--color-ink-soft)]">
            Ctrl + Enter to ask
          </span>

          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="rounded-full bg-[color:var(--color-accent)] px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask MIND"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {answer && (
        <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-accent-soft)] p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            MIND Response
          </div>

          <div className="whitespace-pre-wrap text-sm leading-7 text-[color:var(--color-ink)]">
            {answer}
          </div>
        </div>
      )}

      <NextBestStep
        label="Try today's planned topic instead"
        reason={
          activeCourse
            ? `Your current course context is ${activeCourse.title}.`
            : "Continue with your planned study session."
        }
        actionLabel="Go to Planner"
        onAction={() => (window.location.href = "/planner")}
      />
    </div>
  );
}