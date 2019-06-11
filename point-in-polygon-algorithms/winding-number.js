/*
 * 回转数法（角度累加法）
 * http://en.wikipedia.org/wiki/Winding_number
 */
function windingNumber (p, poly) {
  let px = p.x
  let py = p.y
  let sum = 0

  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    let sx = poly[i].x
    let sy = poly[i].y
    let tx = poly[j].x
    let ty = poly[j].y

    // 点与多边形顶点重合或在多边形的边上
    if ((sx - px) * (px - tx) >= 0 && (sy - py) * (py - ty) >= 0 && (px - sx) * (ty - sy) === (py - sy) * (tx - sx)) {
      return 'on'
    }

    let angle = Math.atan2(sy - py, sx - px) - Math.atan2(ty - py, tx - px)

    // 确保点与多边形相邻顶点连线的夹角在 -180 度（-π）到 180 度（π）之间
    if (angle >= Math.PI) {
      angle = angle - Math.PI * 2
    } else if (angle <= -Math.PI) {
      angle = angle + Math.PI * 2
    }
    sum += angle
  }

  // 夹角和为 0 度时点在多边形外，否则点在多边形内
  return Math.round(sum / Math.PI) === 0 ? 'out' : 'in'
}
