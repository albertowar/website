/**
 * Pixel art as SVG: a bitmap is rows of characters, each character a key into a colour legend
 * ('.' or any key missing from the legend is transparent). Each colour becomes one path of merged
 * horizontal runs, so a sprite stays a handful of nodes however many cells it has.
 */
export function toPaths(g: string[][], keys: Record<string, string>) {
  return Object.keys(keys)
    .map((k) => {
      let d = '';
      g.forEach((row, y) => {
        let x = 0;
        while (x < row.length) {
          if (row[x] !== k) {
            x++;
            continue;
          }
          let n = 1;
          while (x + n < row.length && row[x + n] === k) n++;
          d += `M${x} ${y}h${n}v1h-${n}z`;
          x += n;
        }
      });
      return { fill: keys[k], d };
    })
    .filter((p) => p.d);
}

/** The single path of a one-colour bitmap drawn with '#'. */
export const iconPath = (map: readonly string[]) => toPaths(map.map((r) => [...r]), { '#': 'currentColor' })[0]?.d ?? '';
