const routePages = new Set(['home', 'tracks', 'track', 'topic', 'lesson', 'exercise', 'profile', 'coding', 'foundations']);

export function routeFromHash(hash = globalThis.location?.hash ?? '') {
  const [requestedPage = 'home', ...encodedSegments] = String(hash ?? '').replace(/^#\/?/, '').split('/');
  const segments = encodedSegments.map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return '';
    }
  });
  const id = segments[0] ?? '';
  if (requestedPage === 'coding' && id === 'problem') {
    return { page: 'coding-problem', id: segments[1] ?? '' };
  }
  if (requestedPage === 'coding') {
    return { page: 'coding', id };
  }
  if (!routePages.has(requestedPage)) return { page: 'home', id: '' };
  return { page: requestedPage, id };
}
