import { findLessonForExercise, getLesson, getTopic, getTrack, lessons, tracks } from './content.js';
import { gradeAnswer } from './grading.js';
import { emptyProgress, makeBackup, parseBackup } from './progress.js';
import { RUNNER_TIMEOUT_MS, runChallenge } from './runner.js';
import { routeFromHash } from './routing.js';
import { getStorageMode, loadProgress, replaceProgress, saveProgress } from './storage.js';

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');
let progress = emptyProgress();
let saveTimer;
let saveQueue = Promise.resolve();
let toastTimer;
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
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'dark' ? '#151a22' : '#f6f7f9');
}

applyTheme();
systemColorScheme?.addEventListener('change', () => {
  if (themePreference === 'system') applyTheme();
});

const routeLabels = {
  home: '내 학습실',
  tracks: '배울 주제',
  track: '학습 경로',
  topic: '학습 주제',
  lesson: '학습 단위',
  exercise: '문제 풀기',
  profile: '내 기록',
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
  return escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function go(path) {
  window.location.hash = `/${path.replace(/^\//, '')}`;
}

function navLink(path, label, icon, currentPage) {
  const [page] = path.split('/');
  const active = currentPage === page || (page === 'tracks' && ['track', 'topic', 'lesson', 'exercise'].includes(currentPage));
  return `<a class="nav-link ${active ? 'is-active' : ''}" href="#/${path}" ${active ? 'aria-current="page"' : ''}>
    <span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>
  </a>`;
}

function shell(page, content) {
  const savedStatus = getStorageMode();
  return `<div class="app-shell">
    <aside class="sidebar" aria-label="주요 탐색">
      <a class="brand" href="#/home" aria-label="코드한걸음 내 학습실">
        <span class="brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span class="brand-name">코드한<span>걸음</span></span>
      </a>
      <div class="sidebar-label">학습 공간</div>
      <nav class="primary-nav">
        ${navLink('home', '내 학습실', '⌂', page)}
        ${navLink('tracks', '배울 주제', '▦', page)}
        ${navLink('profile', '내 기록', '◷', page)}
      </nav>
      <div class="sidebar-divider"></div>
      <div class="sidebar-label sidebar-label-row"><span>나의 경로</span><a href="#/tracks">모두 보기</a></div>
      <nav class="track-nav" aria-label="학습 경로">
        ${tracks.map((track) => `<a class="track-nav-link" href="#/track/${track.id}">
          <span class="mini-track-mark tone-${track.tone}">${escapeHtml(track.short)}</span><span>${escapeHtml(track.title)}</span>
        </a>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="local-note-icon" aria-hidden="true">↗</div>
        <strong>내 기기에 저장돼요</strong>
        <p>로그인 없이 공부하고, 백업 파일로 기록을 옮길 수 있어요.</p>
        <a href="#/profile" class="text-link">기록 관리 <span aria-hidden="true">→</span></a>
      </div>
    </aside>
    <div class="app-column">
      <header class="topbar">
        <div class="breadcrumbs"><span>코드한걸음</span><span aria-hidden="true">/</span><strong>${routeLabels[page] || '내 학습실'}</strong></div>
        <div class="topbar-actions">
          <label class="theme-control"><span>화면</span><select data-action="theme" aria-label="화면 테마"><option value="system" ${themePreference === 'system' ? 'selected' : ''}>기기 설정</option><option value="light" ${themePreference === 'light' ? 'selected' : ''}>밝게</option><option value="dark" ${themePreference === 'dark' ? 'selected' : ''}>어둡게</option></select></label>
          <span class="save-indicator"><i aria-hidden="true"></i>${escapeHtml(savedStatus)}</span>
          <a class="avatar-link" href="#/profile" aria-label="내 학습 기록 열기">나</a>
        </div>
      </header>
      <main id="main-content" class="page-content">${content}</main>
      <footer class="site-footer"><span>코드한걸음</span><span>각 단원에는 설명, 예제, 연습 문제가 있어요.</span><a href="https://github.com/seonsun10/code-one-step/issues/new/choose" target="_blank" rel="noopener noreferrer" aria-label="GitHub에서 학습 오류나 접근성 문제 제보하기 (GitHub 로그인 필요)">문제 제보</a><a href="#/profile">기록 백업</a></footer>
    </div>
    <nav class="mobile-nav" aria-label="모바일 탐색">
      ${navLink('home', '학습실', '⌂', page)}
      ${navLink('tracks', '주제', '▦', page)}
      ${navLink('profile', '기록', '◷', page)}
    </nav>
  </div>`;
}

function latestAnswers() {
  const result = new Map();
  for (const answer of progress.answers) result.set(answer.exerciseId, answer);
  return result;
}

function accuracySummary() {
  const answers = [...latestAnswers().values()];
  if (!answers.length) return '아직 첫 문제 전이에요';
  const correct = answers.filter((answer) => answer.correct).length;
  return `${Math.round((correct / answers.length) * 100)}% 정답률`;
}

function trackProgress(track) {
  const done = track.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
  return { done, total: track.lessons.length, percent: Math.round((done / track.lessons.length) * 100) };
}

function trackMark(track, extraClass = '') {
  return `<span class="track-mark tone-${track.tone} ${extraClass}" aria-hidden="true">${escapeHtml(track.short)}</span>`;
}

function trackCard(track) {
  const stats = trackProgress(track);
  const nextLesson = track.lessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ?? track.lessons[0];
  const target = stats.done === 0 ? `#/track/${track.id}` : `#/lesson/${nextLesson.id}`;
  return `<article class="track-card">
    <div class="track-card-top">${trackMark(track)}<span class="level-pill">${escapeHtml(track.level)}</span></div>
    <div class="track-card-copy"><p class="eyebrow">${escapeHtml(track.category)}</p><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(track.description)}</p></div>
    <div class="track-progress-row"><span>${stats.done}/${stats.total} 단원 완료</span><span>${stats.percent}%</span></div>
    <div class="progress-track" role="progressbar" aria-label="${escapeHtml(track.title)} 진도" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${stats.percent}"><span style="width:${stats.percent}%;--progress-color:${track.accent}"></span></div>
    <a class="card-link" href="${target}">${stats.done === 0 ? '단계 살펴보기' : stats.done === stats.total ? '다시 보기' : '학습 계속하기'} <span aria-hidden="true">→</span></a>
  </article>`;
}

function homePage() {
  const route = routeFromHash();
  const lastLesson = getLesson(progress.lastLessonId) ?? lessons[0];
  const lastTrack = getTrack(lastLesson.trackId);
  const completeCount = progress.completedLessonIds.length;
  const totalCount = lessons.length;
  const recent = [...progress.answers].slice(-3).reverse();
  const nextPractice = lessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ?? lessons[0];
  const exerciseLabels = { choice: '객관식', 'short-answer': '주관식', 'locate-error': '오류 찾기', 'repair-code': '코드 수정', coding: '코딩 문제' };
  return `<section class="welcome-row">
      <div class="welcome-copy"><p class="eyebrow">내 학습실</p>
        <h1>배우고, 풀고,<br /><span>차근차근 이어가요.</span></h1>
        <p class="welcome-description">궁금한 주제를 고르고 직접 풀어 보세요.<br class="desktop-break" />내 학습 기록은 이 기기에 조용히 저장돼요.</p>
      </div>
      <div class="welcome-summary" aria-label="학습 요약">
        <span class="summary-caption">내 학습 여정</span>
        <strong>${completeCount}<small>/${totalCount}</small></strong>
        <span class="summary-foot">단원을 완료했어요</span>
      </div>
    </section>
    <div class="dashboard-grid">
      <div class="dashboard-main-column">
        <section class="resume-card" aria-labelledby="resume-title">
          <div class="resume-copy"><div class="resume-kicker">다시 이어하기</div>
            <p class="resume-track">${escapeHtml(lastTrack.title)} <span aria-hidden="true">·</span> ${escapeHtml(lastLesson.duration)}</p>
            <h2 id="resume-title">${escapeHtml(lastLesson.title)}</h2>
            <p>${escapeHtml(lastLesson.objective)}</p>
            <a class="button button-primary" href="#/lesson/${lastLesson.id}">학습 계속하기 <span aria-hidden="true">→</span></a>
          </div>
        </section>
        <section class="content-section">
          <div class="section-heading"><div><p class="eyebrow">학습 경로</p><h2>배우고 싶은 주제를 골라요</h2></div><a class="subtle-link" href="#/tracks">전체 보기 <span aria-hidden="true">→</span></a></div>
          <div class="track-grid track-grid-featured">${tracks.map(trackCard).join('')}</div>
        </section>
        <section class="content-section recent-section">
          <div class="section-heading"><div><p class="eyebrow">풀이 기록</p><h2>최근에 풀어 본 문제</h2></div><a class="subtle-link" href="#/profile">학습 기록 <span aria-hidden="true">→</span></a></div>
          ${recent.length ? `<div class="recent-list">${recent.map((answer) => {
            const lesson = findLessonForExercise(answer.exerciseId);
            if (!lesson) return '';
            const track = getTrack(lesson.trackId);
            return `<a class="recent-row" href="#/exercise/${lesson.id}">${trackMark(track, 'recent-mark')}<span class="recent-copy"><strong>${escapeHtml(lesson.exercise.title)}</strong><small>${escapeHtml(track.title)} · ${answer.correct ? '정답 확인' : '다시 도전할 수 있어요'}</small></span><span class="recent-result ${answer.correct ? 'is-correct' : 'is-review'}">${answer.correct ? '완료' : '복습'} <span aria-hidden="true">→</span></span></a>`;
          }).join('')}</div>` : `<div class="empty-card"><span class="empty-icon" aria-hidden="true">✎</span><div><strong>첫 문제를 풀어 볼까요?</strong><p>정답과 오답을 모두 기록해 다음 학습을 이어갈 수 있어요.</p></div><a class="button button-small button-secondary" href="#/tracks">주제 둘러보기</a></div>`}
        </section>
      </div>
      <aside class="dashboard-aside">
        <section class="aside-card daily-card">
          <div class="aside-card-heading"><span class="eyebrow">다음 연습</span></div>
          <h2>오늘의 한 문제</h2><p>짧은 문제 하나로 배운 내용을 다시 떠올려요.</p>
          <div class="daily-question"><span class="question-number">${String(nextPractice.number).padStart(2, '0')}</span><div><strong>${escapeHtml(nextPractice.exercise.title)}</strong><small>${escapeHtml(nextPractice.trackTitle)} · ${exerciseLabels[nextPractice.exercise.type]} · ${escapeHtml(nextPractice.duration)}</small></div></div>
          <a class="button button-secondary button-full" href="#/exercise/${nextPractice.id}">문제 풀기 <span aria-hidden="true">→</span></a>
        </section>
        <section class="aside-card progress-card">
          <div class="aside-card-heading"><span class="eyebrow">나의 진도</span></div>
          <h2>내 학습 기록</h2><p>현재 브라우저에서 이어서 공부할 수 있어요.</p>
          <div class="progress-stat"><span>완료한 단원</span><strong>${completeCount}<small> / ${totalCount}</small></strong></div>
          <div class="progress-stat"><span>최근 정답률</span><strong>${escapeHtml(accuracySummary())}</strong></div>
          <a class="text-link" href="#/profile">기록 백업과 복원 <span aria-hidden="true">→</span></a>
        </section>
        <div class="privacy-note"><span aria-hidden="true">♧</span><p><strong>계정 없이 시작해요</strong><br />진도는 이 브라우저에 저장됩니다.</p></div>
      </aside>
    </div>`;
}

function tracksPage() {
  const languageTracks = tracks.filter((track) => track.category === '프로그래밍 언어');
  const frameworkTracks = tracks.filter((track) => track.category === '프레임워크');
  return `<section class="page-heading"><p class="eyebrow">학습 주제</p><h1>배우고 싶은 주제를 골라요</h1><p>짧은 설명, 예제, 문제를 순서대로 따라가며 기초를 다질 수 있어요.</p></section>
    <section class="content-section"><div class="section-heading compact-heading"><div><p class="eyebrow">언어</p><h2>프로그래밍 언어</h2></div></div><div class="track-grid">${languageTracks.map(trackCard).join('')}</div></section>
    <section class="content-section"><div class="section-heading compact-heading"><div><p class="eyebrow">프레임워크</p><h2>프레임워크</h2></div></div><div class="track-grid">${frameworkTracks.map(trackCard).join('')}</div></section>`;
}

function trackPage(trackId) {
  const track = getTrack(trackId);
  if (!track) return notFoundPage();
  const stats = trackProgress(track);
  return `<a class="back-link" href="#/tracks"><span aria-hidden="true">←</span> 모든 학습 주제</a>
    <section class="track-hero tone-panel-${track.tone}">
      <div class="track-hero-copy"><p class="eyebrow">${escapeHtml(track.category)} · ${escapeHtml(track.level)}</p><h1>${escapeHtml(track.title)}</h1><p>${escapeHtml(track.description)}</p><div class="track-hero-meta"><span>학습 단원 ${track.lessons.length}개</span><span class="meta-divider" aria-hidden="true"></span><span>${stats.done}개 완료</span></div></div>
      <div class="track-hero-progress"><span>학습 진도</span><strong>${stats.percent}%</strong><div class="progress-track"><span style="width:${stats.percent}%;--progress-color:${track.accent}"></span></div></div>
    </section>
    <section class="track-overview" aria-label="학습 경로 안내"><p><strong>학습 목표</strong>${escapeHtml(track.objective)}</p><p><strong>선수 지식</strong>${escapeHtml(track.prerequisites.join(', '))}</p></section>
    <section class="content-section lesson-list-section"><div class="section-heading"><div><p class="eyebrow">단계별 학습</p><h2>학습 주제</h2></div><span class="muted-label">각 단계에는 설명과 연습 문제가 있어요</span></div>
      <div class="lesson-list">${track.topics.map((topic) => {
        const topicLessons = topic.lessonIds.map((lessonId) => getLesson(lessonId)).filter(Boolean);
        const done = topicLessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
        return `<a class="lesson-row topic-row" href="#/topic/${topic.id}"><span class="lesson-index">${String(topic.stage).padStart(2, '0')}</span><span class="lesson-row-copy"><span class="lesson-row-stage">${topic.stage}단계</span><span class="lesson-row-title">${escapeHtml(topic.title)}</span><span class="lesson-row-subtitle">${escapeHtml(topic.objective)}</span></span><span class="lesson-row-meta">${done}/${topicLessons.length}개 완료 <i aria-hidden="true">·</i> ${topicLessons.length}개 단원</span><span class="row-arrow" aria-hidden="true">→</span></a>`;
      }).join('')}</div>
    </section>`;
}

function topicPage(topicId) {
  const item = getTopic(topicId);
  if (!item) return notFoundPage();
  const { topic, track, lessons: topicLessons } = item;
  return `<a class="back-link" href="#/track/${track.id}"><span aria-hidden="true">←</span> ${escapeHtml(track.title)} 학습 경로</a>
    <section class="topic-hero track-hero tone-panel-${track.tone}">
      <div class="track-hero-copy"><p class="eyebrow">${escapeHtml(track.title)} · ${topic.stage}단계</p><h1>${escapeHtml(topic.title)}</h1><p>${escapeHtml(topic.objective)}</p><div class="track-hero-meta"><span>학습 단원 ${topicLessons.length}개</span><span class="meta-divider" aria-hidden="true"></span><span>${escapeHtml(track.level)}</span></div></div>
    </section>
    <section class="content-section lesson-list-section"><div class="section-heading"><div><p class="eyebrow">${topic.stage}단계</p><h2>이 주제에서 공부할 내용</h2></div><span class="muted-label">개념 → 예제 → 문제 순서로 학습해요</span></div>
      <div class="lesson-list">${topicLessons.map((lesson, index) => {
        const done = progress.completedLessonIds.includes(lesson.id);
        const answer = latestAnswers().get(lesson.exercise.id);
        return `<a class="lesson-row" href="#/lesson/${lesson.id}"><span class="lesson-index ${done ? 'is-done' : ''}">${done ? '✓' : String(index + 1).padStart(2, '0')}</span><span class="lesson-row-copy"><span class="lesson-row-stage">${lesson.stage}단계 · ${lesson.number}번째 단원</span><span class="lesson-row-title">${escapeHtml(lesson.title)}</span><span class="lesson-row-subtitle">${escapeHtml(lesson.objective)}</span></span><span class="lesson-row-meta">${escapeHtml(lesson.duration)} <i aria-hidden="true">·</i> ${answer ? '문제 기록 있음' : '연습 문제 1개'}</span><span class="row-arrow" aria-hidden="true">→</span></a>`;
      }).join('')}</div>
    </section>${sourceList(track.contentReview)}`;
}

function sourceList(review) {
  return `<section class="content-source" aria-labelledby="content-source-title"><div><p class="eyebrow">기술 출처</p><h2 id="content-source-title">적용 버전과 참고 문서</h2><p>${escapeHtml(review.versionContext)} · ${escapeHtml(review.reviewedAt)} 검토</p></div><ul>${review.sources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>`;
}

function lessonNavigation(track, lesson) {
  const index = track.lessons.findIndex((item) => item.id === lesson.id);
  const previous = track.lessons[index - 1];
  const next = track.lessons[index + 1];
  return `<nav class="lesson-navigation" aria-label="학습 단원 이동">
    ${previous ? `<a href="#/lesson/${previous.id}"><span>이전 단원</span><strong>${escapeHtml(previous.title)}</strong></a>` : '<span class="lesson-nav-empty">첫 단원</span>'}
    ${next ? `<a class="lesson-nav-next" href="#/lesson/${next.id}"><span>다음 단원</span><strong>${escapeHtml(next.title)}</strong></a>` : '<span class="lesson-nav-empty lesson-nav-next">마지막 단원</span>'}
  </nav>`;
}

function lessonPage(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return notFoundPage();
  const track = getTrack(lesson.trackId);
  const topic = track.topics.find((item) => item.id === lesson.topicId);
  const done = progress.completedLessonIds.includes(lesson.id);
  return `<a class="back-link" href="#/topic/${topic.id}"><span aria-hidden="true">←</span> ${escapeHtml(topic.title)} 학습 주제</a>
    <div class="lesson-layout">
      <article class="lesson-article">
        <p class="eyebrow">${escapeHtml(track.title)} · ${lesson.stage}단계 · 단원 ${lesson.number}/${track.lessons.length}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lesson-lead">${escapeHtml(lesson.objective)}</p>
        <div class="lesson-meta-row"><span>예상 ${escapeHtml(lesson.duration)}</span><span>난이도 ${escapeHtml(lesson.difficulty)}</span><span>${escapeHtml(lesson.referenceVersion)}</span>${done ? '<span class="completed-pill">✓ 완료</span>' : ''}</div>
        <div class="lesson-body-copy"><p>${inlineText(lesson.intro)}</p><h2>기억할 내용</h2><ul class="learning-points">${lesson.points.map((point) => `<li><span class="point-check" aria-hidden="true">✓</span><span>${inlineText(point)}</span></li>`).join('')}</ul><h2>짧은 예제</h2>${codeBlock(lesson.example, track.title)}</div>
        <div class="lesson-tip"><span class="tip-mark" aria-hidden="true">i</span><div><strong>작게 나누어 연습해요</strong><p>예제를 읽은 다음, 아래 문제에서 직접 고르거나 코드를 고쳐 보세요.</p></div></div>
        ${sourceList(track.contentReview)}
      </article>
      <aside class="lesson-action-card"><div class="lesson-action-top"><span class="eyebrow">연습 문제</span></div><h2>배운 내용을<br />확인해 볼까요?</h2><p>${escapeHtml(lesson.exercise.title)}</p><div class="lesson-action-details"><span>개념 확인</span><span>힌트와 풀이 제공</span><span>진도 자동 저장</span></div><a class="button button-primary button-full" href="#/exercise/${lesson.id}">연습 문제 풀기 <span aria-hidden="true">→</span></a>${done ? '<a class="subtle-link centered-link" href="#/exercise/' + lesson.id + '">다시 풀어보기</a>' : ''}<div class="saved-small">정답을 맞히면 단원이 완료돼요</div></aside>
    </div>${lessonNavigation(track, lesson)}`;
}

function codeBlock(code, label = 'CODE') {
  return `<div class="code-block"><div class="code-block-bar"><span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${escapeHtml(label)}</span><button type="button" class="copy-code-button" data-copy-code="${escapeHtml(code)}">복사</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function exerciseForm(exercise) {
  const draft = progress.drafts[exercise.id];
  if (exercise.type === 'choice') {
    return `<fieldset class="answer-fieldset"><legend class="visually-hidden">답을 하나 선택하세요</legend><div class="choice-list">${exercise.choices.map((choice, index) => `<label class="choice-option"><input type="radio" name="choice" value="${escapeHtml(choice.id)}" ${draft === choice.id ? 'checked' : ''} /><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span class="choice-text">${inlineText(choice.text)}</span><span class="choice-check" aria-hidden="true">✓</span></label>`).join('')}</div></fieldset>`;
  }
  if (exercise.type === 'short-answer') {
    return `<label class="field-label" for="short-answer">답을 적어 보세요</label><textarea class="answer-textarea short-answer-input" id="short-answer" name="short-answer" rows="3" maxlength="500" placeholder="배운 내용을 떠올려 적어 보세요." data-draft-id="${exercise.id}">${escapeHtml(typeof draft === 'string' ? draft : '')}</textarea><p class="field-hint">표현이 조금 달라도 핵심이 같다면 정답으로 인정해요.</p>`;
  }
  if (exercise.type === 'locate-error') {
    const selected = Array.isArray(draft) ? draft : [];
    return `<p class="field-label">오류가 있는 줄을 선택하세요</p><div class="line-code" role="group" aria-label="오류가 있는 코드 줄 선택">${exercise.codeLines.map((line, index) => {
      const lineNumber = index + 1;
      return `<button type="button" class="code-line ${selected.includes(lineNumber) ? 'is-selected' : ''}" data-select-line="${lineNumber}" aria-pressed="${selected.includes(lineNumber)}"><span class="line-number">${lineNumber}</span><code>${escapeHtml(line)}</code></button>`;
    }).join('')}</div>`;
  }
  if (exercise.type === 'repair-code' || exercise.type === 'coding') {
    const value = typeof draft === 'string' ? draft : exercise.starterCode;
    const label = exercise.type === 'coding' ? 'JavaScript' : 'React / JavaScript';
    return `<div class="editor-heading"><label class="field-label" for="code-answer">${exercise.type === 'coding' ? '함수 코드를 작성하세요' : '코드를 수정하세요'}</label><span class="editor-language"><i aria-hidden="true"></i>${label}</span></div><textarea class="code-editor" id="code-answer" name="code-answer" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="20000" data-draft-id="${exercise.id}" aria-label="${exercise.type === 'coding' ? 'JavaScript 문제 코드 편집기' : '코드 수정 편집기'}">${escapeHtml(value)}</textarea>${exercise.type === 'coding' ? '<p class="field-hint">코드는 이 브라우저에서 실행하고 1.8초 후 종료해요. 완전한 보안 샌드박스는 아니므로 민감한 코드나 정보는 붙여 넣지 마세요.</p>' : '<p class="field-hint">필요한 부분을 직접 수정한 뒤 확인해 보세요.</p>'}`;
  }
  return '';
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

function exercisePage(lessonId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return notFoundPage();
  const track = getTrack(lesson.trackId);
  const exercise = lesson.exercise;
  const lastAnswer = [...progress.answers].reverse().find((answer) => answer.exerciseId === exercise.id);
  const kindLabel = {
    choice: '객관식',
    'short-answer': '주관식',
    'locate-error': '오류 찾기',
    'repair-code': '코드 수정',
    coding: '코딩 문제',
  }[exercise.type];
  return `<a class="back-link" href="#/lesson/${lesson.id}"><span aria-hidden="true">←</span> ${escapeHtml(lesson.title)} 학습으로</a>
    <div class="exercise-layout"><article class="exercise-main">
      <div class="exercise-heading"><div><p class="eyebrow">${escapeHtml(track.title)} · ${lesson.stage}단계</p><h1>${escapeHtml(exercise.title)}</h1></div><span class="question-type-pill">${escapeHtml(kindLabel)}</span></div>
      <section class="exercise-card"><div class="exercise-card-top"><span class="exercise-step">연습 <strong>${String(lesson.number).padStart(2, '0')}</strong></span><span class="exercise-progress-label">학습 목표에 맞춰 풀어 보세요</span></div>
        <p class="exercise-prompt">${inlineText(exercise.prompt)}</p>
        ${exercise.type === 'coding' ? '<div class="coding-requirements"><span class="requirements-icon" aria-hidden="true">↳</span><span>입력은 숫자 배열, 반환값은 배열 안의 모든 숫자의 합이에요.</span></div>' : ''}
        <form id="answer-form" data-exercise-form="${exercise.type}">${exerciseForm(exercise)}
          <div class="answer-actions"><button class="button button-primary" type="submit" data-submit-answer>${exercise.type === 'coding' ? '코드 실행하고 확인' : '답 확인하기'} <span aria-hidden="true">→</span></button><span class="answer-save-hint">답과 진도는 이 기기에 저장됩니다.</span>${exercise.type === 'coding' ? '<span class="runner-status" data-runner-status role="status" aria-live="polite"></span>' : ''}</div>
        </form>
        <div id="answer-feedback">${answerFeedback(lastAnswer, exercise)}</div>
        <details class="hint-disclosure"><summary><span class="hint-light" aria-hidden="true">✦</span>막혔나요? 힌트 보기</summary><p>${inlineText(exercise.hint)}</p></details>
      </section>
      <details class="solution-disclosure"><summary>정답을 확인하고 풀이 설명 보기</summary><section class="solution-card"><div class="solution-heading"><div><p class="eyebrow">정답과 해설</p><h2>풀이 설명</h2></div></div><p>${inlineText(exercise.explanation)}</p></section></details>
      <div class="exercise-bottom-actions"><a class="button button-secondary" href="#/lesson/${lesson.id}">개념 다시 보기</a><a class="text-link" href="#/track/${track.id}">다음 단원 둘러보기 <span aria-hidden="true">→</span></a></div>
    </article><aside class="exercise-side"><div class="side-goal-card"><p class="eyebrow">학습 목표</p><h2>${escapeHtml(lesson.objective)}</h2><div class="goal-divider"></div><span class="muted-label">이번 단원</span><a href="#/lesson/${lesson.id}">${escapeHtml(lesson.title)} <span aria-hidden="true">↗</span></a></div><div class="side-privacy-note"><p><strong>기록은 내 기기에만 저장돼요.</strong><br />다른 기기에서 이어가려면 내 기록에서 백업 파일을 옮겨 주세요.</p></div></aside></div>`;
}

function profilePage() {
  const completeCount = progress.completedLessonIds.length;
  const latest = [...latestAnswers().values()];
  const correctCount = latest.filter((answer) => answer.correct).length;
  const accuracy = latest.length ? Math.round((correctCount / latest.length) * 100) : 0;
  const recent = [...progress.answers].slice(-8).reverse();
  return `<section class="page-heading profile-heading"><p class="eyebrow">내 기기에 저장</p><h1>내 학습 기록</h1><p>로그인 없이 이 브라우저에 저장된 진도를 확인하고 백업할 수 있어요.</p></section>
    <section class="profile-stats-grid"><article class="profile-stat-card"><span class="stat-icon icon-lilac" aria-hidden="true">✓</span><span class="stat-caption">완료한 단원</span><strong>${completeCount}<small> / ${lessons.length}</small></strong><span class="stat-foot">학습 경로 전체</span></article><article class="profile-stat-card"><span class="stat-icon icon-mint" aria-hidden="true">◎</span><span class="stat-caption">최근 문제 정답률</span><strong>${latest.length ? `${accuracy}%` : '—'}</strong><span class="stat-foot">문제별 가장 최근 답 기준</span></article><article class="profile-stat-card"><span class="stat-icon icon-peach" aria-hidden="true">◷</span><span class="stat-caption">풀이 기록</span><strong>${progress.answers.length}<small>회</small></strong><span class="stat-foot">정답과 오답을 모두 기록</span></article></section>
    <div class="profile-layout"><section class="profile-panel"><div class="section-heading"><div><p class="eyebrow">최근 풀이</p><h2>최근에 푼 문제</h2></div></div>
      ${recent.length ? `<div class="recent-list">${recent.map((answer) => {
        const lesson = findLessonForExercise(answer.exerciseId);
        if (!lesson) return '';
        const track = getTrack(lesson.trackId);
        const date = new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(new Date(answer.answeredAt));
        return `<a class="recent-row" href="#/exercise/${lesson.id}">${trackMark(track, 'recent-mark')}<span class="recent-copy"><strong>${escapeHtml(lesson.exercise.title)}</strong><small>${escapeHtml(track.title)} · ${date}</small></span><span class="recent-result ${answer.correct ? 'is-correct' : 'is-review'}">${answer.correct ? '정답' : '복습'} <span aria-hidden="true">→</span></span></a>`;
      }).join('')}</div>` : `<div class="empty-state"><span class="empty-icon" aria-hidden="true">◷</span><strong>아직 저장된 풀이가 없어요</strong><p>첫 문제를 풀면 여기에 기록이 쌓여요.</p><a class="button button-small button-primary" href="#/tracks">학습 시작하기</a></div>`}
    </section><aside class="profile-panel backup-panel"><p class="eyebrow">기록 백업</p><h2>다른 기기에서도<br />이어 공부하고 싶다면</h2><p>학습 기록 파일을 내보내고, 다른 기기에서 가져올 수 있어요. 파일은 본인 기기에서 직접 관리합니다.</p><button class="button button-secondary button-full" type="button" data-action="export-progress">기록 파일 내보내기 <span aria-hidden="true">↓</span></button><label class="button button-outline button-full import-button">백업 파일 가져오기 <span aria-hidden="true">↑</span><input type="file" accept="application/json,.json" data-action="import-progress" /></label><p class="backup-caption">내보낸 JSON 파일은 최대 1MB까지 가져올 수 있어요.</p></aside></div>
    <section class="storage-info"><span class="storage-info-icon" aria-hidden="true">◉</span><div><strong>현재 ${escapeHtml(getStorageMode())}</strong><p>이 브라우저 데이터를 지우면 학습 기록도 지워질 수 있어요. 정기적으로 백업해 주세요. 계정 간 자동 동기화는 제공하지 않습니다.</p></div><button class="text-button danger-text" type="button" data-action="reset-progress">이 기기의 기록 초기화</button></section>`;
}

function notFoundPage() {
  return `<section class="empty-state page-empty"><span class="empty-icon" aria-hidden="true">?</span><h1>학습 단위를 찾지 못했어요</h1><p>경로가 바뀌었거나 콘텐츠가 아직 준비되지 않았습니다.</p><a class="button button-primary" href="#/tracks">학습 주제 보기</a></section>`;
}

function render({ focus = false } = {}) {
  const route = routeFromHash();
  let content;
  switch (route.page) {
    case 'tracks': content = tracksPage(); break;
    case 'track': content = trackPage(route.id); break;
    case 'topic': content = topicPage(route.id); break;
    case 'lesson': content = lessonPage(route.id); break;
    case 'exercise': content = exercisePage(route.id); break;
    case 'profile': content = profilePage(); break;
    default: content = homePage();
  }
  app.innerHTML = shell(route.page, content);
  if (focus) {
    const heading = app.querySelector('#main-content h1, #main-content h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
}

function announce(message, kind = 'info') {
  toastRegion.innerHTML = `<div class="toast toast-${kind}" role="status"><span aria-hidden="true">${kind === 'error' ? '!' : '✓'}</span>${escapeHtml(message)}</div>`;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toastRegion.innerHTML = ''; }, 3200);
}

function persistProgress({ immediate = false } = {}) {
  clearTimeout(saveTimer);
  const save = async (snapshot = structuredClone(progress)) => {
    const queuedSave = saveQueue.catch(() => undefined).then(() => saveProgress(snapshot));
    saveQueue = queuedSave;
    try {
      await queuedSave;
      if (routeFromHash().page !== 'exercise') render();
      return true;
    } catch (error) {
      announce(error.message || '기록을 저장하지 못했어요. 백업 파일을 만들어 주세요.', 'error');
      return false;
    }
  };
  if (immediate) return save();
  saveTimer = window.setTimeout(() => { void save(); }, 500);
}

function openLesson(lessonId, page = 'lesson') {
  const lesson = getLesson(lessonId);
  if (!lesson) return;
  progress.lastLessonId = lesson.id;
  progress.lastTrackId = lesson.trackId;
  void persistProgress({ immediate: true });
  go(`${page}/${lesson.id}`);
}

function recordAnswer(exercise, response, correct, note = '') {
  const lesson = findLessonForExercise(exercise.id);
  progress.answers.push({
    exerciseId: exercise.id,
    correct,
    response: typeof response === 'string' ? response.slice(0, 20_000) : Array.isArray(response) ? response.slice(0, 50) : String(response ?? ''),
    answeredAt: new Date().toISOString(),
    note: String(note).slice(0, 500),
  });
  progress.answers = progress.answers.slice(-500);
  if (correct && lesson && !progress.completedLessonIds.includes(lesson.id)) {
    progress.completedLessonIds.push(lesson.id);
  }
  if (correct) delete progress.drafts[exercise.id];
  void persistProgress({ immediate: true }).then((saved) => {
    render();
    if (saved) announce(correct ? '정답이에요. 이 단원을 완료했어요!' : '답을 저장했어요. 해설을 보고 다시 도전해 보세요.', correct ? 'success' : 'info');
  });
}

function exportProgress() {
  const backup = makeBackup(progress);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `code-one-step-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('학습 기록 백업 파일을 내보냈어요.');
}

async function importProgress(file) {
  if (!file) return;
  try {
    if (file.size > 1_000_000) throw new RangeError('파일이 1MB보다 큽니다.');
    const restored = parseBackup(await file.text());
    const completed = restored.completedLessonIds.filter((id) => getLesson(id));
    const validAnswers = restored.answers.filter((answer) => findLessonForExercise(answer.exerciseId));
    restored.completedLessonIds = completed;
    restored.answers = validAnswers;
    if (!window.confirm(`백업에 완료한 단원 ${completed.length}개와 풀이 ${validAnswers.length}개가 있어요. 현재 이 기기의 기록을 이 백업으로 바꿀까요?`)) return;
    const queuedSave = saveQueue.catch(() => undefined).then(() => replaceProgress(restored));
    saveQueue = queuedSave;
    const saved = await queuedSave;
    progress = saved;
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
  const lesson = getLesson(routeFromHash().id);
  if (!lesson) return;
  const exercise = lesson.exercise;
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
    announce('오류가 있다고 생각하는 줄을 선택해 주세요.', 'error');
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
    const deadline = Date.now() + RUNNER_TIMEOUT_MS;
    const updateRemainingTime = () => {
      if (!runnerStatus) return;
      const remaining = Math.max(0, deadline - Date.now());
      runnerStatus.textContent = `실행 중 · 남은 시간 ${(remaining / 1000).toFixed(1)}초`;
    };
    updateRemainingTime();
    const countdown = window.setInterval(updateRemainingTime, 500);
    const result = await runChallenge(exercise, response);
    clearInterval(countdown);
    if (runnerStatus) {
      runnerStatus.textContent = result.timedOut
        ? '시간 제한을 초과해 실행을 종료했어요.'
        : '코드 실행을 마쳤어요.';
    }
    const passedCount = result.results.filter((test) => test.passed).length;
    const note = result.timedOut
      ? result.error
      : result.error
        ? `실행 오류: ${result.error}`
        : `${exercise.tests.length}개 테스트 중 ${passedCount}개를 통과했어요.${result.output ? ` 출력: ${result.output}` : ''}`;
    recordAnswer(exercise, response, result.passed, note);
    return;
  }

  const correct = gradeAnswer(exercise, response);
  recordAnswer(exercise, response, correct);
}

document.addEventListener('click', (event) => {
  const lineButton = event.target.closest('[data-select-line]');
  if (lineButton) {
    const line = Number(lineButton.dataset.selectLine);
    const lesson = getLesson(routeFromHash().id);
    if (!lesson) return;
    const id = lesson.exercise.id;
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

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  switch (actionButton.dataset.action) {
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
  const control = event.target.closest('[data-draft-id]');
  if (!control) return;
  progress.drafts[control.dataset.draftId] = control.value.slice(0, 20_000);
  persistProgress();
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-action="theme"]')) {
    themePreference = ['system', 'light', 'dark'].includes(event.target.value) ? event.target.value : 'system';
    try {
      if (themePreference === 'system') localStorage.removeItem(themePreferenceKey);
      else localStorage.setItem(themePreferenceKey, themePreference);
    } catch {
      announce('화면은 바뀌었지만 테마 설정을 이 기기에 저장하지 못했어요.', 'error');
    }
    applyTheme();
    return;
  }
  if (event.target.matches('[data-action="import-progress"]')) {
    void importProgress(event.target.files?.[0]);
    event.target.value = '';
    return;
  }
  if (event.target.matches('input[name="choice"]')) {
    const lesson = getLesson(routeFromHash().id);
    if (!lesson) return;
    progress.drafts[lesson.exercise.id] = event.target.value;
    persistProgress();
  }
});

window.addEventListener('hashchange', () => {
  const route = routeFromHash();
  if (route.page === 'lesson' || route.page === 'exercise') {
    const lesson = getLesson(route.id);
    if (lesson) {
      progress.lastLessonId = lesson.id;
      progress.lastTrackId = lesson.trackId;
      persistProgress();
    }
  }
  render({ focus: true });
});

window.addEventListener('storage', (event) => {
  if (event.key === 'study-web-progress-v1') {
    announce('다른 탭에서 학습 기록이 바뀌었어요. 새로고침하면 최신 기록을 불러옵니다.');
  }
});

async function start() {
  try {
    progress = await loadProgress();
  } catch {
    progress = emptyProgress();
    announce('저장된 기록을 읽지 못해 새 학습 공간으로 열었어요.', 'error');
  }
  render();
}

void start();
