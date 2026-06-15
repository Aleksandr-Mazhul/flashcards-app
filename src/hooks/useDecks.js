import {useCallback, useEffect, useMemo, useReducer} from 'react';

import {Card} from '../models/Card.js';
import {Deck} from '../models/Deck.js';
import {StorageService} from '../services/StorageService.js';
import {createId} from '../utils/createId.js';

function createDefaultDeck() {
  return new Deck([], createId('deck'), 'New Deck');
}

function ensureValidState(state) {
  const decks = state.decks.length > 0
    ? state.decks
    : [createDefaultDeck()];
  const activeDeckExists = decks.some((deck) => deck.id === state.activeDeckId);

  return {
    decks,
    activeDeckId: activeDeckExists ? state.activeDeckId : decks[0].id,
  };
}

function cloneCard(card, overrides = {}) {
  return new Card(
    overrides.id ?? card.id,
    overrides.front ?? card.front,
    overrides.back ?? card.back,
    overrides.learned ?? card.learned,
  );
}

function cloneDeckWithCards(deck, cards) {
  return new Deck(cards, deck.id, deck.name);
}

function updateDeck(decks, deckId, updater) {
  return decks.map((deck) => {
    if (deck.id !== deckId) {
      return deck;
    }

    const cards = deck.getCards();
    return cloneDeckWithCards(deck, updater(cards));
  });
}

function decksReducer(state, action) {
  switch (action.type) {
    case 'createDeck': {
      const deck = new Deck([], createId('deck'), action.name || 'New Deck');

      return {
        decks: [...state.decks, deck],
        activeDeckId: deck.id,
      };
    }

    case 'deleteDeck': {
      const decks = state.decks.filter((deck) => deck.id !== action.deckId);

      return ensureValidState({
        decks,
        activeDeckId: state.activeDeckId === action.deckId
          ? decks[0]?.id ?? null
          : state.activeDeckId,
      });
    }

    case 'selectDeck':
      if (!state.decks.some((deck) => deck.id === action.deckId)) {
        return state;
      }

      return {
        ...state,
        activeDeckId: action.deckId,
      };

    case 'addCard':
      return {
        ...state,
        decks: updateDeck(state.decks, action.deckId, (cards) => [
          ...cards,
          new Card(createId('card'), action.front, action.back),
        ]),
      };

    case 'updateCard':
      return {
        ...state,
        decks: updateDeck(state.decks, action.deckId, (cards) => cards.map((card) => {
          if (card.id !== action.cardId) {
            return card;
          }

          return cloneCard(card, {
            front: action.front,
            back: action.back,
          });
        })),
      };

    case 'deleteCard':
      return {
        ...state,
        decks: updateDeck(
          state.decks,
          action.deckId,
          (cards) => cards.filter((card) => card.id !== action.cardId),
        ),
      };

    case 'toggleLearned':
      return {
        ...state,
        decks: updateDeck(state.decks, action.deckId, (cards) => cards.map((card) => {
          if (card.id !== action.cardId) {
            return card;
          }

          return cloneCard(card, {
            learned: !card.learned,
          });
        })),
      };

    default:
      return state;
  }
}

function initDeckState() {
  return ensureValidState(StorageService.load());
}

export function useDecks() {
  const [state, dispatch] = useReducer(decksReducer, undefined, initDeckState);

  const activeDeck = useMemo(() => (
    state.decks.find((deck) => deck.id === state.activeDeckId) ?? state.decks[0]
  ), [state.activeDeckId, state.decks]);

  const cards = useMemo(() => activeDeck?.getCards() ?? [], [activeDeck]);

  useEffect(() => {
    StorageService.save(state.decks, state.activeDeckId);
  }, [state.activeDeckId, state.decks]);

  const createDeck = useCallback((name) => {
    const deckName = typeof name === 'string' ? name.trim() : '';

    dispatch({
      type: 'createDeck',
      name: deckName || 'New Deck',
    });
  }, []);

  const deleteDeck = useCallback((deckId) => {
    dispatch({type: 'deleteDeck', deckId});
  }, []);

  const selectDeck = useCallback((deckId) => {
    dispatch({type: 'selectDeck', deckId});
  }, []);

  const addCard = useCallback((deckId, front, back) => {
    dispatch({
      type: 'addCard',
      deckId,
      front,
      back,
    });
  }, []);

  const updateCard = useCallback((deckId, cardId, front, back) => {
    dispatch({
      type: 'updateCard',
      deckId,
      cardId,
      front,
      back,
    });
  }, []);

  const deleteCard = useCallback((deckId, cardId) => {
    dispatch({
      type: 'deleteCard',
      deckId,
      cardId,
    });
  }, []);

  const toggleLearned = useCallback((deckId, cardId) => {
    dispatch({
      type: 'toggleLearned',
      deckId,
      cardId,
    });
  }, []);

  return {
    decks: state.decks,
    activeDeck,
    activeDeckId: state.activeDeckId,
    cards,
    createDeck,
    deleteDeck,
    selectDeck,
    addCard,
    updateCard,
    deleteCard,
    toggleLearned,
  };
}
