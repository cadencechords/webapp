import React, { useEffect, useMemo, useState } from 'react';
import { UploadButton } from 'react-file-utils';
import clsx from 'clsx';
import { usePopper } from 'react-popper';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import type { Event as StreamEvent } from 'stream-chat';
// stream-chat-react's generics, which its contexts' channel and messages use.
// Its index doesn't export them.
import type { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';

import {
  EmojiPicker,
  SendButton as DefaultSendButton,
  QuotedMessagePreview as DefaultQuotedMessagePreview,
  QuotedMessagePreviewHeader,
  AttachmentPreviewList,
  ChatAutoComplete,
  useChatContext,
  useChannelActionContext,
  useChannelStateContext,
  useTranslationContext,
  useMessageInputContext,
  useComponentContext,
  CooldownTimer as DefaultCooldownTimer,
} from 'stream-chat-react';
import Button from '../Button';
import Icon from '../Icon';

export const MessageInput = () => {
  const { quotedMessage } = useChannelStateContext('MessageInputFlat');
  const { setQuotedMessage } = useChannelActionContext('MessageInputFlat');
  const { channel } = useChatContext('MessageInputFlat');

  useEffect(() => {
    const handleQuotedMessageUpdate = (
      e: StreamEvent<DefaultStreamChatGenerics>
    ) => {
      if (e.message?.id !== quotedMessage?.id) return;
      if (e.type === 'message.deleted') {
        setQuotedMessage(undefined);
        return;
      }
      setQuotedMessage(e.message);
    };
    channel?.on('message.deleted', handleQuotedMessageUpdate);
    channel?.on('message.updated', handleQuotedMessageUpdate);

    return () => {
      channel?.off('message.deleted', handleQuotedMessageUpdate);
      channel?.off('message.updated', handleQuotedMessageUpdate);
    };
  }, [channel, quotedMessage, setQuotedMessage]);

  return <MessageInputV2 />;
};

const MessageInputV2 = () => {
  const {
    acceptedFiles = [],
    multipleUploads,
    quotedMessage,
  } = useChannelStateContext('MessageInputV2');

  const { t } = useTranslationContext('MessageInputV2');

  const {
    closeEmojiPicker,
    cooldownRemaining,
    emojiPickerIsOpen,
    handleSubmit,
    isUploadEnabled,
    maxFilesLeft,
    message,
    numberOfUploads,
    openEmojiPicker,
    setCooldownRemaining,
    text,
    uploadNewFiles,
  } = useMessageInputContext('MessageInputV2');

  const {
    CooldownTimer = DefaultCooldownTimer,
    QuotedMessagePreview = DefaultQuotedMessagePreview,
    SendButton = DefaultSendButton,
  } = useComponentContext('MessageInputV2');

  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    placement: 'top-end',
  });

  const id = useMemo(() => nanoid(), []);

  const accept = useMemo(
    () =>
      acceptedFiles.reduce<Record<string, string[]>>(
        (mediaTypeMap, mediaType) => {
          mediaTypeMap[mediaType] ??= [];
          return mediaTypeMap;
        },
        {}
      ),
    [acceptedFiles]
  );

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    accept,
    disabled: !isUploadEnabled || maxFilesLeft === 0,
    multiple: multipleUploads,
    noClick: true,
    onDrop: uploadNewFiles,
  });

  // TODO: "!message" condition is a temporary fix for shared
  // state when editing a message (fix shared state issue)
  const displayQuotedMessage =
    !message && quotedMessage && !quotedMessage.parent_id;

  return (
    <>
      <div {...getRootProps({ className: 'str-chat__message-input' })}>
        {isDragActive && (
          <div
            className={clsx('str-chat__dropzone-container', {
              'str-chat__dropzone-container--not-accepted': isDragReject,
            })}
          >
            {!isDragReject && <p>{t('Drag your files here')}</p>}
            {isDragReject && (
              <p>{t('Some of the files will not be accepted')}</p>
            )}
          </div>
        )}

        {displayQuotedMessage && <QuotedMessagePreviewHeader />}

        <div className="str-chat__message-input-inner">
          <div
            className="str-chat__file-input-container"
            data-testid="file-upload-button"
          >
            <UploadButton
              accept={acceptedFiles?.join(',')}
              aria-label="File upload"
              className="str-chat__file-input"
              data-testid="file-input"
              disabled={!isUploadEnabled || maxFilesLeft === 0}
              id={id}
              multiple={multipleUploads}
              onFileChange={uploadNewFiles}
            />
            <label
              className="p-2 bg-transparent rounded-full str-chat__file-input-label hover:bg-gray-100 dark:hover:bg-dark-gray-600"
              htmlFor={id}
            >
              <Icon
                name="add_circle"
                filled
                className="w-6 h-6 text-blue-600 dark:text-dark-blue"
              />
            </label>
          </div>
          <Button variant="icon" size="md" color="blue" className="mr-2">
            <Icon name="bar_chart" filled className="w-6 h-6" />
          </Button>

          <div className="str-chat__message-textarea-container">
            {displayQuotedMessage && (
              <QuotedMessagePreview quotedMessage={quotedMessage} />
            )}

            {isUploadEnabled && !!numberOfUploads && <AttachmentPreviewList />}

            <div className="str-chat__message-textarea-with-emoji-picker">
              <ChatAutoComplete />

              <div className="str-chat__message-textarea-emoji-picker">
                {emojiPickerIsOpen && (
                  <div
                    className="str-chat__message-textarea-emoji-picker-container"
                    style={styles.popper}
                    {...attributes.popper}
                    ref={setPopperElement}
                  >
                    <EmojiPicker />
                  </div>
                )}

                <Button
                  variant="icon"
                  aria-label="Emoji picker"
                  ref={setReferenceElement}
                  onClick={
                    emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker
                  }
                >
                  <Icon name="mood" filled className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
          {/* hide SendButton if this component is rendered in the edit message form */}
          {!message && (
            <>
              {cooldownRemaining ? (
                <CooldownTimer
                  cooldownInterval={cooldownRemaining}
                  setCooldownRemaining={setCooldownRemaining}
                />
              ) : (
                <SendButton
                  disabled={!numberOfUploads && !text.length}
                  sendMessage={handleSubmit}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
