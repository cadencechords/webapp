export function removeSpaces(text: string | null | undefined) {
  return text?.replaceAll(' ', '');
}

export function basename(filename: string | null | undefined) {
  return filename?.split('.')[0];
}

export function extension(filename: string | null | undefined) {
  return filename?.split('.').slice(1).join('.');
}

export function pluralize(word: string, length: number) {
  return length === 1 ? word : `${word}s`;
}
