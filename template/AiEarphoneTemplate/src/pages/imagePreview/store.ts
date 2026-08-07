let pendingImageUrl = '';

export const setPendingImagePreviewUrl = (url: string) => {
  pendingImageUrl = url || '';
};

export const consumePendingImagePreviewUrl = () => {
  const url = pendingImageUrl;
  pendingImageUrl = '';
  return url;
};
