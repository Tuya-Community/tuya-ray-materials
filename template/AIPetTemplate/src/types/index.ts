export type ImgItem = {
  id: number; // 图片id
  src: string; // 图片路径
  filterSrc?: string; // 滤镜地址
  originUrl: string; // 原始路径
  title: string; // 标题
  fileType: 'image' | 'video'; // 图片类型
  fileName: string; // 图片名称
  filterCode?: string; // 滤镜类型
  thumbnail?: string; // 缩略图路径
  width?: number; // 宽度
  height?: number; // 高度
  realWidth?: number; // 图片真实宽度
  realHeight?: number; // 图片真实高度
  scale?: number; // 缩放比例
  xOffset?: number; // x轴偏移量
  yOffset?: number; // y轴偏移量
  layoutType?: number; // 布局类型
  rotate?: number; // 旋转角度（度）
};
export enum HistoryStatus {
  SUCCESS = 1,
  FAILED = 2,
  UPLOADING = 3,
}

export enum HistoryType {
  image = 'image',
  video = 'video',
}

export type HistoryItem = {
  url: string; // 图片路径
  videoDuration?: number; // 视频时长
  originUrl?: string; // 原始路径
  thumbnail: string; // 缩略图路径
  title: string; // 用户自定义的标题
  centerX?: number; // x坐标
  centerY?: number; // y坐标
  filename: string; // 文件名称
  type: 'image' | 'video'; // 文件类型
  mode?: number[]; // 1喜欢 2大笑 3伤心 其他用户操作的心情
};
export type History = {
  list: Array<HistoryItem>;
  type: HistoryType | 'video' | 'image'; // 图片或视频
  status: HistoryStatus; // 发送状态
  timestamp: number; // 发送的时间戳
  sid?: string;
  prefix: string;
};

/**
 * 在相框设备中的文件名，格式为 md5(url) + '_' + 时间戳 + '.' + 文件后缀名
 * 如照片为 b2f2d6f65eedcfd189bb341e3baa1d28_1722760086681.jpg
 * 如视频为 0a30a20be509e9d6087cec2801059019_1722760086681.mp4
 * 用于相框中的文件和手机中的文件操作同步，如点赞、撤回、查询等
 */
export type RealFn = string;

/**
 * 文件名 hash，即 md5(url)，用于在 App 批量的上传成功通道中，分辨出上传成功的文件的 url
 */
export type HashUrl = string;

export type UploadExtraFileData = {
  /**
   * 图片中心点 x 坐标，fileType 为 image 时必填
   */
  centerX?: number;
  /**
   * 图片中心点 y 坐标，fileType 为 image 时必填
   */
  centerY?: number;
  /**
   * 视频的播放时长，单位毫秒，fileType 为 video 时必填
   */
  videoDuration?: number;
  /**
   * 图片或视频标题
   */
  title: string;
  /**
   * 文件类型
   */
  fileType: 'image' | 'video';
  /**
   * 文件缩略图，用于历史记录的列表缩略图展示
   * 如照片为 thingfile://store/thumbnails/0A388AD7-0538-417C-8A6D-2F1A2ECF3140_scaled_pic_thumb.jpg
   * 如视频为 thingfile://store/video_clip_thumbnails/video_20240804_140623/thumbnail_0_000.jpg
   */
  thumbnail: string;
  /**
   * 处理后的文件路径 url，用于历史记录的详情渲染
   * 如照片压缩裁剪后为 thingfile://store/compress_image/0A388AD7-0538-417C-8A6D-2F1A2ECF3140_scaled.jpg
   * 如视频压缩裁剪后为 thingfile://store/video_clip/clip_IMG_9710/video_20240804_140623.mp4
   */
  url: string;
  /**
   * 视频原始路径，用于首页已发送的文件状态判断展示
   * 如照片为 ???
   * 如视频为 thingotherfile:///var/mobile/Media/DCIM/109APPLE/IMG_9710.MOV
   */
  originUrl?: string;
  /**
   * 在相框设备中的文件名，格式为 md5(url) + '_' + 时间戳 + '.' + 文件后缀名
   * 如照片为 b2f2d6f65eedcfd189bb341e3baa1d28_1722760086681.jpg
   * 如视频为 0a30a20be509e9d6087cec2801059019_1722760086681.mp4
   * 用于相框中的文件和手机中的文件操作同步，如点赞、撤回、查询等
   */
  filename: RealFn;

  // ai 滤镜模版code
  templateCode?: string;
  /**
   * 图片旋转角度（度），用于图片旋转功能
   */
  rotate?: number;
};

