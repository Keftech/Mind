import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import { getTopicsForCourse } from "../../data/topics";
import { getCourseReadiness } from "../../lib/progressStore";
import StrataDivider from "../../components/StrataDivider";

export default function ProgressDashboard() {
  const rows = mockStudent.courseCodes.map((code) => {
    const course = getCourse(mockStudent.departmentId, code);
    const topics = getTopicsForCourse(code);
    const readiness = getCourseReadiness(code, topics);
    return { code, course, readiness };
  });

  const assessed = rows.filter((r) => r.readiness.readinessPct !== null);
  const avgReadiness = assessed.length
    ? Math.round(assessed.reduce((s, r) => s + r.readiness.readinessPct, 0) / assessed.length)
    : null;

  const stats = [
    { label: "Courses assessed", value: `${assessed.length} of ${rows.length}` },
    { label: "Average readiness", value: avgReadiness === null ? "—" : `${avgReadiness}%` },
    {
      label: "Lowest course",
      value: assessed.length
        ? assessed.sort((a, b) => a.readiness.readinessPct - b.readiness.readinessPct)[0].course?.code
        : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[color:var(--color-ink)]">Your progress</h1>
      <StrataDivider />
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4"
          >
            <p className="text-xs text-[color:var(--color-slate)]">{s.label}</p>
            <p className="mt-1 font-display text-xl text-[color:var(--color-ink)]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map(({ code, course, readiness }) => (
          <div
            key={code}
            className="flex items-center justify-between rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3"
          >
            <p className="text-sm text-[color:var(--color-ink)]">{course?.title}</p>
            <span className="font-mono text-sm text-[color:var(--color-slate)]">
              {readiness.readinessPct === null ? "not assessed" : `${readiness.readinessPct}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}