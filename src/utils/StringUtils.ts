export function removeSpaces(text: string | null | undefined) {
  return text?.replaceAll(' ', '');
}

export function basename(filename: string | null | undefined) {
  return filename?.split('.')[0];
}

export function extension(filename: string | null | undefined) {
  return filename?.split('.').slice(1).join('.');
}

/** An undefined length (a list that hasn't loaded) reads as plural. */
export function pluralize(word: string, length: number | undefined) {
  return length === 1 ? word : `${word}s`;
}
