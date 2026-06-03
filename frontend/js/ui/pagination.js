export const renderPagination = ({
  container,
  totalCount,
  pageSize,
  currentPage,
}) => {
  container.innerHTML = "";

  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages === 1) return;

  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");

    btn.textContent = i;
    btn.dataset.page = i;

    if (i === currentPage) {
      btn.disabled = true;
      btn.style.fontWeight = "bold";
    }

    container.appendChild(btn);
  }
};
