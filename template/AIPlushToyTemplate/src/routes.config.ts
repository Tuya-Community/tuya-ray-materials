import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/dialogHistory',
    path: '/pages/DialogHistory/index',
    name: 'DialogHistory',
  },
  {
    route: '/aiAgentEdit',
    path: '/pages/AIAgentEdit/index',
    name: 'AIAgentEdit',
  },
  {
    route: '/voiceSquare',
    path: '/pages/VoiceSquare/index',
    name: 'VoiceSquare',
  },
  {
    route: '/voiceEdit',
    path: '/pages/VoiceEdit/index',
    name: 'VoiceEdit',
  },
  {
    route: '/cloneSetting',
    path: '/pages/CloneSetting/index',
    name: 'cloneSetting',
  },
  {
    route: '/cloneVoice',
    path: '/pages/CloneVoice/index',
    name: 'CloneVoice',
  },
];
