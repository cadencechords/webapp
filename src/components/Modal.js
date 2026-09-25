import React from 'react';
import StyledDialog from './StyledDialog';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import useBreakPoints from '../hooks/useBreakPoints';
import Button from './Button';
import Icon from './Icon';

export default function Modal({
  open,
  onClose,
  children,
  headerRight,
  dialogSize = /** @type {import('./StyledDialog').DialogSize} */ ('xl'),
  title,
}) {
  const { isSm } = useBreakPoints();
  return (
    <>
      {isSm && (
        <StyledDialog
          borderedTop={false}
          onCloseDialog={onClose}
          open={open}
          size={dialogSize}
          title={title}
        >
          {children}
        </StyledDialog>
      )}
      {!isSm && (
        <BottomSheet open={open} onDismiss={onClose} className="relative z-50">
          <div className="p-3 pt-0">
            <div className="px-3 mb-4 flex-between">
              <Button variant="icon" size="md" onClick={onClose} tabIndex={1}>
                <Icon
                  name="close"
                  className="w-5 h-5 text-gray-700 dark:text-dark-gray-200"
                />
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
