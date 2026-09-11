/**
 * pdfPrint.ts
 * Solución de generación de PDF usando window.print().
 *
 * ¿Por qué window.print() en lugar de html2canvas / dom-to-image-more?
 * Tailwind CSS v4 usa la función de color oklch() internamente.
 * Los motores de canvas (html2canvas, dom-to-image-more) no soportan oklch()
 * al serializar SVG → Canvas. window.print() usa el motor de renderizado
 * nativo del navegador que sí soporta oklch() de forma perfecta.
 */

/**
 * Dispara el diálogo de impresión del navegador con el reporte formateado.
 * El CSS @media print en globals.css oculta header, footer y copilot,
 * muestra el banner PDF y aplica page-break-inside: avoid en cada sección.
 *
 * @param profileName Nombre del perfil (usado para sugerir el nombre del archivo en Chrome)
 * @param onStart Callback ejecutado al iniciar (para mostrar estado de carga)
 * @param onEnd Callback ejecutado al terminar (para ocultar estado de carga)
 */
export function triggerPrintAsPDF(
  profileName: string,
  onStart?: () => void,
  onEnd?: () => void,
): void {
  const reportElement = document.getElementById('report-content');
  if (!reportElement) return;

  onStart?.();

  // Sugerir el nombre del archivo via document.title (Chrome lo usa como nombre del PDF)
  const fecha = new Date().toLocaleDateString("es-PE").replace(/\//g, "-");
  const originalTitle = document.title;
  document.title = `Orientador_Vocacional_${profileName}_${fecha}`;

  // Mostrar el banner de PDF y ocultar el copilot antes de imprimir
  reportElement.classList.add('pdf-export-mode');

  // Pequeño delay para que el layout se ajuste antes de abrir el diálogo
  setTimeout(() => {
    window.print();

    // Restaurar título y estado original después de imprimir
    // afterprint se dispara cuando el usuario cierra el diálogo
    const handleAfterPrint = () => {
      document.title = originalTitle;
      reportElement.classList.remove('pdf-export-mode');
      onEnd?.();
      window.removeEventListener('afterprint', handleAfterPrint);
    };

    window.addEventListener('afterprint', handleAfterPrint);

    // Fallback: si afterprint no se dispara en 30s, limpiar de todas formas
    setTimeout(() => {
      handleAfterPrint();
    }, 30_000);
  }, 300);
}
