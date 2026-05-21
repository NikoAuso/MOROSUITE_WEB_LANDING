/**
 * Centralized copy for the "non disponibile" UX states surfaced when the
 * backend is unreachable or returns empty payloads. Edit these strings to
 * tweak the user-facing wording without hunting through components.
 */
export const FALLBACK_COPY = {
  service: {
    title: 'Servizio temporaneamente non disponibile',
    description: 'Stiamo aggiornando il sito. Riprova tra qualche minuto.',
  },
  hours: {
    badge: 'Orari',
    title: 'Orari non disponibili',
    description: 'Non riusciamo a recuperare gli orari di apertura. Riprova tra qualche minuto.',
  },
  pricing: {
    badge: 'Listino',
    title: 'Listino non disponibile',
    description: 'Non riusciamo a recuperare il listino prezzi. Riprova tra qualche minuto.',
  },
  legal: {
    badge: 'Documento',
    title: 'Documento temporaneamente non disponibile',
    description: 'Non riusciamo a recuperare il documento richiesto. Riprova tra qualche minuto.',
  },
  cta: {
    booking: 'Prenotazioni non disponibili',
    login: 'Accesso non disponibile',
    register: 'Registrazione non disponibile',
  },
} as const;
