import ossApiInstance from '@/api/ossApi';
import {
  deviceTimerCode,
  disturbTimeSetCode,
  mapResetCode,
  statusCode,
  switchGoCode,
  voiceDataCode,
} from '@/constant/dpCodes';
import { devices, support } from '@/devices';
import Strings from '@/i18n';
import { selectMapStateByKey } from '@/redux/modules/mapStateSlice';
import { robotIsNotWorking } from '@/utils/robotStatus';
import { useActions } from '@ray-js/panel-sdk';
import { router } from '@ray-js/ray';
import { Cell, CellGroup, Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useInterval } from 'ahooks';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Setting: FC = () => {
  const actions = useActions();
  const isEmptyMap = useSelector(selectMapStateByKey('isEmptyMap'));

  useEffect(() => {
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_settings'),
    });
  }, []);

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
      });
  };

  useInterval(
    () => {
      ossApiInstance.updateAuthentication();
    },
    60 * 60 * 1000,
    {
      immediate: true,
    }
  );

  useEffect(() => {
    ty.setNavigationBarTitle({
      title: Strings.getLang('dsc_settings'),
    });
  }, []);

  return (
    <>
      <CellGroup>
        <Cell
          title={Strings.getLang('dsc_multi_map')}
          isLink
          onClick={() => {
            router.push('/multiMap');
          }}
        />
        {!isEmptyMap && (
          <Cell title={Strings.getLang('dsc_map_edit')} isLink onClick={handleNavToMapEdit} />
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
      </CellGroup>
      <Dialog id="smart-dialog" customClass="my-custom-class" />
    </>
  );
};

export default Setting;