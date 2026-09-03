import { mockStudent } from "../../data/mockStudent";
import { getPathwayForDepartment } from "../../data/careerPathways";

export default function CareerExplorer() {
  const pathway = getPathwayForDepartment(mockStudent.departmentId);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[color:var(--color-ink)]">Career pathways</h1>
      {pathway ? (
        <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5">
          <h2 className="font-display text-lg text-[color:var(--color-ink)]">{pathway.title}</h2>
          <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">{pathway.summary}</p>
          <p className="mt-3 text-xs font-mono uppercase text-[color:var(--color-accent)]">
            Skills to build
          </p>
          <p className="text-sm text-[color:var(--color-ink)]">{pathway.skills.join(" · ")}</p>
        </div>
      ) : (
        <p className="text-sm text-[color:var(--color-slate)]">
          A career pathway for your department hasn't been written yet.
        </p>
      )}
    </div>
  );
}