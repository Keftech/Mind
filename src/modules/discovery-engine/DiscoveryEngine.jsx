import { mockStudent } from "../../data/mockStudent";
import { getCourse } from "../../data/courses";
import { getResourcesForCourse } from "../../data/resources";

export default function DiscoveryEngine() {
  const student = mockStudent;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[color:var(--color-ink)]">Discover</h1>
      {student.courseProgress.map((cp) => {
        const course = getCourse(student.departmentId, cp.code);
        const items = getResourcesForCourse(cp.code);

        return (
          <div key={cp.code}>
            <h2 className="font-display text-lg text-[color:var(--color-ink)]">
              {cp.code} — {course?.title ?? "Unknown course"}
            </h2>
            {items.length === 0 ? (
              <p className="mt-2 text-sm text-[color:var(--color-slate)]">
                Resources for this course haven't been curated yet.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {items.map((r) => (
                  <div
                    key={r.title}
                    className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3"
                  >
                    <span className="font-mono text-xs uppercase text-[color:var(--color-accent)]">
                      {r.type}
                    </span>
                    <p className="text-sm text-[color:var(--color-ink)]">{r.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}