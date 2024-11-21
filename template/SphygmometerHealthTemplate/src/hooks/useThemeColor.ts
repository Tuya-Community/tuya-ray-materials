import { useSelector } from '@/redux';

export default function useThemeColor() {
  const themeColor = useSelector(state => state.uiState.themeColor);

  return themeColor;
}
