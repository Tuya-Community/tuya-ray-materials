## 本地律动库

### 用法

#### 1. 使用 IDE 插件将律动数据注入到项目

- `src/standModel/musicModel/AppMusic`

#### 2. 代码引用

```tsx
import AppMusic from '@/standModel/musicModel/AppMusic';

export const Music: React.FC<Props> = ({ style }) => {
  return (
    <View style={style} className={styles.list}>
      <AppMusic />
    </View>
  );
};
```
