import React, { useCallback, useEffect, useState } from 'react';

import {
  MessageActionsBox,
  ActionsIcon as DefaultActionsIcon,
  useMessageContext,
} from 'stream-chat-react';
import { isPoll } from '../../utils/chat';

export const MessageActions = props => {
  const {
    ActionsIcon = DefaultActionsIcon,
    customWrapperClass = '',
    handleDelete: propHandleDelete,
    handlePin: propHandlePin,
    inline,
    message: propMessage,
    messageWrapperRef,
    mine,
  } = props;

  const {
    handleDelete: contextHandleDelete,
    handlePin: contextHandlePin,
    isMyMessage,
    message: contextMessage,
    setEditingState,
  } = useMessageContext('MessageActions');

  const handleDelete = propHandleDelete || contextHandleDelete;
  const handlePin = propHandlePin || contextHandlePin;
  const message = propMessage || contextMessage;

  const [actionsBoxOpen, setActionsBoxOpen] = useState(false);

  const hideOptions = useCallback(event => {
    if (event instanceof KeyboardEvent && event.key !== 'Escape') {
      return;
    }
    setActionsBoxOpen(false);
  }, []);
  const messageDeletedAt = !!message?.deleted_at;

  useEffect(() => {
    if (messageWrapperRef?.current) {
      messageWrapperRef.current.addEventListener('mouseleave', hideOptions);
    }
  }, [hideOptions, messageWrapperRef]);

  useEffect(() => {
    if (messageDeletedAt) {
      document.removeEventListener('click', hideOptions);
    }
  }, [hideOptions, messageDeletedAt]);

  useEffect(() => {
    if (!actionsBoxOpen) return;

    document.addEventListener('click', hideOptions);
    document.addEventListener('keyup', hideOptions);

    return () => {
      document.removeEventListener('click', hideOptions);
      document.removeEventListener('keyup', hideOptions);
    };
  }, [actionsBoxOpen, hideOptions]);

  function getMessageActions() {
    let actions = ['quote', 'pin'];

    if (isMyMessage()) actions.push('delete');
    if (isMyMessage() && !isPoll(message)) actions.push('edit');

    return actions;
  }

  return (
    <MessageActionsWrapper
      customWrapperClass={customWrapperClass}
      inline={inline}
      setActionsBoxOpen={setActionsBoxOpen}
    >
      <MessageActionsBox
        getMessageActions={getMessageActions}
        handleDelete={handleDelete}
        handleEdit={setEditingState}
        handlePin={handlePin}
        isUserMuted={() => {}}
        mine={mine ? mine() : isMyMessage()}
        open={actionsBoxOpen}
      />
      <button
        aria-expanded={actionsBoxOpen}
        aria-haspopup="true"
        aria-label="Open Message Actions Menu"
        className="str-chat__message-actions-box-button"
      >
        <ActionsIcon className="str-chat__message-action-icon" />
      </button>
    </MessageActionsWrapper>
  );
};

const MessageActionsWrapper = props => {
  const { children, customWrapperClass, inline, setActionsBoxOpen } = props;

  const defaultWrapperClass = `
  str-chat__message-simple__actions__action
  str-chat__message-simple__actions__action--options
  str-chat__message-actions-container`;

  const wrapperClass = customWrapperClass || defaultWrapperClass;

  const onClickOptionsAction = event => {
    event.stopPropagation();
    setActionsBoxOpen(prev => !prev);
  };

  const wrapperProps = {
    className: wrapperClass,
    'data-testid': 'message-actions',
    onClick: onClickOptionsAction,
  };

  if (inline) return <span {...wrapperProps}>{children}</span>;

  return <div {...wrapperProps}>{children}</div>;
};
