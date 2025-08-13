#!/bin/bash
# 复制源目录中的所有内容到目标目录

# 设置源目录和目标目录路径
source_dir="./example/src/slider/"
target_dir="./src/"

# 执行复制操作
cp -R "$source_dir"/* "$target_dir"/

# 输出完成消息
echo "已将 $source_dir 中的所有文件和子目录复制到 $target_dir 中。"