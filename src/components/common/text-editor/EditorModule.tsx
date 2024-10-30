import { useEffect, useRef, useState } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EditorModuleProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

export default function EditorModule({ onEmojiSelect }: EditorModuleProps) {
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
    <div>
      <div className="ql-formats">
        <select className="ql-size" defaultValue="medium">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
      </div>
      <div className="ql-formats">
        <button type="button" aria-label="ql-bold" className="ql-bold" />
        <button type="button" aria-label="ql-italic" className="ql-italic" />
        <button
          type="button"
          aria-label="ql-underline"
          className="ql-underline"
        />
        <button type="button" aria-label="ql-strike" className="ql-strike" />
      </div>
      <div className="ql-formats">
        <button
          type="button"
          aria-label="ql-list"
          className="ql-list"
          value="ordered"
        />
        <button
          type="button"
          aria-label="ql-list"
          className="ql-list"
          value="bullet"
        />
        <button
          type="button"
          aria-label="ql-indent"
          className="ql-indent"
          value="-1"
        />
        <button
          type="button"
          aria-label="ql-indent"
          className="ql-indent"
          value="+1"
        />
      </div>
      <div className="ql-formats">
        <select aria-label="ql-color" className="ql-color" />
        <select aria-label="ql-background" className="ql-background" />
        <select aria-label="ql-align" className="ql-align" />
      </div>
      <div className="ql-formats">
        <button type="button" aria-label="ql-link" className="ql-link" />
        <button
          type="button"
          aria-label="ql-code-block"
          className="ql-code-block"
        />
      </div>
      <div className="ql-formats relative">
        <button type="button" onClick={() => setShowPicker(prev => !prev)}>
          😊
        </button>
        {showPicker && (
          <div ref={pickerRef} className="absolute right-0 top-7 z-10">
            <Picker data={data} onEmojiSelect={onEmojiSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
