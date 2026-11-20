import { findLessonForExercise, getCurrentExerciseId, getExercise, getLesson, getTopic, getTrack, lessons, tracks } from './content.js';
import { codingProblems } from './coding-problems.js';
import { toCodingExercise } from './coding-problem-adapter.js';
import { gradeAnswer } from './grading.js';
import { emptyProgress, getCompletedLessonIds, latestExerciseResults, latestCodingResults, recordExerciseResult, recordCodingResult, separateCodingRecords, migrateExerciseIds, makeBackup, parseBackup, MAX_COMPLETED_LESSONS } from './progress.js';
import { FASTAPI_INITIALIZE_TIMEOUT_MS, FASTAPI_RUNNER_TIMEOUT_MS, POSTGRESQL_RUNNER_TIMEOUT_MS, RUNNER_STARTUP_TIMEOUT_MS, RUNNER_TIMEOUT_MS, runChallenge } from './runner.js';
import { routeFromHash } from './routing.js';
import { formatCodingExampleValue, formatExerciseValue } from './runner-values.js';
import { getStorageMode, loadProgress, replaceProgress, saveProgress } from './storage.js';
import { codeLanguageId, highlightCode } from './syntax-highlight.js';
import { createCodeEditor } from './editor-runtime.js';
import { foundationsTrack } from './foundations.js';
import { paginationState } from './pagination.js';

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
let progress = emptyProgress();
let saveTimer;
let saveQueue = Promise.resolve();
let toastTimer;
let codingCatalogPageNumber = 1;
let foundationsPageNumber = 1;
let renderedRouteKey = '';
const codeEditors = new Map();
const themePreferenceKey = 'study-web-theme';
const systemColorScheme = window.matchMedia?.('(prefers-color-scheme: dark)');

function readThemePreference() {
  try {
    const preference = localStorage.getItem(themePreferenceKey);
    return ['light', 'dark'].includes(preference) ? preference : 'system';
  } catch {
    return 'system';
  }
}

let themePreference = readThemePreference();

function applyTheme() {
  const resolvedTheme = themePreference === 'system'
    ? (systemColorScheme?.matches ? 'dark' : 'light')
    : themePreference;
  document.documentElement.dataset.theme = resolvedTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'dark' ? '#121716' : '#f7f6f2');
  const themeButton = document.querySelector('[data-action="toggle-theme"]');
  if (themeButton) {
    const label = resolvedTheme === 'dark' ? '밝은 화면으로 전환' : '어두운 화면으로 전환';
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
    themeButton.dataset.icon = resolvedTheme === 'dark' ? 'sun' : 'moon';
  }
}

applyTheme();
systemColorScheme?.addEventListener('change', () => {
  if (themePreference === 'system') applyTheme();
});

