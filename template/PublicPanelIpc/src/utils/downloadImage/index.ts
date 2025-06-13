export function getFileNameByUrl(url: string): string {
  if (!url) return '';
  const fileName = url.split('?')[0].split('/').pop();
  return fileName;
}
