import { useAppSelector } from '@/redux';
import { ThemeConfigItem } from '@/redux/modules/themeSlice';
import _ from 'lodash';

export const useUiConfig = <T>(selector: (item: ThemeConfigItem) => T): T => {
  const defaultTheme = useAppSelector(state => state?.theme?.config?.default);

  const themeType = useAppSelector(state => state?.theme?.type);

  const config = useAppSelector(
    state => state?.theme?.config,
    (a, b) => selector(a[themeType]) === selector(b[themeType])
  );

  return selector(_.defaultsDeep({}, config?.[themeType], defaultTheme));
};