export type UploadExtraData = {
  /**
   * 元数据，最大64字节，32个字符，在当前项目中语义为 uid，用户 id
   */
  meta: string;
  /**
   * 图片类型文件的数据，若存在则代表当前上传的为图片
   */
  fileMap?: Record<HashUrl, UploadExtraFileData>;
  type: 'ai-filter-upload' | null; // 上传类型
  templateCode?: string;
};

export interface CreateInnerAudioContextTask {
  pause(params: {
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  resume(params: {
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  play(params: {
    src: string;

    startTime?: number;

    autoplay?: boolean;

    loop?: boolean;

    volume?: number;

    playbackRate?: number;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  seek(params: {
    position?: number;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  stop(params: {
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  destroy(params: {
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  onTimeUpdate(
    listener: (params: {
      contextId: string;

      time: number;
    }) => void
  ): void;
}

export type MiniProgramAccountInfo = {
  /** 小程序 appId */
  appId: string;
  /**
   * 小程序版本
   * develop: 开发版
   * trail: 体验版
   * release: 正式版
   */
  envVersion: string;
  /** 小程序版本号 */
  version: string;
  /** 小程序名称 */
  appName: string;
  /** 小程序图标 */
  appIcon: string;
};

export interface GetFileSystemManagerTask {
  access(params: {
    path: string;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  readFile(params: {
    filePath: string;

    encoding?: string;

    position?: number;

    length?: number;
    complete?: () => void;
    success?: (params: { data: string }) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  readFileSync(req?: FileReadFileReqBean): {
    data: string;
  };

  saveFile(params: {
    tempFilePath: string;

    filePath: string;
    complete?: () => void;
    success?: (params: { savedFilePath: string }) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  saveFileSync(params?: SaveFileSyncParams): {
    savedFilePath: string;
  };

  stat(params: {
    path: string;

    recursive?: boolean;
    complete?: () => void;
    success?: (params: { fileStatsList: FileStats[] }) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  statSync(params?: FileStatsParams): {
    fileStatsList: FileStats[];
  };

  mkdir(params: {
    dirPath: string;

    recursive?: boolean;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  mkdirSync(params?: MakeDirParams): null;

  rmdir(params: {
    dirPath: string;

    recursive?: boolean;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  rmdirSync(params?: RemoveDirParams): null;

  writeFile(params: {
    filePath: string;

    data: string;

    encoding?: string;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;

  writeFileSync(params?: WriteFileParams): null;

  removeSavedFile(params: {
    filePath: string;
    complete?: () => void;
    success?: (params: null) => void;
    fail?: (params: {
      errorMsg: string;
      errorCode: string | number;
      innerError: {
        errorCode: string | number;
        errorMsg: string;
      };
    }) => void;
  }): void;
}

export type WriteFileParams = {
  fileId: string;

  filePath: string;

  data: string;

  encoding?: string;
};

export type RemoveDirParams = {
  fileId: string;

  dirPath: string;

  recursive?: boolean;
};

export type MakeDirParams = {
  fileId: string;

  dirPath: string;

  recursive?: boolean;
};
export type FileStats = {
  mode: string;

  size: number;

  lastAccessedTime: number;

  lastModifiedTime: number;

  isDirectory: boolean;

  isFile: boolean;
};
export type FileStatsParams = {
  fileId: string;

  path: string;

  recursive?: boolean;
};
export type SaveFileSyncParams = {
  fileId: string;

  tempFilePath: string;

  filePath: string;
};
export type FileReadFileReqBean = {
  filePath: string;

  encoding?: string;

  position?: number;

  length?: number;
};
