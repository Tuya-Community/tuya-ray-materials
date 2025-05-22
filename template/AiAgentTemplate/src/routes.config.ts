import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/AIDialogue/index',
    name: 'Home',
  },
  {
    route: '/dialogHistory',
    path: '/pages/DialogHistory/index',
    name: 'DialogHistory',
  },
  {
    route: '/voiceSquare',
    path: '/pages/VoiceSquare/index',
    name: 'VoiceSquare',
  },
  {
    route: '/voiceSetting',
    path: '/pages/VoiceSetting/index',
    name: 'VoiceSetting',
  },
  {
    route: '/cloneSetting',
    path: '/pages/CloneSetting/index',
    name: 'cloneSetting',
  },
  {
    route: '/cloneVoice',
    path: '/pages/CloneVoiceAction/index',
    name: 'CloneVoice',
  },
  {
    route: '/customAgentEdit',
    path: '/pages/CustomAgentEdit/index',
    name: 'CustomAgentEdit',
  },
  {
    route: '/avatarSelect',
    path: '/pages/AvatarSelect/index',
    name: 'AvatarSelect',
  },
];
