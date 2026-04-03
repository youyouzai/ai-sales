const fs = require('fs');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(sz => {
  const rx = Math.round(sz * 0.18);
  const fs2 = Math.round(sz * 0.55);
  const fs3 = Math.round(sz * 0.12);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0c29"/>
      <stop offset="50%" style="stop-color:#302b63"/>
      <stop offset="100%" style="stop-color:#24243e"/>
    </linearGradient>
  </defs>
  <rect width="${sz}" height="${sz}" rx="${rx}" fill="url(#g)"/>
  <circle cx="${sz/2}" cy="${sz*0.42}" r="${sz*0.28}" fill="rgba(108,99,255,0.3)"/>
  <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-size="${fs2}" font-family="serif">⭐</text>
  <text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" font-size="${fs3}" font-family="Arial,sans-serif" fill="#a78bfa" font-weight="bold">销售之星</text>
</svg>`;
  fs.writeFileSync(`icons/icon-${sz}.svg`, svg);
  console.log(`Created icon-${sz}.svg`);
});
console.log('Done!');
