import type { Messages } from './en';

/** Spanish copy. Tone and terms: design/index-e/glossary.es.md (informal "tú"). */
export const es: Messages = {
  meta: {
    title: 'Metis — Del material de clase al dato de aprendizaje',
    description:
      'Metis genera evaluaciones con IA a partir de tus archivos, las comparte con un enlace y devuelve resultados por ítem, estudiante y tema, con una guía IA que acompaña sin resolver.',
  },
  a11y: {
    skipToContent: 'Saltar al contenido',
    mainNav: 'Principal',
    legalNav: 'Legal',
    language: 'Idioma',
    home: 'Metis, inicio',
    langNames: { es: 'Español', en: 'English' },
  },
  header: {
    tagline: 'Evaluación con IA · para instructores y estudiantes',
    login: 'Entrar',
    cta: 'Crear evaluación →',
    nav: { guide: 'Guía IA', configure: 'Configurar', results: 'Resultados', spec: 'Ficha' },
  },
  hero: {
    meta: ['01 — Plataforma', 'Crear · Compartir · Comprender', 'Compatible con Canvas LMS'],
    titleLead: 'Del material de clase',
    titleTail: 'al dato de aprendizaje',
    lead: 'Metis genera evaluaciones con IA a partir de tus archivos, las comparte con un enlace y devuelve resultados por ítem, estudiante y tema. Dentro del enlace del estudiante, guía sin dar la respuesta.',
    primaryCta: 'Crear evaluación gratis →',
    secondaryCta: 'Habla con Metis ↓',
    pipeline: [
      { key: 'A', title: 'Archivo', note: 'PDF · DOCX · PPTX' },
      { key: 'B', title: 'Ítems', note: 'Sugeridos por IA' },
      { key: 'C', title: 'Enlace + Metis', note: 'Pistas, nunca respuestas' },
      { key: 'D', title: 'Resultados', note: 'Por ítem y estudiante' },
    ],
    pipelineLabel: 'Del archivo a los resultados en cuatro pasos',
    card: {
      groupLabel: 'Metis, la guía IA',
      header: 'Metis',
      online: 'En línea',
      name: 'Metis',
      inEveryLink: 'En cada enlace',
      expressionsLabel: 'Expresiones de Metis',
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
  ticker: [
    'Quiz 02 · Oferta y demanda — 26 de 28 entregas',
    'Metis dio 11 pistas · 0 respuestas reveladas',
    'Ítem 05 marcado para repasar',
    'Leccion_06.pdf → 12 ítems sugeridos',
    'Acierto medio 74 %',
  ],
  guide: {
    kicker: '02 — Guía IA',
    title: 'Reglas explícitas. Comportamiento predecible.',
    lead: 'Metis vive dentro del enlace del estudiante. Cambia una regla a la izquierda y la conversación de la derecha la sigue, respuesta a respuesta. Escribe tu propia pregunta o mira la demostración.',
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
          desc: 'Resuelve un caso parecido para imitar el método',
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
          socratic:
            'Buena pregunta para pensarla. ¿Qué te dice la tabla sobre compradores y vendedores cuando cambia el precio?',
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
        mode: (label: string) => `Regla actualizada — ${label}`,
        maxHints: (n: number) => `Regla actualizada — pistas máximas: ${n}`,
        cite: (on: boolean) => `Regla actualizada — citar material: ${on ? 'sí' : 'no'}`,
        guide: (on: boolean) => (on ? 'Guía IA encendida' : 'Guía IA apagada'),
      },
    },
  },
  configure: {
    kicker: '03 — Configurar',
    title: 'Tú defines la estructura. Metis llena los ítems.',
    lead: 'Ajusta los controles. La vista previa se arma con temas detectados en el material de ejemplo, y la configuración de la guía se comparte con el chat de arriba.',
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
    kicker: '04 — Resultados',
    title: 'Lo que pasó, ítem por ítem, en cuanto se envía.',
    kpis: {
      submissions: 'Entregas',
      accuracy: 'Acierto medio',
      hints: 'Pistas de Metis',
      revealed: 'Respuestas reveladas',
    },
    percent: (n: number) => `${n} %`,
    histogramCaption: 'Distribución de puntajes (0–10)',
    histogramLabel: 'Histograma de puntajes: la mayoría obtuvo entre 6 y 9 puntos de 10',
    accuracyCaption: 'Acierto por ítem · de menor a mayor',
    review: 'Repasar',
    summaryLabel: 'Metis · resumen para el instructor',
    summary:
      'El ítem 05 concentró 6 de las 11 pistas. Conviene repasar el excedente del consumidor antes de la próxima unidad.',
    hintLog: 'Ver el registro de pistas →',
    avatarLabel: 'Metis revisando los resultados, con lentes de lectura',
  },
  spec: {
    kicker: '05 — Ficha técnica',
    title: 'Qué hace Metis, sin adjetivos.',
    rows: [
      { id: 'input', k: 'Entrada', v: 'PDF, documentos, presentaciones y notas. Se arrastran y se sueltan.' },
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
        v: 'Un enlace por evaluación. Se responde desde cualquier dispositivo.',
      },
      {
        id: 'guide',
        k: 'Guía IA',
        v: 'Metis, un agente en el enlace del estudiante que da pistas según tus reglas. Nunca revela la respuesta.',
      },
      { id: 'results', k: 'Resultados', v: 'Por ítem, por estudiante y por tema, en cuanto se envía.' },
      { id: 'sources', k: 'Fuentes', v: 'Cada ítem remite al pasaje del material de origen.' },
      { id: 'integration', k: 'Integración', v: 'Compatible con Canvas LMS. Exporta a PDF y Word.' },
    ],
  },
  cta: {
    kicker: '06 — Empezar',
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
