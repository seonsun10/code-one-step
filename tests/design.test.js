import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { tracks } from '../src/content.js';

const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
const staticHeaders = await readFile(new URL('../_headers', import.meta.url), 'utf8');
const buildScript = await readFile(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
const mainScript = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const storageScript = await readFile(new URL('../src/storage.js', import.meta.url), 'utf8');
const curriculumTools = await readFile(new URL('../src/curriculum-tools.js', import.meta.url), 'utf8');
const designRules = await readFile(new URL('../docs/rules/design.md', import.meta.url), 'utf8');
const initialThemeScript = await readFile(new URL('../src/theme.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const trackIconIds = ['javascript', 'python', 'java', 'spring', 'react', 'nextjs', 'kotlin', 'csharp', 'typescript', 'postgresql'];
const trackIcons = Object.fromEntries(await Promise.all(trackIconIds.map(async (id) => [
  id,
  await readFile(new URL(`../public/tracks/${id}.svg`, import.meta.url), 'utf8'),
])));

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

function themeTokens(selector) {
  const group = styles.match(new RegExp(selector + '\\s*\\{([^}]+)\\}'))?.[1];
  assert.ok(group, 'Missing theme group ' + selector);
  return Object.fromEntries([...group.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)].map((match) => [match[1], match[2]]));
}

test('reading sizes, buttons, and code use the readable editorial scale', () => {
  assert.match(styles, /--reading-min:\s*16px/);
  assert.match(styles, /html\s*\{[^}]*min-width:\s*0/);
  assert.match(styles, /body\s*\{[^}]*font-size:\s*16px/);
  assert.match(styles, /body\s*\{[^}]*min-width:\s*0/);
  assert.match(styles, /\.lesson-body-copy\s*>\s*p\s*\{[^}]*font-size:\s*17px/);
  assert.match(styles, /\.exercise-question-copy\s*\{[^}]*font-size:\s*18px/);
  assert.match(styles, /\.choice-text\s*\{[^}]*font-size:\s*16px/);
  assert.match(styles, /\.editor-shell \.cm-editor\s*\{[^}]*font:\s*15px/);
  assert.match(styles, /--radius-control:\s*6px/);
  assert.match(styles, /--radius-alert:\s*8px/);
  assert.match(styles, /\.repair-criteria-section\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
  assert.match(styles, /\.toast\s*\{[^}]*border-radius:\s*var\(--radius-alert\)/);
  assert.match(styles, /font-family:.*Pretendard.*SUIT.*Noto Sans KR/);
  assert.match(styles, /\.button\s*\{[^}]*min-height:\s*46px/);
});

test('route changes return to the top while same-page rerenders keep scroll position', () => {
  assert.match(mainScript, /const routeChanged = routeKey !== renderedRouteKey;/);
  assert.match(mainScript, /history\.scrollRestoration = 'manual'/);
  assert.match(mainScript, /if \(routeChanged\) window\.scrollTo\(0, 0\);/);
  assert.doesNotMatch(styles, /html\s*\{[^}]*scroll-behavior:\s*smooth/);
  assert.ok(mainScript.indexOf('app.innerHTML = shell(route.page, content);') < mainScript.indexOf('if (routeChanged) window.scrollTo(0, 0);'));
  assert.ok(mainScript.indexOf('heading.focus({ preventScroll: true });') < mainScript.indexOf('if (routeChanged) window.scrollTo(0, 0);'));
});

test('topbar text and divider align with the page content at each responsive width', () => {
  assert.match(styles, /\.app-column\s*\{[^}]*--content-gutter:\s*clamp\(22px,\s*4vw,\s*56px\);[^}]*--content-inset:\s*max\(var\(--content-gutter\),\s*calc\(\(100%\s*-\s*1160px\)\s*\/\s*2\s*\+\s*var\(--content-gutter\)\)\)/);
  assert.match(styles, /\.topbar\s*\{[^}]*padding:\s*8px\s+var\(--content-inset\)/);
  assert.match(styles, /\.topbar\s*\{[^}]*border-bottom:\s*0/);
  assert.match(styles, /\.topbar::after\s*\{[^}]*left:\s*var\(--content-inset\);[^}]*right:\s*var\(--content-inset\)/);
  assert.match(styles, /\.page-content\s*\{[^}]*padding:\s*42px\s+var\(--content-gutter\)\s+56px/);
  assert.match(styles, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.app-column\s*\{[^}]*--content-gutter:\s*20px/);
  assert.match(styles, /@media\s*\(max-width:\s*390px\)[\s\S]*?\.app-column\s*\{[^}]*--content-gutter:\s*16px/);
});

test('the home activity and example stack when the desktop navigation leaves less content width', () => {
  assert.match(styles, /@media\s*\(max-width:\s*900px\)\s*\{[^}]*\.home-dashboard-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);\s*gap:\s*0/);
  assert.match(styles, /@media\s*\(max-width:\s*900px\)\s*\{[\s\S]*?\.home-dashboard-grid\s*>\s*\.home-section\s*\+\s*\.home-section\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
});

test('home examples follow the learner’s next level and use code or text styling that fits the example', () => {
  const javascriptArrayLesson = tracks.find((track) => track.id === 'javascript').lessons.find((lesson) => lesson.id === 'js-arrays');
  assert.equal(javascriptArrayLesson.example.split('\n').length, 6);
  assert.match(javascriptArrayLesson.example, /console\.log\(total\); \/\/ 9$/);
  assert.match(mainScript, /function homeExampleLesson\(track, fallbackLesson, codingProblem\)[\s\S]*?track\.lessons\.find\(\(lesson\) => !isLessonComplete\(lesson\)\)/);
  assert.match(mainScript, /const exampleTrack = codingTrack \?\? resumeTrack/);
  assert.match(mainScript, /const exampleLesson = codingTrack \? homeExampleLesson\(codingTrack, resumeLesson, resumeCodingProblem\) : resumeLesson/);
  assert.match(mainScript, /new Set\(codingProblem\?\.topicIds \?\? \[\]\)/);
  assert.match(mainScript, /const relatedLessons = track\.lessons\.filter\(\(lesson\) => topicIds\.has\(lesson\.topicId\)\)/);
  assert.match(mainScript, /function homeExampleSection\(track, lesson\)/);
  assert.match(mainScript, /const previewLimit = 7;/);
  assert.match(mainScript, /codeBlock\(preview, exampleLanguage, \{ copy: false \}\)/);
  assert.match(mainScript, /codeLanguageId\(exampleLanguage\) !== 'plain'/);
  assert.match(mainScript, /lesson\.difficulty/);
  assert.match(styles, /\.home-example \.code-block-body\s*\{[^}]*max-height:\s*180px/);
  assert.match(styles, /\.home-example-notes\s*\{/);
});

test('the skill picker reveals its lightbulb menu with accessible slide-down behavior', () => {
  assert.match(mainScript, /data-home-skill-toggle aria-expanded="false" aria-controls="home-skill-links" aria-label="배울 주제 보기"/);
  assert.match(mainScript, /class="home-skill-bulb"/);
  assert.match(mainScript, /picker\.classList\.toggle\('is-open', open\)/);
  assert.match(mainScript, /toggle\.setAttribute\('aria-expanded', String\(open\)\)/);
  assert.match(mainScript, /menu\.inert = !open/);
  assert.match(styles, /\.home-skill-grid-clip\s*\{[^}]*grid-template-rows:\s*0fr[^}]*overflow:\s*hidden/);
  assert.match(styles, /\.home-skill-picker\.is-open \.home-skill-grid-clip\s*\{[^}]*grid-template-rows:\s*1fr/);
  assert.match(styles, /\.home-skill-toggle:hover/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('the learning activity grid fills its section and keeps each date easy to target', () => {
  assert.match(styles, /\.activity-calendar-wrap\s*\{[^}]*grid-template-columns:\s*18px minmax\(0,\s*1fr\)/);
  assert.match(styles, /\.activity-calendar\s*\{[^}]*grid-auto-columns:\s*minmax\(0,\s*1fr\);[^}]*width:\s*100%/);
  assert.match(styles, /\.activity-calendar\s*\{[^}]*gap:\s*3px/);
  assert.match(styles, /\.activity-week\s*\{[^}]*gap:\s*3px/);
  assert.match(styles, /\.activity-day\s*\{[^}]*width:\s*100%;[^}]*aspect-ratio:\s*1/);
  assert.match(styles, /@media\s*\(max-width:\s*390px\)[\s\S]*?\.activity-calendar\s*\{[^}]*gap:\s*2px[\s\S]*?\.activity-week\s*\{[^}]*gap:\s*2px/);
});

test('short-answer instructions describe the exact-match grading limit honestly', () => {
  assert.match(mainScript, /자동 채점은 등록된 답안 표현과 비교해요/);
  assert.match(mainScript, /다르게 표현했다면 풀이의 기준 답안과 대조해 보세요/);
  assert.doesNotMatch(mainScript, /표현이 조금 달라도 핵심이 같다면 정답으로 인정해요/);
});

test('code editor has a dedicated high-contrast surface, selection, and focus ring in both themes', () => {
  assert.match(styles, /\.editor-shell \.cm-editor\s*\{[^}]*color:\s*var\(--editor-ink\);\s*background:\s*var\(--editor-bg\)/);
  assert.match(styles, /\.editor-shell \.cm-scroller\s*\{[^}]*overflow:\s*auto/);
  assert.match(styles, /\.editor-shell \.cm-content\s*\{[^}]*caret-color:\s*var\(--editor-ink\)/);
  assert.match(styles, /\.editor-shell \.cm-editor\.cm-focused\s*\{[^}]*outline:\s*3px solid var\(--editor-focus\)/);
  assert.match(styles, /\.editor-shell \.cm-selectionBackground,\s*\.editor-shell \.cm-content ::selection\s*\{[^}]*color:\s*var\(--editor-selection-ink\);\s*background:\s*var\(--editor-selection-bg\)/);
  assert.match(styles, /\.code-block ::selection\s*\{[^}]*color:\s*var\(--code-selection-ink\);[^}]*background:\s*var\(--code-selection-bg\)/);
  assert.match(styles, /\.syntax-keyword\s*\{[^}]*color:\s*var\(--syntax-keyword\)/);
  assert.match(styles, /\.syntax-declaration\s*\{[^}]*color:\s*var\(--syntax-declaration\)/);
  assert.match(styles, /\.editor-shell \.tok-keyword\s*\{[^}]*color:\s*var\(--syntax-keyword\)/);
  const light = themeTokens(':root');
  const dark = themeTokens(':root\\[data-theme="dark"\\]');
  for (const theme of [light, dark]) {
    assert.ok(contrastRatio(hexColor(theme['--editor-selection-ink']), hexColor(theme['--editor-selection-bg'])) >= 4.5);
    assert.ok(contrastRatio(hexColor(theme['--code-selection-ink']), hexColor(theme['--code-selection-bg'])) >= 4.5);
  }
});

test('long code examples scroll vertically with their line numbers instead of being clipped', () => {
  assert.match(styles, /.code-block-body\s*\{[^}]*max-height:\s*420px;[^}]*overflow-x:\s*hidden;[^}]*overflow-y:\s*auto/);
  assert.match(styles, /.code-block-body pre:not\(\.code-block-gutter\)\s*\{[^}]*overflow-x:\s*auto;[^}]*overflow-y:\s*visible/);
  assert.match(styles, /.code-block-gutter\s*\{[^}]*overflow:\s*visible/);
  assert.doesNotMatch(styles, /\.exercise-prompt \.code-block pre\s*\{[^}]*max-height:/);
});

