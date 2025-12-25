import Strings from '@/i18n';
import { router } from '@ray-js/ray';

export const showConfirmBackModal = (callback?: VoidFunction) => {
  ty.showModal({
    title: '',
    content: Strings.getLang('unsaveSceneTip'),
    cancelText: Strings.getLang('cancel'),
    confirmText: Strings.getLang('unsaveSceneBtnText'),
    confirmColor: '#FF4444',
    cancelColor: 'rgba(0, 0, 0, 0.5)',
    success(res) {
      if (res.confirm) {
        callback && callback();
        router.back();
      }
    },
  });
};

export interface ShowConfirmDeleteModalOps {
  content: string;
  success: (params: { confirm: boolean; cancel: boolean }) => void;
}

export const showConfirmDeleteModal = ({ success, content }: ShowConfirmDeleteModalOps) => {
  ty.showModal({
    title: '',
    content,
    cancelText: Strings.getLang('cancel'),
    confirmText: Strings.getLang('delete'),
    confirmColor: '#FF4444',
    cancelColor: 'rgba(0, 0, 0, 0.5)',
    success,
  });
};
