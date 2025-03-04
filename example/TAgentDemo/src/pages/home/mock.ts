import {mock, WorkflowReplyResourceType} from "@ray-js/t-agent-plugin-assistant";
import {ChatCardType} from "@ray-js/t-agent";

/**
 * This is a mock file for the agent.
 */

// When the user sends a message with the block 'hello', the assistant will respond with 'hello, who are you?'
mock.hooks.hook('sendToAssistant', context => {
  if (context.options.block?.includes('hello')) {
    context.responseText = 'hello, who are you?';
  }
});

// When the user sends a message with the block 'markdown', the assistant will respond with a markdown text containing a chart.
mock.hooks.hook('sendToAssistant', context => {
  if (context.options.block?.includes('markdown')) {
    context.responseText = `
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***

## Custom block

### echarts

\`\`\`echarts
{
  "height": 260,
  "option": {
    "xAxis": {
      "type": "category",
      "data": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ]
    },
    "yAxis": {
      "type": "value"
    },
    "series": [
      {
        "data": [
          150,
          230,
          224,
          218,
          135,
          147,
          260
        ],
        "type": "line"
      }
    ]
  }
}
\`\`\`

## table

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

## code

\`\`\` js
var foo = function (bar) {
  return bar++;
};
\`\`\`

## Plugins


> Classic markup: :wink: :cry: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)
`;
  }
});

// When the user sends a message with the block 'card', the assistant will respond with two card.
mock.hooks.hook('sendToAssistant', context => {
  if (context.options.block?.includes('card')) {
    context.responseText = 'This is card example';
    context.responseExtensions = {
      aiCards: [
        {
          cardCode: 'myCard',
          cardType: ChatCardType.CUSTOM,
          cardData: { title: 'Card 1' },
        },
        {
          cardCode: 'myCard',
          cardType: ChatCardType.CUSTOM,
          cardData: { title: 'Card 2' },
        },
      ],
    };
  }
});

// When the user sends a message with the block 'workflow', the assistant will respond with a workflow.
mock.hooks.hook('sendToAssistant', context => {
  if (context.options.block?.includes('workflow')) {
    context.responseText = 'This is workflow example';
    context.responseExtensions = {
      workflowAskOptions: {
        options: [
          {
            name: 'Option 1',
            value: 'Option 1',
          },
          {
            name: 'Option 2',
            value: 'Option 2',
          },
          {
            name: 'Option 3',
            value: 'Option 3',
          },
        ],
      },
    };
  }

  if (context.options.block?.includes('Option 1')) {
    context.responseText = 'This is workflow response card';
    context.responseExtensions = {
      workflowEnd: {
        replyResources: [
          {
            type: WorkflowReplyResourceType.MiniProgram,
            title: 'Official Mini Program demo',
            url: 'thingsmart://miniApp?url=godzilla://tydhopggfziofo1h9h',
          },
        ],
      },
    };
  }
})

mock.hooks.hook('asrDetection', context => {
  context.responseText = 'Hello world!, I am a virtual assistant.';
});
