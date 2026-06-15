import {Deck} from '../models/Deck.js';

export class StorageService {
  static STORAGE_KEY = 'flashcards-deck';

  static load() {
    let raw;

    try {
      raw = localStorage.getItem(StorageService.STORAGE_KEY);
    } catch {
      raw = null;
    }

    if (!raw) {
      return {
        decks: [new Deck()],
        activeDeckId: null,
      };
    }

    try {
      const data = JSON.parse(raw);

      const rawDecks = Array.isArray(data.decks) ? data.decks : [];
      const decks = rawDecks
        .map((deck) => Deck.fromJSON(deck))
        .filter(Boolean);

      return {
        decks,
        activeDeckId: data.activeDeckId ?? null,
      };
    } catch {
      return {
        decks: [new Deck()],
        activeDeckId: null,
      };
    }
  }

  static save(decks, activeDeckId) {
    const data = {
      decks: decks.map((deck) => deck.toJSON()),
      activeDeckId,
    };

    try {
      localStorage.setItem(
        StorageService.STORAGE_KEY,
        JSON.stringify(data),
      );
    } catch {
      // If storage is unavailable, the app can still work for the current session.
    }
  }
}
