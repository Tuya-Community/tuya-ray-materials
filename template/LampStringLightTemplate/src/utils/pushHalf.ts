import { routes } from '@/routes.config';
import { navigateTo } from '@ray-js/ray';

export const pushHalf = (routeUrl: string) => {
  const [path, query] = routeUrl.split('?');
  const route = routes.find(item => item.route === path);
  if (route) {
    navigateTo({
      url: `${route?.path}?${query}`,
      type: 'half',
      // @ts-ignore
      topMargin: 1,
    });
  }
};
