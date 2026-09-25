import { useState } from 'react';

export default function useDialog(): [
  isOpen: boolean,
  show: () => void,
  close: () => void,
] {
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
  }

  function show() {
    setIsOpen(true);
  }
  return [isOpen, show, close];
}
