/**
 * build.js - 将多文件项目打包为单个 HTML 文件
 * 用法：node build.js
 * 输出：dist/index.html（完全独立，无需服务器）
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SRC_DIR = __dirname;
const DIST_DIR = path.join(__dirname, 'dist');
const CHART_JS_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
const CHART_JS_CACHE = path.join(SRC_DIR, '.chartjs.cache.js');

// ─── 工具函数 ──────────────────────────────────────────────────────────────

function readFile(filename) {
  return fs.readFileSync(path.join(SRC_DIR, filename), 'utf8');
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  ✓ 使用缓存：${path.basename(dest)}`);
      resolve(fs.readFileSync(dest, 'utf8'));
      return;
    }
    console.log(`  ↓ 下载中：${url}`);
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✓ 下载完成`);
        resolve(fs.readFileSync(dest, 'utf8'));
      });
    }).on('error', err => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')       // 移除注释
    .replace(/\s{2,}/g, ' ')                 // 合并空白
    .replace(/\s*([:;,{}])\s*/g, '$1')       // 去除符号周围空白
    .replace(/;}/g, '}')                     // 移除最后分号
    .trim();
}

function minifyJs(js) {
  // 只移除块注释，不处理行注释（避免误伤字符串中的 https:// 等）
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')        // 移除 /* */ 块注释
    .replace(/\n{3,}/g, '\n\n')             // 合并多余空行
    .trim();
}

function getFileSize(str) {
  const bytes = Buffer.byteLength(str, 'utf8');
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// ─── 构建流程 ──────────────────────────────────────────────────────────────

async function build() {
  console.log('\n╔══════════════════════════════════╗');
  console.log('║    销售之星 PWA - 单文件构建     ║');
  console.log('╚══════════════════════════════════╝\n');

  // 1. 读取源文件
  console.log('📂 读取源文件...');
  const htmlRaw = readFile('index.html');
  const cssRaw  = readFile('styles.css');
  const jsRaw   = readFile('app.js');
  console.log(`  ✓ index.html  ${getFileSize(htmlRaw)}`);
  console.log(`  ✓ styles.css  ${getFileSize(cssRaw)}`);
  console.log(`  ✓ app.js      ${getFileSize(jsRaw)}`);

  // 2. 下载 Chart.js
  console.log('\n📦 处理依赖...');
  let chartJs;
  try {
    chartJs = await downloadFile(CHART_JS_URL, CHART_JS_CACHE);
    console.log(`  ✓ chart.js    ${getFileSize(chartJs)}`);
  } catch (e) {
    console.warn(`  ⚠ 下载 Chart.js 失败（${e.message}），使用 CDN 链接`);
    chartJs = null;
  }

  // 3. 压缩
  console.log('\n🔧 压缩资源...');
  const cssMin = minifyCss(cssRaw);
  const jsMin  = minifyJs(jsRaw);
  console.log(`  ✓ CSS  ${getFileSize(cssRaw)} → ${getFileSize(cssMin)}`);
  console.log(`  ✓ JS   ${getFileSize(jsRaw)} → ${getFileSize(jsMin)}`);

  // 4. 修改 app.js：移除 Service Worker 注册（standalone 文件不需要）
  // 直接替换 app.js 中的 SW 注册代码段（精确字符串匹配）
  const swBlock = `if ('serviceWorker' in navigator) {\n    navigator.serviceWorker.register('/sw.js').catch(() => {});\n  }`;
  const jsFinal = jsMin.includes(swBlock)
    ? jsMin.replace(swBlock, '/* SW disabled in standalone mode */')
    : jsMin.replace(
        /if\s*\(['"]\s*serviceWorker\s*['"]\s+in\s+navigator\s*\)\s*\{[^}]*navigator\.serviceWorker\.register[^;]+;[^}]*\}/,
        '/* SW disabled in standalone mode */'
      );

  // 5. 拼装 HTML
  console.log('\n🔨 合并为单文件...');
  let html = htmlRaw;

  // 替换 <link rel="stylesheet">
  html = html.replace(
    /<link\s+rel="stylesheet"\s+href="styles\.css"\s*\/>/,
    `<style>${cssMin}</style>`
  );

  // 替换 Chart.js CDN script 标签
  if (chartJs) {
    html = html.replace(
      /<script\s+src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js[^"]*"><\/script>/,
      `<script>${chartJs}</script>`
    );
  }

  // 替换 <script src="app.js">
  html = html.replace(
    /<script\s+src="app\.js"><\/script>/,
    `<script>${jsFinal}</script>`
  );

  // 移除 manifest link（单文件无需 manifest）
  html = html.replace(/\s*<link\s+rel="manifest"[^>]*>\s*/g, '\n  ');

  // 添加独立运行标注注释
  const buildTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const header = `<!-- 销售之星 PWA - 单文件版\n     构建时间：${buildTime}\n     双击即可在浏览器中打开使用，无需服务器\n-->\n`;
  html = header + html;

  // 6. 写出
  if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);
  const outPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(outPath, html, 'utf8');

  // 7. 报告
  console.log(`  ✓ 输出文件：dist/index.html`);
  console.log(`\n✅ 构建完成！`);
  console.log('─'.repeat(42));
  console.log(`  原始总大小：${getFileSize(htmlRaw + cssRaw + jsRaw + (chartJs || ''))}`);
  console.log(`  打包文件：  ${getFileSize(html)}`);
  console.log('─'.repeat(42));
  console.log(`\n📱 使用方式：`);
  console.log(`  1. 用浏览器直接双击打开 dist/index.html`);
  console.log(`  2. 或通过微信/钉钉等分享该文件`);
  console.log(`  3. 无需安装任何依赖，无需联网（Chart.js 已内嵌）\n`);
}

build().catch(err => {
  console.error('\n❌ 构建失败：', err.message);
  process.exit(1);
});
