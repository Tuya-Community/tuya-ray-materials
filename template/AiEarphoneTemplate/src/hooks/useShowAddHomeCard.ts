import { useCallback, useState } from 'react';
import { getStorageSync, setStorageSync } from '@ray-js/ray';
import Strings from '@/i18n';
import { useSelector, useAppDispatch } from '@/redux';
import { selectDevInfo } from '@/redux/modules/devInfoSlice';
import {
  addAiNoteCardToHome,
  fetchAiNoteCardDisplayStatus,
  selectIsHomeCardDisplay,
} from '@/redux/modules/aiNoteCardSlice';

const STORAGE_KEY = 'HAS_SHOWN_FTF_ADD_HOME_CARD_POPUP';

/**
 * FaceToFace 结束录音时：引导将 AI 笔记卡片添加到首页
 * @param onAdd 添加成功后的回调
 * @param onLater 稍后/关闭后的回调
 * @returns 弹窗状态与操作方法
 */
const useShowAddHomeCard = (onAdd?: () => void, onLater?: () => void) => {
  const { homeId } = useSelector(selectDevInfo);
  const dispatch = useAppDispatch();
  const isHomeCardDisplay = useSelector(selectIsHomeCardDisplay);
  const [show, setShow] = useState(false);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const handleAdd = useCallback(async () => {
    if (!homeId) {
      return;
    }
    try {
      await dispatch(addAiNoteCardToHome(homeId)).unwrap();
      ty.showToast({ title: Strings.getLang('addToHomePopup_added'), icon: 'success' });
      handleClose();
      onAdd?.();
    } catch (error) {
      ty.showToast({ title: error, icon: 'error' });
    }
  }, [homeId, dispatch, handleClose, onAdd]);

  const handleLater = useCallback(() => {
    handleClose();
    onLater?.();
  }, [handleClose, onLater]);

  /**
   * 检查并显示弹窗（用于点击完成时触发）
   * @returns 是否显示了弹窗
   */
  const checkAndShow = useCallback(async (): Promise<boolean> => {
    if (!homeId) {
      return false;
    }
    try {
      let displayed = isHomeCardDisplay;
      if (displayed === null) {
        displayed = await dispatch(fetchAiNoteCardDisplayStatus(homeId)).unwrap();
      }
      if (displayed) {
        return false;
      }

      const hasShown = getStorageSync({ key: STORAGE_KEY });
      if (!hasShown) {
        setShow(true);
        setStorageSync({ key: STORAGE_KEY, data: 'true' });
        return true;
      }
    } catch (error) {
      console.error('check FaceToFace add-home popup failed', error);
    }
    return false;
  }, [homeId, isHomeCardDisplay, dispatch]);

  return {
    show,
    onClose: handleClose,
    onAdd: handleAdd,
    onLater: handleLater,
    checkAndShow,
  };
};

export default useShowAddHomeCard;
