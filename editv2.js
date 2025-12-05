// editv2.js - modal editor for series.php

(function () {
  let featuredEventsState = [];

  // Read current featured events from the main page tiles
  function initializeFeaturedEventsStateFromPage() {
    const scrollContainer = document.querySelector('.featured-scroll-container');
    
    if (!scrollContainer) {
      featuredEventsState = [];
      return;
    }

    const tiles = scrollContainer.querySelectorAll('.featured-tile');
    featuredEventsState = [];

    tiles.forEach(function (tile) {
      const titleEl = tile.querySelector('h3');
      const infoDivs = tile.querySelectorAll('div');
      const yearsEl = infoDivs[0] || null;
      const purseEl = infoDivs[1] || null;

        featuredEventsState.push({
          id: parseInt(tile.dataset.continualId, 10),    // you'll add this attr in HTML later
          title: titleEl ? titleEl.textContent.trim() : '',
          years: yearsEl ? yearsEl.textContent.trim() : '',
          purse: purseEl ? purseEl.textContent.trim() : ''
        });

    });
  }

  // Ensure a hidden field exists to send featured events as JSON
  function ensureHiddenFeaturedField() {
    const form = document.getElementById('event_form');
    if (!form) return null;
   let hidden = document.getElementById('featured_events_input');
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'featured_events_input';
      hidden.id = 'featured_events_input';
      form.appendChild(hidden);
    }
    return hidden;
  }

  // Render list of featured events inside the modal
  function renderFeaturedList() {
    const list = document.getElementById('featured_list_items');
    if (!list) return;

    list.innerHTML = '';

    if (featuredEventsState.length) {
      featuredEventsState.forEach(function (event, index) {
        const li = document.createElement('li');

        const textSpan = document.createElement('span');
        let label = event.title || '';
        if (event.years) {
          label += ' • ' + event.years;
        }
        if (event.purse) {
          label += ' • ' + event.purse;
        }
        textSpan.textContent = label;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';
        // Uses your .btn-primary CSS
        removeBtn.classList.add('btn-primary');

        removeBtn.addEventListener('click', function () {
          featuredEventsState.splice(index, 1);
          renderFeaturedList();
          updatePageFeaturedTiles();
        });

        li.appendChild(textSpan);
        li.appendChild(removeBtn);
        list.appendChild(li);
      });
    }

    // Sync hidden JSON field with current state
    const hidden = ensureHiddenFeaturedField();
    if (hidden) {
      hidden.value = JSON.stringify(
        featuredEventsState.map(ev => ev.id)
    );

    }
  }

  // Reflect current state back onto the main "Featured Events" tiles
  function updatePageFeaturedTiles() {
    const scrollContainer = document.querySelector('.featured-scroll-container');
    if (!scrollContainer) return;

    scrollContainer.innerHTML = '';

   featuredEventsState.forEach(function (event) {
      const tile = document.createElement('div');
      tile.className = 'featured-tile';
      tile.dataset.continualId = event.id;


      const titleEl = document.createElement('h3');
      titleEl.textContent = event.title || '';

      const yearsDiv = document.createElement('div');
      yearsDiv.textContent = event.years || '';

      const purseDiv = document.createElement('div');
      purseDiv.textContent = event.purse || '';

      tile.appendChild(titleEl);
      tile.appendChild(yearsDiv);
      tile.appendChild(purseDiv);

      scrollContainer.appendChild(tile);
    });
  }

  // Open modal: sync title + featured list, then show overlay
  function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;

    const titleInput = document.getElementById('event_title_input');
    const titleDisplay = document.getElementById('event_title');
    if (titleInput && titleDisplay) {
      titleInput.value = titleDisplay.textContent.trim();
    }

    renderFeaturedList();

    modalOverlay.classList.add('active');      // CSS handles blur + visibility
    document.body.classList.add('modal-open'); // CSS prevents background scroll
  }

  function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Logo upload: click image or button to open file picker, preview in img
  function initLogoUpload() {
    const logoImg = document.getElementById('event_logo_input');
    const logoInput = document.getElementById('logo_upload_input');
    const wrapper = document.getElementById('logo_upload_wrapper');

    if (!logoImg || !logoInput || !wrapper) return;

    // Create a visible "Upload Logo" button if it doesn't exist yet
    let uploadBtn = document.getElementById('logo_upload_button');
    if (!uploadBtn) {
      uploadBtn = document.createElement('button');
      uploadBtn.type = 'button';
      uploadBtn.id = 'logo_upload_button';
      uploadBtn.textContent = 'Upload Logo';
      uploadBtn.classList.add('btn-primary');
      wrapper.appendChild(uploadBtn);
    }

    function triggerFilePicker() {
      logoInput.click();
    }

    logoImg.addEventListener('click', triggerFilePicker);
    uploadBtn.addEventListener('click', triggerFilePicker);

    logoInput.addEventListener('change', function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        logoImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  function initMapUpload() {
    const mapImg = document.getElementById('map_logo_input');
    const mapInput = document.getElementById('map_upload_input');
    const mapWrapper = document.getElementById('map_upload_wrapper');

    if (!mapImg || !mapInput || !mapWrapper) return;

    // Create a visible "Upload Logo" button if it doesn't exist yet
    let uploadBtn = document.getElementById('map_upload_button');
    if (!uploadBtn) {
      uploadBtn = document.createElement('button');
      uploadBtn.type = 'button';
      uploadBtn.id = 'map_upload_button';
      uploadBtn.textContent = 'Upload map';
      uploadBtn.classList.add('btn-primary');
      mapWrapper.appendChild(uploadBtn);
    }

    function triggerFilePicker() {
      mapInput.click();
    }

    mapImg.addEventListener('click', triggerFilePicker);
    uploadBtn.addEventListener('click', triggerFilePicker);

    mapInput.addEventListener('change', function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        mapImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Wire up modal open/close interactions
  function initModal() {
    const editButton = document.getElementById('editButton');
    const modalOverlay = document.getElementById('modalOverlay');
    if (!editButton || !modalOverlay) {
      return;
    }

    const closeButton = modalOverlay.querySelector('.modal-close');

    editButton.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });

    if (closeButton) {
      closeButton.addEventListener('click', function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    // Click on backdrop (overlay) closes modal
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  // Inputs for adding new featured events
  function initFeaturedEventsInputs() {
      const input = document.getElementById('featured_search_input');
      const addBtn = document.getElementById('add_featured_btn');
      const searchBtn = document.getElementById('seriesSearchButton');
      const suggestionsBox = document.getElementById('featured_suggestions');
    
      if (!input || !addBtn || !suggestionsBox) {
        console.error('Featured events inputs not found');
        return;
      }
    
      let selectedEvent = null;

  // --- SEARCH LOGIC ---
function performSearch() {
  const q = input.value.trim();
  
  if (q.length < 2) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    return;
  }

  fetch("search_events.php?q=" + encodeURIComponent(q))
    .then(res => {
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    })
    .then(data => {
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'block';
      suggestionsBox.style.border = '1px solid #ddd';
      suggestionsBox.style.maxHeight = '300px';
      suggestionsBox.style.overflowY = 'auto';
      suggestionsBox.style.background = 'white';
      suggestionsBox.style.position = 'absolute';
      suggestionsBox.style.width = '100%';
      suggestionsBox.style.zIndex = '1000';
      
      if (data.length === 0) {
        suggestionsBox.innerHTML = '<div style="padding: 10px;">No events found</div>';
        return;
      }
      
      data.forEach(event => {
        const div = document.createElement('div');
        div.className = "suggestion-item";
        div.style.padding = '10px';
        div.style.cursor = 'pointer';
        div.style.borderBottom = '1px solid #eee';
        div.innerHTML = `<strong>${event.series_name}</strong><br><small>${event.first_year}–${event.last_year}</small>`;
        
        div.addEventListener('mouseenter', () => div.style.background = '#f0f0f0');
        div.addEventListener('mouseleave', () => div.style.background = 'white');
        div.addEventListener('click', () => {
          selectedEvent = {
            id: event.continual_id,
            title: event.series_name,
            years: `${event.first_year}–${event.last_year}`,
            purse: ""
          };
          input.value = event.series_name;
          suggestionsBox.innerHTML = '';
          suggestionsBox.style.display = 'none';
        });
        
        suggestionsBox.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      suggestionsBox.innerHTML = '<div style="padding: 10px; color: red;">Search failed</div>';
    });
}

// Search on button click
if (searchBtn) {
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });
}

// Search as user types (debounced)
let searchTimeout;
input.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 300);
});

// Search on Enter
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performSearch();
  }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== input && e.target !== searchBtn) {
    suggestionsBox.style.display = 'none';
  }
});


 // --- Add button: adds selectedEvent to featured list ---
