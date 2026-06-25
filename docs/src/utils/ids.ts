export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
