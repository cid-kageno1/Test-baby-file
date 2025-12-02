// Simple normalizer: lowercases, trims, collapses whitespace and strips punctuation (basic)
export function normalize(s) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[“”"'`⋯….,!?;:(){}[\]<>\\/|@#$%^&*_+=~–—–]/g, "")
    .replace(/\s+/g, " ");
}
