import { useCallback, useState } from 'react';

const useToggleModal = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const onOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const onToggleModal = useCallback(() => {
    setModalOpen(isModalOpen => !isModalOpen);
  }, []);

  return {
    isModalOpen,
    onCloseModal,
    onOpenModal,
    onToggleModal,
  };
};

export default useToggleModal;
