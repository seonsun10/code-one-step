import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const staticHeaders = await readFile(new URL('../_headers', import.meta.url), 'utf8');
const buildScript = await readFile(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
const mainScript = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const initialThemeScript = await readFile(new URL('../src/theme.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('primary Korean learning copy stays at least 14px', () => {
  assert.match(styles, /--reading-min:\s*14px/);
  assert.match(styles, /\.page-content\s+:is\([\s\S]*?\)\s*\{\s*font-size:\s*max\(var\(--reading-min\),\s*1em\)/);
  const readableControls = styles.match(/\.page-content\s+:is\(([\s\S]*?)\)\s*\{\s*font-size:\s*max\(var\(--reading-min\),\s*1em\)/)?.[1];
  assert.ok(readableControls?.includes('.answer-textarea'), 'Short answers should use the readable text size');
  assert.ok(readableControls?.includes('.code-editor'), 'The code editor should use the readable text size');
});

test('small screens use the fixed three-item mobile navigation', () => {
  assert.match(styles, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.mobile-nav\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/);
  assert.match(styles, /\.mobile-nav\s+\.nav-link\s*\{[^}]*font-size:\s*14px/);
});

test('the visible brand and feedback link use the selected public project', () => {
  assert.match(html, /<title>코드한걸음 — 배우고, 풀고, 이어가기<\/title>/);
  assert.match(mainScript, /aria-label="코드한걸음 내 학습실"/);
  assert.match(mainScript, /https:\/\/github\.com\/seonsun10\/code-one-step\/issues\/new\/choose/);
  assert.match(mainScript, /target="_blank" rel="noopener noreferrer" aria-label="GitHub에서 학습 오류나 접근성 문제 제보하기 \(GitHub 로그인 필요\)"/);
});

function hexColor(value) {
  return value.match(/[0-9a-f]{2}/gi).map((channel) => Number.parseInt(channel, 16));
}

function contrastRatio(foreground, background) {
  const luminance = (color) => {
    const channels = color.map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test('muted and feedback text tokens meet WCAG AA on their light surfaces', () => {
  const tokenColor = (name) => {
    const value = styles.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
    assert.ok(value, `Missing ${name} contrast token`);
    return hexColor(value);
  };
  const pairs = [
    ['--text-muted', '#ffffff'],
    ['--text-muted', '#f6f7f9'],
    ['--text-muted', '#fffaf0'],
    ['--text-muted', '#eff9f3'],
    ['--text-success', '#eff9f3'],
    ['--text-success', '#e8f6ee'],
    ['--text-review', '#fffaf0'],
    ['--text-review', '#f8edcf'],
    ['--text-danger', '#ffffff'],
    ['--text-danger', '#fff0ee'],
  ];
  for (const [token, background] of pairs) {
    assert.ok(contrastRatio(tokenColor(token), hexColor(background)) >= 4.5, `${token} is too faint on ${background}`);
  }
});

test('dark appearance text tokens meet WCAG AA on their matching surfaces', () => {
  const darkRoot = styles.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)?.[1];
  assert.ok(darkRoot, 'Missing dark theme token group');
  const tokenColor = (name) => {
    const value = darkRoot.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
    assert.ok(value, `Missing dark ${name} contrast token`);
    return hexColor(value);
  };
  const pairs = [
    ['--text-primary', '#1a2029'],
    ['--text-muted', '#11151b'],
    ['--text-muted', '#1a2029'],
    ['--text-success', '#1b3328'],
    ['--text-review', '#382f1e'],
    ['--text-danger', '#1a2029'],
  ];
  for (const [token, background] of pairs) {
    assert.ok(contrastRatio(tokenColor(token), hexColor(background)) >= 4.5, `${token} is too faint on ${background}`);
  }
});

test('theme control follows the device by default and stores an explicit light or dark choice locally', () => {
  assert.match(html, /<script src="\.\/src\/theme\.js"><\/script>\s*<link rel="stylesheet"/);
  assert.match(initialThemeScript, /prefers-color-scheme:\s*dark/);
  assert.match(initialThemeScript, /localStorage\.getItem\(themeKey\)/);
  assert.doesNotMatch(initialThemeScript, /addEventListener\(['"]change['"]/);
  assert.match(mainScript, /data-action="theme"/);
  assert.match(mainScript, /localStorage\.setItem\(themePreferenceKey, themePreference\)/);
  assert.match(mainScript, /systemColorScheme\?\.addEventListener\(['"]change['"]/);
  assert.match(mainScript, /기기 설정/);
  assert.match(mainScript, /어둡게/);
});

test('all current tracks are visible and a new learner starts from the stage overview', () => {
  assert.match(mainScript, /tracks\.map\(trackCard\)/);
  assert.match(mainScript, /tracks\.map\(\(track\) => `<a class="track-nav-link"/);
  assert.doesNotMatch(mainScript, /tracks\.slice\(0,\s*[34]\)/);
  assert.match(mainScript, /stats\.done === 0 \? `#\/track\/\$\{track\.id\}`/);
});

test('static release headers isolate the runner while keeping its parent frame usable', () => {
  assert.match(staticHeaders, /X-Content-Type-Options:\s*nosniff/);
  assert.match(staticHeaders, /Referrer-Policy:\s*strict-origin-when-cross-origin/);
  assert.match(staticHeaders, /Permissions-Policy:\s*camera=\(\), microphone=\(\), geolocation=\(\)/);
  assert.match(staticHeaders, /connect-src 'none';[^\n]*frame-ancestors 'self'/);
  for (const route of ['/public/runner-frame.html', '/public/runner-frame']) {
    const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(
      staticHeaders,
      new RegExp(`(?:^|\\n)${escapedRoute}\\r?\\n\\s+Content-Security-Policy: default-src 'none';[^\\n]*connect-src 'none';[^\\n]*frame-ancestors 'self'`, 'm'),
      `Both the .html and clean URL runner routes need the isolated CSP (${route})`,
    );
  }
  assert.match(buildScript, /cp\(resolve\(projectRoot, '_headers'\), resolve\(outputDirectory, '_headers'\)\)/);
  assert.match(buildScript, /await rm\(outputDirectory, \{ recursive: true, force: true \}\)/);
});
