// In-memory access token store. Module-level state, no React.
// Auth feature plan will wire this into a refresh-on-401 flow.

type Listener = (token: string | null) => void;

let token: string | null = null;
const listeners = new Set<Listener>();

export function getToken(): string | null {
  return token;
}

export function setToken(t: string | null): void {
  token = t;
  for (const fn of listeners) {
    fn(token);
  }
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
