export function setAlpha(color, alpha) {
  let rgba = color.match(/[\d.]+/g);

  if (rgba.length !== 4) {
    return color;
  }

  rgba[3] = alpha;
  return 'rgba(' + rgba.join(',') + ')';
}
