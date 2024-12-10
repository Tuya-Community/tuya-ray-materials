import { gateway } from '@ray-js/ray';
import { useRequest } from 'ahooks';
import { translateGatewayAbility } from '@/utils';
import { UnPromisify, GetUseRequestResult, GetUseRequestOptions } from '@/types';

const { getGatewayAbility } = gateway;
type TranslateResult = ReturnType<typeof translateGatewayAbility>;

type GetGatewayAbilityResponse = UnPromisify<ReturnType<typeof getGatewayAbility>>;

type Result = GetUseRequestResult<GetGatewayAbilityResponse, [string]>;

type UseGetGatewayCapabilityResult = {
  data: TranslateResult[];
} & Omit<Result, 'data'>;

/**
 * @language zh-CN
 * @description 获取网关能力的hooks 涉及云端接口: tuya.m.gateway.ability.device.indicator.batch.get_1.0
 * @param {String} devIds 设备id列表 JSON.stringify后的结果。例如: JSON.stringify(['1234'])
 * @param {Object} options useRequest的第二个参数。
 * @return useRequest的执行结果
 */
const useGetGatewayCapability = (
  devIds: string,
  options?: GetUseRequestOptions<GetGatewayAbilityResponse, [string]>
): UseGetGatewayCapabilityResult => {
  const { data, ...rest } = useRequest<GetGatewayAbilityResponse, [string]>(
    () => getGatewayAbility({ devIds }),
    {
      refreshDeps: [devIds],
      ...options,
    }
  );

  return {
    data: (Array.isArray(data) ? data : []).map(translateGatewayAbility),
    ...rest,
  };
};

export default useGetGatewayCapability;
