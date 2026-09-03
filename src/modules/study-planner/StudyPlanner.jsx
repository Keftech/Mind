import { Link } from "react-router-dom";
import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import { getTopicsForCourse } from "../../data/topics";
import { getCourseReadiness } from "../../lib/progressStore";

export default function StudyPlanner() {
  const plan = mockStudent.courseCodes
    .map((code) => {
      const course = getCourse(mockStudent.departmentId, code);
      const topics = getTopicsForCourse(code);
      const readiness = getCourseReadiness(code, topics);
      return { code, course, readiness };
    })
    .sort((a, b) => {
      const aScore = a.readiness.readinessPct ?? -1;
      const bScore = b.readiness.readinessPct ?? -1;
      return aScore - bScore;
    });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[color:var(--color-ink)]">This week's focus</h1>
      <p className="text-sm text-[color:var(--color-slate)]">
        Ranked by what needs attention most — lowest readiness first.
      </p>
      
      <div className="space-y-2">
        {plan.map(({ code, course, readiness }) => (
          <Link
            key={code}
            to={`/course/${code}`}
            className="flex items-center justify-between rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 transition hover:border-[color:var(--color-accent)]"
          >
            <div>
              <p className="text-sm font-medium text-[color:var(--color-ink)]">{course?.title}</p>
              <p className="text-xs text-[color:var(--color-slate)]">
                {course?.units} unit{course?.units === 1 ? "" : "s"} ·{" "}
                {readiness.readinessPct === null
                  ? "no self-check quiz yet"
                  : `${readiness.assessableTopics} of ${readiness.totalTopics} topics assessed`}
              </p>
              <p className="text-xs text-[color:var(--color-slate)]">
  {course?.units} unit{course?.units === 1 ? "" : "s"} ·{" "}
                  {course?.examFormat === "cbt" ? "CBT" : course?.examFormat === "theory" ? "Theory" : "Format TBC"} ·{" "}
  {readiness.readinessPct === null
    ? "no self-check quiz yet"
    : `${readiness.assessableTopics} of ${readiness.totalTopics} topics assessed`}
</p>
            </div>
            <span className="font-mono text-sm text-[color:var(--color-slate)]">
              {readiness.readinessPct === null ? "—" : `${readiness.readinessPct}%`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
