import { useEffect, useState } from 'react';
import { getStorageSync, setStorageSync } from '@ray-js/ray';
import Strings from '@/i18n';
import { useSelector, useAppDispatch } from '@/redux';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import { selectIsHomeCardDisplay, addAiNoteCardToHome } from '@/redux/modules/aiNoteCardSlice';

const STORAGE_KEY = 'HAS_SHOWN_FIRST_SUMMARY_SUCCESS_POPUP';

/**
 * 自定义 Hook：管理首次转写成功时的弹窗显示
 * @returns { show: boolean, onClose: () => void, onAdd?: () => void, onLater?: () => void }
 */
const useFirstTransformSuccessPopup = (
  isReadyTransfer: boolean,
  onAdd?: () => void,
  onLater?: () => void
) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const { homeId } = useSelector(selectDevInfo);
  const isHomeCardDisplay = useSelector(selectIsHomeCardDisplay);

  useEffect(() => {
    // 总结成功且有数据且 AI 笔记卡片没有被添加到首页的时候
    if (isHomeCardDisplay === false && isReadyTransfer) {
      // 检查是否已经显示过弹窗
      try {
        const hasShown = getStorageSync({ key: STORAGE_KEY });
        if (!hasShown) {
          // 第一次总结成功，显示弹窗
          setShow(true);
          // 标记为已显示
          setStorageSync({ key: STORAGE_KEY, data: 'true' });
        }
      } catch (error) {
        console.error('检查首次总结成功弹窗状态失败:', error);
      }
    }
  }, [isHomeCardDisplay, isReadyTransfer]);

  const handleClose = () => {
    setShow(false);
  };

  const handleAdd = async () => {
    if (!homeId) return;
    try {
      await dispatch(addAiNoteCardToHome(homeId)).unwrap();
      ty.showToast({ title: Strings.getLang('addToHomePopup_added'), icon: 'success' });
      handleClose();
      onAdd?.();
    } catch (error) {
      ty.showToast({ title: error, icon: 'error' });
    }
  };

  const handleLater = () => {
    handleClose();
    onLater?.();
  };

  return {
    show,
    onClose: handleClose,
    onAdd: handleAdd,
    onLater: handleLater,
  };
};

export default useFirstTransformSuccessPopup;
