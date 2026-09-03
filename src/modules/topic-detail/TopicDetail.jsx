import { Link, useParams } from "react-router-dom";
import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import { getTopic } from "../../data/topics";
import { getTopicProgress } from "../../lib/progressStore";
import StrataDivider from "../../components/StrataDivider.jsx";
import TopicVisual from "../../components/TopicVisual";
import QuizCard from "../../components/QuizCard";

export default function TopicDetail() {
  const { code, topicId } = useParams();

  const course = getCourse(mockStudent.departmentId, code);
  const topic = getTopic(code, topicId);

  if (!course || !topic) {
    return (
      <div className="space-y-4">
        <Link
          to={`/course/${code}`}
          className="text-xs text-[color:var(--color-slate)] hover:text-[color:var(--color-ink)]"
        >
          ← Back to course
        </Link>

        <p className="text-sm text-[color:var(--color-slate)]">
          Topic not found.
        </p>
      </div>
    );
  }

  const progress = getTopicProgress(code, topic.id);

  const hasSections =
    Array.isArray(topic.sections) && topic.sections.length > 0;

  const hasKeyPoints =
    Array.isArray(topic.keyPoints) && topic.keyPoints.length > 0;

  const hasExamFocus =
    Array.isArray(topic.examFocus) && topic.examFocus.length > 0;

  const hasQuiz =
    Array.isArray(topic.quiz) && topic.quiz.length > 0;

  const hasExamQuestions =
    Array.isArray(topic.examQuestions) && topic.examQuestions.length > 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <Link
          to={`/course/${code}`}
          className="text-xs text-[color:var(--color-slate)] hover:text-[color:var(--color-ink)]"
        >
          ← Back to {course.code}
        </Link>

        <h1 className="mt-2 font-display text-3xl text-[color:var(--color-ink)]">
          {topic.title}
        </h1>

        <p className="mt-1 text-sm text-[color:var(--color-slate)]">
          {course.code} — {course.title}
        </p>
      </div>

      <StrataDivider />

      {/* Quick Summary */}
      <section className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5">
        <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
          Quick summary
        </p>

        <p className="mt-2 text-sm leading-7 text-[color:var(--color-ink-soft)]">
          {topic.summary}
        </p>
      </section>

      {/* Lesson Content */}
      {hasSections && (
        <section>
          <div className="mb-3">
            <h2 className="font-display text-2xl text-[color:var(--color-ink)]">
              Learn
            </h2>

            <p className="mt-1 text-sm text-[color:var(--color-slate)]">
              Study this section carefully before attempting the self-check.
            </p>
          </div>

          <div className="space-y-5">
            {topic.sections.map((section, sectionIndex) => (
              <article
                key={`${topic.id}-section-${sectionIndex}`}
                className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5"
              >
              {/* Section title */}
<h3 className="font-display text-xl leading-snug text-[color:var(--color-ink)]">
  {section.title ?? section.heading}
</h3>

{/* Section visual */}
<TopicVisual visual={section.visual} />

{/* Section paragraphs */}
{Array.isArray(section.paragraphs) &&
                  section.paragraphs.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {section.paragraphs.map(
                        (paragraph, paragraphIndex) => (
                          <p
                            key={`${topic.id}-section-${sectionIndex}-paragraph-${paragraphIndex}`}
                            className="text-sm leading-7 text-[color:var(--color-ink-soft)]"
                          >
                            {paragraph}
                          </p>
                        )
                      )}
                    </div>
                  )}

                {/* Subsections */}
                {Array.isArray(section.subsections) &&
                  section.subsections.length > 0 && (
                    <div className="mt-5 space-y-5">
                      {section.subsections.map(
                        (subsection, subsectionIndex) => (
                          <div
                            key={`${topic.id}-section-${sectionIndex}-subsection-${subsectionIndex}`}
                            className="border-l-2 border-[color:var(--color-line)] pl-4"
                          >
                            {/* Subsection title */}
                            <h4 className="font-display text-lg text-[color:var(--color-ink)]">
                              {subsection.title ?? subsection.heading}
                            </h4>

                            {/* Subsection paragraphs */}
                            {Array.isArray(subsection.paragraphs) &&
                              subsection.paragraphs.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {subsection.paragraphs.map(
                                    (paragraph, paragraphIndex) => (
                                      <p
                                        key={`${topic.id}-subsection-${subsectionIndex}-paragraph-${paragraphIndex}`}
                                        className="text-sm leading-7 text-[color:var(--color-ink-soft)]"
                                      >
                                        {paragraph}
                                      </p>
                                    )
                                  )}
                                </div>
                              )}
                              {/* Subsection visual */}
<TopicVisual visual={subsection.visual} />

                            {/* Subsection points */}
                            {Array.isArray(subsection.points) &&
                              subsection.points.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                  {subsection.points.map(
                                    (point, pointIndex) => (
                                      <li
                                        key={`${topic.id}-subsection-${subsectionIndex}-point-${pointIndex}`}
                                        className="flex gap-2 text-sm leading-6 text-[color:var(--color-ink-soft)]"
                                      >
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-accent)]" />

                                        <span>{point}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Key Points */}
      {hasKeyPoints && (
        <section>
          <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
              Key points
            </p>

            <h2 className="mt-1 font-display text-xl text-[color:var(--color-ink)]">
              What you should remember
            </h2>

            <ul className="mt-4 space-y-3">
              {topic.keyPoints.map((point, index) => (
                <li
                  key={`${topic.id}-key-point-${index}`}
                  className="flex gap-3 text-sm leading-7 text-[color:var(--color-ink-soft)]"
                >
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] font-mono text-xs text-[color:var(--color-accent)]">
                    {index + 1}
                  </span>

                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Exam Focus */}
      {hasExamFocus && (
        <section>
          <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-accent-soft)] p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
              Exam focus
            </p>

            <h2 className="mt-1 font-display text-xl text-[color:var(--color-ink)]">
              Pay particular attention to these
            </h2>

            <ul className="mt-4 space-y-2">
              {topic.examFocus.map((item, index) => {
                const topicName =
                  typeof item === "string" ? item : item.topic;

                return (
                  <li
                    key={`${topic.id}-exam-focus-${index}`}
                    className="flex gap-2 text-sm leading-6 text-[color:var(--color-ink)]"
                  >
                    <span>📌</span>

                    <span>
                      <strong>{topicName}</strong>
                      {typeof item !== "string" && item.focus &&
                        ` — ${item.focus}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Quiz */}
      {hasQuiz && (
        <section>
          <div className="mb-3">
            <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
              Self-check
            </p>

            <h2 className="mt-1 font-display text-2xl text-[color:var(--color-ink)]">
              Test your understanding
            </h2>

            <p className="mt-1 text-sm text-[color:var(--color-slate)]">
              Try these questions after studying the lesson.
            </p>
          </div>

          <QuizCard
            courseCode={code}
            topicId={topic.id}
            questions={topic.quiz}
          />

          <div className="mt-3 text-xs text-[color:var(--color-slate)]">
            Best score so far: {progress.bestScorePct}%
            {progress.attempts > 0 &&
              ` · ${progress.attempts} attempt${
                progress.attempts === 1 ? "" : "s"
              }`}
          </div>
        </section>
      )}

      {/* Exam Questions */}
      {hasExamQuestions && (
        <section>
          <div className="mb-3">
            <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
              Exam practice
            </p>

            <h2 className="mt-1 font-display text-2xl text-[color:var(--color-ink)]">
              Practice questions
            </h2>

            <p className="mt-1 text-sm text-[color:var(--color-slate)]">
              These are questions you should be able to answer in your own
              words.
            </p>
          </div>

          <div className="space-y-3">
            {topic.examQuestions.map((item, index) => (
              <div
                key={`${topic.id}-exam-question-${index}`}
                className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium leading-6 text-[color:var(--color-ink)]">
                    {index + 1}. {typeof item === "string" ? item : item.question}
                  </p>

                  {typeof item !== "string" && item.marks && (
                    <span className="shrink-0 font-mono text-xs text-[color:var(--color-slate)]">
                      {item.marks} marks
                    </span>
                  )}
                </div>

                {typeof item !== "string" && item.type && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-[color:var(--color-accent)]">
                    {item.type}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* End of Topic */}
      <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5">
        <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
          Topic complete
        </p>

        <p className="mt-2 font-display text-lg text-[color:var(--color-ink)]">
          Finished studying?
        </p>

        <p className="mt-1 text-sm leading-6 text-[color:var(--color-ink-soft)]">
          Review the key points, then take the self-check quiz and practice
          answering the examination questions without looking at your notes.
        </p>

        <Link
          to={`/course/${code}`}
          className="mt-4 inline-block rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Back to course
        </Link>
      </div>
    </div>
  );
}