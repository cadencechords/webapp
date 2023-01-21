import { useState } from 'react';

export default function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
  }

  function show() {
    setIsOpen(true);
  }
  return [isOpen, show, close];
}
