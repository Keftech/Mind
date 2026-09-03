import { mockStudent } from "../../data/mockStudent";
import { institutions, getDepartment } from "../../data/institutions";

export default function MindTwin() {
  const s = mockStudent;
  const university = institutions[s.universityId];
  const department = getDepartment(s.universityId, s.facultyId, s.departmentId);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[color:var(--color-ink)]">Mind Twin</h1>
      <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 space-y-2 text-sm">
        <p><span className="text-[color:var(--color-slate)]">University:</span> {university?.shortName ?? "—"}</p>
        <p><span className="text-[color:var(--color-slate)]">Department:</span> {department?.name ?? "—"}</p>
        <p><span className="text-[color:var(--color-slate)]">Level:</span> {s.level}</p>
        <p><span className="text-[color:var(--color-slate)]">Goal:</span> {s.goal}</p>
      </div>
    </div>
  );
}