addBtn.addEventListener('click', function (e) {
  e.preventDefault();
  
  if (!selectedEvent) {
    alert('Please search and select an event first');
    return;
  }

  // Check if already in list
  const alreadyAdded = featuredEventsState.some(ev => ev.id === selectedEvent.id);
  if (alreadyAdded) {
    alert('This event is already featured');
    return;
  }

  featuredEventsState.push(selectedEvent);
  input.value = '';
  selectedEvent = null;
  suggestionsBox.innerHTML = '';
  suggestionsBox.style.display = 'none';
  
  renderFeaturedList();
  updatePageFeaturedTiles();
});
}


  // Make the form POST to insert.php with multipart encoding
  function initFormSubmit() {
    const form = document.getElementById('event_form');
    if (!form) return;

    form.action = 'insert.php';
    form.method = 'post';
    form.enctype = 'multipart/form-data';

    form.addEventListener('submit', function () {
      const hidden = ensureHiddenFeaturedField();
      if (hidden) {
        hidden.value = JSON.stringify(featuredEventsState);
      }
      // allow normal submit to insert.php
    });
  }

  // Boot everything once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Take initial featured events from the page
    initializeFeaturedEventsStateFromPage();
    // Wire modal, logo, featured list, and form
    initModal();
    initLogoUpload();
    initFeaturedEventsInputs();
    initFormSubmit();
  });
})();
