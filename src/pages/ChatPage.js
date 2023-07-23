import React, { useEffect, useState } from 'react';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { useSelector } from 'react-redux';
import { selectCurrentTeam, selectCurrentUser } from '../store/authSlice';
import useBreakPoints from '../hooks/useBreakPoints';
import useTheme from '../hooks/useTheme';

const client = new StreamChat('svcbduxgv7sw');

export default function ChatPage() {
  const { chat_token, id } = useSelector(selectCurrentUser);
  const { id: teamId } = useSelector(selectCurrentTeam);
  const [channel, setChannel] = useState();
  const { isMd } = useBreakPoints();

  const heightOfVerticalNavs = isMd ? 88 : 81;
  const { isDark } = useTheme();

  useEffect(() => (document.title = 'Chat'));

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
      <Chat client={client} theme={isDark && 'str-chat__theme-dark'}>
        <Channel channel={channel}>
          <div
            style={{ maxHeight: `calc(100vh - ${heightOfVerticalNavs}px)` }}
            className="w-full"
          >
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );
}
