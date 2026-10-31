import { describe, expect, it } from 'vitest';
import { initialProgress, progressSchema, readProgress, recordPreference, recordNpcChoice, getPlazaRiasec, isPlazaComplete, type Progress } from '@/game/adventure';
import { plazaNpcs } from '@/game/plazaNpcs';

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
      npcDecisions: [],
    });
  });
});

describe('Exploratory preferences', () => {
  it('replaces a repeated mission preference while preserving other discoveries and settings', () => {
    const before: Progress = {
      version: 1, started: true, reducedMotion: true,
      npcDecisions: [],
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
    expect(Object.keys(recovered).sort()).toEqual(['decisions', 'npcDecisions', 'reducedMotion', 'started', 'version']);
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

describe('Plaza conversations', () => {
  it('records one answer per NPC and keeps prior mission progress', () => {
    const withMission = recordPreference(initialProgress, 'inventos', 'yes');
    const first = recordNpcChoice(withMission, 'inventor', 0);
    const updated = recordNpcChoice(first, 'inventor', 2);
    expect(updated.npcDecisions).toMatchObject([{ npcId: 'inventor', choice: 2, evidenceVersion: 1 }]);
    expect(updated.npcDecisions[0].note).toBe(plazaNpcs.find(npc => npc.id === 'inventor')!.notes[2]);
    expect(updated.decisions).toEqual(withMission.decisions);
    expect(readProgress(JSON.stringify(updated)).npcDecisions).toEqual(updated.npcDecisions);
  });

  it('restores older saves with an empty plaza journal', () => {
    const legacy = JSON.parse(saved()) as Record<string, unknown>;
    delete legacy.npcDecisions;
    expect(readProgress(JSON.stringify(legacy)).npcDecisions).toEqual([]);
  });

  it('preserves the old students answer without treating it as new RIASEC evidence', () => {
    const recovered = readProgress(saved({ npcDecisions: [{ npcId: 'estudiantes', choice: 1 }] }));
    expect(recovered.npcDecisions).toEqual([{ npcId: 'emprendedor', choice: 1, note: 'De mi exploración anterior: Crear la presentación.' }]);
    expect(getPlazaRiasec(recovered)).toEqual({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    expect(isPlazaComplete(recovered)).toBe(false);
  });

  it('uses the requested Nayra weights and replaces rather than accumulates repeated answers', () => {
    const first = recordNpcChoice(initialProgress, 'inventor', 0);
    expect(getPlazaRiasec(first)).toEqual({ R: 2, I: 2, A: 0, S: 0, E: 0, C: 0 });
    const repeated = recordNpcChoice(first, 'inventor', 0);
    expect(getPlazaRiasec(repeated)).toEqual(getPlazaRiasec(first));
    const changed = recordNpcChoice(first, 'inventor', 1);
    expect(getPlazaRiasec(changed)).toEqual({ R: 0, I: 0, A: 3, S: 0, E: 0, C: 0 });
    expect(getPlazaRiasec(recordNpcChoice(changed, 'inventor', 2))).toEqual({ R: 0, I: 0, A: 0, S: 2, E: 1, C: 0 });
  });

  it('unlocks travel only after six versioned conversations and rejects invalid choices', () => {
    let progress = initialProgress;
    for (const npc of plazaNpcs) progress = recordNpcChoice(progress, npc.id, 0);
    expect(isPlazaComplete(progress)).toBe(true);
    expect(recordNpcChoice(progress, 'inventor', 3)).toBe(progress);
    expect(recordNpcChoice(progress, 'inventor', -1)).toBe(progress);
    expect(recordNpcChoice(progress, 'inventor', 0.5)).toBe(progress);
  });

  it('rejects duplicate NPC entries and ignores injected totals and journal prose', () => {
    const first = recordNpcChoice(initialProgress, 'inventor', 0);
    expect(readProgress(saved({ npcDecisions: [first.npcDecisions[0], first.npcDecisions[0]] }))).toEqual(initialProgress);
    const recovered = readProgress(saved({ npcDecisions: [{ ...first.npcDecisions[0], note: 'injected' }], riasec: { R: 999 } }));
    expect(recovered.npcDecisions[0].note).toBe(first.npcDecisions[0].note);
    expect(getPlazaRiasec(recovered).R).toBe(2);
    expect(recovered).not.toHaveProperty('riasec');
  });
});
