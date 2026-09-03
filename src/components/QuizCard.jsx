import { useState } from "react";
import { recordQuizResult } from "../lib/progressStore";

export default function QuizCard({ courseCode, topicId, questions, onScored }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function selectAnswer(qIndex, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  }

  function handleSubmit() {
    const correctCount = questions.reduce(
      (count, q, i) => (answers[i] === q.correctIndex ? count + 1 : count),
      0
    );
    const scorePct = Math.round((correctCount / questions.length) * 100);
    setSubmitted(true);
    const result = recordQuizResult(courseCode, topicId, scorePct);
    onScored?.(scorePct, result);
  }

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4"
        >
          <p className="text-sm font-medium text-[color:var(--color-ink)]">{q.question}</p>
          <div className="mt-2 space-y-1.5">
            {q.options.map((opt, oi) => {
              const isSelected = answers[i] === oi;
              const isCorrect = oi === q.correctIndex;
              let style = "border-[color:var(--color-line)]";
              if (submitted && isCorrect) style = "border-[color:var(--color-good)] bg-[color:var(--color-good-soft)]";
              else if (submitted && isSelected && !isCorrect) style = "border-red-300 bg-red-50";
              else if (isSelected) style = "border-[color:var(--color-accent)]";

              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(i, oi)}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-sm text-[color:var(--color-ink)] ${style}`}
                  disabled={submitted}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-2 text-xs text-[color:var(--color-ink-soft)]">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Submit answers
        </button>
      ) : (
        <p className="text-sm text-[color:var(--color-ink-soft)]">
          Scored — your best attempt is saved to this topic's mastery.
        </p>
      )}
    </div>
  );
}