const routeLabels = {
  home: '내 학습실',
  tracks: '배울 주제',
  track: '과정',
  topic: '주제',
  lesson: '수업',
  exercise: '문제 풀기',
  profile: '내 기록',
  coding: '코딩 문제',
  'coding-problem': '코딩 문제 풀기',
  foundations: '공통 실무 기초',
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function inlineText(value) {
  return String(value).split(/\r?\n/)
    .map((line) => escapeHtml(line).replace(/`([^`]+)`/g, '<code>$1</code>'))
    .join('<br>');
}

function go(path) {
  window.location.hash = `/${path.replace(/^\//, '')}`;
}

function navLink(path, label, icon, currentPage, accessibleLabel = label) {
  const [page] = path.split('/');
  const active = currentPage === page
    || (page === 'tracks' && ['track', 'topic', 'lesson', 'exercise'].includes(currentPage))
    || (page === 'coding' && currentPage === 'coding-problem');
  return `<a class="nav-link ${active ? 'is-active' : ''}" href="#/${path}" aria-label="${escapeHtml(accessibleLabel)}" ${active ? 'aria-current="page"' : ''}>
    <span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>
  </a>`;
}

function themeToggle() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const label = isDark ? '밝은 화면으로 전환' : '어두운 화면으로 전환';
  return `<button class="theme-toggle" type="button" data-action="toggle-theme" data-icon="${isDark ? 'sun' : 'moon'}" aria-label="${label}" title="${label}">
    <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
    <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z"/></svg>
  </button>`;
}

function shell(page, content) {
  const savedStatus = getStorageMode();
  return `<div class="app-shell">
    <aside class="sidebar" aria-label="주요 메뉴">
      <a class="brand" href="#/home" aria-label="코드한걸음 내 학습실">
        <span class="brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span class="brand-name">코드한<span>걸음</span></span>
      </a>
      <nav class="primary-nav">
        ${navLink('home', '내 학습실', '⌂', page)}
        ${navLink('tracks', '배울 주제', '▦', page)}
        ${navLink('coding', '코딩 문제', '&lt;/&gt;', page)}
        ${navLink('foundations', '공통 실무 기초', '⌘', page)}
        ${navLink('profile', '내 기록', '◷', page)}
      </nav>
      <div class="sidebar-divider"></div>
      <div class="sidebar-label sidebar-label-row"><span>내 과정</span><a href="#/tracks">전체 보기</a></div>
      <nav class="track-nav" aria-label="내 과정">
        ${tracks.map((track) => `<a class="track-nav-link" href="#/track/${track.id}">
          ${trackMark(track, 'mini-track-mark')}<span>${escapeHtml(track.title)}</span>
        </a>`).join('')}
      </nav>
    </aside>
    <div class="app-column">
      <header class="topbar">
        <div class="breadcrumbs"><strong>${routeLabels[page] || '내 학습실'}</strong></div>
        <div class="topbar-actions">
          ${themeToggle()}
          <span class="save-indicator${savedStatus === '저장 실패' ? ' is-error' : ''}" aria-label="${escapeHtml(savedStatus)}"><i aria-hidden="true"></i>${escapeHtml(savedStatus)}</span>
        </div>
      </header>
      <main id="main-content" class="page-content">${content}</main>
      <footer class="site-footer"><a href="https://github.com/seonsun10/code-one-step/issues/new/choose" target="_blank" rel="noopener noreferrer" aria-label="GitHub에서 학습 오류나 접근성 문제 제보하기 (GitHub 로그인 필요)">문제 제보</a></footer>
    </div>
    <nav class="mobile-nav" aria-label="모바일 메뉴">
      ${navLink('home', '홈', '⌂', page, '내 학습실')}
      ${navLink('tracks', '학습', '▦', page, '배울 주제')}
      ${navLink('coding', '코딩', '&lt;/&gt;', page, '코딩 문제')}
      ${navLink('foundations', '실무', '⌘', page, '공통 실무 기초')}
      ${navLink('profile', '기록', '◷', page, '내 기록')}
    </nav>
  </div>`;
}

function latestAnswers() {
  return new Map(latestExerciseResults(progress).map((answer) => [answer.exerciseId, answer]));
}

function latestCodingAnswers() {
  return new Map(latestCodingResults(progress).map((answer) => [answer.exerciseId, answer]));
}

function recentAnswerEvents(limit) {
  const events = [
    ...progress.answers.map((answer) => ({ ...answer, context: 'learning' })),
    ...progress.codingAnswers.map((answer) => ({ ...answer, context: 'coding' })),
  ];
  const unique = new Map();
  for (const answer of events) {
    const key = `${answer.exerciseId}:${answer.answeredAt}:${answer.correct}:${JSON.stringify(answer.response)}`;
    unique.set(key, answer);
  }
  return [...unique.values()]
    .sort((left, right) => Date.parse(right.answeredAt) - Date.parse(left.answeredAt))
    .slice(0, limit);
}

function reconcileProgress(value) {
  migrateExerciseIds(value, getCurrentExerciseId, (id, response) => {
    const exercise = getExercise(id);
    return exercise ? gradeAnswer(exercise, response) : false;
  });
  const previousCompletions = Array.isArray(value.completedLessonIds) ? value.completedLessonIds : [];
  const codingProblemIds = new Set(codingProblems.map((problem) => problem.id));
  separateCodingRecords(value, codingProblemIds);
  const isKnownExercise = (id) => Boolean(getExercise(id));
  value.answers = value.answers.filter((answer) => isKnownExercise(answer.exerciseId));
  value.exerciseResults = value.exerciseResults.filter((result) => isKnownExercise(result.exerciseId));
  value.codingAnswers = value.codingAnswers.filter((answer) => codingProblemIds.has(answer.exerciseId));
  value.codingResults = value.codingResults.filter((result) => codingProblemIds.has(result.exerciseId));
  value.codingDrafts = Object.fromEntries(Object.entries(value.codingDrafts).filter(([id]) => codingProblemIds.has(id)));
  const latestResults = latestExerciseResults(value);
  value.exerciseResults = latestResults.map(({ exerciseId, correct, answeredAt }) => ({ exerciseId, correct, answeredAt }));
  value.codingResults = latestCodingResults(value).map(({ exerciseId, correct, answeredAt }) => ({ exerciseId, correct, answeredAt }));
  const currentCompletions = getCompletedLessonIds(lessons, { exerciseResults: latestResults });
  const currentCompletionSet = new Set(currentCompletions);
  value.legacyCompletedLessonIds = [...new Set([
    ...value.legacyCompletedLessonIds,
    ...previousCompletions.filter((id) => getLesson(id) && !currentCompletionSet.has(id)),
  ])].slice(0, MAX_COMPLETED_LESSONS);
  value.completedLessonIds = currentCompletions;
  value.lastExerciseId = isKnownExercise(value.lastExerciseId) ? value.lastExerciseId : null;
  value.lastCodingProblemId = codingProblems.find((problem) => problem.id === value.lastCodingProblemId)?.id ?? null;
  value.codingFilters = value.codingFilters ?? { search: '', language: '', level: '', topic: '', status: '' };
  value.lastLessonId = getLesson(value.lastLessonId)?.id ?? (value.lastExerciseId ? findLessonForExercise(value.lastExerciseId)?.id : null);
  value.lastTrackId = getTrack(value.lastTrackId)?.id
    ?? (value.lastLessonId ? getLesson(value.lastLessonId)?.trackId : null)
    ?? codingProblems.find((problem) => problem.id === value.lastCodingProblemId)?.language
    ?? null;
  return value;
}

function exerciseProgress(lesson) {
  const answers = latestAnswers();
  const completed = lesson.exercises.filter((exercise) => answers.get(exercise.id)?.correct).length;
  return { completed, total: lesson.exercises.length, done: completed === lesson.exercises.length };
}

function isLessonComplete(lesson) {
  return exerciseProgress(lesson).done;
}

function nextExercise(lesson) {
  const answers = latestAnswers();
  return lesson.exercises.find((exercise) => !answers.get(exercise.id)?.correct) ?? lesson.exercises[0];
}

function nextTrackExercise(track) {
  for (const lesson of track.lessons) {
    if (!isLessonComplete(lesson)) return nextExercise(lesson);
  }
  return track.lessons[0]?.exercises[0] ?? null;
}

function homeExampleLesson(track, fallbackLesson, codingProblem) {
  if (!track?.lessons?.length) return fallbackLesson;
  const topicIds = new Set(codingProblem?.topicIds ?? []);
  if (topicIds.size) {
    const relatedLessons = track.lessons.filter((lesson) => topicIds.has(lesson.topicId));
    const relatedLesson = relatedLessons.find((lesson) => !isLessonComplete(lesson))
      ?? [...relatedLessons].reverse().find(isLessonComplete);
    if (relatedLesson) return relatedLesson;
  }
  return track.lessons.find((lesson) => !isLessonComplete(lesson))
    ?? [...track.lessons].reverse().find(isLessonComplete)
    ?? fallbackLesson;
}

function nextCurriculumExercise() {
  for (const lesson of lessons) {
    if (!isLessonComplete(lesson)) return nextExercise(lesson);
  }
  return lessons[0]?.exercises[0] ?? null;
}

function completedLessonCount() {
  return lessons.filter(isLessonComplete).length;
}

function exerciseLabel(exercise) {
  return {
    choice: '객관식',
    'short-answer': '주관식',
    'locate-error': '오류 찾기',
    'repair-code': '코드 수정',
    coding: '코딩 문제',
  }[exercise.type] ?? '연습 문제';
}

function accuracySummary() {
  const answers = [...latestAnswers().values()];
  if (!answers.length) return '아직 첫 문제 전이에요';
  const correct = answers.filter((answer) => answer.correct).length;
  return `${Math.round((correct / answers.length) * 100)}% 정답률`;
}

function trackProgress(track) {
  const done = track.lessons.filter(isLessonComplete).length;
  return { done, total: track.lessons.length, percent: Math.round((done / track.lessons.length) * 100) };
}

const trackIconSources = {
  javascript: './public/tracks/javascript.svg',
  typescript: './public/tracks/typescript.svg',
  postgresql: './public/tracks/postgresql.svg',
  fastapi: './public/tracks/fastapi.svg',
  python: './public/tracks/python.svg',
  java: './public/tracks/java.svg',
  spring: './public/tracks/spring.svg',
  react: './public/tracks/react.svg',
  nextjs: './public/tracks/nextjs.svg',
  kotlin: './public/tracks/kotlin.svg',
  csharp: './public/tracks/csharp.svg',
  ai: './public/tracks/ai.svg',
  foundations: './public/tracks/foundations.svg',
};

const codingLanguageTitles = { typescript: 'TypeScript' };

function codingLanguageTitle(languageId) {
  return tracks.find((track) => track.id === languageId)?.title ?? codingLanguageTitles[languageId] ?? languageId;
}

function trackMark(track, extraClass = '') {
  const id = typeof track === 'string' ? track : track?.id;
  const iconSource = trackIconSources[id];
  if (!iconSource) return '';
  return `<span class="track-mark ${extraClass}" aria-hidden="true"><img src="${iconSource}" alt="" /></span>`;
}

function trackRow(track) {
  const stats = trackProgress(track);
  const weeklySummary = `${track.course.sessions}회 학습 · ${track.practiceMode ?? `${track.course.questions}문제`}`;
  return `<a class="track-index-row" href="#/track/${track.id}">
    ${trackMark(track, 'track-index-mark')}
    <span class="track-index-copy"><span class="track-category">${escapeHtml(track.category)}</span><strong>${escapeHtml(track.title)}</strong><span>${escapeHtml(track.description)}</span><small>${weeklySummary}</small></span>
    <span class="track-index-progress"><span>${stats.done}/${stats.total}주 · ${stats.percent}%</span><span class="progress-track" aria-hidden="true"><span style="width:${stats.percent}%"></span></span></span>
    <span class="track-index-action">과정 보기 <span aria-hidden="true">→</span></span>
  </a>`;
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dateFromLocalKey(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatActivityDate(date, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
}

function learningActivity() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = localDateKey(today);
  const counts = new Map();
  const records = [...latestExerciseResults(progress), ...latestCodingResults(progress)];
  for (const record of records) {
    const date = new Date(record.answeredAt);
    if (!Number.isFinite(date.getTime()) || date > new Date()) continue;
    const key = localDateKey(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const mondayOffset = (today.getDay() + 6) % 7;
  const recentStart = new Date(today);
  recentStart.setDate(today.getDate() - mondayOffset - (11 * 7));
  const storedKeys = [...counts.keys()].sort();
  const capped = (progress.exerciseResults?.length ?? 0) >= 10_000
    || (progress.codingResults?.length ?? 0) >= 5_000;
  const oldestStored = storedKeys.length ? dateFromLocalKey(storedKeys[0]) : null;
  const start = capped && oldestStored && oldestStored > recentStart ? oldestStored : recentStart;
  const startMonday = new Date(start);
  startMonday.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const weeks = [];

  for (let weekStart = new Date(startMonday); weekStart <= today; weekStart.setDate(weekStart.getDate() + 7)) {
    const days = [];
    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayOffset);
      if (date < start || date > today) {
        days.push(null);
        continue;
      }
      const key = localDateKey(date);
      const count = counts.get(key) ?? 0;
      days.push({ date, key, count, level: count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4 });
    }
    weeks.push({ start: localDateKey(weekStart), days });
  }

  const visibleStart = capped && start > recentStart ? start : recentStart;
  const visibleCount = [...counts.entries()]
    .filter(([key]) => dateFromLocalKey(key) >= start && dateFromLocalKey(key) <= today)
    .reduce((sum, [, count]) => sum + count, 0);
  return {
    today,
    todayKey,
    weeks,
    visibleStart,
    visibleCount,
    todayCount: counts.get(todayKey) ?? 0,
    capped,
    limitedRange: capped && start > recentStart,
  };
}

function homeActivitySection() {
  const activity = learningActivity();
  const gridLabel = `문제별 최근 풀이 기록, ${formatActivityDate(activity.visibleStart)}부터 ${formatActivityDate(activity.today)}까지`;
  const weeks = activity.weeks.map((week) => `<div class="activity-week" role="row" aria-label="${escapeHtml(formatActivityDate(dateFromLocalKey(week.start), { month: 'long', day: 'numeric' }))} 주">
    ${week.days.map((day) => day ? `<button class="activity-day${day.key === activity.todayKey ? ' is-selected' : ''}" type="button" role="gridcell" data-activity-day="${day.key}" data-activity-count="${day.count}" data-activity-level="${day.level}" aria-label="${escapeHtml(formatActivityDate(day.date))}, ${day.count}개 문제 풀이 기록" aria-selected="${day.key === activity.todayKey}" tabindex="${day.key === activity.todayKey ? '0' : '-1'}" title="${escapeHtml(formatActivityDate(day.date))} · ${day.count}개 문제"></button>` : '<span class="activity-day is-outside" aria-hidden="true"></span>').join('')}
  </div>`).join('');
  const rangeNote = activity.limitedRange
    ? `보존된 풀이 기록은 ${formatActivityDate(activity.visibleStart)}부터 표시해요.`
    : '풀이 기록은 이 브라우저에 저장돼요.';
  const todayMessage = activity.todayCount
    ? `오늘 ${activity.todayCount}개 문제에 풀이 기록이 있어요.`
    : '오늘 기록은 아직 없어요.';

  return `<section class="home-section home-garden" aria-labelledby="home-garden-title">
    <div class="home-section-heading"><div><p class="eyebrow">최근 12주</p><h2 id="home-garden-title">학습 기록</h2></div><span class="garden-total"><strong>${activity.visibleCount}</strong>개 문제</span></div>
    <div class="activity-calendar-wrap">
      <div class="activity-weekdays" aria-hidden="true"><span>월</span><span>수</span><span>금</span></div>
      <div class="activity-calendar" role="grid" aria-label="${escapeHtml(gridLabel)}">${weeks}</div>
    </div>
    <p class="activity-selected" data-activity-summary aria-live="polite">${escapeHtml(formatActivityDate(activity.today))} · ${todayMessage}</p>
    <p class="activity-note">${escapeHtml(rangeNote)}</p>
  </section>`;
}

function homeSkillPicker() {
  const links = tracks.map((track) => `<a class="home-skill-link" href="#/track/${encodeURIComponent(track.id)}">
    ${trackMark(track, 'home-skill-mark')}<span class="home-skill-name">${escapeHtml(track.title)}</span><span class="home-skill-arrow" aria-hidden="true">→</span>
  </a>`).join('');
  return `<section class="home-section home-skill-section" aria-labelledby="home-skill-title" data-home-skill-picker>
    <div class="home-skill-header">
      <div class="home-section-heading"><div><p class="eyebrow">배울 주제</p><h2 id="home-skill-title">어떤 걸 배워볼까요?</h2></div></div>
      <button class="home-skill-toggle" type="button" data-home-skill-toggle aria-expanded="false" aria-controls="home-skill-links" aria-label="배울 주제 보기">
        <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="14.5" cy="15" r="5.5"/><path d="M5 35c1.2-6.7 4.4-10.1 9.5-10.1 3.6 0 6.3 1.8 7.9 5.1"/><path class="home-skill-bulb" d="M31 8.5a7.5 7.5 0 0 0-4.7 13.4c1.3 1 2.1 2.4 2.2 4h5c.1-1.6.9-3 2.2-4A7.5 7.5 0 0 0 31 8.5Z"/><path d="M28.8 29.2h4.4m-3.6 3.1h2.8M31 4.5V2m7 5.2 1.8-1.8m-15.6 1.8-1.8-1.8"/></svg>
      </button>
    </div>
    <p class="home-skill-lead">관심 있는 주제부터 편하게 시작해 보세요.</p>
    <div class="home-skill-grid-clip"><nav class="home-skill-grid" id="home-skill-links" aria-label="배울 주제" aria-hidden="true" inert>${links}</nav></div>
  </section>`;
}

function homeExampleSection(track, lesson) {
  const source = String(lesson?.example ?? '');
  const lines = source.trim().split(/\r?\n/).filter(Boolean);
  const previewLimit = 7;
  const preview = lines.slice(0, previewLimit).join('\n') + (lines.length > previewLimit ? '\n…' : '');
  const exampleLanguage = lesson?.exampleLanguage ?? track?.title ?? '';
  const labeledLines = lines.map((line) => {
    const match = line.trim().match(/^([^:：]{1,48})[:：]\s*(.+)$/);
    return match ? { label: match[1].trim(), description: match[2].trim() } : null;
  });
  const href = `#/lesson/${lesson.id}`;
  const examplePreview = labeledLines.length > 1 && labeledLines.every(Boolean)
    ? `<dl class="exercise-context-list home-example-context-list">${labeledLines.map(({ label, description }) => `<div><dt>${inlineText(label)}</dt><dd>${inlineText(description)}</dd></div>`).join('')}</dl>`
    : codeLanguageId(exampleLanguage) !== 'plain'
      ? codeBlock(preview, exampleLanguage, { copy: false })
      : `<div class="home-example-notes">${lines.slice(0, 5).map((line) => {
          const match = line.trim().match(/^([^:：]{1,48})[:：]\s*(.+)$/);
          return match
            ? `<div class="home-example-note"><strong>${inlineText(match[1].trim())}</strong><span>${inlineText(match[2].trim())}</span></div>`
            : `<p class="home-example-note is-lead">${inlineText(line)}</p>`;
        }).join('')}${lines.length > 5 ? '<p class="home-example-note is-more" aria-hidden="true">…</p>' : ''}</div>`;
  const level = `${lesson.week ? `${lesson.week}주차 · ` : ''}${lesson.difficulty ?? '학습'}`;
  return `<section class="home-section home-example" aria-labelledby="home-example-title">
    <div class="home-section-heading"><div><p class="eyebrow">${escapeHtml(track?.title ?? '오늘의 학습')} · ${escapeHtml(level)}</p><h2 id="home-example-title">오늘의 예제</h2></div></div>
    <p class="home-example-title">${escapeHtml(lesson.title)}</p>
    ${examplePreview}
    <a class="text-link" href="${href}">이 내용 더 배우기 <span aria-hidden="true">→</span></a>
  </section>`;
}

function homePage() {
  const resumeCodingProblem = progress.lastActivity === 'coding'
    ? codingProblems.find((problem) => problem.id === progress.lastCodingProblemId)
    : null;
  const savedLesson = getLesson(progress.lastLessonId);
  const savedExercise = getExercise(progress.lastExerciseId);
  const savedAnswer = savedExercise ? latestAnswers().get(savedExercise.id) : null;
  const resumeExercise = savedLesson && savedExercise && findLessonForExercise(savedExercise.id)?.id === savedLesson.id && !savedAnswer?.correct
    ? savedExercise
    : savedLesson && !isLessonComplete(savedLesson)
      ? nextExercise(savedLesson)
      : nextCurriculumExercise();
  const resumeLesson = findLessonForExercise(resumeExercise?.id) ?? savedLesson ?? lessons[0];
  const resumeTrack = getTrack(resumeLesson.trackId);
  const codingTrack = resumeCodingProblem ? tracks.find((item) => item.id === resumeCodingProblem.language) : null;
  const exampleTrack = codingTrack ?? resumeTrack;
  const exampleLesson = codingTrack ? homeExampleLesson(codingTrack, resumeLesson, resumeCodingProblem) : resumeLesson;
  const resumeMarkup = resumeCodingProblem
    ? (() => {
        const answer = latestCodingAnswers().get(resumeCodingProblem.id);
        return `<section class="home-resume home-resume-coding" aria-labelledby="resume-title"><div class="home-resume-copy"><p class="eyebrow">이어서 코딩</p><p class="resume-context">${escapeHtml(codingLanguageTitle(resumeCodingProblem.language))} · 코딩 문제 · 약 ${resumeCodingProblem.estimatedMinutes}분</p><h2 id="resume-title">${escapeHtml(resumeCodingProblem.title)}</h2><p>${answer?.correct ? '이미 해결했어요. 코드를 다시 실행해 복습할 수 있어요.' : '작성 중인 코드는 이 기기에 저장돼 있어요.'}</p></div><a class="button button-primary" href="#/coding/problem/${encodeURIComponent(resumeCodingProblem.id)}">${answer?.correct ? '복습 이어하기' : '이어서 풀기'} <span aria-hidden="true">→</span></a></section>`;
      })()
    : `<section class="home-resume" aria-labelledby="resume-title">${trackMark(resumeTrack, 'home-resume-mark')}<div class="home-resume-copy"><p class="eyebrow">${savedLesson ? '이어서 하기' : '첫 문제부터'}</p><p class="resume-context">${escapeHtml(resumeTrack.title)} · ${resumeLesson.week}주차 · ${escapeHtml(resumeLesson.title)}</p><h2 id="resume-title">${escapeHtml(resumeExercise.title)}</h2><p>${escapeHtml(resumeLesson.objective)}</p></div><a class="button button-primary" href="#/exercise/${resumeExercise.id}">${savedLesson ? '이어서 풀기' : '첫 문제 풀기'} <span aria-hidden="true">→</span></a></section>`;
  const recent = recentAnswerEvents(4);
  const hasResume = Boolean(savedLesson || resumeCodingProblem);
  const todayLabel = formatActivityDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' });
  const homeTitle = hasResume ? '이어서 공부해요' : '오늘은 뭘 배워볼까요?';
  const homeIntro = hasResume ? '지난번에 멈춘 곳부터 이어서 해요.' : '관심 있는 주제를 골라 첫 문제부터 시작해요.';
  const exampleMarkup = homeExampleSection(exampleTrack, exampleLesson);
  return `<section class="home-heading" aria-labelledby="home-title"><p class="eyebrow">${escapeHtml(todayLabel)}</p><h1 id="home-title">${homeTitle}</h1><p>${homeIntro}</p></section>
    ${resumeMarkup}
    <div class="home-dashboard-grid">${homeActivitySection()}${exampleMarkup}</div>
    ${homeSkillPicker()}
    <section class="content-section recent-section"><div class="section-heading"><div><p class="eyebrow">최근 활동</p><h2>최근 풀이</h2></div><a class="text-link" href="#/profile">전체 기록 보기 <span aria-hidden="true">→</span></a></div>
      ${recent.length ? `<div class="recent-list">${recent.map((answer) => {
        const problem = codingProblems.find((item) => item.id === answer.exerciseId);
        const lesson = findLessonForExercise(answer.exerciseId);
        if (answer.context === 'coding' && problem) {
          const track = tracks.find((item) => item.id === problem.language);
          return `<a class="recent-row" href="#/coding/problem/${encodeURIComponent(problem.id)}">${trackMark(track, 'recent-mark')}<span class="recent-copy"><strong>${escapeHtml(problem.title)}</strong><small>${escapeHtml(track?.title ?? problem.language)} · 코딩 문제 · ${answer.correct ? '정답' : '다시 풀기'}</small></span><span class="recent-result ${answer.correct ? 'is-correct' : 'is-review'}">${answer.correct ? '확인' : '복습'} <span aria-hidden="true">→</span></span></a>`;
        }
        const exercise = getExercise(answer.exerciseId);
        if (!lesson || !exercise) return '';
        const track = getTrack(lesson.trackId);
        return `<a class="recent-row" href="#/exercise/${exercise.id}">${trackMark(track, 'recent-mark')}<span class="recent-copy"><strong>${escapeHtml(exercise.title)}</strong><small>${escapeHtml(track.title)} · ${answer.correct ? '정답' : '다시 풀기'}</small></span><span class="recent-result ${answer.correct ? 'is-correct' : 'is-review'}">${answer.correct ? '확인' : '복습'} <span aria-hidden="true">→</span></span></a>`;
      }).join('')}</div>` : `<p class="empty-state">문제를 풀면 최근 풀이가 여기에 표시돼요.</p>`}
    </section>`;
}

function tracksPage() {
  const languageTracks = tracks.filter((track) => track.category.startsWith('프로그래밍 언어'));
  const frameworkTracks = tracks.filter((track) => track.category.includes('프레임워크'));
  const aiTracks = tracks.filter((track) => track.category === '인공지능');
  const databaseTracks = tracks.filter((track) => track.category === '데이터베이스');
  return `<section class="page-heading"><p class="eyebrow">배울 주제</p><h1>무엇부터 배워볼까요?</h1><p>관심 있는 걸 골라 시작해 보세요. 과정마다 기초부터 차근차근 배울 수 있어요.</p></section>
    <section class="content-section"><div class="section-heading"><div><p class="eyebrow">언어</p><h2>프로그래밍 언어</h2></div></div><div class="track-list">${languageTracks.map(trackRow).join('')}</div></section>
    <section class="content-section"><div class="section-heading"><div><p class="eyebrow">프레임워크</p><h2>프레임워크</h2></div></div><div class="track-list">${frameworkTracks.map(trackRow).join('')}</div></section>
    ${aiTracks.length ? `<section class="content-section"><div class="section-heading"><div><p class="eyebrow">인공지능</p><h2>AI 학습</h2></div></div><div class="track-list">${aiTracks.map(trackRow).join('')}</div></section>` : ''}
    ${databaseTracks.length ? `<section class="content-section"><div class="section-heading"><div><p class="eyebrow">데이터베이스</p><h2>SQL 배우기</h2></div></div><div class="track-list">${databaseTracks.map(trackRow).join('')}</div></section>` : ''}`;
}

function foundationsPage() {
  const completedWeeks = foundationsTrack.lessons.filter(isLessonComplete).length;
  const page = paginationState(foundationsTrack.lessons.length, foundationsPageNumber, 10);
  foundationsPageNumber = page.page;
  const weekRows = foundationsTrack.lessons.slice(page.startIndex, page.endIndex).map((lesson) => {
    const status = exerciseProgress(lesson);
    return `<a class="lesson-row foundations-week-row" href="#/foundations/week-${String(lesson.week).padStart(2, '0')}"><span class="lesson-index ${status.done ? 'is-done' : ''}">${status.done ? '✓' : String(lesson.week).padStart(2, '0')}</span><span class="lesson-row-copy"><span class="lesson-row-stage">${lesson.week}주차 · ${escapeHtml(lesson.difficulty)}</span><span class="lesson-row-title">${escapeHtml(lesson.title)}</span><span class="lesson-row-subtitle">${escapeHtml(lesson.objective)}</span></span><span class="lesson-row-meta">${status.completed}/${status.total}문제 정답 · 하루 3문제</span><span class="row-arrow" aria-hidden="true">→</span></a>`;
  }).join('');
  return `<section class="page-heading foundations-heading"><p class="eyebrow">언어 공통 실무 과정 · 26주</p><h1>개발할 때 필요한 기본 흐름을 익혀요.</h1><p>터미널과 Git부터 디버깅, HTTP, SQL, 테스트까지 단계별로 연습합니다. 계정이나 실제 서비스 연결은 필요하지 않아요.</p></section>
    <section class="content-section foundations-overview"><div class="section-heading"><div><h2>주차별 수업</h2></div><span class="section-count">배운 주 ${completedWeeks}/26</span></div>
      <div class="lesson-list foundations-week-list">${weekRows}</div>${paginationControls(page, 'foundations', '주차별 수업 페이지')}
    </section>
    ${sourceList(foundationsTrack.contentReview, '참고한 공식 문서')}`;
}

function foundationsWeekPage(unitId) {
  const match = /^week-(\d{2})$/.exec(unitId);
  const week = Number(match?.[1]);
  const lesson = foundationsTrack.lessons.find((item) => item.week === week);
  if (lesson) return lessonPage(lesson.id);
  if (!Number.isInteger(week) || week < 1 || week > foundationsTrack.course.weeks) return notFoundPage();
  return `<a class="back-link" href="#/foundations"><span aria-hidden="true">←</span> 공통 실무 기초</a><section class="empty-state page-empty"><p class="eyebrow">${week}주차</p><h1>이 주차는 아직 준비 중이에요.</h1><a class="button button-primary" href="#/foundations">다른 주차 보기</a></section>`;
}

function trackPage(trackId) {
  const track = getTrack(trackId);
  if (!track) return notFoundPage();
  const stats = trackProgress(track);
  return `<a class="back-link" href="#/tracks"><span aria-hidden="true">←</span> 배울 주제 전체 보기</a>
    <section class="track-heading"><p class="eyebrow">${escapeHtml(track.category)} · ${stats.done}/${stats.total}주 완료</p><h1>${escapeHtml(track.title)}</h1><p>${escapeHtml(track.objective)}</p><div class="progress-track track-total-progress" role="progressbar" aria-label="${escapeHtml(track.title)} 학습 진도" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${stats.percent}"><span style="width:${stats.percent}%"></span></div><p class="track-prerequisites"><strong>먼저 알면 좋은 내용</strong> ${escapeHtml(track.prerequisites.join(', '))}</p><p class="track-course-summary">${track.course.sessions}회 학습 · ${track.practiceMode ?? `${track.course.questions}문제`} · 주 5일, 하루 60~90분 기준</p></section>
    <section class="content-section lesson-list-section"><div class="section-heading"><div><p class="eyebrow">${track.topics.length}단계</p><h2>배울 내용</h2></div></div>
      <div class="stage-list">${track.topics.map((topic) => {
        const topicLessons = topic.lessonIds.map((lessonId) => getLesson(lessonId)).filter(Boolean);
        const done = topicLessons.filter(isLessonComplete).length;
        const weekRange = `${topicLessons[0]?.week ?? 0}–${topicLessons.at(-1)?.week ?? 0}주`;
        return `<a class="stage-row" href="#/topic/${topic.id}"><span class="stage-number">${String(topic.stage).padStart(2, '0')}</span><span class="stage-copy"><span class="stage-label">${topic.stage}단계 · ${weekRange}</span><strong>${escapeHtml(topic.title)}</strong><span>${escapeHtml(topic.objective)}</span></span><span class="stage-count">${done}/${topicLessons.length}주<br />${topicLessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0)}개 ${escapeHtml(track.practiceUnit)}</span><span class="row-arrow" aria-hidden="true">→</span></a>`;
      }).join('')}</div>
    </section>`;
}

function topicPage(topicId) {
  const item = getTopic(topicId);
  if (!item) return notFoundPage();
  const { topic, track, lessons: topicLessons } = item;
  return `<a class="back-link" href="${track.id === 'foundations' ? '#/foundations' : `#/track/${track.id}`}"><span aria-hidden="true">←</span> ${escapeHtml(track.title)} 과정</a>
    <section class="page-heading"><p class="eyebrow">${escapeHtml(track.title)} · ${topic.stage}단계 · ${topicLessons[0]?.week ?? 0}–${topicLessons.at(-1)?.week ?? 0}주</p><h1>${escapeHtml(topic.title)}</h1><p>${escapeHtml(topic.objective)}</p></section>
    <section class="content-section lesson-list-section"><div class="section-heading"><div><p class="eyebrow">이 단계에서 배우는 주차</p><h2>${topicLessons.length}주 · ${topicLessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0)}문제</h2></div></div>
      <div class="lesson-list">${topicLessons.map((lesson, index) => {
        const status = exerciseProgress(lesson);
        return `<a class="lesson-row" href="#/lesson/${lesson.id}"><span class="lesson-index ${status.done ? 'is-done' : ''}">${status.done ? '✓' : String(lesson.week).padStart(2, '0')}</span><span class="lesson-row-copy"><span class="lesson-row-stage">${lesson.week}주차 · ${escapeHtml(lesson.difficulty)}</span><span class="lesson-row-title">${escapeHtml(lesson.title)}</span><span class="lesson-row-subtitle">${escapeHtml(lesson.objective)}</span></span><span class="lesson-row-meta">${status.completed}/${status.total}문제 정답 · 주 5회</span><span class="row-arrow" aria-hidden="true">→</span></a>`;
      }).join('')}</div>
    </section>${sourceList(track.contentReview)}`;
}

function sourceList(review, label = '공식 문서') {
  return `<details class="content-source"><summary><span>${escapeHtml(label)}</span><span class="content-source-toggle"><span class="content-source-open">보기</span><span class="content-source-close">접기</span><svg class="content-source-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></span></summary><div class="content-source-content"><p>${escapeHtml(review.versionContext)} · 자료 기준일 ${escapeHtml(review.reviewedAt)}</p><ul>${review.sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></div></details>`;
}

function lessonNavigation(track, lesson) {
  const index = track.lessons.findIndex((item) => item.id === lesson.id);
  const previous = track.lessons[index - 1];
  const next = track.lessons[index + 1];
  return `<nav class="lesson-navigation" aria-label="주차 이동">
    ${previous ? `<a href="#/lesson/${previous.id}"><span>이전 주차</span><strong>${escapeHtml(previous.title)}</strong></a>` : '<span class="lesson-nav-empty">첫 주차</span>'}
    ${next ? `<a class="lesson-nav-next" href="#/lesson/${next.id}"><span>다음 주차</span><strong>${escapeHtml(next.title)}</strong></a>` : '<span class="lesson-nav-empty lesson-nav-next">마지막 주차</span>'}
  </nav>`;
}

function lessonPage(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return notFoundPage();
  const track = getTrack(lesson.trackId);
  const topic = track.topics.find((item) => item.id === lesson.topicId);
  const status = exerciseProgress(lesson);
  const firstExercise = nextExercise(lesson);
  const sessionSummaryVisible = lesson.showSessionSummary !== false;
  return `<a class="back-link" href="#/topic/${topic.id}"><span aria-hidden="true">←</span> ${escapeHtml(topic.title)} 주제</a>
    <div class="lesson-layout">
      <article class="lesson-article">
        <p class="eyebrow">${escapeHtml(track.title)} · ${lesson.week}주차 · 단계 ${lesson.stage}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lesson-lead">${escapeHtml(lesson.objective)}</p>
        <div class="lesson-meta-row"><span>회당 60~90분 기준</span><span>난이도 ${escapeHtml(lesson.difficulty)}</span>${lesson.referenceVersion ? `<span>${escapeHtml(lesson.referenceVersion)}</span>` : ''}${status.done ? `<span class="completed-pill">✓ 이번 주 완료</span>` : `<span>${status.completed}/${status.total}문제 정답</span>`}</div>
        <div class="lesson-body-copy">${lesson.intro ? `<p>${inlineText(lesson.intro)}</p>` : ''}${lesson.points.length ? `<h2>기억할 내용</h2><ul class="learning-points">${lesson.points.map((point) => `<li><span class="point-check" aria-hidden="true">✓</span><span>${inlineText(point)}</span></li>`).join('')}</ul>` : ''}<h2>짧은 예제</h2>${codeBlock(lesson.example, track.title)}</div>
        <section class="weekly-sessions" aria-labelledby="weekly-sessions-title"><div class="weekly-sessions-heading"><div><h2 id="weekly-sessions-title">5일 동안, 하루 세 문제</h2></div></div>${lesson.studyDays.map((session, sessionIndex) => {
          const sessionDayLabel = sessionIndex === 0 ? '오늘' : `${session.number}일차`;
          const sessionTitlePrefix = `${session.number}일차 · `;
          const sessionTitle = session.title.startsWith(sessionTitlePrefix) ? session.title.slice(sessionTitlePrefix.length) : session.title;
          const exampleHeading = sessionIndex === 0 ? '오늘의 예제' : `${session.number}일차 예제`;
          const exercisesHeading = sessionIndex === 0 ? '오늘의 세 문제' : `${session.number}일차 세 문제`;
          const dayStatus = exerciseProgress(session);
          const activityList = `<ol>${session.activities.map((activity) => `<li><span class="study-activity-time">${escapeHtml(activity.time)}</span><div><strong>${escapeHtml(activity.title)}</strong><p>${inlineText(activity.prompt)}</p></div></li>`).join('')}</ol>`;
          const activityTitle = sessionIndex === 0 ? '오늘 배울 내용' : `${sessionDayLabel}에 배울 내용`;
          const activitySection = session.activitiesCollapsed
            ? `<details class="study-activity"><summary>${activityTitle} 보기</summary>${activityList}</details>`
            : `<section class="study-activity" aria-label="${activityTitle}"><h3>${activityTitle}</h3>${activityList}</section>`;
          return `<details class="study-session-row${sessionIndex === 0 ? ' is-today' : ''}" ${sessionIndex === 0 ? 'open' : ''}><summary><span class="study-day-number">${session.number}일차</span><span class="study-session-summary"><strong>${escapeHtml(sessionTitle)}</strong>${sessionSummaryVisible ? `<small>${escapeHtml(session.objective)}</small>` : ''}</span><span class="study-session-count">${dayStatus.completed}/3문제 ${dayStatus.done ? '완료' : ''}</span></summary><div class="study-session-content">${sessionSummaryVisible && session.intro ? `<p>${inlineText(session.intro)}</p>` : ''}<h3>${exampleHeading}</h3>${codeBlock(session.example, session.exampleLanguage ?? track.title)}${activitySection}<h3 class="study-exercises-heading">${exercisesHeading}</h3><ol class="lesson-exercise-list">${session.exercises.map((exercise, index) => {
            const answer = latestAnswers().get(exercise.id);
            return `<li><a href="#/exercise/${exercise.id}"><span class="exercise-list-number">${index + 1}</span><span><strong>${escapeHtml(exercise.title)}</strong><small>${exerciseLabel(exercise)}</small></span><span class="exercise-list-state">${answer?.correct ? '정답' : answer ? '다시 풀기' : '시작'} <span aria-hidden="true">→</span></span></a></li>`;
          }).join('')}</ol></div></details>`;
        }).join('')}</section>
        ${sourceList(track.contentReview)}
      </article>
      <aside class="lesson-next-step"><p class="eyebrow">다음에 풀 문제</p><h2>${escapeHtml(firstExercise.title)}</h2><a class="button button-primary button-full" href="#/exercise/${firstExercise.id}">${status.done ? '문제 다시 풀기' : '문제 풀기'} <span aria-hidden="true">→</span></a></aside>
    </div>${lessonNavigation(track, lesson)}`;
}

function codeBlock(code, label = 'CODE', { copy = true } = {}) {
  const lines = String(code).split('\n').map((_, index) => index + 1).join('\n');
  const copyButton = copy ? `<button type="button" class="copy-code-button" data-copy-code="${escapeHtml(code)}">복사</button>` : '';
  return `<div class="code-block"><div class="code-block-bar"><span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${escapeHtml(label)}</span>${copyButton}</div><div class="code-block-body"><pre class="code-block-gutter" aria-hidden="true">${lines}</pre><pre><code class="language-${codeLanguageId(label)}">${highlightCode(code, label)}</code></pre></div></div>`;
}

function repairCriteria(exercise) {
  const criteria = exercise.acceptanceCriteria;
  if (exercise.type !== 'repair-code' || !criteria) return '';

  const list = (items) => `<ul>${items.map((item) => `<li>${inlineText(item)}</li>`).join('')}</ul>`;
  const examples = criteria.examples.map((example) => `<div class="repair-example"><span>입력</span><code>${escapeHtml(example.input)}</code><span>기대 결과</span><code>${escapeHtml(example.output)}</code></div>`).join('');
  const tests = criteria.tests.map((test) => `<tr><td><code>${escapeHtml(test.input)}</code></td><td><code>${escapeHtml(test.expected)}</code></td></tr>`).join('');

  return `<section class="repair-criteria-section" aria-labelledby="repair-criteria-heading">
    <h2 id="repair-criteria-heading">수정 기준</h2>
    <div class="repair-criteria-grid"><div><h3>요구사항</h3>${list(criteria.requirements)}</div><div><h3>제약</h3>${list(criteria.constraints)}</div></div>
    <div class="repair-example-list"><h3>입출력 예시</h3>${examples}</div>
    <table class="repair-test-table"><caption>추가 확인 사례</caption><thead><tr><th scope="col">입력</th><th scope="col">기대 결과</th></tr></thead><tbody>${tests}</tbody></table>
    <p class="repair-grading-note">${escapeHtml(exercise.gradingNote)}</p>
  </section>`;
}

function exerciseForm(exercise, { codingProblem = false } = {}) {
  const draft = codingProblem ? progress.codingDrafts[exercise.id] : progress.drafts[exercise.id];
  if (exercise.type === 'choice') {
    return `<fieldset class="answer-fieldset"><legend class="visually-hidden">답 하나를 골라 주세요</legend><div class="choice-list">${exercise.choices.map((choice, index) => `<label class="choice-option"><input type="radio" name="choice" value="${escapeHtml(choice.id)}" ${draft === choice.id ? 'checked' : ''} /><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span class="choice-text">${inlineText(choice.text)}</span><span class="choice-check" aria-hidden="true">✓</span></label>`).join('')}</div></fieldset>`;
  }
  if (exercise.type === 'short-answer') {
    return `<label class="field-label" for="short-answer">답을 적어 보세요</label><textarea class="answer-textarea short-answer-input" id="short-answer" name="short-answer" rows="3" maxlength="500" placeholder="배운 내용을 떠올려 적어 보세요." data-draft-id="${exercise.id}">${escapeHtml(typeof draft === 'string' ? draft : '')}</textarea><p class="field-hint">자동 채점은 등록된 답안 표현과 비교해요. 다르게 표현했다면 풀이의 기준 답안과 대조해 보세요.</p>`;
  }
  if (exercise.type === 'locate-error') {
    const selected = Array.isArray(draft) ? draft : [];
    return `<p class="field-label">오류가 있는 줄을 골라 보세요</p><div class="line-code" role="group" aria-label="오류가 있는 줄 고르기">${exercise.codeLines.map((line, index) => {
      const lineNumber = index + 1;
      return `<button type="button" class="code-line ${selected.includes(lineNumber) ? 'is-selected' : ''}" data-select-line="${lineNumber}" aria-pressed="${selected.includes(lineNumber)}"><span class="line-number">${lineNumber}</span><code>${escapeHtml(line)}</code></button>`;
    }).join('')}</div>`;
  }
  if (exercise.type === 'repair-code' || exercise.type === 'coding') {
    const value = typeof draft === 'string' ? draft : exercise.starterCode;
    const label = exercise.language ?? (exercise.type === 'coding' ? 'JavaScript' : '코드');
    const inputLabel = exercise.type === 'coding' ? `${label} 문제 코드 편집기` : `${label} 코드 수정 편집기`;
    const runnerHint = label === 'SQL · PostgreSQL'
      ? '실행할 때마다 임시 데이터가 초기화돼요. PostgreSQL 확장은 지원하지 않아요.'
      : label === 'TypeScript'
      ? '코드 결과를 채점하지만 타입 검사는 하지 않아요. 비밀 정보는 입력하지 마세요.'
      : exercise.adapterId === 'fastapi-asgi-v1'
        ? '요청은 외부 서버나 API로 보내지 않아요. 처음 준비할 때 최대 60초 걸릴 수 있어요.'
      : '코드는 브라우저에서 실행돼요. 비밀 정보는 입력하지 마세요.';
    const codingLabel = exercise.adapterId === 'fastapi-asgi-v1' ? 'FastAPI 앱 코드를 작성해 보세요' : '함수 코드를 작성해 보세요';
    return `<div class="editor-heading"><span class="field-label" id="code-answer-label">${exercise.type === 'coding' ? codingLabel : '코드를 고쳐 보세요'}</span><span class="editor-language"><i aria-hidden="true"></i>${escapeHtml(label)}</span></div><div class="editor-shell" data-code-editor><div class="editor-mount" data-editor-mount></div><textarea class="code-editor-source" id="code-answer" name="code-answer" hidden wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="20000" data-code-editor-input data-language="${codeLanguageId(label)}" data-draft-id="${exercise.id}"${codingProblem ? ' data-draft-scope="coding"' : ''} aria-label="${escapeHtml(inputLabel)}" aria-describedby="editor-key-hint">${escapeHtml(value)}</textarea></div><p class="editor-key-hint" id="editor-key-hint">Enter 자동 들여쓰기 · Tab 들여쓰기 · Shift+Tab 내어쓰기 · Escape 다음 버튼으로 이동 · 최대 20,000자</p>${exercise.type === 'coding' ? `<p class="field-hint">${runnerHint}</p>` : '<p class="field-hint">수정 기준과 추가 확인 사례를 보고 필요한 부분을 바꿔 보세요.</p>'}`;
  }
  return '';
}

function formatRunnerInput(exercise, test) {
  if (exercise.adapterId === 'postgresql-query-v1') return test.input || '(추가 입력 행 없음)';
  if (exercise.adapterId === 'fastapi-asgi-v1') return `${test.input.method} ${test.input.path}${test.input.query ? `\nquery=${formatExerciseValue(test.input.query)}` : ''}${Object.hasOwn(test.input, 'json') ? `\njson=${formatExerciseValue(test.input.json)}` : ''}`;
  const args = Array.isArray(test.input) ? test.input.map(formatExerciseValue) : [];
  return `${exercise.entryPoint}(${args.join(', ')})`;
}

function runnerResultsSection(exercise, result) {
  if (exercise.type !== 'coding') return '';
  if (!result) {
    return `<section class="runner-results is-empty" data-runner-results data-state="empty" aria-labelledby="runner-results-title">
      <div class="runner-results-heading"><div><h3 id="runner-results-title">실행 결과</h3></div><span class="runner-state-label">대기 중</span></div>
    </section>`;
  }

  const states = {
    passed: ['모든 테스트 통과', 'runner-passed'],
    partial: ['일부 테스트 실패', 'runner-partial'],
    error: ['실행 오류', 'runner-error'],
    timeout: ['시간 초과', 'runner-error'],
    unavailable: ['실행 공간을 사용할 수 없음', 'runner-error'],
  };
  const isPostgres = exercise.adapterId === 'postgresql-query-v1';
  const isFastApi = exercise.adapterId === 'fastapi-asgi-v1';
  const [label, stateClass] = states[result.state] ?? states.error;
  const results = Array.isArray(result.results) ? result.results : [];
  const cases = exercise.tests.map((item, index) => {
    const outcome = results[index];
    const passed = outcome?.passed === true;
    const caseLabel = outcome ? (passed ? '통과' : '실패') : '실행되지 않음';
    const caseClass = outcome ? (passed ? 'is-passed' : 'is-failed') : 'is-not-run';
    const inputLabel = isPostgres ? '예제 행 추가 SQL' : isFastApi ? 'HTTP 요청' : '입력 호출';
    const expectedLabel = isPostgres ? '기대 결과 행' : isFastApi ? '기대 HTTP 응답' : '기대 반환값';
    const actualLabel = isPostgres ? '실제 결과 행' : isFastApi ? '실제 HTTP 응답' : '실제 반환값';
    return `<li class="runner-case ${caseClass}">
      <div class="runner-case-heading"><strong>테스트 ${index + 1}</strong><span>${caseLabel}</span></div>
      <dl class="runner-values"><div><dt>${inputLabel}</dt><dd><pre>${escapeHtml(formatRunnerInput(exercise, item))}</pre></dd></div><div><dt>${expectedLabel}</dt><dd><pre>${escapeHtml(formatExerciseValue(item.expected))}</pre></dd></div><div><dt>${actualLabel}</dt><dd><pre>${escapeHtml(outcome?.actualAvailable ? outcome.actual : '결과를 받지 못했습니다.')}</pre></dd></div></dl>
      ${outcome?.error ? `<p class="runner-case-error">${escapeHtml(outcome.error)}</p>` : ''}
      ${outcome?.output ? `<div class="runner-case-stdout"><strong>이 사례의 출력</strong><pre>${escapeHtml(outcome.output)}</pre></div>` : ''}
    </li>`;
  }).join('');
  const stdout = result.output || results.map((item, index) => item.output ? `테스트 ${index + 1}\n${item.output}` : '').filter(Boolean).join('\n\n');
  const passedCount = result.passedCount ?? results.filter((item) => item.passed).length;
  const total = result.total ?? exercise.tests.length;

  return `<section class="runner-results ${stateClass}" data-runner-results data-state="${escapeHtml(result.state)}" aria-labelledby="runner-results-title">
    <div class="runner-results-heading"><div><p class="eyebrow">실행 결과</p><h3 id="runner-results-title">${label}</h3><p data-runner-state role="status" aria-live="polite">${passedCount}/${total}개 테스트 통과</p></div><span class="runner-state-label">${label}</span></div>
    ${result.error ? `<p class="runner-top-error">${escapeHtml(result.error)}</p>` : ''}
    ${isPostgres || isFastApi ? '' : `<section class="runner-stdout" aria-label="표준 출력"><h4>표준 출력</h4><pre>${escapeHtml(stdout || '출력된 내용이 없습니다.')}</pre>${result.outputWasTruncated ? '<p>출력이 1,800자 제한으로 일부 생략되었습니다.</p>' : ''}</section>`}
    <div class="runner-cases-heading"><h4>테스트별 결과</h4><span>${isPostgres ? 'PostgreSQL 결과 행을 비교합니다' : isFastApi ? 'ASGI 상태 코드와 JSON 응답을 비교합니다' : '값과 자료 구조를 비교합니다'}</span></div>
    <ol class="runner-case-list">${cases}</ol>
    <p class="runner-limit-note">이 결과는 화면에 제공된 테스트 사례만 확인합니다. 사례를 통과해도 모든 입력에 대한 정확성을 증명하지는 않습니다.</p>
  </section>`;
}

function exercisePromptContent(prompt) {
  const paragraphs = prompt.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return paragraphs.map((paragraph, index) => {
    const wrappedCode = paragraph.startsWith('`') && paragraph.endsWith('`') && paragraph.slice(1, -1).includes('\n');
    const rawCode = index === paragraphs.length - 1 && paragraph.includes('\n')
      && /^\s*(?:\/\/|#|@|public\b|private\b|protected\b|class\b|interface\b|record\b|import\b|export\b|const\b|let\b|function\b|def\b|return\b|if\s*\(|[\w$.<>?, ]+\s*\([^\)\n]*\)\s*\{)/m.test(paragraph);
    if (wrappedCode || rawCode) {
      const code = wrappedCode ? paragraph.slice(1, -1) : paragraph;
      return codeBlock(code, '문제 코드');
    }
    const labeledLines = paragraph.split('\n').map((line) => {
      const match = line.trim().match(/^([^:：]{1,48})[:：]\s*(.+)$/);
      return match ? { label: match[1].trim(), description: match[2].trim() } : null;
    });
    if (labeledLines.length > 1 && labeledLines.every(Boolean)) {
      return `<dl class="exercise-context-list">${labeledLines.map(({ label, description }) => `<div><dt>${inlineText(label)}</dt><dd>${inlineText(description)}</dd></div>`).join('')}</dl>`;
    }
    return `<p class="exercise-question-copy">${inlineText(paragraph)}</p>`;
  }).join('');
}

function answerFeedback(answer, exercise) {
  if (!answer) return '';
  const correct = answer.correct;
  const choiceExplanation = exercise.type === 'choice'
    ? exercise.choiceExplanations[String(answer.response)]
    : '';
  const note = answer.note || choiceExplanation;
  return `<section class="answer-feedback ${correct ? 'feedback-correct' : 'feedback-review'}" role="status"><span class="feedback-icon" aria-hidden="true">${correct ? '✓' : '↻'}</span><div><strong>${correct ? '잘했어요! 핵심을 정확히 짚었어요.' : '좋은 시도예요. 설명을 확인하고 다시 풀어 보세요.'}</strong>${note ? `<p>${escapeHtml(note)}</p>` : ''}</div></section>`;
}

function resolveExerciseRoute(id) {
  const exercise = getExercise(id);
  if (exercise) return { exercise, lesson: findLessonForExercise(exercise.id) };
  const problem = codingProblems.find((item) => item.id === id);
  if (problem?.runtime.status === 'verified' && problem.grading.mode === 'runtime-output') {
    return { exercise: toCodingExercise(problem), lesson: findLessonForExercise(problem.id) };
  }
  const legacyLesson = getLesson(id);
  if (legacyLesson) return { exercise: nextExercise(legacyLesson), lesson: legacyLesson };
  return null;
}

function exercisePage(exerciseId) {
  const resolved = resolveExerciseRoute(exerciseId);
  if (!resolved?.lesson || !resolved.exercise) return notFoundPage();
  const { lesson, exercise } = resolved;
  const track = getTrack(lesson.trackId);
  const lastAnswer = latestAnswers().get(exercise.id);
  const courseIndex = lesson.exercises.findIndex((item) => item.id === exercise.id);
  const session = lesson.studyDays.find((item) => item.exercises.some((question) => question.id === exercise.id));
  const sessionIndex = session.exercises.findIndex((item) => item.id === exercise.id);
  const previous = lesson.exercises[courseIndex - 1] ?? track.lessons[lesson.number - 2]?.exercises.at(-1);
  const next = lesson.exercises[courseIndex + 1] ?? track.lessons[lesson.number]?.exercises[0];
  const answers = latestAnswers();
  const status = exerciseProgress(lesson);
  const courseLink = track.id === 'foundations' ? '#/foundations' : `#/track/${track.id}`;
  const sessionGoal = lesson.showSessionSummary === false ? '' : `<aside class="exercise-side"><p><strong>오늘의 목표</strong><br />${escapeHtml(session.objective)}</p></aside>`;
  return `<a class="back-link" href="#/lesson/${lesson.id}"><span aria-hidden="true">←</span> ${escapeHtml(lesson.title)} 학습으로</a>
    <section class="exercise-heading"><p class="eyebrow">${escapeHtml(track.title)} · ${lesson.week}주차 · ${session.number}일차 ${escapeHtml(session.title)}</p><h1>${escapeHtml(exercise.title)}</h1><div class="exercise-heading-meta"><span class="question-type-pill">${exerciseLabel(exercise)}</span><span>주간 진도 ${status.completed}/15</span></div></section>
    <nav class="question-navigation" aria-label="오늘의 세 문제">${session.exercises.map((item, index) => {
      const answer = answers.get(item.id);
      const active = item.id === exercise.id;
      const state = answer?.correct ? '정답' : answer ? '다시 풀기' : '미풀이';
      return `<a class="question-nav-item ${active ? 'is-current' : ''} ${answer?.correct ? 'is-correct' : ''}" href="#/exercise/${item.id}" ${active ? 'aria-current="step"' : ''}><span>${answer?.correct ? '✓' : String(index + 1)}</span><span>문제 ${index + 1}<small>${state}</small></span></a>`;
    }).join('')}</nav>
    <div class="exercise-layout"><article class="exercise-main">
        <section class="exercise-prompt-section" aria-labelledby="exercise-prompt-title"><div class="exercise-section-heading"><h2 id="exercise-prompt-title">문제</h2></div><div class="exercise-prompt">${exercisePromptContent(exercise.prompt)}</div></section>
        ${exercise.type === 'coding' ? `<div class="coding-requirements"><span class="requirements-icon" aria-hidden="true">↳</span><span>${inlineText(exercise.acceptanceCriteria?.requirements?.join(' ') ?? '각 입력에 대해 문제에서 요구한 반환값을 돌려주세요.')}</span></div>` : ''}
        ${repairCriteria(exercise)}
        <section class="answer-section" aria-labelledby="answer-section-title"><div class="exercise-section-heading"><h2 id="answer-section-title">${exercise.type === 'choice' ? '답변 선택' : exercise.type === 'locate-error' ? '오류 줄 선택' : exercise.type === 'repair-code' || exercise.type === 'coding' ? '코드 작성' : '답변 작성'}</h2></div><form id="answer-form" data-exercise-form="${exercise.type}">${exerciseForm(exercise)}
          <div class="answer-actions"><button class="button button-primary" type="submit" data-submit-answer>${exercise.type === 'coding' ? '코드 실행하고 확인' : '답 확인하기'} <span aria-hidden="true">→</span></button>${exercise.type === 'coding' ? '<span class="runner-status" data-runner-status role="status" aria-live="polite"></span>' : ''}</div>
        </form>${runnerResultsSection(exercise, lastAnswer?.execution)}</section>
        <div id="answer-feedback">${answerFeedback(lastAnswer, exercise)}</div>
        <details class="hint-disclosure"><summary><span class="hint-light" aria-hidden="true">✦</span>막혔나요? 힌트 보기</summary><p>${inlineText(exercise.hint)}</p></details>
      <details class="solution-disclosure"><summary><span>정답과 풀이 설명 보기</span></summary><section class="solution-content"><div class="solution-heading"><div><p class="eyebrow">정답과 해설</p><h2>풀이 설명</h2></div></div><p>${inlineText(exercise.explanation)}</p></section></details>
       <nav class="exercise-bottom-actions" aria-label="문제 이동"><a class="button button-secondary" href="#/lesson/${lesson.id}">개념 다시 보기</a>${previous ? `<a class="question-move" href="#/exercise/${previous.id}">← 이전 문제</a>` : '<span class="question-move is-muted">첫 문제</span>'}${next ? `<a class="button button-primary" href="#/exercise/${next.id}">다음 문제 <span aria-hidden="true">→</span></a>` : `<a class="button button-primary" href="${courseLink}">과정으로 돌아가기 <span aria-hidden="true">→</span></a>`}</nav>
    </article>${sessionGoal}</div>`;
}

function codingProblemState(problem) {
  const latest = latestCodingAnswers().get(problem.id);
  const hasSolvedBefore = progress.codingAnswers.some((answer) => answer.exerciseId === problem.id && answer.correct);
  if (latest?.correct) return { key: 'solved', label: '해결' };
  if (hasSolvedBefore) return { key: 'review', label: '복습 필요' };
  if (latest || (typeof progress.codingDrafts[problem.id] === 'string' && progress.codingDrafts[problem.id] !== problem.starterCode)) {
    return { key: 'in-progress', label: '진행 중' };
  }
  return { key: 'not-started', label: '미풀이' };
}

function paginationControls(page, kind, label) {
  if (page.totalPages <= 1) return '';
  const pageButton = (number) => number === page.page
    ? `<span class="pagination-page is-current" aria-current="page" aria-label="${number}페이지, 현재 페이지" tabindex="-1">${number}</span>`
    : `<button class="pagination-page" type="button" data-pagination-kind="${kind}" data-pagination-page="${number}" aria-label="${number}페이지">${number}</button>`;
  const pageItems = page.pages.map((number) => number === '…'
    ? '<span class="pagination-gap" aria-hidden="true">…</span>'
    : pageButton(number)).join('');
  return `<nav class="pagination-controls" aria-label="${label}">
    <button class="pagination-step" type="button" data-pagination-kind="${kind}" data-pagination-page="${page.page - 1}" ${page.page === 1 ? 'disabled' : ''}>이전</button>
    <div class="pagination-pages">${pageItems}</div>
    <button class="pagination-step" type="button" data-pagination-kind="${kind}" data-pagination-page="${page.page + 1}" ${page.page === page.totalPages ? 'disabled' : ''}>다음</button>
  </nav>`;
}

function applyCodingFilters() {
  const section = document.querySelector('.coding-catalog-section');
  if (!section) return;
  const value = (name) => section.querySelector(`[data-coding-filter="${name}"]`)?.value.trim().toLocaleLowerCase('ko-KR') ?? '';
  const search = value('search');
  const language = value('language');
  const level = value('level');
  const topic = value('topic');
  const status = value('status');
  const matchingRows = [];
  section.querySelectorAll('[data-coding-row]').forEach((row) => {
    const matches = (!language || row.dataset.language === language)
      && (!level || row.dataset.level.toLocaleLowerCase('ko-KR') === level)
      && (!topic || row.dataset.topics.split(',').includes(topic))
      && (!status || row.dataset.status === status)
      && (!search || row.dataset.searchText.includes(search));
    row.hidden = !matches;
    if (matches) matchingRows.push(row);
  });
  const visible = matchingRows.length;
  const page = paginationState(visible, codingCatalogPageNumber, 20);
  codingCatalogPageNumber = page.page;
  matchingRows.forEach((row, index) => {
    row.hidden = index < page.startIndex || index >= page.endIndex;
  });
  const count = section.querySelector('[data-coding-count]');
  if (count) count.textContent = `${visible}개 문제`;
  const empty = section.querySelector('[data-coding-empty]');
  if (empty) empty.hidden = visible > 0;
  const pagination = section.querySelector('[data-coding-pagination]');
  if (pagination) pagination.innerHTML = paginationControls(page, 'coding', '코딩 문제 페이지');
}

function saveCodingFilters() {
  const section = document.querySelector('.coding-catalog-section');
  if (!section) return;
  const read = (name) => section.querySelector(`[data-coding-filter="${name}"]`)?.value ?? '';
  progress.codingFilters = {
    search: read('search').trim().slice(0, 100),
    language: read('language').slice(0, 50),
    level: read('level').slice(0, 50),
    topic: read('topic').slice(0, 120),
    status: read('status'),
  };
  persistProgress();
}

function codingCatalogPage(language = '') {
  const runnableProblems = codingProblems.filter((problem) =>
    problem.review.status === 'approved'
    &&
    problem.runtime.status === 'verified'
    && problem.grading.mode === 'runtime-output');
  const languages = [...new Set(runnableProblems.map((problem) => problem.language))];
  const topics = [...new Set(runnableProblems.flatMap((problem) => problem.topicIds))];
  const levels = [...new Set(runnableProblems.map((problem) => problem.level))];
  const filters = progress.codingFilters ?? { search: '', language: '', level: '', topic: '', status: '' };
  const selectedLanguage = language.toLowerCase() || (languages.includes(filters.language) ? filters.language : '');
  const selectedLevel = levels.includes(filters.level) ? filters.level : '';
  const selectedTopic = topics.includes(filters.topic) ? filters.topic : '';
  const languageTrack = tracks.find((track) => track.id === selectedLanguage);
  const visibleProblems = selectedLanguage
    ? runnableProblems.filter((problem) => problem.language === selectedLanguage)
    : runnableProblems;
  const topicLabel = (topicId) => getTopic(topicId)?.topic.title ?? topicId;
  const languageOptions = languages.map((id) =>
    `<option value="${escapeHtml(id)}" ${selectedLanguage === id ? 'selected' : ''}>${escapeHtml(codingLanguageTitle(id))}</option>`,
  ).join('');
  const levelOptions = levels
    .map((level) => `<option value="${escapeHtml(level)}" ${selectedLevel === level ? 'selected' : ''}>${escapeHtml(level)}</option>`).join('');
  const topicOptions = topics.map((topicId) => `<option value="${escapeHtml(topicId)}" ${selectedTopic === topicId ? 'selected' : ''}>${escapeHtml(topicLabel(topicId))}</option>`).join('');
  const rows = visibleProblems.map((problem) => {
    const state = codingProblemState(problem);
    const track = tracks.find((item) => item.id === problem.language);
    const topicNames = problem.topicIds.map(topicLabel);
    const keywords = [problem.title, problem.objective, problem.statement, ...problem.requirements, ...topicNames, codingLanguageTitle(problem.language)]
      .join(' ');
    return `<a class="coding-problem-row" href="#/coding/problem/${encodeURIComponent(problem.id)}" data-coding-row data-language="${escapeHtml(problem.language)}" data-level="${escapeHtml(problem.level)}" data-topics="${escapeHtml(problem.topicIds.join(','))}" data-status="${state.key}" data-search-text="${escapeHtml(keywords.toLocaleLowerCase('ko-KR'))}">
      <span class="coding-row-meta"><span>${escapeHtml(problem.level)}</span><span class="coding-problem-state state-${state.key}">${state.label}</span></span>
      <span class="coding-row-title">${escapeHtml(problem.title)}</span>
      <span class="coding-row-copy">${escapeHtml(problem.objective)}</span>
      <span class="coding-row-detail">${escapeHtml(codingLanguageTitle(problem.language))} · ${escapeHtml(topicNames.join(' · '))} · 약 ${problem.estimatedMinutes}분</span>
      <span class="coding-row-action">문제 풀기 <span aria-hidden="true">→</span></span>
    </a>`;
  }).join('');
  const languageDirectoryTracks = languages.map((id) =>
    tracks.find((track) => track.id === id) ?? { id, title: codingLanguageTitle(id) },
  );
  const languageDirectory = languageDirectoryTracks
    .map((track) => {
      const count = runnableProblems.filter((problem) => problem.language === track.id).length;
      return `<a class="coding-language-link ${track.id === selectedLanguage ? 'is-current' : ''}" href="#/coding/${encodeURIComponent(track.id)}">${trackMark(track, 'coding-language-mark')}<span><strong>${escapeHtml(track.title)}</strong><small>${count}개 실행 문제</small></span></a>`;
    }).join('');
  const noLanguageProblems = Boolean(language) && runnableProblems.every((problem) => problem.language !== selectedLanguage);
  return `<section class="page-heading coding-heading"><h1>코딩 문제</h1><p>문제의 요구사항을 읽고 코드를 작성한 뒤, 입력 사례마다 나온 결과로 확인해 보세요. 작성 방식은 자유롭고 테스트 결과로 채점합니다.</p></section>
    <section class="content-section coding-catalog-section" aria-labelledby="coding-catalog-title">
      <div class="section-heading"><div><p class="eyebrow">문제 목록</p><h2 id="coding-catalog-title">어떤 언어와 주제를 배워볼까요?</h2></div><span class="section-count" data-coding-count aria-live="polite">${visibleProblems.length}개 문제</span></div>
      <div class="coding-filters" data-coding-catalog>
        <label class="coding-search-field">문제 검색<input type="search" data-coding-filter="search" placeholder="문제 이름이나 개념 검색" value="${escapeHtml(filters.search)}" /></label>
        <label>언어<select data-coding-filter="language"><option value="">모든 실행 가능 언어</option>${languageOptions}</select></label>
        <label>난이도<select data-coding-filter="level"><option value="">모든 난이도</option>${levelOptions}</select></label>
        <label>주제<select data-coding-filter="topic"><option value="">모든 주제</option>${topicOptions}</select></label>
        <label>내 풀이<select data-coding-filter="status"><option value="">모든 상태</option><option value="not-started" ${filters.status === 'not-started' ? 'selected' : ''}>미풀이</option><option value="in-progress" ${filters.status === 'in-progress' ? 'selected' : ''}>진행 중</option><option value="review" ${filters.status === 'review' ? 'selected' : ''}>복습 필요</option><option value="solved" ${filters.status === 'solved' ? 'selected' : ''}>해결</option></select></label>
        <button class="button button-outline coding-filter-reset" type="button" data-coding-reset>조건 초기화</button>
      </div>
      ${noLanguageProblems ? `<div class="empty-state coding-empty-state"><strong>${escapeHtml(codingLanguageTitle(selectedLanguage))} 코딩 문제는 아직 없어요.</strong><p>개념 문제는 과정에서 풀 수 있어요.</p>${languageTrack ? `<a class="button button-secondary" href="#/track/${languageTrack.id}">${escapeHtml(languageTrack.title)} 과정 보기 <span aria-hidden="true">→</span></a>` : '<a class="button button-secondary" href="#/coding">모든 코딩 문제 보기</a>'}</div>` : `<div class="coding-problem-list" data-coding-results>${rows}</div><div class="empty-state coding-empty-state" data-coding-empty hidden><strong>조건에 맞는 문제가 없어요</strong><p>검색어와 필터를 바꾸거나 초기화해 보세요.</p></div><div data-coding-pagination></div>`}
    </section>
    <section class="content-section coding-language-section"><div class="section-heading"><div><h2>언어와 프레임워크</h2></div></div><p class="coding-language-note">개념 문제는 각 과정에서 풀 수 있어요.</p><div class="coding-language-list">${languageDirectory}</div></section>`;
}

function codingProblemPage(problemId) {
  const problem = codingProblems.find((item) => item.id === problemId);
  if (!problem || problem.review.status !== 'approved' || problem.runtime.status !== 'verified' || problem.grading.mode !== 'runtime-output') {
    return `<a class="back-link" href="#/coding"><span aria-hidden="true">←</span> 코딩 문제 목록</a><div class="empty-state page-empty"><h1>이 문제는 아직 준비되지 않았어요.</h1><p>코딩 문제 목록에서 다른 문제를 골라 주세요.</p><a class="button button-primary" href="#/coding">코딩 문제 목록 보기</a></div>`;
  }
  const exercise = toCodingExercise(problem);
  const latest = latestCodingAnswers().get(problem.id);
  const state = codingProblemState(problem);
  const isPostgres = problem.contract.kind === 'sql';
  const isFastApi = problem.contract.kind === 'asgi-app';
  const topicNames = problem.topicIds.map((topicId) => getTopic(topicId)?.topic.title ?? topicId);
  const schemaExample = isPostgres ? `<article class="coding-example"><h3>이번 문제의 테이블</h3><p>${escapeHtml(problem.database.description)}</p><pre>${escapeHtml(problem.database.setup)}</pre></article>` : '';
  const examples = schemaExample + problem.examples.map((example, index) => `<article class="coding-example"><h3>예시 ${index + 1}</h3><dl><div><dt>${isPostgres ? '예제 행 추가 SQL' : isFastApi ? '요청' : '입력'}</dt><dd><pre>${escapeHtml(formatCodingExampleValue(example.input))}</pre></dd></div><div><dt>${isPostgres ? '기대 결과 행' : isFastApi ? '기대 HTTP 응답' : '기대 결과'}</dt><dd><pre>${escapeHtml(formatCodingExampleValue(example.expected))}</pre></dd></div></dl>${example.explanation ? `<p>${escapeHtml(example.explanation)}</p>` : ''}</article>`).join('');
  const requirements = problem.requirements.map((item) => `<li>${inlineText(item)}</li>`).join('');
  const constraints = problem.constraints.map((item) => `<li>${inlineText(item)}</li>`).join('');
  const hints = problem.hints.map((hint, index) => `<details class="hint-disclosure"><summary><span class="hint-light" aria-hidden="true">✦</span>힌트 ${index + 1} 보기</summary><p>${inlineText(hint)}</p></details>`).join('');
  const commonMistakes = (problem.commonMistakes ?? []).map((mistake) => `<li>${inlineText(mistake)}</li>`).join('');
  const sources = problem.sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} <span aria-hidden="true">↗</span></a><span>확인일 ${escapeHtml(source.reviewedAt)}</span></li>`).join('');
  const languageProblems = codingProblems.filter((item) => item.language === problem.language && item.runtime.status === 'verified');
  const position = languageProblems.findIndex((item) => item.id === problem.id) + 1;
  const nextProblem = codingProblems.find((item) => item.language === problem.language && item.prerequisiteIds.includes(problem.id) && item.runtime.status === 'verified');
  const track = tracks.find((item) => item.id === problem.language);
  const languageTitle = codingLanguageTitle(problem.language);
  return `<a class="back-link" href="#/coding/${encodeURIComponent(problem.language)}"><span aria-hidden="true">←</span> ${escapeHtml(languageTitle)} 코딩 문제</a>
    <section class="coding-problem-heading"><p class="eyebrow">${escapeHtml(languageTitle)} · ${escapeHtml(topicNames.join(' · '))}</p><h1>${escapeHtml(problem.title)}</h1><p>${escapeHtml(problem.objective)}</p><div class="coding-problem-badges"><span>${escapeHtml(problem.level)}</span><span>문제 ${position} / ${languageProblems.length}</span><span>약 ${problem.estimatedMinutes}분</span><span>${escapeHtml(problem.versionContext)}</span><span class="coding-problem-state state-${state.key}">${state.label}</span></div></section>
    <div class="coding-workspace-layout"><article>
      <section class="coding-statement-section" aria-labelledby="coding-statement-title"><div class="exercise-section-heading"><h2 id="coding-statement-title">문제 설명</h2></div><div class="coding-statement">${inlineText(problem.statement)}</div><dl class="coding-contract"><div><dt>${isPostgres ? '예제 데이터' : isFastApi ? 'HTTP 요청' : '입력'}</dt><dd>${escapeHtml(problem.contract.inputDescription)}</dd></div><div><dt>${isPostgres ? '결과 행' : isFastApi ? 'HTTP 응답' : '반환값'}</dt><dd>${escapeHtml(problem.contract.outputDescription)}</dd></div>${isPostgres ? '' : `<div><dt>${isFastApi ? 'ASGI 진입점' : '함수 이름'}</dt><dd><code>${isFastApi ? 'app' : escapeHtml(problem.contract.entryPoint)}</code></dd></div>`}</dl></section>
      <section class="coding-criteria-section" aria-labelledby="coding-criteria-title"><div class="exercise-section-heading"><h2 id="coding-criteria-title">요구사항과 조건</h2></div><div class="coding-criteria-grid"><div><h3>요구사항</h3><ul>${requirements}</ul></div><div><h3>제약</h3><ul>${constraints}</ul></div></div></section>
      <section class="coding-examples-section" aria-labelledby="coding-examples-title"><div class="exercise-section-heading"><h2 id="coding-examples-title">입출력 예제</h2></div><div class="coding-example-list">${examples}</div></section>
      <section class="coding-editor-section" aria-labelledby="coding-editor-title"><div class="exercise-section-heading"><h2 id="coding-editor-title">코드 작성과 실행</h2></div><p class="coding-editor-intro">${isFastApi ? 'FastAPI 앱을 작성하고 공개 요청 테스트로 상태 코드와 JSON 응답을 확인해 보세요.' : '예제를 모두 만족하는 코드를 작성해 실행해 보세요. 형식이나 알고리즘은 달라도 테스트 결과가 같으면 통과합니다.'}</p><form id="answer-form" data-exercise-form="coding">${exerciseForm(exercise, { codingProblem: true })}<div class="answer-actions"><button class="button button-primary" type="submit" data-submit-answer>${isPostgres ? '질의 실행하고 결과 채점' : isFastApi ? '앱 실행하고 요청 채점' : '코드 실행하고 채점'} <span aria-hidden="true">→</span></button><span class="answer-save-hint">작성한 코드는 이 기기에 저장돼요.</span><span class="runner-status" data-runner-status role="status" aria-live="polite"></span></div></form>${runnerResultsSection(exercise, latest?.execution)}<div id="answer-feedback">${answerFeedback(latest, exercise)}</div></section>
      <section class="coding-help-section" aria-labelledby="coding-help-title"><div class="exercise-section-heading"><h2 id="coding-help-title">막혔을 때</h2></div>${hints}${commonMistakes ? `<details class="hint-disclosure"><summary><span class="hint-light" aria-hidden="true">!</span>자주 하는 실수 보기</summary><ul>${commonMistakes}</ul></details>` : ''}<details class="solution-disclosure"><summary><span>정답 코드와 풀이 보기</span></summary><section class="solution-content"><div class="solution-heading"><div><p class="eyebrow">참고 구현 · ${escapeHtml(problem.solution.complexity)}</p><h2>풀이 설명</h2></div></div><p>${inlineText(problem.solution.explanation)}</p>${codeBlock(problem.solution.referenceImplementation, languageTitle)}</section></details></section>
      <nav class="exercise-bottom-actions" aria-label="코딩 문제 이동">${track ? `<a class="button button-secondary" href="#/track/${encodeURIComponent(problem.language)}">${escapeHtml(languageTitle)} 개념 배우기</a>` : `<span class="button button-secondary is-disabled" aria-disabled="true">${escapeHtml(languageTitle)} 과정 준비 중</span>`}<a class="question-move" href="#/coding">전체 코딩 문제</a>${nextProblem ? `<a class="button button-primary" href="#/coding/problem/${encodeURIComponent(nextProblem.id)}">다음 문제 <span aria-hidden="true">→</span></a>` : `<a class="button button-primary" href="#/coding/${encodeURIComponent(problem.language)}">다른 문제 보기 <span aria-hidden="true">→</span></a>`}</nav>
      <section class="coding-sources-section"><h2>참고 자료</h2><ul>${sources}</ul></section>
    </article></div>`;
}

function profilePage() {
  const completeCount = completedLessonCount();
  const legacyCompleteCount = progress.legacyCompletedLessonIds.length;
  const latestByEvent = new Map([
    ...[...latestAnswers().values()].map((answer) => [`learning:${answer.exerciseId}`, answer]),
    ...[...latestCodingAnswers().values()].map((answer) => [`coding:${answer.exerciseId}`, answer]),
  ]);
  const latest = [...new Map([...latestByEvent.values()].map((answer) => [
    `${answer.exerciseId}:${answer.answeredAt}:${answer.correct}`,
    answer,
  ])).values()];
  const correctCount = latest.filter((answer) => answer.correct).length;
  const accuracy = latest.length ? Math.round((correctCount / latest.length) * 100) : 0;
  const recent = recentAnswerEvents(8);
  const recordedAttempts = recentAnswerEvents(1_000).length;
  return `<section class="page-heading profile-heading"><h1>내 학습 기록</h1><p>로그인 없이 진도를 이 브라우저에 저장해요.</p></section>
    <section class="profile-stats-grid"><article class="profile-stat"><span class="stat-caption">완료한 주차</span><strong>${completeCount}<small>주</small></strong>${legacyCompleteCount ? `<span class="stat-foot">이전 과정 완료 ${legacyCompleteCount}주 기록도 보존됩니다.</span>` : ''}</article><article class="profile-stat"><span class="stat-caption">최근 문제 정답률</span><strong>${latest.length ? `${accuracy}%` : '—'}</strong><span class="stat-foot">학습 문제와 코딩 문제별 최근 결과</span></article><article class="profile-stat"><span class="stat-caption">풀이 기록</span><strong>${recordedAttempts}<small>회</small></strong><span class="stat-foot">학습·코딩 문제 합계</span></article></section>
    <div class="profile-layout"><section class="profile-section"><div class="section-heading"><div><h2>최근에 푼 문제</h2></div></div>
      ${recent.length ? `<div class="recent-list">${recent.map((answer) => {
        const problem = codingProblems.find((item) => item.id === answer.exerciseId);
        const lesson = findLessonForExercise(answer.exerciseId);
        const track = lesson ? getTrack(lesson.trackId) : null;
        const date = new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(new Date(answer.answeredAt));
        const exercise = getExercise(answer.exerciseId);
        if (answer.context === 'coding' && problem) {
          const codingTrack = tracks.find((item) => item.id === problem.language);
          return `<a class="recent-row" href="#/coding/problem/${encodeURIComponent(problem.id)}">${trackMark(codingTrack ?? problem.language, 'recent-mark')}<span class="recent-copy"><strong>${escapeHtml(problem.title)}</strong><small>${escapeHtml(codingLanguageTitle(problem.language))} · 코딩 문제 · ${date}</small></span><span class="recent-result ${answer.correct ? 'is-correct' : 'is-review'}">${answer.correct ? '정답' : '복습'} <span aria-hidden="true">→</span></span></a>`;
        }
        if (!lesson || !track || !exercise) return '';
        return `<a class="recent-row" href="#/exercise/${exercise.id}">${trackMark(track, 'recent-mark')}<span class="recent-copy"><strong>${escapeHtml(exercise.title)}</strong><small>${escapeHtml(track.title)} · ${date}</small></span><span class="recent-result ${answer.correct ? 'is-correct' : 'is-review'}">${answer.correct ? '정답' : '복습'} <span aria-hidden="true">→</span></span></a>`;
      }).join('')}</div>` : `<div class="empty-state"><span class="empty-icon" aria-hidden="true">◷</span><strong>아직 저장된 풀이가 없어요</strong><p>첫 문제를 풀면 여기에 기록이 쌓여요.</p><a class="button button-small button-primary" href="#/tracks">학습 시작하기</a></div>`}
    </section><aside class="profile-section backup-section"><h2>다른 기기로 기록 옮기기</h2><p>기록 파일을 내보낸 뒤, 다른 기기에서 가져오세요.</p><button class="button button-secondary button-full" type="button" data-action="export-progress">기록 파일 내보내기 <span aria-hidden="true">↓</span></button><label class="button button-outline button-full import-button">백업 파일 가져오기 <span aria-hidden="true">↑</span><input type="file" accept="application/json,.json" data-action="import-progress" /></label><p class="backup-caption">백업 파일은 최대 1MB까지 가져올 수 있어요.</p></aside></div>
    <section class="storage-info"><span class="storage-info-icon" aria-hidden="true">◉</span><div><strong>기록 보관</strong><p>브라우저 데이터를 지우면 학습 기록도 사라질 수 있어요. 백업 파일을 따로 보관해 주세요.</p></div><button class="text-button danger-text" type="button" data-action="reset-progress">이 기기의 기록 초기화</button></section>`;
}

function notFoundPage() {
  return `<section class="empty-state page-empty"><span class="empty-icon" aria-hidden="true">?</span><h1>페이지를 찾을 수 없어요.</h1><p>과정에서 다른 주제를 골라 주세요.</p><a class="button button-primary" href="#/tracks">배울 주제 보기</a></section>`;
}

function render({ focus = false } = {}) {
  for (const editor of codeEditors.values()) editor.destroy();
  codeEditors.clear();
  const route = routeFromHash();
  const routeKey = `${route.page}:${route.id}`;
  const routeChanged = routeKey !== renderedRouteKey;
  if (routeChanged) {
    codingCatalogPageNumber = 1;
    foundationsPageNumber = 1;
    renderedRouteKey = routeKey;
  }
  let content;
  switch (route.page) {
    case 'tracks': content = tracksPage(); break;
    case 'track': content = trackPage(route.id); break;
    case 'topic': content = topicPage(route.id); break;
    case 'lesson': content = lessonPage(route.id); break;
    case 'exercise': content = exercisePage(route.id); break;
    case 'coding': content = codingCatalogPage(route.id); break;
    case 'coding-problem': content = codingProblemPage(route.id); break;
    case 'foundations': content = route.id ? foundationsWeekPage(route.id) : foundationsPage(); break;
    case 'profile': content = profilePage(); break;
    default: content = homePage();
  }
  app.innerHTML = shell(route.page, content);
  app.querySelectorAll('[data-code-editor-input]').forEach((source) => {
    const parent = source.closest('[data-code-editor]')?.querySelector('[data-editor-mount]');
    if (!parent) return;
    const editor = createCodeEditor({
      parent,
      source,
      onEscape: () => source.closest('form')?.querySelector('[data-submit-answer]')?.focus(),
    });
    codeEditors.set(source, editor);
  });
  if (route.page === 'coding') applyCodingFilters();
  if (focus) {
    const heading = app.querySelector('#main-content h1, #main-content h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  if (routeChanged) window.scrollTo(0, 0);
}

function announce(message, kind = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${kind}`;
  toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  toast.innerHTML = `<span aria-hidden="true">${kind === 'error' ? '!' : '✓'}</span><span class="toast-message">${escapeHtml(message)}</span>`;
  const storageFailure = toastRegion.querySelector('[data-storage-failure]');
  if (storageFailure) {
    toastRegion.querySelectorAll('.toast:not([data-storage-failure])').forEach((item) => item.remove());
    toastRegion.append(toast);
  } else {
    toastRegion.replaceChildren(toast);
  }
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.remove();
    toastTimer = undefined;
  }, 3200);
}

