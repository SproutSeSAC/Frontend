import Modal from '@/components/common/modal/Modal';

interface AlertProps {
  toggleModal: () => void;
}

export default function Alert({ toggleModal }: AlertProps) {
  return (
    <Modal title="인증 확인" onToggleClick={toggleModal}>
      <div>인증ㅇ...</div>
    </Modal>
  );
}
