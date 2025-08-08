export interface IProps {
  className?: string;
  onReset: () => void;
  value: number;
  lineCount: number;
  size: number; // 组件尺寸， rpx为单位
  lineWidth: number; // 环的宽度， rpx为单位
  lineLength: number; // 环的宽度， rpx为单位
  activeColor: string; // 激活单色
  lineColor: string;
  total: number;
}
