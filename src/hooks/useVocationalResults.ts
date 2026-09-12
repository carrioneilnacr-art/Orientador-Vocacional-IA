"use client";

import { useEffect, useState } from "react";
import type { VocationalResults } from "@/types/vocacional";
import { DIMENSION_LABELS } from "@/constants/dimensions";

interface UseVocationalResultsReturn {
  results: VocationalResults | null;
  isLoaded: boolean;
  profileName: string;
  topDimension: string | null;
  testId: string | null;
}

/**
 * useVocationalResults
 * Carga y procesa los resultados vocacionales desde localStorage.
 */
export function useVocationalResults(): UseVocationalResultsReturn {
  const [results, setResults] = useState<VocationalResults | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vocational_results");
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch {
        // corrupted data — leave results null
      }
    }
    setIsLoaded(true);
  }, []);

  const topDimension =
    Object.entries(results?.dimensionScores ?? {}).sort(
      ([, a], [, b]) => (b as number) - (a as number),
    )[0]?.[0] ?? null;

  const profileName = topDimension ? (DIMENSION_LABELS[topDimension] ?? "Lógico") : "Lógico";
  const testId = results?.testId ?? null;

  return { results, isLoaded, profileName, topDimension, testId };
}

