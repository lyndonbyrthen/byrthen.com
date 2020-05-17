export const getRainbowArray = (count:number) => {
    const rainbow = [];

    for (let i = 0; i < count; i++) {
      const f = i / count;
      const a = (1 - f) / .2;
      const x = Math.floor(a);
      const y = Math.floor(255 * (a - x));

      let r=0, g=0, b=0;

      switch (x) {
        case 0: r = 255; g = y; b = 0; break;
        case 1: r = 255 - y; g = 255; b = 0; break;
        case 2: r = 0; g = 255; b = y; break;
        case 3: r = 0; g = 255 - y; b = 255; break;
        case 4: r = y; g = 0; b = 255; break;
        case 5: r = 255; g = 0; b = 255; break;
        default: break;
      }

      rainbow[i] = [r, g, b];
    }

    return rainbow;
}

export const getRgbaStr = (rgb:number[], a:number) => `rgba(${[...rgb,a].join(',')})`;
