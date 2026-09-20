import type { HostelAggregate } from '../../src/lib/hostelTypes';
import { CONTACT_INFO } from '../constants/footerData';

export interface AnswerEngine {
  answer(question: string, locale: 'es' | 'en'): Promise<string>;
}

interface FaqEntry {
  keywords: string[];
  answerEs: string;
  answerEn: string;
}

/** Facts already established elsewhere in this codebase (HostelFacilitiesPage,
 * HostelAggregate) -- nothing here is invented. Check-in/out only appear when
 * the backend actually has a value; no placeholder time is guessed. */
function buildFaqEntries(hostelInfo: HostelAggregate | null): FaqEntry[] {
  const entries: FaqEntry[] = [
    {
      keywords: ['wifi', 'internet', 'wi-fi', 'conexion', 'connection'],
      answerEs: 'WiFi gratuito en todo el albergue, sin coste adicional.',
      answerEn: 'Free WiFi throughout the hostel, no extra cost.',
    },
    {
      keywords: ['lavander', 'laundry', 'lavar', 'wash', 'ropa', 'secadora', 'dryer'],
      answerEs: 'Lavadora y secadora por €3 el ciclo, detergente incluido.',
      answerEn: 'Washer and dryer for €3 per cycle, detergent included.',
    },
    {
      keywords: ['bici', 'bike', 'bicycle', 'bicicleta', 'alquiler bici', 'rental bike'],
      answerEs: 'Alquiler de bicicletas a €10/día, incluye casco y candado.',
      answerEn: 'Bike rental at €10/day, includes helmet and lock.',
    },
    {
      keywords: ['ducha', 'shower', 'agua caliente', 'hot water', 'bano', 'bathroom'],
      answerEs: 'Duchas con agua caliente disponible las 24 horas.',
      answerEn: '24-hour hot water showers available.',
    },
    {
      keywords: ['cocina', 'kitchen', 'comida', 'cook', 'cocinar', 'nevera', 'fridge'],
      answerEs: 'Cocina compartida abierta de 7:00 a 22:00, con nevera y microondas.',
      answerEn: 'Shared kitchen open from 7am to 10pm, with fridge and microwave.',
    },
    {
      keywords: ['cama', 'bed', 'taquilla', 'locker', 'dormitorio', 'dorm'],
      answerEs: '24 camas en dormitorios mixtos, cada una con taquilla individual.',
      answerEn: '24 beds in mixed dormitories, each with an individual locker.',
    },
    {
      keywords: ['reserva', 'booking', 'book', 'reservar'],
      answerEs: 'Puedes reservar tu cama directamente desde la página de Reservar.',
      answerEn: 'You can book your bed directly from the Book Now page.',
    },
  ];

  if (hostelInfo?.checkInFrom) {
    entries.push({
      keywords: ['check-in', 'checkin', 'entrada', 'llegada', 'hora de entrada'],
      answerEs: `El check-in es a partir de las ${hostelInfo.checkInFrom}.`,
      answerEn: `Check-in starts at ${hostelInfo.checkInFrom}.`,
    });
  }
  if (hostelInfo?.checkOutBefore) {
    entries.push({
      keywords: ['check-out', 'checkout', 'salida', 'hora de salida'],
      answerEs: `El check-out es antes de las ${hostelInfo.checkOutBefore}.`,
      answerEn: `Check-out is before ${hostelInfo.checkOutBefore}.`,
    });
  }

  return entries;
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Client-side, zero-network FAQ matcher: normalizes the question and scores
 * each entry by keyword overlap. This is the "local model" the user asked
 * for today -- a real, working answer engine with no external API or key,
 * built behind the `AnswerEngine` interface specifically so a future
 * WASM-backed LLM (e.g. wllama, transformers.js) can implement the same
 * interface and be swapped in later without touching the chat UI.
 */
export class LocalKeywordEngine implements AnswerEngine {
  private readonly entries: FaqEntry[];

  constructor(hostelInfo: HostelAggregate | null = null) {
    this.entries = buildFaqEntries(hostelInfo);
  }

  async answer(question: string, locale: 'es' | 'en'): Promise<string> {
    const normalizedQuestion = normalize(question);
    let best: FaqEntry | null = null;
    let bestScore = 0;

    for (const entry of this.entries) {
      const score = entry.keywords.reduce(
        (count, keyword) => (normalizedQuestion.includes(normalize(keyword)) ? count + 1 : count),
        0
      );
      if (score > bestScore) {
        best = entry;
        bestScore = score;
      }
    }

    if (best) {
      return locale === 'es' ? best.answerEs : best.answerEn;
    }

    return locale === 'es'
      ? `No tengo respuesta para eso todavía. Llámanos o escríbenos por WhatsApp al ${CONTACT_INFO.phone}.`
      : `I don't have an answer for that yet. Call or WhatsApp us at ${CONTACT_INFO.phone}.`;
  }
}

export function listSuggestedQuestions(locale: 'es' | 'en'): string[] {
  return locale === 'es'
    ? [
        '¿Hay WiFi gratis?',
        '¿Cuánto cuesta la lavandería?',
        '¿Alquiláis bicicletas?',
        '¿A qué hora es el check-in?',
      ]
    : ['Is WiFi free?', 'How much is laundry?', 'Do you rent bikes?', 'What time is check-in?'];
}
