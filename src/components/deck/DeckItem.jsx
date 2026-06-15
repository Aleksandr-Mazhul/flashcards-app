import {memo} from 'react';

function DeckItem({
                    deck,
                    active,
                    onSelect,
                    onDelete,
                  }) {
  const className = active ? 'deck-item active' : 'deck-item';
  const cardCount = deck.getCards().length;

  return (
    <div className={className}>
      <button
        type="button"
        className="deck-select"
        onClick={() => onSelect(deck.id)}
        title={deck.name}
      >
        <span className="deck-name">{deck.name}</span>
        <span className="deck-count">{cardCount}</span>
      </button>

      <button
        type="button"
        className="delete-deck"
        onClick={() => onDelete(deck.id)}
        aria-label={`Delete ${deck.name}`}
      >
        ×
      </button>
    </div>
  );
}

export default memo(DeckItem);
