export default {
  themeLocation: 'theme.json',
  routes: [
    {
      name: 'home',
      isPublic: true,
      route: '/home',
      path: '/pages/home/index',
    },
    {
      name: 'schedule',
      isPublic: true,
      route: '/schedule',
      path: '/pages/schedule/list/index',
    },
    {
      name: 'addSchedule',
      isPublic: true,
      route: '/schedule/add',
      path: '/pages/schedule/add/index',
    },
    {
      name: 'cycle',
      isPublic: true,
      route: '/cycle',
      path: '/pages/cycle/list/index',
    },
    {
      name: 'addCycle',
      isPublic: true,
      route: '/cycle/add',
      path: '/pages/cycle/add/index',
    },
    {
      name: 'random',
      isPublic: true,
      route: '/random',
      path: '/pages/random/list/index',
    },
    {
      name: 'addRandom',
      isPublic: true,
      route: '/random/add',
      path: '/pages/random/add/index',
    },
    {
      name: 'setCountdown',
      isPublic: true,
      route: '/setCountdown',
      path: '/pages/countdown/countdown/index',
    },
    {
      name: 'countdown',
      isPublic: true,
      route: '/countdown',
      path: '/pages/countdown/list/index',
    },
    {
      name: 'astronomical',
      isPublic: true,
      route: '/astronomical',
      path: '/pages/astronomical/list/index',
    },
    {
      name: 'addAstronomical',
      isPublic: true,
      route: '/astronomical/add',
      path: '/pages/astronomical/add/index',
    },
    {
      name: 'inching',
      isPublic: true,
      route: '/inching',
      path: '/pages/inching/list/index',
    },
    {
      name: 'addInching',
      isPublic: true,
      route: '/inching/add',
      path: '/pages/inching/add/index',
    },
  ],
};
