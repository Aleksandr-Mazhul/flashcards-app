import {useCallback, useState} from 'react';

const initialForm = {
  editingCardId: null,
  front: '',
  back: '',
};

export function useCardEditor() {
  const [form, setForm] = useState(initialForm);

  const setFront = useCallback((front) => {
    setForm((current) => ({
      ...current,
      front,
    }));
  }, []);

  const setBack = useCallback((back) => {
    setForm((current) => ({
      ...current,
      back,
    }));
  }, []);

  const startEditing = useCallback((card) => {
    setForm({
      editingCardId: card.id,
      front: card.front,
      back: card.back,
    });
  }, []);

  const resetEditor = useCallback(() => {
    setForm(initialForm);
  }, []);

  return {
    ...form,
    isEditing: form.editingCardId !== null,
    setFront,
    setBack,
    startEditing,
    resetEditor,
  };
}
