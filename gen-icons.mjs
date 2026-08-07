// 生成日历图标 SVG 到 icons/ 目录（GitHub Pages 静态托管用）
// 用法: node gen-icons.mjs [天数] [颜色用逗号分隔]
import { writeFileSync, mkdirSync } from 'node:fs';

// 扁平贴纸风色板（复刻 svgrepo 日历：白卡 + 粗深色描边 + 彩色顶条 + 打孔圆点）
// bar = 顶条色（浅彩）、edge = 描边/文字深色（每色同色系和谐深浅配）
const COLORS = {
  green: { bar: '#7FC8A9', edge: '#3E6B5A' }, // 薄荷绿
  red: { bar: '#EC8BA5', edge: '#6B3A48' }, // 草莓粉
  blue: { bar: '#93B8DC', edge: '#3E5670' }, // 雾霾蓝
  orange: { bar: '#F0B27A', edge: '#6E4A28' }, // 杏桃橙
  purple: { bar: '#B3A0D9', edge: '#4E3F66' }, // 灰雾紫
  gray: { bar: '#BDB7B0', edge: '#57534D' }, // 雾灰
};
const FONT = "'Microsoft YaHei', '微软雅黑', sans-serif";

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function svg(y, m, d, color) {
  const { bar, edge } = COLORS[color];
  const month = MONTHS[m - 1];
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const dots = [118, 256, 394]
    .map((x) => `<circle cx="${x}" cy="112" r="22" fill="#FFFFFF"/><circle cx="${x}" cy="112" r="22" fill="none" stroke="${edge}" stroke-width="8"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 512 512">
  <rect x="24" y="24" width="464" height="464" rx="56" fill="#FFFFFF" stroke="#D8D5D0" stroke-width="3"/>
  <path d="M24 80 Q24 24 80 24 H432 Q488 24 488 80 V196 H24 Z" fill="${bar}"/>
  ${dots}
  <text x="256" y="330" font-size="150" fill="${edge}" text-anchor="middle" font-family="${FONT}">${d}</text>
  <text x="256" y="380" font-size="36" fill="${edge}" text-anchor="middle" letter-spacing="2" font-family="${FONT}">${weekday}</text>
  <text x="256" y="420" font-size="34" fill="${edge}" text-anchor="middle" letter-spacing="4" font-family="${FONT}">${month}</text>
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
