export interface Skill {
  id: number;
  image: string;
  introduce: string;
  name: string;
}

export interface ListRes<T> {
  list: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}

export interface SkillDetail {
  description: string;
  image: string;
  name: string;
  introduce: string;
  utterances: string[];
}

export interface PageProps {
  location: { query: Record<string, any> };
}

export interface AIAgent {
  id: number; // 智能体id
  name: string; // 智能体名称
  introduce: string; // 智能体介绍
  logoUrl: string; // 智能体 logo
  bgColor: string; // 背景色，目前确定为N套颜色方案，云端传key
  tags: string[]; // 智能体标签
  added: boolean; // 是否已经添加到对话
  creator: string; // 智能体创建者
}

export interface GetListAtopParams {
  pageNo: number;
  pageSize: number;
}

export interface GetAIAgentListParams {
  devId: string;
  tag: string; // 默认是推荐
  keyWord: string; // 可为空
  pageNo: number;
  pageSize: number;
  busChannel?: '1'; // 根据业务类型获取智能体广场分页数据，例如：1表示音箱智能体
}

export interface AgentListItem {
  id: number; // 绑定实例id
  endpointAgentId?: number; // 绑定实例id
  agentId: number; // 智能体id
  name: string;
  introduce: string;
  logoUrl: string;
  // tags: Array<string>;
  wakeWord: string; // 绑定的唤醒词，可为空
  bgColor: string; // 背景色，目前确定为N套颜色方案，云端传key
  isMain: number; // 是否默认智能体 1 是 0 否
  added?: boolean; // 判断是否
  tagKey?: string; // 判断是否
  roleId?: string;
  roleName?: string;
  roleImgUrl?: string;
  templateId?: string;
}

export interface GetListParams {
  current: number;
  pageSize: number;
  tag?: string;
  searchText?: string;
}

export interface AgentListRes {
  totalPage: number;
  list: Array<AgentListItem>;
}

export interface GetAgentListRes {
  total: number;
  list: Array<AgentListItem>;
}

export interface GetHistoryParams {
  endpointAgentId?: number;
  startTime?: string;
  endTime?: string;
  pageNo: number;
  pageSize: number;
  roleId: string;
}

export interface AgentInfo {
  voiceId: string;
  voiceName: string;
  lang: string;
  speed: number; // 语速
  tone: number; // 语调
  keepChat: boolean; // 连续对话
  endpointAgentId?: number;
  supportLangs?: Array<string>;
  isMain?: number;
  modelName?: string; // 模型名称
  roleId?: string;
}

export interface DialogContentItem {
  context: string;
  type: 'text' | 'image';
}

export interface HistoryItem {
  // docId?: string; // 会话文本id
  createTime?: string; // 会话创建时间
  requestId?: string; // 请求id
  question?: Array<DialogContentItem>;
  answer?: Array<DialogContentItem>;
  emptyId?: string;
}

export interface DialogHistoryRes {
  list: Array<HistoryItem>;
  totalPage: number;
}

export interface GetDialogHistory {
  total: number;
  list: Array<HistoryItem>;
}

export interface EditAgentInfoParams {
  endpointAgentId: number;
  voiceId: string; // 为空不更新''
  speed: number;
  tone: number;
  lang: string;
  keepChat: boolean;
  isMain?: boolean;
}

export interface BindingAwakeWordsParams {
  endpointAgentId: number;
  wakeWord: string;
}

export interface BindingParams {
  agentId: number;
  wakeWord: string;
}

export interface GetStandardVoiceParams {
  tag?: string;
  keyWord?: string;
  agentId: number;
  pageNo: number;
  pageSize: number;
  lang: string;
}

export interface PreviewAudioParams {
  voiceId: string;
  speed: number;
  tone: number;
}

export interface CloudVoiceItem {
  voiceId: string;
  voiceName: string;
  descTags?: string[];
  speed: number;
  tone: number;
  supportLangs: string[];
  createTime?: number;
  state?: number; // 克隆音色 0 删除 1 正常 2 训练中 3 生成基础数据中 4 失败
  remainTimes?: number; // 剩余训练次数(目前用的火山tts有这个东西)
}

export interface VoiceRes {
  list?: Array<CloudVoiceItem>;
  data?: Array<CloudVoiceItem>;
  totalPage: number;
}

export interface ModelConfig {
  modelId: string;
  modelName: string;
  isDefault?: boolean;
}

export interface GetAgentModelConfigResult {
  supportModels: ModelConfig[];
}

export interface GetAgentModelConfig {
  devId: string;
  endpointAgentId: number;
}

export interface RoleListItem {
  roleId: string; // 角色ID
  roleName: string; // 角色名称
  roleIntroduce: string; // 角色介绍
  roleImgUrl: string; // 角色图像
  useLang: string; // 角色使用语言
  useTimbreId: string; // 角色使用音色
  useTimbreName: string; // 角色使用音色名称
  useLlmId: string; // 角色使用语言模型
  useLlmName: string; // 角色使用语言模型名称
  inBind: string; // 绑定状态
  memoryInfo: string; // 记忆体
}

export interface GetRoleListRes {
  total: number;
  list: Array<RoleListItem>;
}

export interface roleInfo {
  roleImgUrl?: string; // 图像
  roleTemplateId?: string; // 图像对应ID
  voiceId?: string;
  voiceName?: string;
  useLang?: string;
  useLangId?: string;
}

export interface GetStandardVoice {
  total: number;
  list: Array<CloudVoiceItem>;
}