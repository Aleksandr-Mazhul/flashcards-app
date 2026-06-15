import {memo} from 'react';

function CardForm({
                    frontInput,
                    backInput,
                    onFrontChange,
                    onBackChange,
                    onSubmit,
                    onCancel,
                    isEditing,
                  }) {
  const isSubmitDisabled = !frontInput.trim() || !backInput.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <input
          placeholder="Front"
          value={frontInput}
          onChange={(event) => onFrontChange(event.target.value)}
        />

        <input
          placeholder="Back"
          value={backInput}
          onChange={(event) => onBackChange(event.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitDisabled}>
          {isEditing ? 'Update' : 'Add'}
        </button>

        {isEditing && (
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default memo(CardForm);
