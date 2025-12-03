export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: {
    text: string;
  };
  type?: 'text' | 'image';
  path?: string;
  label?: string;
  isLoaded?: boolean;
  timestamp: number;
}

export interface MessageListProps {
  messages?: Message[];
  onRegenerate?: (label: string) => void;
  scrollTop?: number;
  isLoading?: boolean;
}

export interface LabelData {
  imageCategory?: Array<{
    categoryName: string;
    categoryLabel: string[];
  }>;
}

export type Photo = {
  path: string;
  id?: number;
  md5?: string;
  size?: number;
  height?: number;
  width?: number;
  type?: string;
  rawData?: string;
  originData?: boolean;
  mode?: number;
  effect?: number;
  speed?: number;
  time?: number;
  base64Data?: string;
  playVal?: number;
  originUrl?: string;
};
