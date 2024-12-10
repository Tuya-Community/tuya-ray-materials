import { useState, useEffect } from 'react';
import { getGatewayAbility, getCurrentHomeId, getDeviceList } from '@/api';
import { hasManageBleCapability, hasManageMatterCapability, getIsOnline } from '@/utils';
import { DevInfo } from '@/types';

const useGetMigratableGatewayList = (devInfo: DevInfo) => {
  const [migratableGatewayList, setMigratableGatewayList] = useState<DevInfo[]>([]); // 可供迁移时选择的网关列表

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const homeId = await getCurrentHomeId();
    const list = await getDeviceList(homeId);
    const isCurrentGatewayHasManageBleCapability = hasManageBleCapability(
      devInfo.protocolAttribute
    );
    const isCurrentGatewayHasManageMatterCapability = hasManageMatterCapability(
      devInfo.protocolAttribute
    );
    const tempBleGatewayList = [];
    const tempMatterGatewayList = [];
    (list as DevInfo[]).forEach(devItem => {
      if (getIsOnline(devItem) && devItem.devId !== devInfo.devId) {
        if (
          hasManageBleCapability(devItem.protocolAttribute) &&
          isCurrentGatewayHasManageBleCapability
        ) {
          tempBleGatewayList.push(devItem);
        } else if (
          hasManageMatterCapability(devItem.protocolAttribute) &&
          isCurrentGatewayHasManageMatterCapability
        ) {
          tempMatterGatewayList.push(devItem);
        }
      }
    });
    if (tempBleGatewayList.length) {
      getGatewayAbility(JSON.stringify(tempBleGatewayList.map(d => d.devId))).then(res => {
        const filterRes = tempBleGatewayList.filter(d => {
          const item = res.find(r => r.devId === d.devId);
          return item ? item?.subMaximum?.data?.blu > 0 : false;
        });
        setMigratableGatewayList(filterRes.concat(tempMatterGatewayList));
      });
    } else {
      setMigratableGatewayList(tempMatterGatewayList);
    }
  };

  return { list: migratableGatewayList, refresh: getData };
};

export default useGetMigratableGatewayList;
