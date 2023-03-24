import React from 'react';
import StyledDialog from './StyledDialog';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import useBreakPoints from '../hooks/useBreakPoints';
import Button from './Button';
import XIcon from '@heroicons/react/outline/XIcon';

export default function Modal({ open, onClose, children, headerRight }) {
  const { isSm } = useBreakPoints();
  return (
    <>
      {isSm && (
        <StyledDialog
          borderedTop={false}
          onCloseDialog={onClose}
          open={open}
          size="xl"
        >
          {children}
        </StyledDialog>
      )}
      {!isSm && (
        <BottomSheet open={open} onDismiss={onClose}>
          <div className="p-3 pt-0">
            <div className="px-3 mb-4 flex-between">
              <Button variant="icon" size="md" onClick={onClose} tabIndex={1}>
                <XIcon className="w-5 h-5 text-gray-700 dark:text-dark-gray-200" />
              </Button>
              {headerRight ? headerRight : <div />}
            </div>
            {children}
          </div>
        </BottomSheet>
      )}
    </>
  );
}
