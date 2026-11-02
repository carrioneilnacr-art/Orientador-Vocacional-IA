/** Fictional learning scenarios. These checks describe task outcomes, never aptitude. */
export const labPlans = [
  {label:'Igual especie, tierra y agua; cambiar solo sol o sombra.', detail:'A y B reciben la misma agua. Solo cambia la exposición al sol.'},
  {label:'Dar más agua a la planta en sombra que a la del sol.', detail:'Cambian la luz y el agua. Podemos observar el conjunto, pero no aislar la luz.'},
  {label:'Comparar una especie de sombra con otra especie al sol.', detail:'Cambian la especie y la luz. Cualquiera de las dos puede influir.'},
] as const;

export const labConclusions = [
  'La sombra conservó más humedad en esta prueba. Repetiría antes de generalizar.',
  'La sombra siempre es mejor para cualquier planta y en cualquier lugar.',
  'Con una sola prueba ya sé exactamente cuánta agua necesita todo el huerto.',
] as const;

export function reviewLabPlan(plan:number) {
  return {
    controlled:plan===0,
    feedback:plan===0
      ? 'Ahora solo cambia la luz. Esa comparación ayuda a investigar su efecto; todavía no prueba que ocurra igual en todo el huerto.'
      : 'Cambiaste más de una condición. El resultado puede servir para hacer preguntas, pero no permite atribuir el cambio solo a la luz. Puedes revisar el plan.',
  };
}

export function reviewLabConclusion(plan:number,conclusion:number) {
  const solved=plan===0&&conclusion===0;
  return {solved,feedback:solved
    ? 'Tu conclusión distingue lo observado de lo que aún falta comprobar. El siguiente paso sería repetir y registrar nuevas comparaciones.'
    : plan!==0
      ? 'Antes de concluir sobre la luz, conviene comparar plantas equivalentes con la misma agua. Revisa qué condiciones cambiaste.'
      : 'Esta simulación muestra una comparación, no una regla para todas las plantas. Una conclusión prudente reconoce ese límite.'};
}

export const techObservations = [
  {label:'Revisar el proyector',text:'El menú del proyector se ve bien. Está encendido y seleccionado en HDMI 1; el cable entra por HDMI 2.'},
  {label:'Probar la presentación',text:'La presentación se ve en la computadora y está lista para enviar imagen. No hace falta rehacer el archivo.'},
  {label:'Consultar el probador de cable',text:'En esta simulación, el cable A pierde la señal. El cable B de repuesto pasa la comprobación.'},
] as const;
export const techHypotheses = [
  'La presentación está dañada y debemos rehacerla.',
  'El recorrido de la señal combina una entrada distinta y un cable intermitente.',
  'Falta energía para encender el proyector.',
] as const;
export const techRepairs = [
  'Seleccionar HDMI 2 y conservar el cable A.',
  'Cambiar al cable B y dejar seleccionada HDMI 1.',
  'Usar el cable B y seleccionar HDMI 2.',
] as const;
export function reviewTechRepair(hypothesis:number,repair:number) {
  const connected=repair===2;
  return {connected,solved:connected&&hypothesis===1,feedback:connected
    ? hypothesis===1
      ? 'La imagen llega y se mantiene. Tu explicación coincide con las dos comprobaciones: entrada correcta y cable estable.'
      : 'La imagen llega con este ajuste. Compara tu hipótesis con las observaciones: la energía y el archivo ya funcionaban.'
    : repair===0
      ? 'Aparece imagen, pero se interrumpe: la entrada coincide y el cable A sigue fallando. ¿Qué observación falta atender?'
      : 'El cable B es estable, pero la pantalla sigue sin imagen: el proyector escucha una entrada distinta a la conectada.'};
}

export const muralAudiences = [
  {label:'Quienes llegan por primera vez',message:'TU PRIMER PASO',brief:'Quieren identificar un lugar para comenzar sin conocer los nombres de las aulas.'},
  {label:'Quienes vienen con su familia',message:'DESCUBRIMOS JUNTOS',brief:'Quieren encontrar una actividad que puedan conversar y probar en compañía.'},
  {label:'Quienes aún no saben qué les interesa',message:'PRUEBA ALGO NUEVO',brief:'Quieren sentir que pueden explorar sin tener que elegir una profesión hoy.'},
] as const;
export const muralPalettes = [
  {label:'Tinta y arena',background:'#f1dfb6',foreground:'#203e56',accent:'#b55a39',tradeoff:'El texto oscuro se distingue del fondo claro. Las formas pueden acompañar el mensaje.'},
  {label:'Ciruela y crema',background:'#53384f',foreground:'#fff0cc',accent:'#efae72',tradeoff:'El contraste resalta el mensaje y da un tono cálido. Comprueba también la lectura a distancia.'},
  {label:'Verde y papel',background:'#d8e4ce',foreground:'#244c3f',accent:'#bf6a43',tradeoff:'El conjunto recuerda al patio. Un símbolo simple ayuda a no depender solo del color.'},
] as const;
export const muralCompositions = [
  {label:'Un camino central',tradeoff:'La mirada sigue una ruta. Deja espacio alrededor del mensaje para que se lea.'},
  {label:'Una ronda de figuras',tradeoff:'Sugiere encuentro y participación. Cuida que las figuras no compitan con el mensaje.'},
  {label:'Ventanas diferentes',tradeoff:'Muestra posibilidades diversas. Un foco común puede evitar que la composición se disperse.'},
] as const;
export const muralReviews = [
  'Pedir a alguien nuevo que explique qué entiende y ajustar lo que no quede claro.',
  'Comparar dos versiones a distancia y elegir la que conserve mejor mi intención.',
  'Probarlo con el grupo al que va dirigido y recoger otra interpretación.',
] as const;
export const reflectionPrompts = {
  laboratorio:'Piensa en observar, comparar y dejar una pregunta abierta. ¿Querrías seguir explorando ese tipo de actividad?',
  taller:'Piensa en crear para alguien y revisar tu idea con otra mirada. ¿Querrías seguir explorando ese tipo de actividad?',
  tecnologia:'Piensa en buscar una falla, probar un ajuste y comprobar qué cambió. ¿Querrías seguir explorando ese tipo de actividad?',
} as const;
