// Annotation colors are always `rgba(r,g,b,a)` strings (the toolbar's palette
// and saved paths), so matching their numbers never returns null.

export function setAlpha(color: string, alpha: number) {
  // Non-null: an rgba() color has numbers to match (see the top of the file).
  const rgba: (string | number)[] = color.match(/[\d.]+/g)!;

  if (rgba.length !== 4) {
    return color;
  }

  rgba[3] = alpha;
  return 'rgba(' + rgba.join(',') + ')';
}

export function getThemeAwareAnnotationColor(
  annotationColor: string,
  isDark: boolean
) {
  // Non-null: an rgba() color has numbers to match (see the top of the file).
  const [r, g, b, a] = annotationColor.match(/[\d.]+/g)!;

  if (isDark && isBlack([r, g, b])) {
    return `rgba(255,255,255,${a})`;
  } else if (!isDark && isWhite([r, g, b])) {
    return `rgba(0,0,0,${a})`;
  }

  return annotationColor;
}

function isBlack([r, g, b]: string[]) {
  return r === '0' && g === '0' && b === '0';
}

function isWhite([r, g, b]: string[]) {
  return r === '255' && g === '255' && b === '255';
}
