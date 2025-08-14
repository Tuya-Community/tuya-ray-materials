import React from 'react';
import { isObject, mapKeys, omit, kebabCase } from 'lodash-es';
import MD from './components';

const styleObj2Str = (style: Record<string, string>) => {
  if (!isObject(style)) return style;
  return Object.entries(style).reduce((acc, [key, value]) => {
    return `${acc}${key}: ${value};`;
  }, '');
};

export const withReactProps = <P extends Record<string, any>>() => {
  return (props: P) => {
    // 自身是否是一个 Slot 组件
    const isSelfSlot = typeof props?.slot === 'string';
    const slotProps = isSelfSlot ? {} : props?.slot ?? {};
    const slotPropsNames = Object.keys(slotProps);

    const omitPropKeys = ['className', 'slot', 'children'];
    const stylePropsKeys = [];
    let vantProps = omit(props, omitPropKeys) as any;

    vantProps = mapKeys(vantProps, (__, key) => {
      /**
       * React 中为 onClick，涂鸦小程序中的 Event 标准写法为 bindclick，故这里会转一道
       */
      if (key.startsWith('on')) {
        const eventKey = `bind${key[2].toLowerCase()}${key.slice(3)}`;
        return eventKey;
      }

      if (key.endsWith('Style')) {
        stylePropsKeys.push(key);
        return key;
      }

      /**
       * React 为 camelCase，Smart 中的 props 统一为 kebab-case，故这里会转一道
       */
      return key;
    });

    /**
     * React 中为 className，Smart 中使用 class，故这里会转一道
     */
    if (props.className) {
      vantProps.class = props.className;
    }

    if (stylePropsKeys?.length > 0) {
      stylePropsKeys.forEach(stylePropKey => {
        const stylePropValue = vantProps[stylePropKey];
        vantProps[stylePropKey] = styleObj2Str(stylePropValue);
      });
    }
    /**
     * 小程序中的 Slot 写法为子组件 + slot 属性，在 React 中无法直接使用，故这里会转一道，
     * 统一通过 slot props 来定义
     */
    if (slotPropsNames?.length > 0) {
      return (
        <MD {...vantProps} bindupdateBlocks={props.onUpdateBlocks}>
          {slotPropsNames.map(slotName => {
            const name = kebabCase(slotName);
            return React.cloneElement(slotProps?.[slotName], { key: slotName, slot: name });
          })}
          {props.children}
        </MD>
      );
    }
    return (
      <MD
        {...(isSelfSlot ? { slot: props.slot } : {})}
        {...vantProps}
        bindupdateBlocks={props.onUpdateBlocks}
      >
        {props.children}
      </MD>
    );
  };
};
