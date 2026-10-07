---
name: psychometrics-qa
description: >-
  Use this skill to audit, calibrate, and test the RIASEC vocational questionnaire, scoring algorithms, and automated test suites in Orientador Vocacional IA.
---

# Psychometrics QA Skill: Orientador Vocacional IA

Esta habilidad guía a los agentes de Antigravity en la validación psicométrica del modelo RIASEC y la ejecución de pruebas unitarias automatizadas con Vitest.

## 1. Fundamentos Psicométricos del Proyecto

El cuestionario consta de **16 interacciones** organizadas en **4 misiones**:
1. **Misión 1: Primeros Pasos Vocacionales** (Preguntas 1 a 4)
2. **Misión 2: Desafíos y Habilidades Prácticas** (Preguntas 5 a 8)
3. **Misión 3: Trabajo en Equipo y Liderazgo** (Preguntas 9 a 12)
4. **Misión 4: Visión de Futuro e Impacto Social** (Preguntas 13 a 16)

Cada pregunta tiene exactamente **4 opciones**, y cada opción asigna puntajes ponderados a las dimensiones RIASEC + Tecnología/Lógica:
* `REALISTIC` (Realista)
* `INVESTIGATIVE` (Investigador)
* `ARTISTIC` (Artístico)
* `SOCIAL` (Social)
* `ENTERPRISING` (Emprendedor)
* `CONVENTIONAL` (Convencional)
* `TECH` (Tecnológico)
* `LOGIC` (Lógico)

## 2. Personalidades de Chaski Asociadas
La dimensión con mayor puntaje determina la personalidad del avatar Chaski para la devolución del reporte:
* `TECH` / `LOGIC` $\rightarrow$ **Analítico**
* `INVESTIGATIVE` $\rightarrow$ **Explorador**
* `SOCIAL` $\rightarrow$ **Social / Empático**
* `ARTISTIC` $\rightarrow$ **Creativo**
* `ENTERPRISING` $\rightarrow$ **Emprendedor**

## 3. Protocolo de Pruebas Obligatorio

Cada vez que un agente modifique `src/data/questionnaireData.ts`, `src/constants/dimensions.ts` o la lógica de cálculo en `/api/vocacional`:

1. **Ejecutar la suite de pruebas unitarias:**
   ```bash
   npx vitest run
   ```
2. **Ejecutar la verificación de tipos:**
   ```bash
   npx tsc --noEmit
   ```
3. **Criterios de Éxito (Definition of Done):**
   * Las 16 preguntas deben distribuirse estrictamente (4 preguntas por misión).
   * Exactamente 64 opciones en total (4 opciones por pregunta).
   * 100% de los tests en `src/__tests__/vocacional.test.ts` deben pasar sin errores.
