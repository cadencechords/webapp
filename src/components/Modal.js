import React from 'react';
import StyledDialog from './StyledDialog';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import useBreakPoints from '../hooks/useBreakPoints';

export default function Modal({ open, onClose, children }) {
  const { isSm } = useBreakPoints();
  return (
    <>
      {isSm && (
        <StyledDialog
          borderedTop={false}
          onCloseDialog={onClose}
          open={open}
          size="2xl"
        >
          {children}
        </StyledDialog>
      )}
      {!isSm && (
        <BottomSheet open={open} onDismiss={onClose}>
          {children}
        </BottomSheet>
      )}
    </>
  );
}
