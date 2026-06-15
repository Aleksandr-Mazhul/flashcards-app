import {memo} from 'react';

import DeckItem from './DeckItem.jsx';
import deckAdd from '../../assets/icons/deck-add.svg';

function DeckList({
                    decks,
                    activeDeckId,
                    onSelect,
                    onDelete,
                    onCreate,
                  }) {
  return (
    <aside className="decks-panel">
      <div className="panel-heading">
        <span>Decks</span>

        <button
          type="button"
          className="icon-btn deck-create"
          onClick={onCreate}
          aria-label="Create deck"
        >
          <img src={deckAdd} className="icon" alt=""/>
        </button>
      </div>

      <div className="deck-list">
        {decks.map((deck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            active={deck.id === activeDeckId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </aside>
  );
}

export default memo(DeckList);
