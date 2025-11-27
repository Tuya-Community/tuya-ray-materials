const aiFilterEventIdMap = new Map();

export const getAiFilterEventId = (id: string) => {
  return aiFilterEventIdMap.get(id);
};

export const addAiFilterEventId = (id: string, value: any) => {
  aiFilterEventIdMap.set(id, value);
};

export const removeAiFilterEventId = (id: string) => {
  aiFilterEventIdMap.delete(id);
};

export const hasAiFilterEventId = (id: string) => {
  return aiFilterEventIdMap.has(id);
};

export const clearAiFilterEventId = () => {
  aiFilterEventIdMap.clear();
};
