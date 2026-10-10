const routePages = new Set(['home', 'tracks', 'track', 'topic', 'lesson', 'exercise', 'profile']);

export function routeFromHash(hash = globalThis.location?.hash ?? '') {
  const [requestedPage = 'home', encodedId = ''] = String(hash ?? '').replace(/^#\/?/, '').split('/');
  let id = '';
  try {
    id = decodeURIComponent(encodedId);
  } catch {
    // A malformed fragment should resolve to the page's empty/not-found state.
  }
  return { page: routePages.has(requestedPage) ? requestedPage : 'home', id };
}
