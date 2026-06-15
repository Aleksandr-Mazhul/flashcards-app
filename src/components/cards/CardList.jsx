import {memo} from 'react';

import CardRow from './CardRow.jsx';

function CardList({
                    cards,
                    activeCardId,
                    visible,
                    onEdit,
                    onDelete,
                    onSelect,
                  }) {
  if (!visible) {
    return null;
  }

  return (
    <section id="list">
      <div className="list-heading">
        <span>Cards</span>
        <span>{cards.length}</span>
      </div>

      {cards.length === 0 ? (
        <p className="empty-list">No saved cards yet.</p>
      ) : (
        cards.map((card) => (
          <CardRow
            key={card.id}
            card={card}
            active={card.id === activeCardId}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))
      )}
    </section>
  );
}

export default memo(CardList);
