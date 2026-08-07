import store from '@/redux';

export const getSupportLangText = (lang: string) => {
  const { supportLangList } = store.getState()?.uiState;
  return supportLangList.find(item => item.lang === lang)?.display || '';
};
