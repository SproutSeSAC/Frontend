import { useEffect, useRef, useState } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { BsEmojiSmile } from 'react-icons/bs';

interface EmojiModuleProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

export default function EmojiTool({ onEmojiSelect }: EmojiModuleProps) {
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative pb-1">
      <button
        type="button"
        className="size-6 p-1"
        onClick={() => setShowPicker(prev => !prev)}
      >
        <BsEmojiSmile className="h-full w-full" />
      </button>

      {showPicker && (
        <div ref={pickerRef} className="absolute -left-20 top-10 z-10">
          <Picker data={data} onEmojiSelect={onEmojiSelect} />
        </div>
      )}
    </div>
  );
}
