import React from "react";
import { View, Text } from "@ray-js/ray-next";
import { router } from "@ray-js/ray-next";
import clsx from "clsx";

import styles from "./index.module.less";

const NavPanel: React.FC<{
  title: string;
  list: { name: string; path?: string; action?: string; onClick?: () => void }[];
  layout: "grid" | "list";
  onAction?: (actionName: string) => void;
}> = ({ title, list, layout, onAction }) => {
  const isGrid = layout === "grid";
  const items = isGrid ? list : [...list].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View className={styles.wrapper}>
      <Text className={styles.title}>{(I18n.t(title) || title)}</Text>
      <View className={isGrid ? styles.grid : styles.listWrapper}>
        {items.map(({ name, path, action, onClick }) => {
          const runsAction = Boolean(onClick || (action && onAction));

          return (
            <View
              key={name}
              className={styles.item}
              hoverClassName={styles.itemHover}
              onClick={() => {
                if (onClick) {
                  onClick();
                } else if (action && onAction) {
                  onAction(action);
                } else if (path) {
                  router.push(path);
                }
              }}
            >
              <Text className={clsx(styles.itemName, !isGrid && styles.apiName)}>{name}</Text>
              <View className={styles.indicator}>
                <View className={runsAction ? styles.play : styles.arrow} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default NavPanel;