function updateStorageIndicator() {
  const indicator = document.querySelector('.save-indicator');
  if (!indicator) return;
  const mode = getStorageMode();
  indicator.setAttribute('aria-label', mode);
  indicator.classList.toggle('is-error', mode === '저장 실패');
  const dot = indicator.querySelector('i') ?? document.createElement('i');
  dot.setAttribute('aria-hidden', 'true');
  indicator.replaceChildren(dot, document.createTextNode(mode));
}

function announceStorageFailure() {
  clearTimeout(toastTimer);
  toastTimer = undefined;
  const toast = document.createElement('div');
  toast.className = 'toast toast-error toast-storage-failure';
  toast.dataset.storageFailure = 'true';
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span aria-hidden="true">!</span><div class="toast-body"><p>학습 기록을 저장하지 못했어요. 지금 변경한 내용은 이 화면에만 남아 있어요. 페이지를 닫거나 새로고침하기 전에 다시 저장하거나 백업해 주세요.</p><div class="toast-actions"><button class="button button-secondary button-small" type="button" data-action="retry-progress-save">다시 저장</button><button class="button button-outline button-small" type="button" data-action="export-progress">기록 백업</button></div></div>`;
  toastRegion.querySelector('[data-storage-failure]')?.remove();
  toastRegion.querySelectorAll('.toast:not([data-storage-failure])').forEach((item) => item.remove());
  toastRegion.prepend(toast);
}

function announceStorageConflict() {
  clearTimeout(toastTimer);
  toastTimer = undefined;
  const toast = document.createElement('div');
  toast.className = 'toast toast-error toast-storage-failure';
  toast.dataset.storageFailure = 'true';
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span aria-hidden="true">!</span><div class="toast-body"><p>다른 탭에서 기록이 바뀌어 저장하지 못했어요. 이 화면의 변경 내용은 백업한 뒤 최신 기록을 불러와 주세요.</p><div class="toast-actions"><button class="button button-secondary button-small" type="button" data-action="export-progress">기록 백업</button><button class="button button-outline button-small" type="button" data-action="reload-progress">최신 기록 불러오기</button></div></div>`;
  toastRegion.querySelector('[data-storage-failure]')?.remove();
  toastRegion.querySelectorAll('.toast:not([data-storage-failure])').forEach((item) => item.remove());
  toastRegion.prepend(toast);
}

