import React from 'react';
import Image from 'next/image';
import { useRef } from 'react';

interface TextWrapperProps {
  text: string;
}

const TextWrapper: React.FC<TextWrapperProps> = ({ text }) => {
  
  return (
    <div className="text-wrapper">
      <span className="text-outline">{text}</span>
      <span className="text-fill">{text}</span>
    </div>
  );
};

export default TextWrapper;
