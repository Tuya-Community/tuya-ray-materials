import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/Home/index',
    name: 'Home',
  },
  {
    route: '/addPet',
    path: '/pages/AddPet/index',
  },
  {
    route: '/addProfile',
    path: '/pages/AddProfile/index',
  },
  {
    route: '/pet',
    path: '/pages/Pet/index',
  },
  {
    route: '/selectPetBreed',
    path: '/pages/SelectPetBreed/index',
  },
  {
    route: '/selectImage',
    path: '/pages/SelectImage/index',
    name: 'AiFilter',
  },
  {
    route: '/aiFilter',
    path: '/pages/AIFilter/index',
    name: 'AiFilter',
  },
];
