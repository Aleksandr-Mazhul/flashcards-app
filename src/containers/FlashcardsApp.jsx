import {useCallback} from 'react';

import DeckList from '../components/deck/DeckList.jsx';
import CardList from '../components/cards/CardList.jsx';
import CardForm from '../components/form/CardForm.jsx';
import StudyPanel from '../components/study/StudyPanel.jsx';
import {useCardEditor} from '../hooks/useCardEditor.js';
import {useDecks} from '../hooks/useDecks.js';
import {useStudySession} from '../hooks/useStudySession.js';

function FlashcardsApp() {
  const {
    decks,
    activeDeck,
    activeDeckId,
    cards,
    createDeck: createDeckRecord,
    deleteDeck: deleteDeckRecord,
    selectDeck: selectDeckRecord,
    addCard,
    updateCard,
    deleteCard: deleteCardRecord,
    toggleLearned,
  } = useDecks();

  const {
    back,
    editingCardId,
    front,
    isEditing,
    resetEditor,
    setBack,
    setFront,
    startEditing,
  } = useCardEditor();

  const {
    currentCard,
    flipCard,
    isFlipped,
    mode,
    nextCard,
    position,
    prevCard,
    resetStudy,
    selectCard,
    setMode,
    showList,
    shuffleCards,
    toggleList,
    total,
    unflipCard,
    visibleCards,
  } = useStudySession(cards);

  const resetWorkspace = useCallback(() => {
    resetEditor();
    resetStudy();
  }, [resetEditor, resetStudy]);

  const handleCreateDeck = useCallback(() => {
    const name = window.prompt('Deck name');

    if (name === null) {
      return;
    }

    createDeckRecord(name);
    resetWorkspace();
  }, [createDeckRecord, resetWorkspace]);

  const handleDeleteDeck = useCallback((deckId) => {
    deleteDeckRecord(deckId);
    resetWorkspace();
  }, [deleteDeckRecord, resetWorkspace]);

  const handleSelectDeck = useCallback((deckId) => {
    if (deckId === activeDeckId) {
      return;
    }

    selectDeckRecord(deckId);
    resetWorkspace();
  }, [activeDeckId, resetWorkspace, selectDeckRecord]);

  const handleSubmitCard = useCallback(() => {
    if (!activeDeck) {
      return;
    }

    const trimmedFront = front.trim();
    const trimmedBack = back.trim();

    if (!trimmedFront || !trimmedBack) {
      return;
    }

    if (isEditing) {
      updateCard(activeDeck.id, editingCardId, trimmedFront, trimmedBack);
    } else {
      addCard(activeDeck.id, trimmedFront, trimmedBack);
    }

    resetWorkspace();
  }, [
    activeDeck,
    addCard,
    back,
    editingCardId,
    front,
    isEditing,
    resetWorkspace,
    updateCard,
  ]);

  const handleDeleteCard = useCallback((cardId) => {
    if (!activeDeck) {
      return;
    }

    deleteCardRecord(activeDeck.id, cardId);
    resetWorkspace();
  }, [activeDeck, deleteCardRecord, resetWorkspace]);

  const handleToggleLearned = useCallback(() => {
    if (!activeDeck || !currentCard) {
      return;
    }

    toggleLearned(activeDeck.id, currentCard.id);
    unflipCard();
  }, [activeDeck, currentCard, toggleLearned, unflipCard]);

  return (
    <main id="app">
      <DeckList
        decks={decks}
        activeDeckId={activeDeckId}
        onCreate={handleCreateDeck}
        onDelete={handleDeleteDeck}
        onSelect={handleSelectDeck}
      />

      <section
        className="workspace"
        aria-label="Flashcards workspace"
      >
        <StudyPanel
          card={currentCard}
          isFlipped={isFlipped}
          mode={mode}
          position={position}
          showList={showList}
          total={total}
          onFlip={flipCard}
          onMark={handleToggleLearned}
          onModeChange={setMode}
          onNext={nextCard}
          onPrev={prevCard}
          onShuffle={shuffleCards}
          onToggleList={toggleList}
        />

        <CardForm
          backInput={back}
          frontInput={front}
          isEditing={isEditing}
          onBackChange={setBack}
          onCancel={resetEditor}
          onFrontChange={setFront}
          onSubmit={handleSubmitCard}
        />

        <CardList
          cards={visibleCards}
          activeCardId={currentCard?.id ?? null}
          visible={showList}
          onDelete={handleDeleteCard}
          onEdit={startEditing}
          onSelect={selectCard}
        />
      </section>
    </main>
  );
}

export default FlashcardsApp;
