import React, { useEffect, useState } from 'react';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';
import { StreamChat, type Channel as StreamChannel } from 'stream-chat';
import { useSelector } from 'react-redux';
import { selectCurrentTeam, selectCurrentUser } from '../store/authSlice';
import useBreakPoints from '../hooks/useBreakPoints';
import useTheme from '../hooks/useTheme';
import '../components/chat/chat.css';
import Button from '../components/Button';
import { MessageInput as CustomMessageInput } from '../components/chat/MessageInput';
import { MessageOptions } from '../components/chat/MessageOptions';
import Icon from '../components/Icon';

const client = new StreamChat('svcbduxgv7sw');

export default function ChatPage() {
  // Non-null: a page under SecuredRoutes, which renders only once the current
  // user and team load.
  const { chat_token, id } = useSelector(selectCurrentUser)!;
  const { id: teamId } = useSelector(selectCurrentTeam)!;
  const [channel, setChannel] = useState<StreamChannel>();
  const { isMd } = useBreakPoints();

  const heightOfVerticalNavs = isMd ? 80 : 60;
  const { isDark } = useTheme();

  useEffect(() => {
    document.title = 'Chat';
  });

  useEffect(() => {
    if (chat_token && !channel && id && teamId) {
      client.connectUser({ id: `${id}` }, chat_token);
      const channel = client.channel('messaging', `${teamId}`);
      setChannel(channel);
    }
  }, [chat_token, channel, id, teamId]);

  if (!channel) return null;

  return (
    <div>
      <Chat
        client={client}
        theme={isDark ? 'str-chat__theme-dark' : 'str-chat__theme-light'}
      >
        <Channel channel={channel} MessageOptions={MessageOptions}>
          <div
            style={{ maxHeight: `calc(100vh - ${heightOfVerticalNavs}px)` }}
            className="w-full"
          >
            <Window>
              <div className="border-b border-gray-300 dark:border-dark-gray-700">
                <div className="px-10 py-4 mx-auto flex-between">
                  <h1 className="text-lg font-bold">Chat</h1>
                  <div>
                    <Button
                      variant="icon"
                      color="blue"
                      size="md"
                      className="mr-2"
                    >
                      <Icon name="notifications" filled className="w-5 h-5" />
                    </Button>
                    <Button variant="icon" color="blue" size="md">
                      <Icon name="more_horiz" filled className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <MessageList disableDateSeparator={true} />
              <MessageInput Input={CustomMessageInput} grow={true} />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );
}
