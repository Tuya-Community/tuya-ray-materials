import { ReactNode } from 'react';

export type SelectorValue = string | number;

interface SelectorOption<V> {
  title: ReactNode;
  value: V;
  disabled?: boolean;
}

export interface SelectorProps<V> {
  activeKey?: V;
  defaultActiveKey?: V;
  onChange: (key: V) => void;
  options: SelectorOption<V>[];
  style?: React.CSSProperties;
}

export type SelectorItemProps = SelectorProps<SelectorValue> & { name: string };