test('common study directions stay available in a compact disclosure', () => {
  assert.match(curriculumTools, /activitiesCollapsed:\s*true/);
  assert.match(mainScript, /session\.activitiesCollapsed\s*\?\s*`<details class="study-activity">/);
  assert.ok(mainScript.includes("sessionIndex === 0 ? '오늘 배울 내용' : `${sessionDayLabel}에 배울 내용`"));
  assert.match(mainScript, /<summary>\$\{activityTitle\} 보기<\/summary>/);
  assert.match(mainScript, /session\.activities\.map\(\(activity\) =>/);
  assert.match(curriculumTools, /예제의 값이나 조건을 한 가지 바꾸고 결과를 예상해요\./);
  assert.match(curriculumTools, /배운 점, 남은 질문, 다시 풀 문제를 별도 노트에 적어요\./);
  assert.doesNotMatch(mainScript, /5회 학습 · 회당 60~90분 기준/);
  assert.match(styles, /\.study-activity > summary\s*\{[^}]*min-height:\s*44px;[^}]*font-size:\s*15px/);
});

test('expanded study sessions are visually distinct beyond the plus and minus icon', () => {
  assert.match(mainScript, /class="study-session-row\$\{sessionIndex === 0 \? ' is-today' : ''\}" \$\{sessionIndex === 0 \? 'open' : ''\}/);
  assert.match(mainScript, /const sessionTitlePrefix = `\$\{session\.number\}일차 · `;/);
  assert.match(mainScript, /const sessionTitle = session\.title\.startsWith\(sessionTitlePrefix\) \? session\.title\.slice\(sessionTitlePrefix\.length\) : session\.title;/);
  assert.match(mainScript, /<strong>\$\{escapeHtml\(sessionTitle\)\}<\/strong>/);
  assert.ok(mainScript.includes("sessionIndex === 0 ? '오늘의 예제' : `${session.number}일차 예제`"));
  assert.ok(mainScript.includes("sessionIndex === 0 ? '오늘의 세 문제' : `${session.number}일차 세 문제`"));
  assert.match(styles, /\.study-session-row\[open\] > summary, \.study-activity\[open\] > summary\s*\{[^}]*background-color:\s*var\(--surface-soft\);[^}]*box-shadow:\s*inset 3px 0 0 var\(--accent\)/);
  assert.match(styles, /\.study-session-row\[open\] > summary\s*\{[^}]*border-bottom:\s*1px solid var\(--line\)/);
  assert.match(styles, /\.study-session-row\[open\] \.study-session-summary strong, \.study-session-row\.is-today\[open\] \.study-exercises-heading\s*\{[^}]*color:\s*var\(--accent\)/);
  assert.doesNotMatch(styles, /\.study-session-row\.is-today\[open\]\s*\{[^}]*border-left:/);
  assert.match(styles, /summary:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--focus\)/);
});

test('study disclosures have breathing room and smoothly open and close', () => {
  assert.match(styles, /\.study-session-row > summary\s*\{[^}]*padding:\s*11px 12px/);
  assert.match(styles, /\.study-session-content\s*\{[^}]*padding:\s*0 12px 18px/);
  assert.match(styles, /\.study-session-row > summary\s*\{[^}]*padding-inline:\s*12px/);
  assert.match(styles, /\.study-session-content\s*\{[^}]*padding-inline:\s*12px/);
  assert.match(styles, /@supports \(interpolate-size: allow-keywords\) and selector\(details::details-content\)\s*\{[\s\S]*?\.study-session-row::details-content, \.study-activity::details-content\s*\{[^}]*height:\s*0;[^}]*overflow:\s*clip;[^}]*transition:\s*height \.32s ease-in-out, content-visibility \.32s ease-in-out allow-discrete;\s*\}[\s\S]*?\.study-session-row\[open\]::details-content, \.study-activity\[open\]::details-content\s*\{[^}]*height:\s*auto/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*transition-duration:\s*\.01ms/);
});

test('the interface uses restrained surfaces instead of gradients or tiny labels', () => {
  assert.doesNotMatch(styles, /linear-gradient|radial-gradient/);
  assert.match(styles, /\.track-index-row\s*\{[^}]*border-bottom:\s*1px solid var\(--line\)/);
  assert.match(styles, /\.stage-row\s*\{[^}]*min-height:/);
  assert.match(styles, /\.lesson-row\s*\{[^}]*min-height:/);
  assert.match(styles, /\.sidebar-label\s*\{[^}]*font-size:\s*14px/);
});

test('learner screens omit internal review status and duplicate course totals', () => {
  assert.doesNotMatch(mainScript, /과정의 예제와 .*을 검수했어요/);
  assert.doesNotMatch(mainScript, /검수된 범위는 과정 진척 문서/);
  assert.doesNotMatch(mainScript, /아직 검수되지 않은 주차는/);
  assert.doesNotMatch(mainScript, /검수 완료 · 브라우저에서 실행 가능한 문제/);
  assert.doesNotMatch(mainScript, /검수와 실행 환경 확인이 끝난 문항/);
  assert.doesNotMatch(mainScript, /버전 표기는 문항을 검수한 기준/);
  assert.doesNotMatch(mainScript, /class="foundations-coming"/);
  assert.match(mainScript, /개념 문제는 각 과정에서 풀 수 있어요/);
});

test('shared navigation and study screens omit repeated or implementation-only copy', () => {
  assert.doesNotMatch(mainScript, /track\.course\.contentStatus/);
  assert.doesNotMatch(mainScript, /완료 \$\{completeCount\}\/\$\{lessons\.length\}주/);
  assert.doesNotMatch(mainScript, /가장 긴 과정은 \$\{longestCourse\}주예요/);
  assert.doesNotMatch(mainScript, /주차별 설명·예제·다섯 번의 연습으로 배워요/);
  assert.doesNotMatch(mainScript, /내 기기에 저장돼요/);
  assert.doesNotMatch(mainScript, /개념을 읽고, 문제를 풀고, 다음에 이어서 공부해요\./);
  assert.doesNotMatch(mainScript, /각 입력 사례의 기대값과 실제 반환값/);
  assert.doesNotMatch(mainScript, /coding-catalog-summary|브라우저에서 실행 가능한 문제/);
  assert.doesNotMatch(mainScript, /직접 작성하고, 실행해서 확인해요/);
  assert.doesNotMatch(mainScript, /\$\{track\.course\.weeks\}주 ·/);
  assert.doesNotMatch(mainScript, /숙달에는 반복 연습과 실제 프로젝트도 필요합니다/);
  assert.doesNotMatch(mainScript, /오늘 \$\{sessionStatus\.completed\}\/3 · 이번 주 \$\{status\.completed\}\/15/);
  assert.doesNotMatch(mainScript, /이 문제의 학습 목표/);
  assert.doesNotMatch(mainScript, /class="coding-workspace-side"|class="coding-runtime-note"/);
  assert.doesNotMatch(mainScript, /새 메모리 PostgreSQL Worker|Pyodide · FastAPI 로컬 Worker|브라우저 Worker 실행/);
  assert.doesNotMatch(mainScript, /PostgreSQL 18\.3 메모리 DB|TypeScript 6\.0\.3 호환 변환기|FastAPI 0\.143\.0과 Python 3\.14\.2/);
});

test('official source lists stay collapsed until the learner opens them', () => {
  const sourceList = mainScript.match(/function sourceList\(review, label = '공식 문서'\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(sourceList, 'The shared study source list should exist');
  assert.match(sourceList, /<details class="content-source"><summary>/);
  assert.doesNotMatch(sourceList, /<details[^>]*\bopen\b/);
  assert.match(sourceList, /<span>\$\{escapeHtml\(label\)\}<\/span>/);
  assert.match(sourceList, /class="content-source-open">보기/);
  assert.match(sourceList, /class="content-source-close">접기/);
  assert.match(sourceList, /review\.sources\.map/);
  assert.match(mainScript, /sourceList\(foundationsTrack\.contentReview, '참고한 공식 문서'\)/);
  assert.match(styles, /\.content-source summary:focus-visible/);
});

test('practice separates the prompt, code, answer controls, feedback, and explanation with editorial rules', () => {
  assert.match(mainScript, /class="exercise-prompt-section"[\s\S]*exercisePromptContent\(exercise\.prompt\)/);
  assert.match(mainScript, /class="answer-section"[\s\S]*exerciseForm\(exercise\)/);
  assert.match(mainScript, /class="solution-disclosure"/);
  assert.match(mainScript, /wrappedCode[\s\S]*return codeBlock\(code, '문제 코드'\)/);
  assert.doesNotMatch(styles, /\.exercise-prompt-section\s*\{[^}]*border-bottom:/);
  assert.match(styles, /\.answer-section\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
  assert.match(styles, /\.exercise-prompt code:not\(pre code\)/);
  assert.match(styles, /\.line-code\s*\{[^}]*background:\s*var\(--code-bg\)/);
  assert.match(styles, /\.solution-disclosure\s*\{[^}]*border-top:\s*1px solid var\(--line\);[^}]*background:\s*transparent/);
});

test('learner content uses editorial sections and dividers instead of card containers', () => {
  assert.match(designRules, /콘텐츠를 카드형 상자로 감싸지 않는다/);
  assert.match(mainScript, /class="exercise-prompt-section"/);
  assert.match(mainScript, /class="answer-section"/);
  assert.match(mainScript, /class="coding-problem-list"/);
  assert.match(mainScript, /class="coding-problem-row"/);
  assert.doesNotMatch(mainScript, /class="(?:exercise-card|exercise-prompt-panel|answer-panel|coding-problem-card|coding-problem-grid|coding-(?:problem|criteria|examples|editor|help)-panel|coding-example-card|study-session-card|solution-card|profile-stat-card|foundations-week-card)/);
  assert.doesNotMatch(styles, /--surface-(?:problem|answer|choice|explanation)|--radius-card/);
  assert.doesNotMatch(styles, /\.(?:exercise-card|exercise-prompt-panel|answer-panel|coding-problem-card|coding-problem-grid|coding-(?:problem|criteria|examples|editor|help)-panel|coding-example-card|study-session-card|solution-card|profile-stat-card)\s*\{/);
  assert.doesNotMatch(styles, /\.exercise-prompt-section\s*\{[^}]*border-bottom:/);
  assert.match(styles, /\.answer-section\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
  assert.match(styles, /\.coding-problem-row\s*\{[^}]*border-bottom:\s*1px solid var\(--line\)/);
  assert.match(styles, /#main-content h1\[tabindex="-1"\]:focus\s*\{\s*outline:\s*none/);
  assert.match(styles, /\.question-navigation\s*\{[^}]*border-bottom:\s*1px solid var\(--line\)/);
  assert.doesNotMatch(styles, /\.question-navigation\s*\{[^}]*border-top:|\.question-nav-item\.is-current\s*\{[^}]*background:/);
  assert.match(styles, /\.question-nav-item\s*\{[^}]*position:\s*relative/);
});

test('the coding menu only exposes reviewed runnable problems with a focused editor and result area', () => {
  assert.match(mainScript, /navLink\('coding', '코딩 문제'/);
  assert.match(mainScript, /navLink\('home', '홈',[\s\S]*?'내 학습실'\)/);
  assert.match(mainScript, /navLink\('tracks', '학습',[\s\S]*?'배울 주제'\)/);
  assert.match(mainScript, /navLink\('coding', '코딩',[\s\S]*?'코딩 문제'\)/);
  assert.match(mainScript, /navLink\('profile', '기록',[\s\S]*?'내 기록'\)/);
  assert.match(mainScript, /data-coding-filter="search"/);
  assert.match(mainScript, /function codingProblemPage\(problemId\)/);
  assert.match(mainScript, /problem\.runtime\.status !== 'verified'/);
  assert.match(mainScript, /코드 실행하고 채점/);
  assert.match(mainScript, /runnerResultsSection\(exercise, latest\?\.execution\)/);
  assert.match(mainScript, /data-coding-row/);
  assert.match(mainScript, /class="coding-problem-list"/);
  assert.match(styles, /\.coding-problem-heading,\s*\.coding-workspace-layout\s*\{[^}]*width:\s*min\(100%,\s*960px\);[^}]*margin-inline:\s*auto/);
  assert.match(mainScript, /class="coding-statement-section"[\s\S]*class="coding-editor-section"/);
  assert.match(styles, /\.coding-statement-section,\s*\.coding-criteria-section,\s*\.coding-examples-section,\s*\.coding-editor-section,\s*\.coding-help-section\s*\{[^}]*border-bottom:\s*1px solid var\(--line\)/);
  assert.match(styles, /\.coding-contract > div\s*\{[^}]*border-bottom:\s*1px solid var\(--line\)/);
});

test('light and dark text tokens meet WCAG AA on actual surfaces', () => {
  const light = themeTokens(':root');
  const dark = themeTokens(':root\\[data-theme="dark"\\]');
  const pairs = [
    [light['--accent'], light['--surface-soft']],
    [dark['--accent'], dark['--surface-soft']],
    ...['--canvas', '--surface', '--surface-soft', '--surface-field'].map((surface) => [light['--ink'], light[surface]]),
    ...['--canvas', '--surface', '--surface-soft', '--surface-field'].map((surface) => [dark['--ink'], dark[surface]]),
    ...['--canvas', '--surface', '--surface-soft', '--surface-field'].map((surface) => [light['--muted'], light[surface]]),
    [light['--success'], light['--success-bg']],
    [light['--review'], light['--review-bg']],
    [light['--danger'], light['--danger-bg']],
    ...['--canvas', '--surface', '--surface-soft', '--surface-field'].map((surface) => [dark['--muted'], dark[surface]]),
    [dark['--success'], dark['--success-bg']],
    [dark['--review'], dark['--review-bg']],
    [dark['--danger'], dark['--danger-bg']],
    [light['--code-ink'], light['--code-bg']],
    [dark['--code-ink'], dark['--code-bg']],
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(foreground && background);
    assert.ok(contrastRatio(hexColor(foreground), hexColor(background)) >= 4.5, foreground + ' on ' + background);
  }
});

test('small screens use a fixed five-item mobile navigation and stacked study layouts', () => {
  assert.match(styles, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.mobile-nav\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /\.mobile-nav\s+\.nav-link\s*\{[^}]*font-size:\s*14px/);
  assert.match(styles, /\.page-heading h1,[\s\S]*?\.exercise-heading h1\s*\{[^}]*word-break:\s*keep-all/);
  assert.match(styles, /\.app-shell\s*\{[^}]*grid-template-columns:\s*248px/);
  assert.match(styles, /\.lesson-layout,\s*\.exercise-layout,\s*\.profile-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(styles, /\.coding-workspace-layout\s*\{[^}]*width:\s*min\(100%,\s*960px\)/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /\.study-activity-time\s*\{[^}]*font-size:\s*14px/);
  assert.match(styles, /\.study-activity li p\s*\{[^}]*font-size:\s*14px/);
  assert.match(styles, /\.editor-key-hint\s*\{[^}]*font-size:\s*14px/);
  assert.match(styles, /\.coding-filters\s*>\s*label\s*\{[^}]*font-size:\s*14px/);
  assert.match(styles, /\.coding-example\s*>\s*p\s*\{[^}]*font-size:\s*14px/);
});

test('the curriculum directory groups all tracks, including compound category labels', () => {
  const languageTracks = tracks.filter((track) => track.category.startsWith('프로그래밍 언어'));
  const frameworkTracks = tracks.filter((track) => track.category.includes('프레임워크'));
  const aiTracks = tracks.filter((track) => track.category === '인공지능');
  const databaseTracks = tracks.filter((track) => track.category === '데이터베이스');

  assert.equal(languageTracks.length + frameworkTracks.length + aiTracks.length + databaseTracks.length, tracks.length);
  assert.equal(tracks.length, 12);
  assert.deepEqual(aiTracks.map((track) => track.id), ['ai']);
  assert.ok(languageTracks.some((track) => track.id === 'kotlin'));
  assert.ok(languageTracks.some((track) => track.id === 'csharp'));
  assert.ok(frameworkTracks.some((track) => track.id === 'fastapi'));
  assert.match(mainScript, /track\.category\.startsWith\('프로그래밍 언어'\)/);
  assert.match(mainScript, /track\.category\.includes\('프레임워크'\)/);
  assert.match(mainScript, /track\.category === '인공지능'/);
  assert.match(mainScript, /<h2>AI 학습<\/h2>/);
});

test('the selected public brand and feedback link are present', () => {
  assert.match(html, /<title>코드한걸음 — 배우고, 풀고, 이어가기<\/title>/);
  assert.match(mainScript, /aria-label="코드한걸음 내 학습실"/);
  assert.match(mainScript, /https:\/\/github\.com\/seonsun10\/code-one-step\/issues\/new\/choose/);
  assert.match(mainScript, /target="_blank" rel="noopener noreferrer" aria-label="GitHub에서 학습 오류나 접근성 문제 제보하기 \(GitHub 로그인 필요\)"/);
});

test('theme control follows the device by default and stores an explicit light or dark choice locally', () => {
  assert.match(html, /<script src="\.\/src\/theme\.js"><\/script>\s*<link rel="stylesheet"/);
  assert.match(html, /<meta name="theme-color" content="#f2efe8"/);
  assert.match(initialThemeScript, /prefers-color-scheme:\s*dark/);
  assert.match(initialThemeScript, /theme === 'dark' \? '#171d27' : '#f2efe8'/);
  assert.match(initialThemeScript, /localStorage\.getItem\(themeKey\)/);
  assert.doesNotMatch(initialThemeScript, /addEventListener\(['"]change['"]/);
  assert.match(mainScript, /data-action="toggle-theme"/);
  assert.match(mainScript, /theme-icon-sun/);
  assert.match(mainScript, /theme-icon-moon/);
  assert.match(mainScript, /case 'toggle-theme'/);
  assert.match(mainScript, /localStorage\.setItem\(themePreferenceKey, themePreference\)/);
  assert.match(mainScript, /systemColorScheme\?\.addEventListener\(['"]change['"]/);
  assert.match(mainScript, /어두운 화면으로 전환/);
  assert.match(mainScript, /밝은 화면으로 전환/);
  assert.doesNotMatch(mainScript, /<select data-action="theme"/);
});

test('failed progress saves stay visible and offer retry or backup actions', () => {
  assert.match(mainScript, /function announceStorageFailure\(\)/);
  assert.match(mainScript, /data-storage-failure/);
  assert.match(mainScript, /저장하지 못했어요\. 지금 변경한 내용은 이 화면에만 남아 있어요/);
  assert.match(mainScript, /data-action="retry-progress-save"/);
  assert.match(mainScript, /data-action="export-progress"/);
  assert.match(mainScript, /case 'retry-progress-save': void persistProgress\(\{ immediate: true \}\)/);
  assert.match(mainScript, /clearStorageFailure\(\)/);
  assert.match(mainScript, /function updateStorageIndicator\(\)/);
  assert.match(mainScript, /updateStorageIndicator\(\);\s*announceStorageFailure\(\);/);
  assert.doesNotMatch(mainScript, /답과 진도는 이 기기에 저장됩니다/);
  assert.match(styles, /\.save-indicator\.is-error/);
  assert.match(styles, /\.toast-actions \.button\s*\{[^}]*min-height:\s*44px/);
});

test('stale progress from another tab is protected and offers backup or reload', () => {
  assert.match(storageScript, /navigator\?\.locks\?\.request/);
  assert.match(storageScript, /study-web-progress/);
  assert.match(mainScript, /function announceStorageConflict\(\)/);
  assert.match(mainScript, /다른 탭에서 기록이 바뀌어 저장하지 못했어요/);
  assert.match(mainScript, /data-action="reload-progress"/);
  assert.match(mainScript, /error\?\.name === 'StaleProgressError'\) announceStorageConflict\(\)/);
  assert.match(mainScript, /case 'reload-progress': window\.location\.reload\(\)/);
});

test('backup restore cancels stale saves and keeps edits made while the backup is being written', () => {
  const importBody = mainScript.match(/async function importProgress\(file\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(importBody);
  assert.match(importBody, /clearTimeout\(saveTimer\);\s*saveTimer = undefined;\s*progress = restored;/);
  assert.match(importBody, /const queuedSave = saveQueue\.catch\(\(\) => undefined\)\.then\(\(\) => replaceProgress\(restored\)\);[\s\S]*?await queuedSave;/);
  assert.doesNotMatch(importBody, /progress = saved/);
  assert.match(importBody, /catch \{\s*updateStorageIndicator\(\);\s*render\(\{ focus: true \}\);\s*announceStorageFailure\(\);/);
});

test('backup file picker resets after selection so the same file can be retried', () => {
  const importHandler = mainScript.match(/if \(event\.target\.matches\('\[data-action="import-progress"\]'\)\) \{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(importHandler);
  const fileRead = importHandler.indexOf('importProgress(event.target.files?.[0])');
  const inputReset = importHandler.indexOf("event.target.value = ''");
  assert.ok(fileRead >= 0, 'the selected File must be passed to the asynchronous restore before clearing the picker');
  assert.ok(inputReset > fileRead, 'clear the picker after capturing the File so selecting the same path fires change again');
});

test('all tracks appear in the curriculum directory with long courses and ordered questions', () => {
  assert.match(mainScript, /languageTracks\.map\(trackRow\)/);
  assert.match(mainScript, /frameworkTracks\.map\(trackRow\)/);
  assert.match(mainScript, /aiTracks\.map\(trackRow\)/);
  assert.match(mainScript, /databaseTracks\.map\(trackRow\)/);
  assert.match(mainScript, /\$\{track\.course\.sessions\}회 학습/);
  assert.match(mainScript, /track\.practiceMode \?\? `\$\{track\.course\.questions\}문제`/);
  assert.match(mainScript, /stats\.done\}\/\$\{stats\.total\}주/);
  assert.match(mainScript, /session\.exercises\.map/);
  assert.match(mainScript, /question-navigation/);
});

test('track navigation and cards use distinct local technology symbols instead of improvised initials', () => {
  assert.match(mainScript, /const trackIconSources = \{/);
  for (const id of trackIconIds) {
    assert.match(mainScript, new RegExp(`${id}: '\\.\/public\/tracks\/${id}\\.svg'`));
    assert.match(trackIcons[id], /<svg\s/);
    assert.doesNotMatch(trackIcons[id], /<image\b|href=["']https?:\/\//);
  }
  assert.match(trackIcons.javascript, /#F7DF1E/i);
  assert.match(trackIcons.javascript, /#323330/i);
  assert.match(trackIcons.python, /#3776AB/i);
  assert.match(trackIcons.python, /#FFD43B/i);
  assert.match(trackIcons.java, /<path\b[\s\S]*<path\b/);
  assert.match(trackIcons.spring, /#6DB33F/i);
  assert.match(trackIcons.react, /<ellipse\b[\s\S]*<ellipse\b[\s\S]*<ellipse\b/);
  assert.match(mainScript, /<img src="\$\{iconSource\}" alt="" \/>/);
  assert.doesNotMatch(mainScript, /track\.short/);
});

test('static release headers isolate the runner while keeping its parent frame usable', () => {
  const headerForRoute = (route) => {
    const lines = staticHeaders.split(/\r?\n/);
    const routeIndex = lines.findIndex((line) => line.trim() === route);
    assert.notEqual(routeIndex, -1, 'Missing header route ' + route);
    return lines.slice(routeIndex + 1).find((line) => /Content-Security-Policy:/i.test(line)) ?? '';
  };
  assert.match(staticHeaders, /X-Content-Type-Options:\s*nosniff/);
  assert.match(staticHeaders, /Referrer-Policy:\s*strict-origin-when-cross-origin/);
  assert.match(staticHeaders, /Permissions-Policy:\s*camera=\(\), microphone=\(\), geolocation=\(\)/);
  for (const route of ['/', '/index.html']) {
    const routeRule = headerForRoute(route);
    assert.match(routeRule, /style-src 'self' 'unsafe-inline'/, 'CodeMirror injected styles must remain same-origin for ' + route);
    assert.doesNotMatch(routeRule, /style-src[^;]*https?:\/\//, 'The app must not load remote stylesheets (' + route + ')');
  }
  assert.match(staticHeaders, /connect-src 'none';[^\n]*frame-ancestors 'self'/);
  for (const route of ['/public/runner-frame.html', '/public/runner-frame']) {
    const routeRule = staticHeaders.split(route)[1]?.split('\n')[1] ?? '';
    assert.match(routeRule, /Content-Security-Policy: default-src 'none';.*connect-src 'none';.*frame-ancestors 'self'/, 'Both runner URL paths need the isolated policy (' + route + ')');
  }
  assert.match(html, /style-src 'self' 'unsafe-inline'/);
  assert.match(buildScript, /THIRD_PARTY_LICENSES\.txt/);
  assert.match(buildScript, /cp\(resolve\(projectRoot, '_headers'\), resolve\(outputDirectory, '_headers'\)\)/);
  assert.match(buildScript, /await rm\(outputDirectory, \{ recursive: true, force: true \}\)/);
});