function clearStorageFailure() {
  const failure = toastRegion.querySelector('[data-storage-failure]');
  if (!failure) return false;
  failure.remove();
  return true;
}

function persistProgress({ immediate = false } = {}) {
  clearTimeout(saveTimer);
  const save = async (snapshot = structuredClone(progress)) => {
    const queuedSave = saveQueue.catch(() => undefined).then(() => saveProgress({
      ...snapshot,
      updatedAt: progress.updatedAt,
    }));
    saveQueue = queuedSave;
    try {
      const saved = await queuedSave;
      progress.updatedAt = saved.updatedAt;
      updateStorageIndicator();
      if (clearStorageFailure()) announce('학습 기록을 저장했어요.');
      if (!['exercise', 'coding', 'coding-problem'].includes(routeFromHash().page)) render();
      return true;
    } catch (error) {
      updateStorageIndicator();
      if (error?.name === 'StaleProgressError') announceStorageConflict();
      else announceStorageFailure();
      return false;
    }
  };
  if (immediate) return save();
  saveTimer = window.setTimeout(() => { void save(); }, 500);
}

function openLesson(lessonId, page = 'lesson') {
  const lesson = getLesson(lessonId);
  if (!lesson) return;
  const exercise = nextExercise(lesson);
  progress.lastLessonId = lesson.id;
  progress.lastExerciseId = exercise.id;
  progress.lastTrackId = lesson.trackId;
  void persistProgress({ immediate: true });
  go(page === 'exercise' ? `exercise/${exercise.id}` : `${page}/${lesson.id}`);
}

