import { config } from "@/config";
import { devices } from "@/devices";
import { getBitValue } from "@ray-js/panel-sdk/lib/utils";
import { offDeviceOnlineStatusUpdate, onDeviceOnlineStatusUpdate, queryDps } from "@ray-js/ray";
let isRunQuerySigMesh = false;

export const isSigMesh = () => {
    const devInfo = devices.common.getDevInfo();
    if (!devInfo.capability) return false;
    return !!getBitValue(devInfo?.capability, 15);
}


export const sigMeshQueryDpTimers = () => {
    const sigmesh = isSigMesh();
    const devInfo = devices.common.getDevInfo();
    const dpSchema = devices.common.getDpSchema();

    // sigmesh 拉取 倒计时/随机定时/点动定时/循环定时
    if (sigmesh && !isRunQuerySigMesh) {
        // 防止多次监听 同时执行回调后，不再监听DeviceOnline
        offDeviceOnlineStatusUpdate(sigMeshQueryDpTimers);
        if (devInfo.isOnline) {
            isRunQuerySigMesh = true;
            const dpIds = [];
            if (config.countdownDps.length) {
                dpIds.push(...config.countdownDps.map(d => d.id));
            }
            if (config.isSupportRandom === 'y') {
                dpIds.push(dpSchema?.[config.randomCode]?.id);
            }

            if (config.isSupportInching === 'y') {
                dpIds.push(dpSchema?.[config.inchingCode]?.id)
            }

            if (config.isSupportCycle === 'y') {
                dpIds.push(dpSchema?.[config.cycleCode]?.id);
            }

            console.log("queryDps====", dpIds, devInfo.devId);

            return queryDps({
                deviceId: devInfo.devId,
                dpIds: dpIds.filter(Boolean)
            })
        } else {
            onDeviceOnlineStatusUpdate(sigMeshQueryDpTimers)
        }

    }
}