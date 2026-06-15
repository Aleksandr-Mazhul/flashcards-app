import {memo} from 'react';

function ModeSelect({value, onChange}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Study mode"
    >
      <option value="all">
        All
      </option>

      <option value="unlearned">
        Unlearned
      </option>
    </select>
  );
}

export default memo(ModeSelect);
