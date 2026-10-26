import { z } from 'zod';

const aliasSchema = z.record(z.string().email());

/** Aliases are configured on the server; roles still come from school_staff. */
export function resolveStaffLoginEmail(
  identifier: string,
  aliasesJson = process.env.STAFF_LOGIN_ALIASES ?? '{}'
): string | null {
  const normalized = identifier.trim().toLowerCase();
  if (z.string().email().safeParse(normalized).success) return normalized;
  if (!/^[a-z0-9._-]{3,64}$/.test(normalized)) return null;

  try {
    const aliases = aliasSchema.safeParse(JSON.parse(aliasesJson));
    if (!aliases.success) return null;
    const matches = Object.entries(aliases.data)
      .filter(([alias]) => alias.toLowerCase() === normalized);
    // Ambiguous configuration must never select a different person's account.
    return matches.length === 1 ? matches[0][1] : null;
  } catch {
    return null;
  }
}
