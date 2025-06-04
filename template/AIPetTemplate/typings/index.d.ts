declare module '*.png';

declare module '*.module.less' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
  declare module '*.less';
}

declare global {
  interface Window {
    devToolsExtension?: () => any;
    __DEV__: boolean;
  }
}

type DpValue = boolean | number | string;
interface DpState {
  switch?: boolean;
  [dpCode: string]: DpValue;
}

/// 一些 TTT 通用工具泛型 ///
type GetTTTAllParams<Fn> = Parameters<Fn>['0'];
type GetTTTParams<Fn> = Omit<GetTTTAllParams<Fn>, 'complete' | 'success' | 'fail'>;
type GetTTTCompleteData<Fn> = Parameters<GetTTTAllParams<Fn>['complete']>['0'];
type GetTTTSuccessData<Fn> = Parameters<GetTTTAllParams<Fn>['success']>['0'];
type GetTTTFailData<Fn> = Parameters<GetTTTAllParams<Fn>['fail']>['0'];
///                   ///

/**
 * TTT 方法统一错误码
 */
type TTTCommonErrorCode = GetTTTFailData<typeof ty.device.getDeviceInfo>;

/**
 * 设备信息
 */
type DevInfo = ty.device.DeviceInfo & { state: DpState };

/**
 * 设备物模型信息
 */
type ThingModelInfo = GetTTTSuccessData<typeof ty.device.getDeviceThingModelInfo>;

type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
  ? K extends string
    ? Pick<T, K & keyof T> & Partial<T>
    : never
  : never;

// 看宠助手
type PetRecordData = {
  id: number;
  type: number;
  time: string;
  desc: string;
  img?: string;
};

type HomeInfo = {
  homeName: string;
  homeId: string;
  longitude: string;
  latitude: string;
  address: string;
  admin: boolean;
};

type Audio = {
  fileNo: string;
  fileName: string;
  publicUrl?: string;
};

type PetType = 'cat' | 'dog';

type PetBreed = {
  breedCode: string;
  headerChar: string;
  id: number;
  image: string;
  name: string;
};

type PetAdd = {
  petType: PetType;
  breedCode: string;
  sex: number;
  activeness: number;
  name: string;
  weight: number;
  birth: number;
  ownerId?: string;
  avatar?: string;
  timeZone: string;
  tuyaAppId: string;
  foodId?: number;
  rfid?: string;
  devIds?: string[];
  idPhotos?: IdPhotos[];
  features?: Feature[];
};

type Pet = PetAdd & {
  id: number;
  avatarDisplay: string;
  age: number;
  breedName: string;
  createTime: number;
  modifiedTime: number;
  weightType: number;
  bindFood: boolean;
  relationFood: {
    id: number;
    name: string;
  };
  dailyCalorie: number;
  dailyFeeding: number;
  devIds: number[];
  rfid: string;
  extInfo: any;
  feedPlans?: FeedPlan[];
};

// 相似度分析结果
type SimilarityPet = {
  petId: number;
  petName: string;
  similarity: number;
};

type Feature = {
  category: string;
  details: string[];
};

type Images = {
  objectKey: string;
  angle: string;
  desc: string;
};

type IdPhotos = Pick<Images, 'angle' | 'objectKey'>;

// 头像分析结果
type ProfileResult = {
  features?: Feature[];
  idPhotos?: IdPhotos[];
};

type AnalysisResult = {
  analysisResult:
    | 0 // 加载中
    | 1 // 失败
    | 2; // 成功
} & {
  features?: Feature[];
  images?: Array<Images>;
} & {
  petType?: string;
  matchedPets?: SimilarityPet[];
};

type MealPlan = {
  version: number;
  list: FeedPlan[];
};

type FeedPlan = {
  id?: number;
  hour: number;
  minute: number;
  loops: number;
  amount: number;
  status: boolean;
  audioEnable?: boolean;
  audioFileNo?: string;
};

type IFetchPetEatingRecordParams = {
  ownerId: string;
  uuid: string;
  petId?: number;
  startTime?: number;
  endTime?: number;
  pageNo: number;
  pageSize: number;
};

// 宠物进食记录
type IEatingRecord = {
  recordNo: string;
  devId: string;
  deviceName: string;
  ownerId: string;
  roomId: string;
  roomName: string;
  recordTime: number;
  isEncrypted: number; // 文件是否加密，0-否，1-是
  videoCoverDisplay: string; // 视频封面可访问地址，有效期：30-60min
  videoDisplay: string; // 视频可访问地址，有效期：30-60min
  videoDuration: number; // 视频时长，单位：秒
  petAction: string; // 行为
  pets: {
    petId: number;
    petName: string;
  }[]; // 关联的宠物信息
};

// 文件上传业务类型，pet-宠物头像，petFront-宠物特征，temp-临时文件，分析食物成分
type UploadFileBizType = 'pet' | 'petFeature' | 'temp' | 'pet_media-device';
