import React from 'react';
import { View } from '@ray-js/components';
import { createChatAgent, withDebug, withUI } from '@ray-js/t-agent';
import {
  ChatContainer,
  defaultRenderOptions,
  MessageInput,
  MessageList,
} from '@ray-js/t-agent-ui-ray';
import {
  withAssistant,
  withBuildIn,
  withAssistantCopyHistory,
} from '@ray-js/t-agent-plugin-assistant';
import MyCard from '../../components/cards/MyCard';

import './mock'

const createAgent = () => {
  const agent = createChatAgent(
    withUI(),
    withAssistant({
      channel: '[your_agent_id]', // Please replace [your_agent_id] with your agent id
    }),
    withDebug(),
    withAssistantCopyHistory(),
    withBuildIn()
  );

  const { onChatStart, createMessage, onChatResume, onError, onInputBlocksPush, session } = agent;

  onChatStart(async (result) => {
    const hello = createMessage({
      role: 'assistant',
    });

    hello.bubble.setText('Hello! Try to send "hello", "markdown", "workflow" or "card" to see the response.');
    hello.bubble.addTile('recommendations', {
      recommendations: [
        {
          text: 'hello',
          clickPayload: {
            tttAction: {
              type: 'sendMessage',
              blocks: [{ type: 'text', text: 'hello' }],
            },
          },
        },
        {
          text: 'markdown',
          clickPayload: {
            tttAction: {
              type: 'sendMessage',
              blocks: [{ type: 'text', text: 'markdown' }],
            },
          },
        },
        {
          text: 'workflow',
          clickPayload: {
            tttAction: {
              type: 'sendMessage',
              blocks: [{ type: 'text', text: 'workflow' }],
            },
          },
        },
        {
          text: 'card',
          clickPayload: {
            tttAction: {
              type: 'sendMessage',
              blocks: [{ type: 'text', text: 'card' }],
            },
          },
        },
      ]
    })
    result.messages.push(hello);
    await hello.persist()
  });

  // 恢复聊天时，发送一条消息
  onChatResume(async result => {
    const lastMessage = session.getLatestMessage()
    if (lastMessage) {
      const lastMessageCreateTime = lastMessage?.meta?.raw?.TEXT_FINISH?.createTime
      if (lastMessageCreateTime < (Date.now() - 1000 * 60 * 60 * 2)) {
        const welcomeBack = createMessage({
          role: 'assistant',
        });

        welcomeBack.bubble.setText('Welcome back');
        result.messages.push(welcomeBack);
        await welcomeBack.persist();
      }
    }
  });
  return agent;
};

const renderOptions = {
  ...defaultRenderOptions,
  customCardMap: {
    myCard: MyCard,
  },
};

export default function Home() {
  return (
    <View style={{ height: '100vh' }}>
      <ChatContainer createAgent={createAgent} renderOptions={renderOptions}>
        <MessageList />
        <MessageInput />
      </ChatContainer>
    </View>
  );
}
