import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/native_ai',
    path: '/pages/native_ai/index',
    name: 'NativeAI',
  },
  {
    route: '/graffiti',
    path: '/pages/graffiti/index',
    name: 'Graffiti',
  },
  {
    route: '/img-select',
    path: '/pages/media/img-select/index',
    name: 'ImgSelect',
  },
  {
    route: '/photo-album',
    path: '/pages/media/photo-album/index',
    name: 'PhotoAlbum',
  },
  {
    route: '/cropping/:md5',
    path: '/pages/media/cropping/index',
    name: 'Cropping',
  },
  {
    route: '/img-pixelation',
    path: '/pages/media/img-pixelation/index',
    name: 'ImgPixelation',
  },
];