function recordAnswer(exercise, response, correct, note = '', execution = null) {
  const route = routeFromHash();
  const codingProblem = route.page === 'coding-problem'
    ? codingProblems.find((problem) => problem.id === route.id)
    : null;
  const isDedicatedCodingAnswer = codingProblem?.id === exercise.id;
  const lesson = findLessonForExercise(exercise.id);
  const answer = {
    exerciseId: exercise.id,
    correct,
    response: typeof response === 'string' ? response.slice(0, 20_000) : Array.isArray(response) ? response.slice(0, 50) : String(response ?? ''),
    answeredAt: new Date().toISOString(),
    note: String(note).slice(0, 500),
  };
  if (execution) answer.execution = execution;
  if (isDedicatedCodingAnswer) {
    progress.codingAnswers.push(answer);
    progress.codingAnswers = progress.codingAnswers.slice(-500);
    progress.codingResults = recordCodingResult(progress, progress.codingAnswers.at(-1));
    progress.codingDrafts[exercise.id] = String(response ?? '').slice(0, 20_000);
    progress.lastCodingProblemId = exercise.id;
    progress.lastActivity = 'coding';
  } else {
    progress.answers.push(answer);
    progress.answers = progress.answers.slice(-500);
    progress.exerciseResults = recordExerciseResult(progress, progress.answers.at(-1));
    progress.lastExerciseId = exercise.id;
    progress.lastActivity = 'learning';
    if (lesson) {
      progress.lastLessonId = lesson.id;
      progress.lastTrackId = lesson.trackId;
    }
  }
  progress.completedLessonIds = getCompletedLessonIds(lessons, progress);
  const lessonDone = isDedicatedCodingAnswer ? false : lesson ? isLessonComplete(lesson) : false;
  if (!isDedicatedCodingAnswer && exercise.type === 'coding') progress.drafts[exercise.id] = String(response ?? '').slice(0, 20_000);
  else if (!isDedicatedCodingAnswer && correct) delete progress.drafts[exercise.id];
  void persistProgress({ immediate: true }).then((saved) => {
    render();
    if (saved) announce(correct ? (lessonDone ? '정답이에요. 이번 주 문제를 모두 풀었어요!' : '정답이에요. 다음 문제로 이어가 보세요.') : '답을 저장했어요. 해설을 보고 다시 도전해 보세요.', correct ? 'success' : 'info');
  });
}

