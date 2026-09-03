const STORAGE_KEY = "mind_identity_v1";

export function getIdentity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setIdentity(name) {
  const identity = { name };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  return identity;
}