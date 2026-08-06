// 生成日历图标 SVG 到 icons/ 目录（GitHub Pages 静态托管用）
// 用法: node gen-icons.mjs [天数] [颜色用逗号分隔]
import { writeFileSync, mkdirSync } from 'node:fs';

// Fluent Design 色板（低饱和莫兰迪/奶油调）：accent = 氛围光/强调色、dark = 同色系深一档（第二光晕）
// 全局共享：暖灰渐变背景、深蓝灰墨色（日期主视觉）、半透明白磨砂卡片
const COLORS = {
  green: { accent: '#A3CFC5', dark: '#5E9E96' }, // 浅松石绿
  red: { accent: '#DCACA8', dark: '#B97A78' }, // 灰豆沙红
  blue: { accent: '#A5BFD9', dark: '#6E93B8' }, // 雾霾蓝
  orange: { accent: '#E5C09A', dark: '#C29158' }, // 杏桃沙
  purple: { accent: '#B6A8D8', dark: '#8D7FB8' }, // 灰雾紫
  gray: { accent: '#B4BDC3', dark: '#7E8A92' }, // 中性雾灰
};
const BG_TOP = '#F6F4F0';
const BG_BOTTOM = '#ECE8E1';
const INK = '#2E3B45'; // 日期主视觉墨色
const MUTED = 'rgba(46, 59, 69, 0.66)'; // 月份
const FAINT = 'rgba(46, 59, 69, 0.5)'; // 星期
const FONT = "-apple-system, 'Segoe UI', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif";

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function svg(y, m, d, color) {
  const { accent, dark } = COLORS[color];
  const month = MONTHS[m - 1];
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BG_TOP}"/>
      <stop offset="1" stop-color="${BG_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.6"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${dark}" stop-opacity="0.4"/>
      <stop offset="0.6" stop-color="${dark}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${dark}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="36"/>
    </filter>
    <filter id="frost" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="grain" x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.04 0 0 0 0 0.05 0 0 0 0 0.07 0 0 0 0.05 0"/>
    </filter>
    <clipPath id="cardClip">
      <rect x="16" y="16" width="480" height="480" rx="56"/>
    </clipPath>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="104" cy="104" r="230" fill="url(#glowA)" filter="url(#soft)"/>
  <circle cx="428" cy="436" r="250" fill="url(#glowB)" filter="url(#soft)"/>
  <rect x="18" y="30" width="476" height="476" rx="54" fill="#3E4C55" opacity="0.16" filter="url(#soft)"/>
  <g clip-path="url(#cardClip)" filter="url(#frost)">
    <rect width="512" height="512" fill="url(#bg)"/>
    <circle cx="104" cy="104" r="230" fill="url(#glowA)"/>
    <circle cx="428" cy="436" r="250" fill="url(#glowB)"/>
  </g>
  <rect x="16" y="16" width="480" height="480" rx="56" fill="rgba(255,255,255,0.55)"/>
  <rect x="16" y="16" width="480" height="480" rx="56" clip-path="url(#cardClip)" filter="url(#grain)"/>
  <rect x="16.5" y="16.5" width="479" height="479" rx="55.5" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
  <rect x="234" y="108" width="44" height="4" rx="2" fill="${accent}" opacity="0.65"/>
  <text x="256" y="90" font-size="40" font-weight="600" fill="${MUTED}" text-anchor="middle" letter-spacing="4" font-family="${FONT}">${month}</text>
  <text x="256" y="440" font-size="250" font-weight="700" fill="${INK}" text-anchor="middle" font-family="${FONT}">${d}</text>
  <text x="256" y="496" font-size="38" font-weight="500" fill="${FAINT}" text-anchor="middle" letter-spacing="2" font-family="${FONT}">${weekday}</text>
</svg>`;
}

const days = Number(process.argv[2] || 90);
const colors = (process.argv[3] || 'green,red,blue,orange,purple,gray').split(',');

for (let i = 0; i < days; i++) {
  const t = new Date(Date.now() + i * 864e5);
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const d = String(t.getDate()).padStart(2, '0');
  for (const c of colors) {
    mkdirSync(`icons/${y}-${m}-${d}`, { recursive: true });
    writeFileSync(`icons/${y}-${m}-${d}/${c}.svg`, svg(y, m, d, c));
  }
}
console.log(`generated ${days * colors.length} icons -> icons/`);
