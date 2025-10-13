export function generateFace(size, { faceColor, textColor, text }) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = faceColor;
  ctx.fillRect(0, 0, size, size);
  ctx.font = `${size * 0.7}px sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const m = ctx.measureText(text);
  ctx.fillText(
    text,
    (size - m.actualBoundingBoxRight + m.actualBoundingBoxLeft) / 2,
    (size - m.actualBoundingBoxDescent + m.actualBoundingBoxAscent) / 2,
  );
  return canvas;
}
