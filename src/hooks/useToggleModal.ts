import { useState } from 'react';

export const useToggleModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(prev => !prev);

  return {
    modalOpen,
    toggleModal,
  };
};
