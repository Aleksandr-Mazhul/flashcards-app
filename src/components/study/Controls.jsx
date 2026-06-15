import {memo} from 'react';

import arrowLeft from '../../assets/icons/arrow-left.svg';
import arrowRight from '../../assets/icons/arrow-right.svg';
import flipIcon from '../../assets/icons/flip.svg';
import learnedIcon from '../../assets/icons/learned.svg';
import shuffleIcon from '../../assets/icons/shuffle.svg';

function Controls({
                    onPrev,
                    onNext,
                    onFlip,
                    onShuffle,
                    onMark,
                    hasCards,
                    isLearned,
                  }) {
  const controls = [
    {
      label: 'Previous',
      icon: arrowLeft,
      onClick: onPrev,
    },
    {
      label: 'Flip',
      icon: flipIcon,
      onClick: onFlip,
    },
    {
      label: 'Next',
      icon: arrowRight,
      onClick: onNext,
    },
    {
      label: 'Shuffle',
      icon: shuffleIcon,
      onClick: onShuffle,
    },
    {
      label: isLearned ? 'Mark unlearned' : 'Mark learned',
      icon: learnedIcon,
      onClick: onMark,
    },
  ];

  return (
    <div className="controls">
      {controls.map((control) => (
        <button
          key={control.label}
          type="button"
          onClick={control.onClick}
          className="control-btn"
          data-tooltip={control.label}
          aria-label={control.label}
          disabled={!hasCards}
        >
          <img src={control.icon} className="icon" alt=""/>
        </button>
      ))}
    </div>
  );
}

export default memo(Controls);
