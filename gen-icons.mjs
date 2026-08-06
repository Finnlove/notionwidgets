// 生成日历图标 SVG 到 icons/ 目录（GitHub Pages 静态托管用）
// 用法: node gen-icons.mjs [天数] [颜色用逗号分隔]
import { writeFileSync, mkdirSync } from 'node:fs';

// 粉彩糖果色板：main = 顶部色条主色、deep = 深色（文字/描边/波谷小圆点）、light = 彩虹点缀
// 全局共享中性色：奶白渐变卡片、暖棕墨色（眼睛/日期）、腮红粉
const COLORS = {
  green: { main: '#6FD6A8', deep: '#2FA97C', light: '#A8EAC9' }, // 薄荷绿
  red: { main: '#FF8FA6', deep: '#E05270', light: '#FFC2D0' }, // 草莓粉
  blue: { main: '#7CC6F2', deep: '#3B93D4', light: '#B3E2FA' }, // 天蓝
  orange: { main: '#FFB877', deep: '#EF8A3C', light: '#FFD9A8' }, // 蜜桃橙
  purple: { main: '#B78BF0', deep: '#8A55D8', light: '#D9C0F7' }, // 淡紫
  gray: { main: '#AEB9C4', deep: '#6E7B88', light: '#D3DBE2' }, // 雾灰蓝
};
const CREAM_TOP = '#FFFDF8';
const CREAM_BOTTOM = '#FFEDDC';
const INK = '#4E3D33'; // 暖棕墨色：眼睛 + 大号日期
const BLUSH = '#FFB7C9'; // 腮红粉
const FONT = "-apple-system, 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif";

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function svg(y, m, d, color) {
  const { main, deep } = COLORS[color];
  const month = MONTHS[m - 1];
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const trimDots = [32, 96, 160, 224, 288, 352, 416, 480]
    .map((x) => `<circle cx="${x}" cy="168" r="6" fill="${deep}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${CREAM_TOP}"/>
      <stop offset="1" stop-color="${CREAM_BOTTOM}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="72" fill="url(#g)"/>
  <rect width="512" height="188" rx="72" fill="${main}"/>
  <path d="M0 150 H512 Q480 186 448 150 Q416 186 384 150 Q352 186 320 150 Q288 186 256 150 Q224 186 192 150 Q160 186 128 150 Q96 186 64 150 Q32 186 0 150 Z" fill="#fff"/>
  ${trimDots}
  <path d="M52 20 C54 36 62 44 78 46 C62 48 54 56 52 72 C50 56 42 48 26 46 C42 44 50 36 52 20 Z" fill="#fff" opacity="0.95"/>
  <path d="M438 112 A14 14 0 0 1 466 112" stroke="${deep}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M443 112 A9 9 0 0 1 461 112" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M448 112 A4 4 0 0 1 456 112" stroke="${main}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" transform="translate(438 32) scale(1.17)" fill="#fff" opacity="0.95"/>
  <text x="256" y="115" font-size="88" fill="${deep}" opacity="0.35" text-anchor="middle" font-weight="800" letter-spacing="6" font-family="${FONT}">${month}</text>
  <text x="256" y="112" font-size="88" fill="#fff" text-anchor="middle" font-weight="800" letter-spacing="6" font-family="${FONT}">${month}</text>
  <path d="M144 218 Q172 204 200 218" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M312 218 Q340 204 368 218" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="172" cy="262" r="30" fill="${INK}"/>
  <circle cx="162" cy="250" r="11" fill="#fff"/>
  <circle cx="183" cy="273" r="5.5" fill="#fff"/>
  <circle cx="342" cy="262" r="30" fill="${INK}"/>
  <circle cx="352" cy="250" r="11" fill="#fff"/>
  <circle cx="331" cy="273" r="5.5" fill="#fff"/>
  <ellipse cx="106" cy="300" rx="27" ry="16" fill="${BLUSH}" opacity="0.9"/>
  <ellipse cx="406" cy="300" rx="27" ry="16" fill="${BLUSH}" opacity="0.9"/>
  <path d="M224 290 Q256 318 288 290" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <text x="256" y="460" font-size="205" fill="${INK}" text-anchor="middle" font-weight="800" font-family="-apple-system, sans-serif">${d}</text>
  <text x="256" y="504" font-size="44" fill="${deep}" text-anchor="middle" font-weight="700" font-family="${FONT}">${weekday}</text>
  <rect x="10" y="10" width="492" height="492" rx="64" fill="none" stroke="${deep}" stroke-width="8" opacity="0.16"/>
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
