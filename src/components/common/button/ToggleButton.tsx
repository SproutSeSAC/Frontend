import { useState } from 'react';

function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => setIsOn(prev => !prev);

  return (
    <button
      aria-label="토글 버튼"
      className={`flex h-[26px] w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${
        isOn ? 'bg-oliveGreen1' : 'bg-gray-300'
      }`}
      onClick={toggleSwitch}
    >
      <div
        className={`size-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          isOn ? 'translate-x-[1px]' : 'translate-x-[19px]'
        }`}
      />
    </button>
  );
}

export default ToggleButton;
