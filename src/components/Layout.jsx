import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/study", label: "Ask Mind" },
  { to: "/planner", label: "Planner" },
  { to: "/progress", label: "Progress" },
];

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl text-[color:var(--color-ink)]">Mind</span>
          <nav className="flex gap-5 text-sm">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? "text-[color:var(--color-accent)] font-medium"
                    : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}