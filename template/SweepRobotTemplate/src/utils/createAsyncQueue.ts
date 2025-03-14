export function createAsyncQueue(taskFunc, onEmptyCallback, key = 'filePathKey') {
  let processing = false;
  const dataQueue = []; // 队列只保存数据
  const cache = new Map(); // 用于存储已完成的数据结果

  async function processQueue() {
    if (processing) return;
    processing = true;

    while (dataQueue.length > 0) {
      const data = dataQueue.shift(); // 移出队列中的数据

      try {
        await taskFunc(data); // 在这里对数据应用任务函数
      } catch (error) {
        console.error('Error processing task:', error);
      }
    }

    processing = false;

    // 当队列处理完毕后（队列为空），触发回调
    if (dataQueue.length === 0 && typeof onEmptyCallback === 'function') {
      onEmptyCallback();
    }
  }

  return {
    enqueue(dataArray) {
      dataArray.forEach(data => {
        if (!cache.has(data[key])) {
          cache.set(data[key], true); // 将数据存入缓存

          // 仅将未在缓存中的数据加入队列
          dataQueue.push(data);
        }
      });

      // 尝试处理队列
      processQueue();
    },
    getQueue() {
      return [...dataQueue]; // 返回队列的浅拷贝
    },
  };
}
