import {memo} from 'react';

import editIcon from '../../assets/icons/edit.svg';
import trashIcon from '../../assets/icons/trash.svg';

function CardRow({
                   card,
                   active,
                   onEdit,
                   onDelete,
                   onSelect,
                 }) {
  const className = active ? 'card-row active' : 'card-row';

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit(card);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(card.id);
  };

  return (
    <div
      className={className}
      onClick={() => onSelect(card.id)}
    >
      <div className="card-row-copy">
        <strong>{card.front}</strong>
        <span>{card.back}</span>
      </div>

      {card.learned && (
        <span className="learned-pill">Learned</span>
      )}

      <div className="actions">
        <button
          type="button"
          onClick={handleEdit}
          aria-label="Edit card"
          className="icon-btn"
        >
          <img
            src={editIcon}
            className="icon"
            alt=""
          />
        </button>

        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete card"
          className="icon-btn"
        >
          <img
            src={trashIcon}
            className="icon"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}

export default memo(CardRow);
