import type { Messages } from './en';

/** Spanish copy. Tone and terms: design/index-e/glossary.es.md (informal "tú"). */
export const es: Messages = {
  meta: {
    title: 'Metis: del material de clase al dato de aprendizaje',
    description:
      'Metis usa IA para convertir tus archivos de clase en evaluaciones, las comparte con un enlace y muestra los resultados por ítem, estudiante y tema. Los estudiantes pueden pedirle pistas a su guía IA, que no les da la respuesta.',
    ogDescription:
      'Evaluaciones con IA a partir de tus archivos, compartidas con un enlace. Su guía IA da pistas a los estudiantes y no les da la respuesta.',
    ogImageAlt: 'Metis, la guía IA, dibujada como una estudiante con corona de laurel, una lechuza y libros',
  },
  a11y: {
    skipToContent: 'Saltar al contenido',
    mainNav: 'Principal',
    legalNav: 'Legal',
    language: 'Idioma',
    home: 'Metis, inicio',
    langNames: { es: 'Español', en: 'English' },
  },
  sampleData: 'Datos de ejemplo · Quiz 02, Oferta y demanda',
  header: {
    login: 'Entrar',
    cta: 'Crear evaluación →',
    ctaShort: 'Crear gratis →',
    menu: 'Menú',
    nav: {
      guide: 'Guía IA',
      configure: 'Configurar',
      results: 'Resultados',
      insights: 'Conversaciones',
      spec: 'Ficha',
    },
  },
  hero: {
    titleLead: 'Del material de clase',
    titleTail: 'al dato de aprendizaje',
    lead: 'Metis usa IA para convertir tus archivos en una evaluación, la comparte con un enlace y te muestra los resultados por ítem, estudiante y tema. Dentro del enlace, los estudiantes pueden pedirle pistas a Metis; no les dará la respuesta.',
    primaryCta: 'Crear evaluación gratis →',
    secondaryCta: 'Habla con Metis ↓',
    pipeline: [
      { key: 'file', title: 'Archivo', note: 'PDF · DOCX · PPTX' },
      { key: 'items', title: 'Ítems', note: 'Sugeridos por IA' },
      { key: 'link', title: 'Enlace + Metis', note: 'Pistas, nunca respuestas' },
      { key: 'results', title: 'Resultados', note: 'Por ítem y estudiante' },
    ],
    pipelineLabel: 'Del archivo a los resultados en cuatro pasos',
    card: {
      groupLabel: 'Metis, la guía IA',
      header: 'Metis',
      online: 'En línea',
      name: 'Metis',
      inEveryLink: 'En cada enlace',
      pause: 'Pausar el carrusel de Metis',
      play: 'Reanudar el carrusel de Metis',
      aria: (expression: string) => `Metis, la guía IA, ${expression}`,
    },
    expressions: {
      happy: { label: 'Contenta', line: 'Doy pistas, nunca respuestas.' },
      listening: { label: 'Escuchando', line: 'Pregúntame lo que quieras sobre este ítem.' },
      thinking: { label: 'Pensando', line: 'Busco una pista que respete tus reglas.' },
      reviewing: { label: 'Revisando', line: 'Comparo el trabajo con tu rúbrica.' },
      guiding: { label: 'Guiando', line: 'Primero compara las dos columnas.' },
      celebrating: { label: 'Celebrando', line: 'Llegaste por tu cuenta. ¡Bien hecho!' },
    },
  },
  guide: {
    title: 'Metis sigue las reglas que tú defines.',
    lead: 'Metis trabaja dentro del enlace del estudiante. Cambia una regla y la siguiente respuesta del chat la seguirá. Escribe tu propia pregunta o mira la demostración.',
    presence: {
      live: 'Metis · en vivo',
      headline: {
        listening: 'Esperando una pregunta',
        thinking: 'Pensando una pista…',
        guiding: 'Escribiendo una pista…',
        reviewing: 'Reservándose la respuesta',
        off: 'Apagada en esta evaluación',
      },
      maxHints: (n: number) => `máx. ${n} pistas`,
      cites: 'cita la fuente',
      noCites: 'sin citas',
    },
    rules: {
      heading: 'Reglas del instructor · Quiz 02',
      locked: 'Nunca revelar la respuesta',
      alwaysOn: 'Siempre activa',
      helpStyle: 'Estilo de ayuda',
      modes: {
        socratic: {
          label: 'Preguntas socráticas',
          desc: 'Responde con preguntas que llevan al razonamiento',
          short: 'Socrático',
          tag: 'SOCRÁTICO',
        },
        hints: {
          label: 'Pistas directas',
          desc: 'Señala el siguiente paso sin resolverlo',
          short: 'Pistas directas',
          tag: 'PISTA DIRECTA',
        },
        example: {
          label: 'Ejemplo resuelto',
          desc: 'Resuelve un caso parecido para que el estudiante imite el método',
          short: 'Ejemplo resuelto',
          tag: 'EJEMPLO RESUELTO',
        },
      },
      maxHints: 'Pistas máximas por ítem',
      cite: 'Citar el material del curso',
      applies: 'Los cambios aplican a la próxima respuesta',
    },
    chat: {
      name: 'Metis',
      role: 'guía IA',
      status: { idle: 'En línea · sigue tus reglas', thinking: 'Pensando', writing: 'Escribiendo' },
      hints: 'Pistas',
      hintsAria: (used: number, max: number) => `Pistas usadas: ${used} de ${max}`,
      reset: 'Reiniciar',
      demo: 'Ver demostración',
      item: {
        label: 'Ítem 03 · Precio de equilibrio',
        prompt: 'Con la tabla de la Lección 4, encuentra el precio de equilibrio.',
        caption: 'Tabla de precios de la Lección 4',
        price: 'Precio',
        supplied: 'Ofrecida',
        demanded: 'Demandada',
        checking: '(en revisión)',
      },
      log: 'Conversación con Metis',
      student: 'Estudiante',
      thinkingAria: 'Metis está pensando',
      prompts: {
        initial: '¿Cuál es el precio de equilibrio? Solo dime el número.',
        answer: 'Solo dime la respuesta.',
        start: 'No sé por dónde empezar.',
        check40: '¿Es $40?',
      },
      inputLabel: 'Escribe a Metis',
      placeholder: 'Pregunta algo, como «¿Es $30?»',
      send: 'Enviar →',
      off: { text: 'La guía IA está apagada en esta evaluación', turnOn: 'Encender la guía' },
      thatPrice: 'ese precio',
      replies: {
        answer: {
          socratic:
            'No puedo darte el número, pero podemos encontrarlo juntos. ¿Qué tiene que cumplirse entre oferta y demanda en el precio de equilibrio?',
          hints:
            'Pista: el precio de equilibrio es donde la cantidad ofrecida es igual a la demandada. Busca esa fila en la tabla.',
          example:
            'Ejemplo resuelto: si a $8 los vendedores ofrecen 15 unidades y los compradores quieren 15, entonces $8 es el equilibrio. Haz la misma comprobación en tu tabla.',
        },
        start: {
          socratic:
            'Empieza por la tabla. ¿Qué pasa con la cantidad demandada cuando sube el precio? ¿Y con la ofrecida?',
          hints:
            'Pista: recorre la tabla fila por fila y compara las dos columnas de cantidad. Hay una fila distinta a las demás.',
          example:
            'Este es el método: 1) lee una fila, 2) compara ofrecida y demandada, 3) detente donde coincidan. Prueba el paso 1 con la primera fila.',
        },
        check: {
          socratic: (at: string) =>
            `Todavía no te lo confirmo. A ${at}, ¿cuántas unidades se ofrecen y cuántas se demandan? ¿Son iguales?`,
          hints: (at: string) =>
            `Pista: busca la fila de ${at} y compara las dos columnas de cantidad. Si coinciden, tienes tu respuesta.`,
          example: (at: string) =>
            `Ejemplo: a $8, 15 ofrecidas y 15 demandadas significa que $8 es el equilibrio. Haz la misma comprobación a ${at}.`,
        },
        other: {
          socratic: 'Mira la tabla. ¿Qué te dice sobre compradores y vendedores cuando cambia el precio?',
          hints: 'Pista: este ítem trata del punto donde se encuentran las dos columnas de cantidad.',
          example:
            'Imagina un mercado donde a $8 se ofrecen y se quieren 15 unidades: ese precio es el equilibrio. Busca el mismo patrón aquí.',
        },
      },
      source: 'Fuente: Lección 4, p. 06.',
      limit: (max: number) =>
        `Ya usaste las ${max} pistas que tu instructor permite en este ítem. Da tu mejor respuesta; verás la retroalimentación al enviar.`,
      tag: {
        hint: (n: number, max: number) => `PISTA ${n}/${max}`,
        source: 'FUENTE P. 06',
        withheld: 'RESPUESTA RESERVADA',
        limit: 'LÍMITE ALCANZADO',
      },
      notices: {
        mode: (label: string) => `Regla actualizada: ${label}`,
        maxHints: (n: number) => `Regla actualizada: pistas máximas ${n}`,
        cite: (on: boolean) => `Regla actualizada: citar material ${on ? 'sí' : 'no'}`,
        guide: (on: boolean) => (on ? 'Guía IA encendida' : 'Guía IA apagada'),
      },
    },
  },
  configure: {
    title: 'Tú defines la estructura y Metis redacta los ítems.',
    lead: 'La vista previa usa los temas que Metis encontró en el material de ejemplo. Los ajustes de la guía son los mismos que usa el chat de arriba.',
    count: 'Número de ítems',
    countValueText: (n: number) => `${n} ítems`,
    types: 'Tipos de ítem',
    typeNames: {
      mc: 'Opción múltiple',
      tf: 'Verdadero o falso',
      short: 'Respuesta corta',
      match: 'Relacionar',
    },
    minOneType: 'Se necesita al menos un tipo de ítem',
    difficulty: 'Dificultad',
    levels: { basic: 'Básica', medium: 'Media', advanced: 'Avanzada' },
    metisToggle: 'Metis en el enlace del estudiante',
    maxHints: 'Pistas máximas por ítem',
    previewTitle: 'Economía · Oferta y demanda',
    previewLabel: 'Vista previa de la evaluación',
    columns: { no: 'Nº', type: 'Tipo', topic: 'Tema', level: 'Nivel', source: 'Fuente' },
    levelAria: (d: number) => `Nivel ${d} de 3`,
    page: (n: string) => `p. ${n}`,
    more: (n: string) => `+ ${n} ítems más`,
    summary: (count: string, types: number, level: string, guide: boolean) =>
      `${count} ítems · ${types} tipos · ${level} · guía ${guide ? 'activa' : 'apagada'}`,
    guideLine: (on: boolean, max: number) =>
      on ? `Metis: activa · máx. ${max} pistas · nunca revela la respuesta` : 'Metis: apagada',
    ready: 'Listo para compartir',
  },
  topics: {
    demand: 'Ley de la demanda',
    supply: 'Ley de la oferta',
    equilibrium: 'Precio de equilibrio',
    elasticity: 'Elasticidad precio',
    surplus: 'Excedente del consumidor',
    shifts: 'Desplazamientos de la curva',
    substitutes: 'Bienes sustitutos',
    complements: 'Bienes complementarios',
    ceilings: 'Precios máximos',
    shortage: 'Escasez y excedente',
  },
  results: {
    title: 'Mira cómo salió cada ítem apenas los estudiantes entregan.',
    kpis: {
      submissions: 'Entregas',
      accuracy: 'Acierto medio',
      hints: 'Pistas de Metis',
      revealed: 'Respuestas reveladas',
    },
    percent: (n: number) => `${n} %`,
    histogramCaption: 'Distribución de puntajes (0–10)',
    histogramLegend: 'Puntaje de 4 o menos',
    histogramLabel: 'Histograma de puntajes: la mayoría obtuvo entre 6 y 9 puntos de 10',
    accuracyCaption: 'Acierto por ítem · de menor a mayor',
    review: 'Repasar',
    summaryLabel: 'Metis · resumen para el instructor',
    summary:
      'El ítem 05 concentró 6 de las 11 pistas. Conviene repasar el excedente del consumidor antes de la próxima unidad.',
    seeConversations: 'Ver las conversaciones →',
    avatarLabel: 'Metis revisando los resultados, con lentes de lectura',
  },
  insights: {
    title: 'Cada pregunta que le hacen a Metis queda guardada.',
    lead: 'Los chats se guardan junto con los resultados de la evaluación. Puedes leer la conversación de cualquier estudiante, ver qué preguntó más el grupo y encontrar el momento del examen en que se acumularon las preguntas.',
    stats: {
      asked: 'Estudiantes que preguntaron',
      questions: 'Preguntas a Metis',
      peak: (item: string) => `Pico · ítem ${item}`,
      minutes: 'min',
    },
    intents: {
      heading: 'Qué le preguntan a Metis',
      names: {
        concept: 'Explicar un concepto',
        check: 'Comprobar una respuesta',
        answer: 'Pedir la respuesta',
        start: 'Saber por dónde empezar',
      },
      examples: {
        concept: '¿Qué significa excedente del consumidor?',
        check: '¿Es $40?',
        answer: 'Solo dime la respuesta.',
        start: 'No sé por dónde empezar.',
      },
      withheld: 'Respuesta reservada siempre',
    },
    timeline: {
      heading: 'Preguntas durante el examen',
      caption: 'Preguntas a Metis por bloque de 5 minutos',
      label:
        'Gráfica de línea: las preguntas a Metis subieron hasta un pico de 17 entre los minutos 20 y 25, mientras el grupo resolvía el ítem 05, y bajaron hacia el final del examen.',
      axis: (minute: number) => `${minute} min`,
      peak: (item: string, n: number) => `Ítem ${item} · ${n}`,
    },
    sessions: {
      heading: 'Revisa cualquier conversación',
      listLabel: 'Conversaciones guardadas',
      student: (n: string) => `Estudiante ${n}`,
      meta: (item: string, minute: number, count: number) =>
        `Ítem ${item} · min ${minute} · ${count} mensajes`,
      transcriptLabel: (student: string) => `Conversación entre ${student} y Metis`,
      item: (item: string, topic: string) => `Ítem ${item} · ${topic}`,
      saved: 'Guardada con los resultados de la evaluación · solo lectura',
      transcripts: {
        s07: [
          { from: 'student', text: '¿Qué significa excedente del consumidor?' },
          {
            from: 'metis',
            text: 'Compara lo que los compradores estaban dispuestos a pagar con lo que pagaron. ¿En qué parte de la curva de demanda puedes ver esa diferencia?',
            tag: 'PISTA 1/3',
          },
          { from: 'student', text: '¿El área debajo de la curva y arriba del precio?' },
          {
            from: 'metis',
            text: 'Bien. ¿Qué forma tiene esa área y cómo calcularías su tamaño?',
            tag: 'SOCRÁTICO',
          },
        ],
        s12: [
          { from: 'student', text: '¿Es $40?' },
          {
            from: 'metis',
            text: 'Todavía no te lo confirmo. A $40, ¿cuántas unidades se ofrecen y cuántas se demandan?',
            tag: 'RESPUESTA RESERVADA',
          },
          { from: 'student', text: '30 y 30.' },
          {
            from: 'metis',
            text: 'Entonces, ¿qué te dice eso de $40? Escribe tu razonamiento en la respuesta.',
            tag: 'PISTA 2/3',
          },
        ],
        s19: [
          { from: 'student', text: 'Solo dame la respuesta del ítem 05.' },
          {
            from: 'metis',
            text: 'No puedo darte la respuesta, pero podemos llegar juntos. ¿Qué precio pagaron los compradores y cuánto estaban dispuestos a pagar?',
            tag: 'RESPUESTA RESERVADA',
          },
          { from: 'student', text: 'Pagaron $30 y pagarían hasta $50.' },
          {
            from: 'metis',
            text: 'Entonces cada comprador se quedó con parte de esa diferencia. ¿Cómo la sumarías para todo el grupo?',
            tag: 'PISTA 1/3',
          },
        ],
        s23: [
          { from: 'student', text: 'No sé por dónde empezar.' },
          {
            from: 'metis',
            text: 'Empieza por la tabla. ¿Qué pasa con la cantidad demandada cuando sube el precio?',
            tag: 'PISTA 1/3',
          },
          { from: 'student', text: 'Baja.' },
          {
            from: 'metis',
            text: 'Exacto. Esa es la ley de la demanda. La Lección 4, p. 04, explica por qué.',
            tag: 'FUENTE P. 04',
          },
        ],
      },
    },
    trend: {
      label: 'Metis · tendencia para el instructor',
      text: '8 de los 17 estudiantes que usaron a Metis preguntaron qué es el excedente del consumidor, todos durante el ítem 05, donde se concentró el pico de preguntas. Repasa la definición antes de la próxima unidad.',
      basis: 'Basado en 64 preguntas de 17 conversaciones',
      avatarLabel: 'Metis pensando en las conversaciones del grupo',
    },
  },
  spec: {
    title: 'Qué hace Metis, sin adjetivos.',
    rows: [
      { id: 'input', k: 'Entrada', v: 'PDF, documentos, presentaciones y notas. Arrástralos y suéltalos.' },
      {
        id: 'generation',
        k: 'Generación',
        v: 'La IA sugiere ítems a partir de tu material. Tú apruebas, editas o descartas cada uno.',
      },
      {
        id: 'types',
        k: 'Tipos de ítem',
        v: 'Opción múltiple, verdadero o falso, respuesta corta y relacionar.',
      },
      {
        id: 'distribution',
        k: 'Distribución',
        v: 'Un enlace por evaluación. Los estudiantes responden desde cualquier dispositivo.',
      },
      {
        id: 'guide',
        k: 'Guía IA',
        v: 'Metis, un agente en el enlace del estudiante. Da pistas según tus reglas y nunca revela la respuesta.',
      },
      {
        id: 'results',
        k: 'Resultados',
        v: 'Por ítem, estudiante y tema, en cuanto los estudiantes entregan.',
      },
      {
        id: 'conversations',
        k: 'Conversaciones',
        v: 'Cada chat con Metis se guarda con los resultados. Puedes leerlo, ver las preguntas más frecuentes y seguir tendencias.',
      },
      { id: 'sources', k: 'Fuentes', v: 'Cada ítem remite al pasaje del material de origen.' },
      { id: 'export', k: 'Exportación', v: 'PDF y Word.' },
    ],
  },
  cta: {
    title: 'Empieza con un archivo',
    note: 'Sin tarjeta de crédito · configuración en 2 minutos',
    primary: 'Crear evaluación gratis →',
    secondary: 'Hablar con el equipo',
    metisCaption: 'Metis viene en cada enlace',
    avatarLabel: 'Metis celebrando',
  },
  footer: {
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    copyright: (year: number) => `© ${year} Metis`,
  },
};