function exportProgress() {
  let backup;
  try {
    backup = makeBackup(progress);
  } catch (error) {
    announce(error.message || '기록을 백업 파일로 만들지 못했어요.', 'error');
    return;
  }
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `code-one-step-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  const omitted = backup.omittedFromSizeLimit;
  const omissionParts = [
    omitted.answers ? `학습 풀이 ${omitted.answers}회` : '',
    omitted.codingAnswers ? `코딩 풀이 ${omitted.codingAnswers}회` : '',
    omitted.drafts ? `학습 초안 ${omitted.drafts}개` : '',
    omitted.codingDrafts ? `코딩 초안 ${omitted.codingDrafts}개` : '',
  ].filter(Boolean);
  const omission = omissionParts.length
    ? ` 파일 크기 제한으로 오래된 ${omissionParts.join(', ')}를 제외했으며, 문제별 최신 진도는 보관했어요.`
    : '';
  announce(`학습 기록 백업 파일을 내보냈어요.${omission}`);
}

async function importProgress(file) {
  if (!file) return;
  try {
    if (file.size > 1_000_000) throw new RangeError('파일이 1MB보다 큽니다.');
    const restored = reconcileProgress(parseBackup(await file.text()));
    if (!window.confirm(`백업에 완료한 주차 ${restored.completedLessonIds.length}개, 학습 풀이 ${restored.answers.length}개, 코딩 풀이 ${restored.codingAnswers.length}개가 있어요. 현재 이 기기의 기록을 이 백업으로 바꿀까요?`)) return;
    clearTimeout(saveTimer);
    saveTimer = undefined;
    progress = restored;
    const queuedSave = saveQueue.catch(() => undefined).then(() => replaceProgress(restored));
    saveQueue = queuedSave;
    try {
      const saved = await queuedSave;
      progress.updatedAt = saved.updatedAt;
    } catch {
      updateStorageIndicator();
      render({ focus: true });
      announceStorageFailure();
      return;
    }
    render({ focus: true });
    announce('백업 기록을 복원했어요.');
  } catch (error) {
    announce(error.message || '백업 파일을 가져오지 못했어요.', 'error');
  }
}

function selectedResponse(form, exercise) {
  if (exercise.type === 'choice') return new FormData(form).get('choice')?.toString() ?? '';
  if (exercise.type === 'short-answer') return form.querySelector('[name="short-answer"]').value;
  if (exercise.type === 'locate-error') return Array.isArray(progress.drafts[exercise.id]) ? progress.drafts[exercise.id] : [];
  return form.querySelector('[name="code-answer"]').value;
}

async function handleAnswerSubmit(form) {
  const resolved = resolveExerciseRoute(routeFromHash().id);
  if (!resolved) return;
  const { lesson, exercise } = resolved;
  const response = selectedResponse(form, exercise);
  if (exercise.type === 'choice' && !response) {
    announce('보기 하나를 선택한 다음 답을 확인해 주세요.', 'error');
    form.querySelector('input[name="choice"]')?.focus();
    return;
  }
  if (exercise.type === 'short-answer' && !String(response).trim()) {
    announce('답을 적은 다음 확인해 주세요.', 'error');
    form.querySelector('[name="short-answer"]')?.focus();
    return;
  }
  if (exercise.type === 'repair-code' && !String(response).trim()) {
    announce('수정한 코드를 작성한 뒤 확인해 주세요.', 'error');
    form.querySelector('[name="code-answer"]')?.focus();
    return;
  }
  if (exercise.type === 'locate-error' && !response.length) {
    announce('오류가 있다고 생각하는 줄을 골라 주세요.', 'error');
    form.querySelector('[data-select-line]')?.focus();
    return;
  }
  const submit = form.querySelector('[data-submit-answer]');
  if (submit) {
    submit.disabled = true;
    submit.textContent = exercise.type === 'coding' ? '코드를 실행하고 있어요…' : '답을 확인하고 있어요…';
  }

  if (exercise.type === 'coding') {
    const runnerStatus = form.querySelector('[data-runner-status]');
    const codeEditor = form.querySelector('[data-code-editor-input]');
    if (codeEditor) codeEditor.disabled = true;
    codeEditors.get(codeEditor)?.setEditable(false);
    const timeoutBudget = exercise.adapterId === 'fastapi-asgi-v1'
      ? FASTAPI_INITIALIZE_TIMEOUT_MS + FASTAPI_RUNNER_TIMEOUT_MS
      : exercise.adapterId === 'postgresql-query-v1'
        ? POSTGRESQL_RUNNER_TIMEOUT_MS
        : RUNNER_STARTUP_TIMEOUT_MS + RUNNER_TIMEOUT_MS * (exercise.adapterId === 'typescript-function-v1' ? 2 : 1);
    const deadline = Date.now() + timeoutBudget;
    const updateRemainingTime = () => {
      if (!runnerStatus) return;
      const remaining = Math.max(0, deadline - Date.now());
      runnerStatus.textContent = `실행 중 · 남은 시간 ${(remaining / 1000).toFixed(1)}초`;
    };
    updateRemainingTime();
    const countdown = window.setInterval(updateRemainingTime, 500);
    let result;
    try {
      result = await runChallenge(exercise, response);
    } catch (error) {
      result = {
        passed: false,
        state: 'error',
        error: String(error?.message ?? '코드 실행을 마치지 못했어요.').slice(0, 500),
        output: '',
        outputWasTruncated: false,
        passedCount: 0,
        total: exercise.tests.length,
        results: [],
      };
    }
    clearInterval(countdown);
    if (codeEditor) codeEditor.disabled = false;
    codeEditors.get(codeEditor)?.setEditable(true);
    if (runnerStatus) {
      runnerStatus.textContent = result.state === 'passed'
        ? '모든 테스트를 통과했어요.'
        : result.state === 'timeout'
          ? '시간 제한을 초과해 실행을 종료했어요.'
          : result.state === 'error'
            ? '실행 오류를 확인해 주세요.'
            : result.state === 'unavailable'
              ? '실행 공간을 사용할 수 없어 답안은 저장하지 않았어요. 코드는 보관했으니 다시 시도해 주세요.'
            : '실행 결과를 확인해 주세요.';
    }
    if (result.state === 'unavailable') {
      const route = routeFromHash();
      const drafts = route.page === 'coding-problem' ? progress.codingDrafts : progress.drafts;
      drafts[exercise.id] = String(response ?? '').slice(0, 20_000);
      const previousResults = form.querySelector('[data-runner-results]');
      const replacement = document.createElement('template');
      replacement.innerHTML = runnerResultsSection(exercise, result);
      if (previousResults && replacement.content.firstElementChild) {
        previousResults.replaceWith(replacement.content.firstElementChild);
      }
      await persistProgress({ immediate: true });
      return;
    }
    const passedCount = result.passedCount ?? result.results.filter((test) => test.passed).length;
    const total = result.total ?? exercise.tests.length;
    const note = result.state === 'timeout'
      ? result.error
      : result.error
        ? `실행 오류: ${result.error}`
        : `${total}개 테스트 중 ${passedCount}개를 통과했어요.`;
    recordAnswer(exercise, response, result.passed, note, result);
    return;
  }

  const correct = gradeAnswer(exercise, response);
  recordAnswer(exercise, response, correct);
}

function setHomeSkillMenuOpen(picker, open) {
  const toggle = picker?.querySelector('[data-home-skill-toggle]');
  const menu = picker?.querySelector('.home-skill-grid');
  if (!picker || !toggle || !menu) return;
  picker.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '배울 주제 닫기' : '배울 주제 보기');
  menu.setAttribute('aria-hidden', String(!open));
  menu.inert = !open;
}

function selectActivityDay(dayButton) {
  const grid = dayButton?.closest('[role="grid"]');
  if (!grid) return;
  grid.querySelectorAll('[data-activity-day]').forEach((button) => {
    const selected = button === dayButton;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    button.classList.toggle('is-selected', selected);
  });
  const summary = grid.closest('.home-garden')?.querySelector('[data-activity-summary]');
  const date = dateFromLocalKey(dayButton.dataset.activityDay);
  const count = Number(dayButton.dataset.activityCount ?? 0);
  if (summary) {
    summary.textContent = `${formatActivityDate(date)} · ${count ? `${count}개 문제에 풀이 기록이 있어요.` : '이날 기록은 없어요.'}`;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const picker = event.target.closest('[data-home-skill-picker]') ?? document.querySelector('[data-home-skill-picker].is-open');
    if (picker?.classList.contains('is-open')) {
      event.preventDefault();
      setHomeSkillMenuOpen(picker, false);
      const toggle = picker.querySelector('[data-home-skill-toggle]');
      if (event.target !== toggle) {
        toggle?.focus();
      }
      return;
    }
  }

  const dayButton = event.target.closest('[data-activity-day]');
  if (!dayButton) return;
  const offsets = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
  if (event.key === 'Home' || event.key === 'End') {
    const day = dateFromLocalKey(dayButton.dataset.activityDay);
    const offset = (day.getDay() + 6) % 7;
    day.setDate(day.getDate() + (event.key === 'Home' ? -offset : 6 - offset));
    const target = dayButton.closest('[role="grid"]')?.querySelector(`[data-activity-day="${localDateKey(day)}"]`);
    if (target) {
      event.preventDefault();
      target.focus();
      selectActivityDay(target);
    }
    return;
  }
  const offset = offsets[event.key];
  if (offset === undefined) return;
  const day = dateFromLocalKey(dayButton.dataset.activityDay);
  day.setDate(day.getDate() + offset);
  const target = dayButton.closest('[role="grid"]')?.querySelector(`[data-activity-day="${localDateKey(day)}"]`);
  if (target) {
    event.preventDefault();
    target.focus();
    selectActivityDay(target);
  }
});

document.addEventListener('click', (event) => {
  const skillToggle = event.target.closest('[data-home-skill-toggle]');
  if (skillToggle) {
    const picker = skillToggle.closest('[data-home-skill-picker]');
    setHomeSkillMenuOpen(picker, !picker.classList.contains('is-open'));
    return;
  }

  const activityDay = event.target.closest('[data-activity-day]');
  if (activityDay) {
    selectActivityDay(activityDay);
    return;
  }

  if (!event.target.closest('[data-home-skill-picker]')) {
    document.querySelectorAll('[data-home-skill-picker].is-open').forEach((picker) => {
      setHomeSkillMenuOpen(picker, false);
    });
  }

  const lineButton = event.target.closest('[data-select-line]');
  if (lineButton) {
    const line = Number(lineButton.dataset.selectLine);
    const resolved = resolveExerciseRoute(routeFromHash().id);
    if (!resolved) return;
    const id = resolved.exercise.id;
    const selected = Array.isArray(progress.drafts[id]) ? [...progress.drafts[id]] : [];
    const next = selected.includes(line) ? selected.filter((value) => value !== line) : [...selected, line];
    progress.drafts[id] = next;
    lineButton.classList.toggle('is-selected', next.includes(line));
    lineButton.setAttribute('aria-pressed', String(next.includes(line)));
    persistProgress();
    return;
  }

  const copyButton = event.target.closest('[data-copy-code]');
  if (copyButton) {
    if (!navigator.clipboard?.writeText) {
      announce('이 브라우저에서는 코드 복사를 사용할 수 없어요.', 'error');
      return;
    }
    navigator.clipboard.writeText(copyButton.dataset.copyCode)
      .then(() => announce('코드를 복사했어요.'))
      .catch(() => announce('이 브라우저에서는 코드 복사를 사용할 수 없어요.', 'error'));
    return;
  }

  const resetCodingFilters = event.target.closest('[data-coding-reset]');
  if (resetCodingFilters) {
    const section = resetCodingFilters.closest('.coding-catalog-section');
    section?.querySelectorAll('[data-coding-filter]').forEach((control) => { control.value = ''; });
    codingCatalogPageNumber = 1;
    applyCodingFilters();
    saveCodingFilters();
    if (routeFromHash().id) go('coding');
    else section?.querySelector('[data-coding-filter="search"]')?.focus();
    return;
  }

  const pageButton = event.target.closest('[data-pagination-kind][data-pagination-page]');
  if (pageButton) {
    event.preventDefault();
    const kind = pageButton.dataset.paginationKind;
    const requestedPage = Number(pageButton.dataset.paginationPage);
    if (kind === 'coding') {
      codingCatalogPageNumber = requestedPage;
      applyCodingFilters();
    } else if (kind === 'foundations') {
      foundationsPageNumber = requestedPage;
      render();
    }
    document.querySelector(`.pagination-controls[aria-label="${kind === 'coding' ? '코딩 문제 페이지' : '주차별 수업 페이지'}"] [aria-current="page"]`)?.focus();
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  switch (actionButton.dataset.action) {
    case 'toggle-theme': {
      themePreference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(themePreferenceKey, themePreference);
      } catch {
        announce('화면은 바뀌었지만 테마 설정을 이 기기에 저장하지 못했어요.', 'error');
      }
      applyTheme();
      break;
    }
    case 'retry-progress-save': void persistProgress({ immediate: true }); break;
    case 'reload-progress': window.location.reload(); break;
    case 'export-progress': exportProgress(); break;
    case 'reset-progress':
      if (window.confirm('이 기기에 저장된 완료 기록, 답안, 코드 초안을 모두 지울까요?')) {
        progress = emptyProgress();
        void persistProgress({ immediate: true }).then((saved) => {
          render({ focus: true });
          if (saved) announce('이 기기의 학습 기록을 초기화했어요.');
        });
      }
      break;
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-exercise-form]');
  if (!form) return;
  event.preventDefault();
  void handleAnswerSubmit(form);
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-coding-filter]')) {
    codingCatalogPageNumber = 1;
    applyCodingFilters();
    saveCodingFilters();
    const route = routeFromHash();
    if (event.target.dataset.codingFilter === 'language' && route.id
      && event.target.value.toLowerCase() !== route.id.toLowerCase()) go('coding');
    return;
  }
  const control = event.target.closest('[data-draft-id]');
  if (!control) return;
  if (control.matches('[data-code-editor-input]')) {
    const results = control.closest('.exercise-main, .coding-workspace-layout')?.querySelector('[data-runner-results]');
    if (results && results.dataset.state !== 'empty') {
      results.classList.add('is-stale');
      const status = results.querySelector('[data-runner-state]');
      if (status) status.textContent = '코드가 바뀌었습니다. 현재 결과는 이전 실행 기준입니다.';
      const stateLabel = results.querySelector('.runner-state-label');
      if (stateLabel) stateLabel.textContent = '다시 실행 필요';
    }
  }
  const draftCollection = control.dataset.draftScope === 'coding' ? progress.codingDrafts : progress.drafts;
  draftCollection[control.dataset.draftId] = control.value.slice(0, 20_000);
  persistProgress();
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-coding-filter]')) {
    codingCatalogPageNumber = 1;
    applyCodingFilters();
    saveCodingFilters();
    const route = routeFromHash();
    if (event.target.dataset.codingFilter === 'language' && route.id
      && event.target.value.toLowerCase() !== route.id.toLowerCase()) go('coding');
    return;
  }
  if (event.target.matches('[data-action="import-progress"]')) {
    void importProgress(event.target.files?.[0]);
    event.target.value = '';
    return;
  }
  if (event.target.matches('input[name="choice"]')) {
    const resolved = resolveExerciseRoute(routeFromHash().id);
    if (!resolved) return;
    progress.drafts[resolved.exercise.id] = event.target.value;
    persistProgress();
  }
});

function rememberCurrentRoute(route) {
  const codingProblem = route.page === 'coding-problem'
    ? codingProblems.find((problem) => problem.id === route.id && problem.review.status === 'approved' && problem.runtime.status === 'verified')
    : null;
  if (codingProblem) {
    progress.lastCodingProblemId = codingProblem.id;
    progress.lastActivity = 'coding';
    return true;
  }
  const foundationsLesson = route.page === 'foundations'
    ? foundationsTrack.lessons.find((item) => item.week === Number(/^week-(\d{2})$/.exec(route.id)?.[1]))
    : null;
  const lesson = foundationsLesson ?? (route.page === 'lesson'
    ? getLesson(route.id)
    : route.page === 'exercise'
      ? resolveExerciseRoute(route.id)?.lesson
      : null);
  if (lesson) {
    progress.lastActivity = 'learning';
    progress.lastLessonId = lesson.id;
    progress.lastExerciseId = route.page === 'exercise' ? resolveExerciseRoute(route.id)?.exercise.id ?? null : nextExercise(lesson).id;
    progress.lastTrackId = lesson.trackId;
    return true;
  }
  return false;
}

window.addEventListener('hashchange', () => {
  const route = routeFromHash();
  if (rememberCurrentRoute(route)) persistProgress();
  render({ focus: true });
});

window.addEventListener('storage', (event) => {
  if (event.key === 'study-web-progress-v1') {
    announce('다른 탭에서 학습 기록이 바뀌었어요. 새로고침하면 최신 기록을 불러옵니다.');
  }
});

async function start() {
  try {
    const loaded = await loadProgress();
    const needsMigration = !loaded.codingRecordsSeparated;
    progress = reconcileProgress(loaded);
    const currentRouteNeedsSave = rememberCurrentRoute(routeFromHash());
    if (needsMigration || currentRouteNeedsSave) {
      try {
        progress = await saveProgress(progress);
      } catch {
        updateStorageIndicator();
        announceStorageFailure();
      }
    }
  } catch {
    progress = emptyProgress();
    announce('저장된 기록을 읽지 못해 새 학습 공간으로 열었어요.', 'error');
  }
  render();
}

void start();
