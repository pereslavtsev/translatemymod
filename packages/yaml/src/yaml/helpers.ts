export function removeBOM(data: string) {
  return data.replace(/^\uFEFF/gm, '');
}

export function addBOM(data: string) {
  return `\ufeff${data}`;
}
