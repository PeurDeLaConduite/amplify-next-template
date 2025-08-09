export const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
export const singular = (s: string) => (s.endsWith("s") ? s.slice(0, -1) : s);
export const pascal = (s: string) =>
  s.replace(/(^\w|[-_]\w)/g, (m) => m.replace(/[-_]/, "").toUpperCase());

