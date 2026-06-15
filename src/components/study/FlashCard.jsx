import {memo, useCallback} from 'react';

import learnedIcon from '../../assets/icons/learned.svg';

function FlashCard({
                     card,
                     isFlipped,
                     onFlip,
                     onToggleLearned,
                   }) {
  const handleToggleLearned = useCallback((event) => {
    event.stopPropagation();
    onToggleLearned();
  }, [onToggleLearned]);

  if (!card) {
    return (
      <div id="card">
        <article className="note empty">
          <p className="card-content">No cards</p>
        </article>
      </div>
    );
  }

  const className = [
    'note',
    isFlipped ? 'flipped' : '',
    card.learned ? 'learned' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      id="card"
      onClick={onFlip}
    >
      <article className={className}>
        <button
          type="button"
          className={card.learned ? 'badge visible' : 'badge'}
          onClick={handleToggleLearned}
          aria-label={card.learned ? 'Mark as unlearned' : 'Mark as learned'}
        >
          <img
            src={learnedIcon}
            className="icon"
            alt=""
          />
        </button>

        <span className="card-label">
          {isFlipped ? 'Back' : 'Front'}
        </span>

        <p className="card-content">
          {isFlipped ? card.back : card.front}
        </p>
      </article>
    </div>
  );
}

export default memo(FlashCard);
