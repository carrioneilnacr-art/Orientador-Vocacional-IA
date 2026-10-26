import { describe, expect, it } from 'vitest';
import { resolveStaffLoginEmail } from '@/lib/staffLoginIdentity';

describe('staff login identity', () => {
  const aliases = JSON.stringify({ UserDirector: 'director@example.org' });

  it('resolves a configured username regardless of casing or surrounding spaces', () => {
    expect(resolveStaffLoginEmail(' userdirector ', aliases)).toBe('director@example.org');
  });

  it('preserves existing email access', () => {
    expect(resolveStaffLoginEmail(' PERSON@example.org ', '{}')).toBe('person@example.org');
  });

  it('rejects unknown usernames and prototype properties', () => {
    for (const name of ['someone', 'constructor', '__proto__']) {
      expect(resolveStaffLoginEmail(name, aliases)).toBeNull();
    }
  });

  it('fails closed on malformed or ambiguous configuration', () => {
    for (const config of ['invalid', '{"UserDirector":"not-an-email"}',
      '{"UserDirector":"one@example.org","userdirector":"two@example.org"}']) {
      expect(resolveStaffLoginEmail('UserDirector', config)).toBeNull();
    }
  });
});
