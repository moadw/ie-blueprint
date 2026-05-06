export function getInitials(name: string, max = 2): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, max)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}
