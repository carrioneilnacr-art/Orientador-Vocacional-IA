import { describe, expect, it } from 'vitest';
import { initialProgress, progressSchema, readProgress, recordPreference, type Progress } from '@/game/adventure';

const saved = (overrides: Record<string, unknown> = {}) => JSON.stringify({
  ...initialProgress,
  started: true,
  decisions: [{ missionId: 'inventos', preference: 'yes' }],
  ...overrides,
});

describe('Adventure progress recovery', () => {
  it.each([null, '', '{broken', 'null', '[]', '"text"', 'x'.repeat(10001)])(
    'recovers safely from absent, corrupt or oversized storage', raw => {
      expect(readProgress(raw)).toEqual(initialProgress);
    },
  );

  it('rejects even otherwise valid saved content above the storage bound', () => {
    expect(readProgress(saved({ padding: 'a'.repeat(10001) }))).toEqual(initialProgress);
  });

  it('does not silently reuse a different content version', () => {
    expect(readProgress(saved({ version: 2 }))).toEqual(initialProgress);
  });

  it.each([
    { decisions: [{ missionId: 'unknown', preference: 'yes' }] },
    { decisions: [{ missionId: 'mural', preference: 'sometimes' }] },
    { decisions: [{ missionId: 'mural' }] },
    { decisions: [{ missionId: 'inventos', preference: 'yes' }, { missionId: 'inventos', preference: 'no' }] },
  ])('rejects unknown ids, invalid preferences and duplicate mission records', ({ decisions }) => {
    expect(readProgress(saved({ decisions }))).toEqual(initialProgress);
    expect(progressSchema.safeParse({ ...initialProgress, decisions }).success).toBe(false);
  });

  it('restores supported preferences and accessibility settings', () => {
    expect(readProgress(saved({ reducedMotion: true }))).toEqual({
      version: 1, started: true, reducedMotion: true,
      decisions: [{ missionId: 'inventos', preference: 'yes' }],
    });
  });
});

describe('Exploratory preferences', () => {
  it('replaces a repeated mission preference while preserving other discoveries and settings', () => {
    const before: Progress = {
      version: 1, started: true, reducedMotion: true,
      decisions: [
        { missionId: 'inventos', preference: 'yes' },
        { missionId: 'mural', preference: 'maybe' },
      ],
    };
    const after = recordPreference(before, 'inventos', 'no');
    expect(after.decisions).toHaveLength(2);
    expect(after.decisions).toContainEqual({ missionId: 'mural', preference: 'maybe' });
    expect(after.decisions).toContainEqual({ missionId: 'inventos', preference: 'no' });
    expect(after.reducedMotion).toBe(true);
    expect(after.started).toBe(true);
    expect(before.decisions[0].preference).toBe('yes');
    expect(progressSchema.safeParse(after).success).toBe(true);
  });

  it('keeps incomplete evidence as stated preferences without deriving scores or filling missing missions', () => {
    const partial = recordPreference(initialProgress, 'observatorio', 'maybe');
    const recovered = readProgress(JSON.stringify(partial));
    expect(recovered.decisions).toEqual([{ missionId: 'observatorio', preference: 'maybe' }]);
    expect(Object.keys(recovered).sort()).toEqual(['decisions', 'reducedMotion', 'started', 'version']);
    expect(Object.keys(recovered.decisions[0]).sort()).toEqual(['missionId', 'preference']);
  });

  it('discards injected scoring and gameplay fields rather than accepting them as evidence', () => {
    const recovered = readProgress(saved({
      scorePayload: { SOCIAL: 999 },
      dimensionScores: { LOGIC: 100 },
      decisions: [{ missionId: 'inventos', preference: 'yes', score: 100, attempts: 0, elapsed: 1 }],
    }));
    expect(recovered.decisions).toEqual([{ missionId: 'inventos', preference: 'yes' }]);
    expect(recovered).not.toHaveProperty('scorePayload');
    expect(recovered).not.toHaveProperty('dimensionScores');
  });
});
