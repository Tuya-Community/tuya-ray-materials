import ossApiInstance from '@/api/ossApi';
import {
  deviceTimerCode,
  directionControlCode,
  disturbTimeSetCode,
  mapResetCode,
  statusCode,
  switchGoCode,
  voiceDataCode,
} from '@/constant/dpCodes';
import { devices, support } from '@/devices';
import Strings from '@/i18n';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { fetchMultiMaps } from '@/redux/modules/multiMapsSlice';
import { robotIsNotWorking } from '@/utils/robotStatus';
import { useActions } from '@ray-js/panel-sdk';
import { router, View } from '@ray-js/ray';
import { Cell, CellGroup, Dialog, DialogInstance, NavBar } from '@ray-js/smart-ui';
import { useInterval } from 'ahooks';
import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.module.less';

const Setting: FC = () => {
  const dispatch = useDispatch();
  const actions = useActions();
  const mapSize = useSelector(selectMapStateByKey('mapSize'));
  const { width, height } = mapSize;
  const isEmpty = useMemo(() => {
    return width === 0 || height === 0;
  }, [width, height]);

  const handleNavToMapEdit = async () => {
    if (!robotIsNotWorking(devices.common.model.props[statusCode] as Status)) {
      try {
        await DialogInstance.confirm({
          context: this,
          title: Strings.getLang('dsc_tips'),
          icon: true,
          message: Strings.getLang('dsc_robot_is_working_tips'),
          confirmButtonText: Strings.getLang('dsc_confirm'),
          cancelButtonText: Strings.getLang('dsc_cancel'),
        });
        actions[switchGoCode].set(false);
      } catch (err) {
        //
      }
    } else {
      router.push('/mapEdit');
    }
  };

  const handleResetMap = () => {
    DialogInstance.close();
    DialogInstance.confirm({
      context: this,
      title: Strings.getLang('dsc_tips'),
      icon: true,
      message: Strings.getLang('dsc_reset_map_content'),
      confirmButtonText: Strings.getLang('dsc_confirm'),
      cancelButtonText: Strings.getLang('dsc_cancel'),
    })
      .then(() => {
        actions[mapResetCode].set(true);
        ty.showToast({ title: Strings.getLang('dsc_put_dp_success') });
      })
      .catch(() => {
        //
        DialogInstance.close();
      });
  };

  useInterval(
    () => {
      ossApiInstance.updateAuthentication().then(() => {
        dispatch(fetchMultiMaps());
      });
    },
    60 * 60 * 1000,
    {
      immediate: true,
    }
  );

  return (
    <View className={styles.container}>
      <NavBar title={Strings.getLang('dsc_settings')} leftArrow onClickLeft={router.back} />
      <CellGroup>
        <Cell
          title={Strings.getLang('dsc_multi_map')}
          isLink
          onClick={() => {
            router.push('/multiMap');
          }}
        />
        {!isEmpty && (
          <Cell title={Strings.getLang('dsc_map_edit')} isLink onClick={handleNavToMapEdit} />
        )}
        {!isEmpty && (
          <Cell
            title={Strings.getLang('dsc_room_edit')}
            isLink
            onClick={() => {
              router.push('/roomEdit');
            }}
          />
        )}
        {!isEmpty && (
          <Cell
            title={Strings.getLang('dsc_room_floor_material')}
            isLink
            onClick={() => {
              router.push('/roomFloorMaterial');
            }}
          />
        )}
        {!isEmpty && (
          <Cell
            title={Strings.getLang('dsc_preference')}
            isLink
            onClick={() => {
              router.push('/cleanPreference');
            }}
          />
        )}
        {support.isSupportDp(mapResetCode) && (
          <Cell title={Strings.getLang('dsc_reset_map')} isLink onClick={handleResetMap} />
        )}
        {support.isSupportDp(deviceTimerCode) && (
          <Cell
            title={Strings.getLang('dsc_timer_title')}
            isLink
            onClick={() => {
              router.push('/timing');
            }}
          />
        )}
        {support.isSupportDp(disturbTimeSetCode) && (
          <Cell
            title={Strings.getLang('dsc_do_not_disturb')}
            isLink
            onClick={() => {
              router.push('/doNotDisturb');
            }}
          />
        )}
        <Cell
          title={Strings.getLang('dsc_clean_records')}
          isLink
          onClick={() => {
            router.push('/cleanRecords');
          }}
        />
        {support.isSupportDp(voiceDataCode) && (
          <Cell
            title={Strings.getLang('dsc_voice_pack')}
            isLink
            onClick={() => {
              router.push('/voicePack');
            }}
          />
        )}
        {support.isSupportDp(directionControlCode) && (
          <Cell
            title={Strings.getLang('dsc_manual')}
            isLink
            onClick={() => {
              router.push('/manual');
            }}
          />
        )}
      </CellGroup>
      <Dialog id="smart-dialog" customClass="my-custom-class" />
    </View>
  );
};

export default Setting;
