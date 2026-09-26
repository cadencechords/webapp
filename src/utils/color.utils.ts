export function setAlpha(color, alpha) {
  let rgba = color.match(/[\d.]+/g);

  if (rgba.length !== 4) {
    return color;
  }

  rgba[3] = alpha;
  return 'rgba(' + rgba.join(',') + ')';
}

export function getThemeAwareAnnotationColor(annotationColor, isDark) {
  let [r, g, b, a] = annotationColor.match(/[\d.]+/g);

  if (isDark && isBlack([r, g, b])) {
    return `rgba(255,255,255,${a})`;
  } else if (!isDark && isWhite([r, g, b])) {
    return `rgba(0,0,0,${a})`;
  }

  return annotationColor;
}

function isBlack([r, g, b]) {
  return r === '0' && g === '0' && b === '0';
}

function isWhite([r, g, b]) {
  return r === '255' && g === '255' && b === '255';
}
