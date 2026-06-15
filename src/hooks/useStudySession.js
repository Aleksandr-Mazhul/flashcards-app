import {useCallback, useMemo, useReducer} from 'react';

import {shuffleItems} from '../utils/shuffle.js';

const initialStudyState = {
  mode: 'all',
  showList: false,
  currentIndex: 0,
  isFlipped: false,
  cardOrder: [],
};

function studyReducer(state, action) {
  switch (action.type) {
    case 'reset':
      return {
        ...state,
        currentIndex: 0,
        isFlipped: false,
        cardOrder: [],
      };

    case 'setMode':
      return {
        ...state,
        mode: action.mode,
        currentIndex: 0,
        isFlipped: false,
        cardOrder: [],
      };

    case 'toggleList':
      return {
        ...state,
        showList: !state.showList,
      };

    case 'flip':
      return {
        ...state,
        isFlipped: !state.isFlipped,
      };

    case 'unflip':
      return {
        ...state,
        isFlipped: false,
      };

    case 'move':
      return {
        ...state,
        currentIndex: (state.currentIndex + action.direction + action.total) % action.total,
        isFlipped: false,
      };

    case 'selectCard':
      return {
        ...state,
        currentIndex: action.currentIndex,
        isFlipped: false,
      };

    case 'shuffle':
      return {
        ...state,
        cardOrder: action.cardIds,
        currentIndex: 0,
        isFlipped: false,
      };

    default:
      return state;
  }
}

function sortByStoredOrder(cards, cardOrder) {
  if (cardOrder.length === 0) {
    return cards;
  }

  const cardsById = new Map(cards.map((card) => [card.id, card]));
  const orderedIds = new Set(cardOrder);
  const orderedCards = cardOrder
    .map((id) => cardsById.get(id))
    .filter(Boolean);
  const newCards = cards.filter((card) => !orderedIds.has(card.id));

  return [...orderedCards, ...newCards];
}

export function useStudySession(cards) {
  const [state, dispatch] = useReducer(studyReducer, initialStudyState);

  const visibleCards = useMemo(() => {
    const filteredCards = state.mode === 'all'
      ? cards
      : cards.filter((card) => !card.learned);

    return sortByStoredOrder(filteredCards, state.cardOrder);
  }, [cards, state.cardOrder, state.mode]);

  const total = visibleCards.length;
  const currentIndex = total === 0
    ? 0
    : Math.min(state.currentIndex, total - 1);
  const currentCard = visibleCards[currentIndex] ?? null;
  const position = currentCard ? currentIndex + 1 : 0;

  const resetStudy = useCallback(() => {
    dispatch({type: 'reset'});
  }, []);

  const setMode = useCallback((mode) => {
    dispatch({type: 'setMode', mode});
  }, []);

  const toggleList = useCallback(() => {
    dispatch({type: 'toggleList'});
  }, []);

  const flipCard = useCallback(() => {
    if (total > 0) {
      dispatch({type: 'flip'});
    }
  }, [total]);

  const unflipCard = useCallback(() => {
    dispatch({type: 'unflip'});
  }, []);

  const nextCard = useCallback(() => {
    if (total > 0) {
      dispatch({type: 'move', direction: 1, total});
    }
  }, [total]);

  const prevCard = useCallback(() => {
    if (total > 0) {
      dispatch({type: 'move', direction: -1, total});
    }
  }, [total]);

  const selectCard = useCallback((cardId) => {
    const selectedIndex = visibleCards.findIndex((card) => card.id === cardId);

    if (selectedIndex !== -1) {
      dispatch({
        type: 'selectCard',
        currentIndex: selectedIndex,
      });
    }
  }, [visibleCards]);

  const shuffleCards = useCallback(() => {
    const shuffledIds = shuffleItems(visibleCards.map((card) => card.id));

    dispatch({
      type: 'shuffle',
      cardIds: shuffledIds,
    });
  }, [visibleCards]);

  return {
    mode: state.mode,
    showList: state.showList,
    isFlipped: state.isFlipped,
    visibleCards,
    currentCard,
    currentIndex,
    position,
    total,
    setMode,
    toggleList,
    flipCard,
    unflipCard,
    nextCard,
    prevCard,
    selectCard,
    shuffleCards,
    resetStudy,
  };
}
