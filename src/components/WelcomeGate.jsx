import { useState } from "react";
import { setIdentity } from "../lib/identity";

export default function WelcomeGate({ onDone }) {
  const [name, setName] = useState("");

  function handleContinue() {
    if (!name.trim()) return;
    setIdentity(name.trim());
    onDone(name.trim());
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
        <h1 className="font-display text-2xl text-[color:var(--color-ink)]">Welcome to Mind</h1>
        <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">
          What should we call you?
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          placeholder="Your first name"
          autoFocus
          className="mt-4 w-full rounded-lg border border-[color:var(--color-line)] p-3 text-sm outline-none focus:border-[color:var(--color-accent)]"
        />
        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="mt-4 w-full rounded-full bg-[color:var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}