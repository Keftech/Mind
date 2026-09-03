import { Link } from "react-router-dom";
import { mockStudent } from "../../data/mockStudent";
import { getDepartment } from "../../data/institutions";
import { getCourse } from "../../data/courses";
import { getTopicsForCourse } from "../../data/topics";
import { getCourseReadiness } from "../../lib/progressStore";
import { getIdentity } from "../../lib/identity";
import NextBestStep from "../../components/NextBestStep";
import StrataDivider from "../../components/StrataDivider";

export default function Home() {
  const student = mockStudent;
  const identity = getIdentity();
  const department = getDepartment(student.universityId, student.facultyId, student.departmentId);

  const courses = student.courseCodes
    .map((code) => {
      const course = getCourse(student.departmentId, code);
      const topics = getTopicsForCourse(code);
      const readiness = getCourseReadiness(code, topics);
      return { code, course, readiness };
    })
    .sort((a, b) => (b.course?.units ?? 0) - (a.course?.units ?? 0));

  const withScores = courses.filter((c) => c.readiness.readinessPct !== null);
  const lowest = withScores.sort((a, b) => a.readiness.readinessPct - b.readiness.readinessPct)[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[color:var(--color-slate)]">
          {department?.name ?? "Department not set"} · {student.level} Level · {student.semester}
        </p>
        <h1 className="font-display text-3xl text-[color:var(--color-ink)]">
          Welcome back, {identity?.name ?? "there"}
        </h1>
      </div>

      <StrataDivider />

      <NextBestStep
        label={
          lowest
            ? `Focus on ${lowest.course?.title}`
            : "Take your first self-check quiz to start tracking readiness"
        }
        reason={
          lowest
            ? `You're at ${lowest.readiness.readinessPct}% readiness — your lowest of the semester.`
            : "None of your courses have a quiz result yet."
        }
        actionLabel="View course"
        onAction={() =>
          (window.location.href = lowest ? `/course/${lowest.code}` : `/course/${courses[0]?.code}`)
        }
      />

      <section>
        <h2 className="font-display text-lg text-[color:var(--color-ink)]">
          Your courses this semester
        </h2>
        <div className="mt-3 space-y-2">
          {courses.map(({ code, course, readiness }) => (
            <Link
              key={code}
              to={`/course/${code}`}
              className="flex items-center justify-between rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 transition hover:border-[color:var(--color-accent)]"
            >
              <div>
                <p className="text-sm font-medium text-[color:var(--color-ink)]">
                  {code} — {course?.title ?? "Unknown course"}
                </p>
                <p className="text-xs text-[color:var(--color-slate)]">
                  {course?.units} unit{course?.units === 1 ? "" : "s"}
                  {course?.units >= 3 ? " · priority" : ""}
                </p>
                <p className="text-xs text-[color:var(--color-slate)]">
  {course?.units} unit{course?.units === 1 ? "" : "s"}
  {course?.units >= 3 ? " · priority" : ""}
  {course?.examFormat ? ` · ${course.examFormat === "cbt" ? "CBT" : "Theory"}` : ""}
</p>
              </div>
              <span className="font-mono text-sm text-[color:var(--color-slate)]">
                {readiness.readinessPct === null ? "no quiz yet" : `${readiness.readinessPct}% ready`}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}