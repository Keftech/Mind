import { useState } from "react";
import { gradeTheoryAnswer } from "../lib/api";

const BUCKET_LABELS = {
  needs_work: { label: "Needs work", color: "text-red-700 bg-red-50 border-red-200" },
  getting_there: { label: "Getting there", color: "text-amber-700 bg-amber-50 border-amber-200" },
  strong: { label: "Strong answer", color: "text-[color:var(--color-good)] bg-[color:var(--color-good-soft)] border-[color:var(--color-good)]/30" },
};

export default function TheoryAnswerCard({ question, answerGuide, marks, courseContext }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  async function handleSubmit() {
    if (!answer.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await gradeTheoryAnswer({ question, answerGuide, studentAnswer: answer, courseContext });
      setResult(res);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const bucketInfo = result?.bucket ? BUCKET_LABELS[result.bucket] : null;

  return (
    <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium leading-6 text-[color:var(--color-ink)]">{question}</p>
        {marks && (
          <span className="shrink-0 font-mono text-xs text-[color:var(--color-slate)]">{marks} marks</span>
        )}
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here, in your own words..."
        rows={4}
        disabled={!!result}
        className="mt-3 w-full resize-none rounded-lg border border-[color:var(--color-line)] p-3 text-sm outline-none focus:border-[color:var(--color-accent)] disabled:bg-[color:var(--color-paper)]"
      />

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={loading || !answer.trim()}
          className="mt-3 rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "Reviewing..." : "Get feedback"}
        </button>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">
          Couldn't reach Mind for feedback — check your connection and try again.
        </p>
      )}

      {result && (
        <div className="mt-3 space-y-2">
          {bucketInfo ? (
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${bucketInfo.color}`}>
              {bucketInfo.label}
              {result.percentEstimate != null && ` · ~${result.percentEstimate}% (AI estimate)`}
            </span>
          ) : (
            <p className="text-xs text-[color:var(--color-slate)]">
              Couldn't score this precisely — feedback below is still useful.
            </p>
          )}
          <p className="text-sm text-[color:var(--color-ink-soft)]">{result.feedback}</p>
          <p className="text-[10px] text-[color:var(--color-slate)]">
            AI-generated feedback — not an official exam grade.
          </p>
        </div>
      )}
    </div>
  );
}