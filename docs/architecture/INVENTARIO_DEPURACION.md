# Inventario para depuración y archivo

Fecha: 2 de noviembre de 2026. **No se borró ningún archivo ni dependencia.** Esta lista es una propuesta para revisión del propietario, no una autorización de borrado ni una prueba de ausencia total de uso.

## Método y límites

Se revisaron imports, nombres en código, URLs de CSS, plantillas de ruta de assets, scripts, JSON de escena y documentación mediante `rg`. Cero imports no basta: los archivos de `public/` también se sirven por URL, las rutas de Next.js se descubren por convención y los scripts pueden ejecutarse manualmente. Antes de borrar, comprobar llamadas externas, enlaces publicados, Git y backups; repetir build y pruebas tras una eliminación pequeña y reversible.

## Candidatos concretos de menor riesgo

| Elemento | Qué es / evidencia | Propuesta y cautela |
|---|---|---|
| `src/components/game/CompanionHint.tsx` | Componente antiguo de Lumi; solo devuelve `null`. No se encontró import consumidor en `src`. | Candidato a eliminar junto con su CSS tras búsqueda final. |
| `src/components/game/CompanionHint.module.css` | Estilos del acompañante retirado. | Archivar con el componente; confirmar que no se importe de forma independiente. |
| `src/components/game/PlazaDialogue.tsx` | Diálogo de implementación previa; no se encontró import consumidor en `src`. El activo es `PlazaRpgDialogue.tsx`. | Candidato a archivo, revisar pruebas y ramas antiguas. |
| `.next-dev.log` | Salida de un servidor local. | Excluir de Git; puede perderse su historial diagnóstico si se elimina. |
| `artifacts/` | Capturas de trabajo y estados anteriores, no recursos del runtime encontrados. Inventario local: 19 archivos, aproximadamente 13,2 MiB. | Conservar fuera del paquete web o archivar; algunas capturas pueden ser evidencia útil. |

## Assets de referencia o versiones anteriores

| Elemento | Uso observado | Propuesta |
|---|---|---|
| `public/game/colegio/{laboratorio,taller,tecnologia}-hd.png` y versiones sin sufijo | `ColegioRoom.tsx` construye dinámicamente la ruta `${room}-compacto.png`; `ASSETS.md` conserva versiones de proceso. | Candidatos a mover a un archivo fuera de `public/`, no a borrar sin copia. |
| `public/game/colegio/fachada.png`, `banca.png` | La documentación del patio los identifica como recursos de desarrollo no superpuestos al fondo aprobado. | Archivar si no hay consumidor externo. |
| `public/game/colegio/npcs.png` | Hoja original de NPC; el juego utiliza archivos individuales. | Conservar como fuente maestra fuera de `public/` si se decide reducir peso. |
| `public/game/plaza/test-composite.png`, `right-side-full.png`, `metro-ref-crop.png`, `metro-reference.png`, `luis-extracted.png`, `totem-extracted.png`, `bus-extracted.png` | Recursos intermedios cuyo nombre no apareció como consumidor runtime en la búsqueda de `src`. | Revisar visualmente y archivar como material de producción; no asumir que son duplicados binarios. |
| `public/game/npcs/tecnico-full.png`, `tecnico-ref.png` | Referencias/intermedios sin coincidencia de consumo runtime encontrada. | Archivar tras confirmar que los scripts de generación no los necesiten. |
| `public/game/chaski-walk-v1.png` | Caminata anterior mencionada en procedencia; renderer actual usa las láminas de `plaza-lima/base/`. | Archivar con su procedencia; no confundir con las láminas activas. |
| `plaza-lima/` en la raíz | Paquete original de extracción; documentación indica que los recursos servibles se copiaron a `public/game/plaza-lima/`. | Conservar fuente fuera del despliegue si se desea. No borrar manifest ni referencias sin copia. |

`public/game/` contiene aproximadamente 180 archivos y 84,2 MiB en la inspección local. Este tamaño no equivale al peso descargado inicialmente por el navegador. Hay que medir requests reales y caché antes de prometer una mejora de rendimiento.

## Legacy todavía conectado: no borrar como si estuviera muerto

