// 生成日历图标 SVG 到 icons/ 目录（GitHub Pages 静态托管用）
// 用法: node gen-icons.mjs [天数] [颜色用逗号分隔]
import { writeFileSync, mkdirSync } from 'node:fs';

const COLORS = {
  green: ['#5fbb97', '#2f8867'],
  red: ['#e86a6a', '#c44f4f'],
  blue: ['#5b9bd5', '#2f6da8'],
  orange: ['#f4a261', '#c87f38'],
  purple: ['#b48ce0', '#8a5fc0'],
  gray: ['#9aa5b1', '#6b7684'],
};

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function svg(y, m, d, color) {
  const [head, dot] = COLORS[color];
  const month = MONTHS[m - 1];
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="57" fill="#efefef"/>
  <rect width="512" height="185" rx="57" fill="${head}"/>
  <circle cx="376" cy="115" r="14" fill="${dot}"/>
  <circle cx="419" cy="115" r="14" fill="${dot}"/>
  <circle cx="462" cy="115" r="14" fill="${dot}"/>
  <text x="32" y="142" font-size="100" fill="#fff" font-family="-apple-system, 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif">${month}</text>
  <text x="256" y="400" font-size="256" fill="#66757f" text-anchor="middle" font-family="-apple-system, sans-serif">${d}</text>
  <text x="256" y="480" font-size="64" fill="#66757f" text-anchor="middle" font-family="-apple-system, 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif">${weekday}</text>
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
