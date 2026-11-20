export function paginationState(itemCount, requestedPage, pageSize) {
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
  const page = Math.min(totalPages, Math.max(1, Math.floor(requestedPage) || 1));
  const startIndex = Math.min(itemCount, (page - 1) * pageSize);
  const endIndex = Math.min(itemCount, startIndex + pageSize);
  let pages;

  if (totalPages <= 7) {
    pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  } else if (page <= 4) {
    pages = [1, 2, 3, 4, 5, '…', totalPages];
  } else if (page >= totalPages - 3) {
    pages = [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [1, '…', page - 1, page, page + 1, '…', totalPages];
  }

  return { page, totalPages, startIndex, endIndex, pages };
}
