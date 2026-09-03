import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import { getTopicsForCourse } from "../../data/topics";
import { getPastQuestions } from "../../data/pastQuestions";
import { getTopicProgress, getCourseReadiness } from "../../lib/progressStore";
import QuizCard from "../../components/QuizCard";
import StrataDivider from "../../components/StrataDivider.jsx";


export default function CourseDetail() {
  const { code } = useParams();
  const [tick, setTick] = useState(0);
  const [openTopic, setOpenTopic] = useState(null);

  const course = getCourse(mockStudent.departmentId, code);
  const topics = getTopicsForCourse(code);
  const readiness = getCourseReadiness(code, topics);
  const pastQuestions = getPastQuestions(code);

  if (!course) {
    return (
      <p className="text-sm text-[color:var(--color-slate)]">
        Course not found.
      </p>
    );
  }

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-xs text-[color:var(--color-slate)] hover:text-[color:var(--color-ink)]"
        >
          ← Back home
        </Link>

        <h1 className="mt-1 font-display text-3xl text-[color:var(--color-ink)]">
          {course.code} — {course.title}
        </h1>

               <p className="text-sm text-[color:var(--color-slate)]">
          {course.units} units ·{" "}
          {course.examFormat === "cbt"
            ? "CBT exam"
            : course.examFormat === "theory"
            ? "Written theory exam"
            : "Exam format not confirmed yet"}
        </p>
      </div>

      <StrataDivider />

      {course.examFormat === "theory" && (
        <p className="text-sm text-[color:var(--color-ink-soft)]">
          This course is examined with written answers. Self-check quizzes below test whether
          you recognize the right concept — but the real exam needs you to explain it in your
          own words. Practice the past theory questions further down, not just the quizzes.
        </p>
      )}
      {course.examFormat === "cbt" && (
        <p className="text-sm text-[color:var(--color-ink-soft)]">
          This course is examined as CBT (multiple choice). The self-check quizzes below are
          close to the real exam format — the more of these you get comfortable with, the more
          exam-ready you actually are.
        </p>
      )}
      {course.examFormat === null && (
        <p className="text-sm text-[color:var(--color-slate)]">
          Exam format for this course hasn't been confirmed yet — add it to courses.js once
          you know, so the guidance here can be accurate.
        </p>
      )}

      <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5">
        {readiness.readinessPct === null ? (
          <p className="text-sm text-[color:var(--color-slate)]">
            No self-check quizzes are available for this course yet —
            readiness can't be measured until at least one topic has one.
          </p>
        ) : (
          <>
            <p className="font-mono text-xs uppercase text-[color:var(--color-accent)]">
              Exam readiness
            </p>

            <p className="mt-1 font-display text-3xl text-[color:var(--color-ink)]">
              {readiness.readinessPct}%
            </p>

            <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">
              Based on {readiness.assessableTopics} of{" "}
              {readiness.totalTopics} topics assessed so far.
            </p>
          </>
        )}
      </div>

      <section>
        <h2 className="font-display text-lg text-[color:var(--color-ink)]">
          Topics
        </h2>

        <div className="mt-3 space-y-2">
          {topics.length === 0 && (
            <p className="text-sm text-[color:var(--color-slate)]">
              Topics for this course haven't been added yet.
            </p>
          )}

          {topics.map((topic) => {
            const progress = getTopicProgress(code, topic.id);
            const hasQuiz = topic.quiz && topic.quiz.length > 0;
            const hasContent = topic.content && topic.content.trim().length > 0;
            const isOpen = openTopic === topic.id;

            return (
              <div
                key={topic.id}
                className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4"
              >
                <Link
                to={`/course/${code}/topic/${topic.id}`}
               className="flex w-full items-center justify-between text-left"
>
                  <div>
                    <p className="text-sm font-medium text-[color:var(--color-ink)]">
                      {topic.title}
                    </p>
                    <p className="text-xs text-[color:var(--color-slate)]">
                      {topic.summary}
                    </p>
                  </div>

                  <span className="font-mono text-xs text-[color:var(--color-slate)]">
                    {hasQuiz ? `${progress.bestScorePct}%` : "no quiz yet"}
                  </span>
                </Link>

                {Array.isArray(topic.examFocus) && topic.examFocus.length > 0 && (
  <p className="mt-2 rounded-lg bg-[color:var(--color-accent-soft)] p-2 text-xs text-[color:var(--color-ink)]">
  📌 {typeof topic.examFocus[0] === "string"
    ? topic.examFocus[0]
    : `${topic.examFocus[0].topic}: ${topic.examFocus[0].focus}`}
  {topic.examFocus.length > 1 &&
    ` (+${topic.examFocus.length - 1} more)`}
</p>
)}

                {isOpen &&  (
                  <div className="mt-4 space-y-4">
                    {hasContent && (
                      <p className="whitespace-pre-line text-sm text-[color:var(--color-ink-soft)]">
                        {topic.content}
                      </p>
                    )}
                    {hasQuiz && 
                    <QuizCard
                      courseCode={code}
                      topicId={topic.id}
                      questions={topic.quiz}
                      onScored={() => setTick((value) => value + 1)}
                    />
                }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {pastQuestions.length > 0 ? (
        <section>
          <h2 className="font-display text-lg text-[color:var(--color-ink)]">
            Past questions
          </h2>

          <div className="mt-3 space-y-2">
            {pastQuestions.map((question, index) => (
              <div
                key={index}
                className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4"
              >
                <span className="font-mono text-xs uppercase text-[color:var(--color-accent)]">
                  {question.type === "mcq"
                    ? "Multiple choice"
                    : "Theory"}
                </span>

                <p className="mt-1 text-sm text-[color:var(--color-ink)]">
                  {question.question}
                </p>

                <p className="mt-2 text-xs text-[color:var(--color-ink-soft)]">
                  {question.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        course.examFormat === "theory" && (
          <p className="text-sm text-[color:var(--color-slate)]">
            No past questions added yet — for a theory exam, these matter more
            than quizzes once you have them.
          </p>
        )
      )}
    </>
  );
}