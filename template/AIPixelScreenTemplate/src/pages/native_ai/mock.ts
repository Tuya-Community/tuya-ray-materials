export const mockLabelList = {
  imageCategory: [
    {
      categoryLabel: [
        'thing_ai_image_generation_emoji_love',
        'thing_ai_image_generation_emoji_kiss',
        'thing_ai_image_generation_emoji_cry',
        'thing_ai_image_generation_emoji_anger',
        'thing_ai_image_generation_emoji_tongue',
        'thing_ai_image_generation_emoji_laughing_and_crying',
        'thing_ai_image_generation_emoji_smile',
        'thing_ai_image_generation_emoji_starry_eyed',
        'thing_ai_image_generation_emoji_sad',
      ],
      categoryName: 'thing_ai_image_generation_emoji',
    },
    {
      categoryLabel: [
        'thing_ai_image_generation_game_handle',
        'thing_ai_image_generation_game_keyboard',
        'thing_ai_image_generation_game_mouse',
        'thing_ai_image_generation_game_handheld_gaming_device',
        'thing_ai_image_generation_game_earphones',
      ],
      categoryName: 'thing_ai_image_generation_game',
    },
    {
      categoryLabel: [
        'thing_ai_image_generation_festival_new_year',
        'thing_ai_image_generation_festival_halloween',
        'thing_ai_image_generation_festival_valentine',
        'thing_ai_image_generation_festival_christmas',
        'thing_ai_image_generation_festival_birthday',
      ],
      categoryName: 'thing_ai_image_generation_festival',
    },
    {
      categoryLabel: [
        'thing_ai_image_generation_plant_rose',
        'thing_ai_image_generation_plant_lavender',
        'thing_ai_image_generation_plant_oak',
        'thing_ai_image_generation_plant_olive_tree',
        'thing_ai_image_generation_plant_maple_tree',
        'thing_ai_image_generation_plant_coconut_tree',
        'thing_ai_image_generation_plant_tulip',
        'thing_ai_image_generation_plant_lily',
        'thing_ai_image_generation_plant_cherry_blossoms',
        'thing_ai_image_generation_plant_thistle_flower',
        'thing_ai_image_generation_plant_cactus',
        'thing_ai_image_generation_plant_succulent',
        'thing_ai_image_generation_plant_sunflower',
        'thing_ai_image_generation_plant_dandelion',
      ],
      categoryName: 'thing_ai_image_generation_plant',
    },
    {
      categoryLabel: [
        'thing_ai_image_generation_animal_dog',
        'thing_ai_image_generation_animal_rabbit',
        'thing_ai_image_generation_animal_panda',
        'thing_ai_image_generation_animal_fish',
        'thing_ai_image_generation_animal_pig',
        'thing_ai_image_generation_animal_dolphin',
        'thing_ai_image_generation_animal_chicken',
        'thing_ai_image_generation_animal_tiger',
        'thing_ai_image_generation_animal_horse',
        'thing_ai_image_generation_animal_cat',
        'thing_ai_image_generation_animal_bird',
        'thing_ai_image_generation_animal_cow',
        'thing_ai_image_generation_animal_crab',
      ],
      categoryName: 'thing_ai_image_generation_animal',
    },
  ],
};

export const mockMessageList = [
  {
    id: 1,
    role: 'assistant',
    content: {
      text: '你好！我是你的AI助手，有什么可以帮助你的吗？',
    },
    timestamp: Date.now() - 10000,
  },
  {
    id: 2,
    role: 'user',
    content: {
      text: '你好，请介绍一下你自己',
    },
    timestamp: Date.now() - 5000,
  },
  {
    id: 3,
    role: 'assistant',
    content: {
      text: '我是一个智能聊天助手，可以帮助你解答问题、提供建议、进行日常对话等。我会尽力为你提供准确和有用的信息。有什么特别想了解的吗？',
    },
    timestamp: Date.now(),
  },
  {
    id: 4,
    role: 'user',
    content: {
      text: '你能帮我做什么呢？',
    },
    timestamp: Date.now() - 2000,
  },
  {
    id: 5,
    role: 'assistant',
    content: {
      text: '我可以帮助你回答问题、提供信息查询、协助解决问题、进行创意讨论等等。无论是学习、工作还是日常生活中的疑问，我都很乐意为你提供帮助！',
    },
    timestamp: Date.now() - 1000,
  },
  {
    id: 6,
    role: 'user',
    content: {
      text: '兔子',
    },
    timestamp: Date.now() - 2000,
  },
  {
    id: 7,
    role: 'assistant',
    content: {
      text: '我可以帮助你回答问题、提供信息查询、协助解决问题、进行创意讨论等等。无论是学习、工作还是日常生活中的疑问，我都很乐意为你提供帮助！',
    },
    timestamp: Date.now() - 1000,
    label: '兔子',
    type: 'image',
    isLoaded: false,
  },
  {
    id: 8,
    role: 'assistant',
    content: {
      text: '我可以帮助你回答问题、提供信息查询、协助解决问题、进行创意讨论等等。无论是学习、工作还是日常生活中的疑问，我都很乐意为你提供帮助！',
    },
    timestamp: Date.now() - 1000,
    label: '兔子',
    type: 'image',
    isLoaded: true,
  },
  {
    id: 9,
    role: 'assistant',
    content: {
      text: '我可以帮助你回答问题、提供信息查询、协助解决问题、进行创意讨论等等。无论是学习、工作还是日常生活中的疑问，我都很乐意为你提供帮助！',
    },
    timestamp: Date.now() - 1000,
    label: '狗',
    type: 'image',
    isLoaded: true,
  },
];
