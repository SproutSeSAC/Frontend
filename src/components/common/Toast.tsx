import { RiCloseFill } from 'react-icons/ri';

export interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="w-full max-w-80 rounded bg-text p-4 text-white opacity-90 shadow-lg">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button className="ml-4 text-sm underline" onClick={onClose}>
          <RiCloseFill />
        </button>
      </div>
    </div>
  );
}
