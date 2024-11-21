/**
 * HealthKit
 *
 * @version 5.18.0
 */
declare namespace ty.health {
  /**
   * health connect sdk状态获取[Android only]
   */
  export function getHealthConnectStatus(params?: {
    complete?: () => void
    success?: (params: number) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * health connect sdk状态获取[Android only]
   */
  export function getHealthConnectStatusSync(): number

  /**
   * 数据同步到health connect [Android only]
   */
  export function insertRecords(params: {
    /** RecordData数据列表的json array字符串 */
    request: string
    complete?: () => void
    success?: (params: boolean) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 数据同步到health connect [Android only]
   */
  export function insertRecordsSync(request?: RecordParams): boolean

  /**
   * 用户是否已经做过授权操作(针对Quanlity类型数据)[iOS only]
   *需要参数为readPermissions,writePermissions
   */
  export function authStatuPermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 用户是否已经做过授权操作(针对Quanlity类型数据)[iOS only]
   *需要参数为readPermissions,writePermissions
   */
  export function authStatuPermissionsSync(paramModel?: ParamModel): null

  /**
   * 用户是否有Quanlity类型数据写入权限[iOS only]
   *需要参数为writePermission
   */
  export function getSaveQuanlityPermission(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 用户是否有Quanlity类型数据写入权限[iOS only]
   *需要参数为writePermission
   */
  export function getSaveQuanlityPermissionSync(paramModel?: ParamModel): null

  /**
   * Quanlity写入权限申请接口[iOS only]
   *需要参数为permissions
   */
  export function authQuanlityWritePermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Quanlity写入权限申请接口[iOS only]
   *需要参数为permissions
   */
  export function authQuanlityWritePermissionsSync(
    paramModel?: ParamModel
  ): null

  /**
   * Category写入权限申请接口[iOS only]
   *需要参数为permissions
   */
  export function authCategoryWritePermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Category写入权限申请接口[iOS only]
   *需要参数为permissions
   */
  export function authCategoryWritePermissionsSync(
    paramModel?: ParamModel
  ): null

  /**
   * Quanlity读取权限申请[iOS only]
   *需要参数为permissions
   */
  export function authQuanlityReadPermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Quanlity读取权限申请[iOS only]
   *需要参数为permissions
   */
  export function authQuanlityReadPermissionsSync(paramModel?: ParamModel): null

  /**
   * Category 读取权限申请[iOS only]
   *需要参数为permissions
   */
  export function authCategoryReadPermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Category 读取权限申请[iOS only]
   *需要参数为permissions
   */
  export function authCategoryReadPermissionsSync(paramModel?: ParamModel): null

  /**
   * Characteristic 读取权限申请[iOS only]
   *需要参数为permissions
   */
  export function authCharacteristicReadPermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Characteristic 读取权限申请[iOS only]
   *需要参数为permissions
   */
  export function authCharacteristicReadPermissionsSync(
    paramModel?: ParamModel
  ): null

  /**
   * Quanlity读写权限申请[iOS only]
   *需要参数为permissions
   */
  export function authQuanlityRWPermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Quanlity读写权限申请[iOS only]
   *需要参数为permissions
   */
  export function authQuanlityRWPermissionsSync(paramModel?: ParamModel): null

  /**
   * Category 读写权限申请[iOS only]
   *需要参数为permissions
   */
  export function authCategoryRWPermissions(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * Category 读写权限申请[iOS only]
   *需要参数为permissions
   */
  export function authCategoryRWPermissionsSync(paramModel?: ParamModel): null

  /**
   * 写入quality类型的数据[iOS only]
   *需要参数为value,type,unitType,startTime,endTime
   */
  export function saveQuanlityData(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 写入quality类型的数据[iOS only]
   *需要参数为value,type,unitType,startTime,endTime
   */
  export function saveQuanlityDataSync(paramModel?: ParamModel): null

  /**
   * 写入quality类型的数据,不用传时间，开始时间和结束时间默认设置为当前时间[iOS only]
   *需要参数为value,type,unitType
   */
  export function saveQuanlityNoTimeWithData(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 写入quality类型的数据,不用传时间，开始时间和结束时间默认设置为当前时间[iOS only]
   *需要参数为value,type,unitType
   */
  export function saveQuanlityNoTimeWithDataSync(paramModel?: ParamModel): null

  /**
   * 写入血压数据[iOS only]
   */
  export function saveBloodPressureData(params: {
    /** 收缩压 */
    systolic: number
    /** 舒张压 */
    diastolic: number
    /** 开始时间,秒级时间戳 */
    startTime: number
    /** 结束时间,秒级时间戳 */
    endTime: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 写入血压数据[iOS only]
   */
  export function saveBloodPressureDataSync(
    paramModel?: BloodPressureParams
  ): null

  /**
   * 读取 quanlity[iOS only]
   *需要参数为type,unitType,startTime,endTime
   */
  export function readQuanlityDataWithType(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 读取 quanlity[iOS only]
   *需要参数为type,unitType,startTime,endTime
   */
  export function readQuanlityDataWithTypeSync(paramModel?: ParamModel): null

  /**
   * 删除QuanlityData数据,基于起止时间删除[iOS only]
   *需要参数为type,startTime,endTime
   */
  export function deleteQuanlityDataType(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 删除QuanlityData数据,基于起止时间删除[iOS only]
   *需要参数为type,startTime,endTime
   */
  export function deleteQuanlityDataTypeSync(paramModel?: ParamModel): null

  /**
   * 读取 Characteristic[iOS only]
   *需要参数为type
   */
  export function readCharacteristicDataWithType(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 读取 Characteristic[iOS only]
   *需要参数为type
   */
  export function readCharacteristicDataWithTypeSync(
    paramModel?: ParamModel
  ): null

  /**
   * 写入Category类型的数据[iOS only]
   *需要参数为value,type,startTime,endTime
   */
  export function saveCategorylityData(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 写入Category类型的数据[iOS only]
   *需要参数为value,type,startTime,endTime
   */
  export function saveCategorylityDataSync(paramModel?: ParamModel): null

  /**
   * 写入Category类型的数据,不用传时间，开始时间和结束时间默认设置为当前时间[iOS only]
   *需要参数为value,type
   */
  export function saveCategoryNoTimeWithData(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 写入Category类型的数据,不用传时间，开始时间和结束时间默认设置为当前时间[iOS only]
   *需要参数为value,type
   */
  export function saveCategoryNoTimeWithDataSync(paramModel?: ParamModel): null

  /**
   * 读取 Category类型的数据[iOS only]
   *需要参数为type,startTime,endTime
   */
  export function readCategoryDataWithType(params?: {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
    complete?: () => void
    success?: (params: null) => void
    fail?: (params: {
      errorMsg: string
      errorCode: string | number
      innerError: {
        errorCode: string | number
        errorMsg: string
      }
    }) => void
  }): void

  /**
   * 读取 Category类型的数据[iOS only]
   *需要参数为type,startTime,endTime
   */
  export function readCategoryDataWithTypeSync(paramModel?: ParamModel): null

  export type RecordParams = {
    /** RecordData数据列表的json array字符串 */
    request: string
  }

  export type ParamModel = {
    /** 权限类型(申请读写权限的接口使用) */
    permissions?: string[]
    /** 读取权限类型(查询用户是否已经做过授权操的接口使用) */
    readPermissions?: string[]
    /** 写入权限类型(查询用户是否已经做过授权操的接口使用) */
    writePermissions?: string[]
    /** 写入权限类型(查询是否有写权限的接口使用) */
    writePermission?: number
    /** 写入值 */
    value?: number
    /** 传入单位 比如"mg/dL"，"g" */
    unitType?: string
    /** 开始时间,秒级时间戳 */
    startTime?: number
    /** 结束时间,秒级时间戳 */
    endTime?: number
    /** 类型(读写数据的接口使用) */
    type?: number
  }

  export type BloodPressureParams = {
    /** 收缩压 */
    systolic: number
    /** 舒张压 */
    diastolic: number
    /** 开始时间,秒级时间戳 */
    startTime: number
    /** 结束时间,秒级时间戳 */
    endTime: number
  }
}
