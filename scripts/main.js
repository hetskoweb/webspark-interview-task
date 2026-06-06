document.addEventListener('DOMContentLoaded', () => {
// --- ЛОГІКА ПЕРЕМИКАННЯ ВИГЛЯДУ (GRID / LIST) ---
  const postsList = document.querySelector('.posts-list');
  const btnGrid = document.querySelector('.view-switch__btn--grid');
  const btnList = document.querySelector('.view-switch__btn--list');

  if (postsList) postsList.classList.add('rows');
  if (btnList) btnList.classList.add('active');

  if (btnGrid && btnList && postsList) {
    btnGrid.addEventListener('click', () => {
      postsList.classList.remove('rows');
      postsList.classList.add('grid');
      btnGrid.classList.add('active');
      btnList.classList.remove('active');
    });

    btnList.addEventListener('click', () => {
      postsList.classList.remove('grid');
      postsList.classList.add('rows');
      btnList.classList.add('active');
      btnGrid.classList.remove('active');
    });
  }

// --- ЛОГІКА FLATPICKR ТА ФІЛЬТРАЦІЇ ---
  const posts = document.querySelectorAll('.post-card');

  function parsePostDate(dateStr) {
    if (!dateStr) return null;
    dateStr = dateStr.trim();

    if (dateStr.toLowerCase() === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }

    const parts = dateStr.split(/[-_]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return null;
  }

  function filterPosts() {
    const fromDate = dateFromPicker.selectedDates[0] || null;
    const toDate = dateToPicker.selectedDates[0] || null;

    if (toDate) toDate.setHours(23, 59, 59, 999);

    posts.forEach(post => {
      const labels = post.querySelectorAll('.post-card__label');
      let postDateStr = "";

      if (labels.length > 1) {
        postDateStr = labels[1].textContent;
      } else if (labels.length === 1) {
        postDateStr = labels[0].textContent;
      }

      const postDate = parsePostDate(postDateStr);
      let isVisible = true;

      if (postDate) {
        if (fromDate && postDate < fromDate) {
          isVisible = false;
        }
        if (toDate && postDate > toDate) {
          isVisible = false;
        }
      }

      if (isVisible) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    });
  }

  const flatpickrConfig = {
    dateFormat: "d_m_Y",
    disableMobile: true,
    monthSelectorType: 'static',
    firstDayOfWeek: 0,
    onChange: filterPosts
  };

  const dateFromPicker = flatpickr("#date-from", flatpickrConfig);

  const dateToPicker = flatpickr("#date-to", {
    ...flatpickrConfig,
    defaultDate: new Date()
  });

  const btnIconFrom = document.querySelector('button[aria-label="Select date from"]');
  const btnIconTo = document.querySelector('button[aria-label="Select date to"]');

  if (btnIconFrom) btnIconFrom.addEventListener("click", () => dateFromPicker.open());
  if (btnIconTo) btnIconTo.addEventListener("click", () => dateToPicker.open());

  const btnClearFrom = document.querySelector('button[aria-label="Clear date from"]');
  const btnClearTo = document.querySelector('button[aria-label="Clear date to"]');

  if (btnClearFrom) {
    btnClearFrom.addEventListener("click", () => {
      dateFromPicker.clear();
      filterPosts();
    });
  }

  if (btnClearTo) {
    btnClearTo.addEventListener("click", () => {
      dateToPicker.clear();
      filterPosts();
    });
  }

  filterPosts();
});