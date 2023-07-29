import React from 'react';

import {
  MESSAGE_ACTIONS,
  showMessageActionsBox,
  ActionsIcon as DefaultActionsIcon,
  ReactionIcon as DefaultReactionIcon,
  useMessageContext,
} from 'stream-chat-react';
import { MessageActions } from './MessageActions';
import { isPoll } from '../../utils/chat';

const UnMemoizedMessageOptions = props => {
  const {
    ActionsIcon = DefaultActionsIcon,
    messageWrapperRef,
    ReactionIcon = DefaultReactionIcon,
    theme = 'simple',
  } = props;

  const {
    customMessageActions,
    getMessageActions,
    initialMessage,
    message,
    onReactionListClick,
  } = useMessageContext('MessageOptions');

  const messageActions = getMessageActions();
  const showActionsBox =
    showMessageActionsBox(messageActions, false) || !!customMessageActions;

  const shouldShowReactions =
    messageActions.indexOf(MESSAGE_ACTIONS.react) > -1 && !isPoll(message);

  if (
    !message.type ||
    message.type === 'error' ||
    message.type === 'system' ||
    message.type === 'ephemeral' ||
    message.status === 'failed' ||
    message.status === 'sending' ||
    initialMessage
  ) {
    return null;
  }

  const rootClassName = `str-chat__message-${theme}__actions str-chat__message-options`;

  return (
    <div className={rootClassName} data-testid="message-options">
      {showActionsBox && (
        <MessageActions
          ActionsIcon={ActionsIcon}
          messageWrapperRef={messageWrapperRef}
        />
      )}
      {shouldShowReactions && (
        <button
          aria-label="Open Reaction Selector"
          className={`str-chat__message-${theme}__actions__action str-chat__message-${theme}__actions__action--reactions str-chat__message-reactions-button`}
          data-testid="message-reaction-action"
          onClick={onReactionListClick}
        >
          <ReactionIcon className="str-chat__message-action-icon" />
        </button>
      )}
    </div>
  );
};

export const MessageOptions = React.memo(UnMemoizedMessageOptions);