- `AdventureWorld.tsx` todavía se importa desde `Adventure.tsx` como ruta alternativa. A su vez utiliza `PlazaScene.tsx`, `plazaLayout.ts`, `plazaProjection.ts`, `plazaNpcs.ts` y `plaza-reference.json`.
- `PlazaScene.test.ts` y `plazaProjection.test.ts` prueban esa implementación. Conservar hasta retirar explícitamente la rama alternativa y sus pruebas en una migración controlada.
- `public/game/chaski-walk-right-user.png` sigue referenciado desde `AdventureWorld.module.css` y `PlazaWorld.module.css`.
- `PlazaWorld.module.css` lo importa el diálogo antiguo. Depurar toda la cadena después de confirmar usos, no solo el primer archivo.
- `src/game/adventure.ts` conserva misiones y datos de compatibilidad que siguen importándose. Una futura separación del controlador de viaje debe decidir cómo migrar guardados antiguos.
- `test-db.mjs` es un diagnóstico manual citado en README. Los `test-*.mjs` y `test-max-scores.*` de la raíz no pertenecen automáticamente a Vitest, pero eso no los convierte en basura. Revisar funciones y credenciales sin ejecutarlos indiscriminadamente.
- `scripts/inspect-*.cjs` y `scripts/audit-map-routes.cjs` son herramientas de QA; no se cargan en la web, pero sirven para verificar contornos y recorridos.

## Dependencias que merecen revisión, no desinstalación automática

| Paquete | Evidencia local | Siguiente comprobación |
|---|---|---|
| `html2canvas`, `dom-to-image-more` | No se encontró import ejecutable en `src`/`scripts`; `pdfPrint.ts` explica el cambio a impresión del navegador. README aún los menciona. | Revisar scripts externos, actualizar README y retirar uno por vez con build y prueba PDF. |
| `@google/genai` | No apareció import consumidor en la búsqueda del repositorio excluyendo dependencias/build; el chat usa `@ai-sdk/google`. | Revisar experimentos fuera de repo antes de retirar. |
| `react-is` | Sin import directo encontrado. | Inspeccionar árbol de dependencias y requisitos de pares; no asumir innecesario. |
| `jspdf`, `exceljs`, `pdf-parse`, `recharts` | Hay imports en pruebas, parser de notas o resultados. | Mantener; no borrar por parecer repetidos respecto de otras bibliotecas. |

## Documentación e infraestructura: consolidar

- `docs/architecture/PRODUCT_ROADMAP.md` describe el flujo antiguo, versiones de IA y afirmaciones de producto que no son una certificación. Referencia nueva: `ARQUITECTURA_MONOLITO_MODULAR.md`.
- `docs/game/RUTA_CHASKI_IA_ESCENARIOS.md` contiene textos antiguos de tres conversaciones y controles ya modificados. El código exige cinco. Conservar historial y actualizar referencias en una revisión editorial, no usarlo como especificación vigente del gate.
- `docs/architecture/003_enable_rls_policies.sql` contiene políticas históricas públicas de sesiones. No volver a ejecutarlo para configurar producción. Se confirmó el riesgo remoto y se endureció `user_sessions` con el registro operativo `HARDEN_USER_SESSIONS.sql`, sin borrar filas. Falta reconciliar ese SQL con el historial de migraciones; conservar ambos como evidencia hasta completar esa reconciliación. Borrar el archivo antiguo no corrige ni documenta por sí solo la BD.
- `docs/architecture/*.sql` y `supabase/migrations/` representan dos lugares de SQL. Elegir una secuencia canónica y verificar qué se aplicó antes de moverlos.
- `docs/game/*.png` y documentos de auditoría sirven de evidencia. Se pueden archivar fuera del despliegue web sin perderlos del proyecto.
- `.github/workflows/quality.yml`, `src/__tests__/architecture.test.ts` y los módulos nuevos `assessment`, `adventure`, `chaski-ai` y `school-portal` son infraestructura/código activo de esta reorganización: no son candidatos de limpieza por ser nuevos o no aparecer en capturas de juego.

## Orden sugerido de limpieza

1. Aprobar una lista concreta de candidatos, manteniendo copia o historial recuperable.
2. Retirar componentes `null` o sin consumidores confirmados.
3. Archivar intermedios gráficos fuera de `public/` y revisar visualmente ambos escenarios.
4. Depurar la rama legacy completa solo después de migrar sus guardados y entradas alternativas.
5. Revisar dependencias y documentación; ejecutar tipos, pruebas, build y prueba de exportación de reportes.

No se deben incluir `.env`, secretos, base de datos, backups completos ni directorios amplios en una operación de limpieza genérica.
