document.addEventListener('DOMContentLoaded', function() {
  // State
  let filters = {
    category: 'all',
    tilingType: 'all',
    displayServer: 'all',
    resourceUsage: 'all',
    customization: 'all',
    beginnerFriendly: false,
    search: ''
  };

  // Elements
  const searchInput = document.getElementById('search-input');
  const cardsContainer = document.getElementById('cards-container');
  const filterChips = document.querySelectorAll('.filter-chip');
  const modal = document.getElementById('screenshot-modal');
  const modalImage = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');

  // Filter change handler
  function handleFilterChange(filterType, value) {
    if (filterType === 'beginnerFriendly') {
      filters.beginnerFriendly = !filters.beginnerFriendly;
    } else {
      filters[filterType] = value;
    }
    updateFilterChips();
    renderCards();
  }

  // Update chip styles
  function updateFilterChips() {
    filterChips.forEach(chip => {
      const type = chip.dataset.filterType;
      const value = chip.dataset.filterValue;
      
      if (type === 'beginnerFriendly') {
        chip.classList.toggle('active', filters.beginnerFriendly && value === 'true');
        if (value === 'false') {
          chip.classList.toggle('active', !filters.beginnerFriendly);
        }
      } else {
        chip.classList.toggle('active', filters[type] === value);
      }
    });
  }

  // Filter environments
  function filterEnvironments(environments) {
    return environments.filter(env => {
      if (filters.category !== 'all' && env.category !== filters.category) return false;
      if (filters.tilingType !== 'all' && env.tilingType !== filters.tilingType) return false;
      if (filters.displayServer !== 'all' && env.displayServer !== filters.displayServer && env.displayServer !== 'both') return false;
      if (filters.resourceUsage !== 'all' && env.resourceUsage !== filters.resourceUsage) return false;
      if (filters.customization !== 'all' && env.customization !== filters.customization) return false;
      if (filters.beginnerFriendly && !env.beginnerFriendly) return false;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchName = env.name.toLowerCase().includes(searchLower);
        const matchDesc = env.description.toLowerCase().includes(searchLower);
        const matchFeatures = env.features.some(f => f.toLowerCase().includes(searchLower));
        if (!matchName && !matchDesc && !matchFeatures) return false;
      }
      
      return true;
    });
  }

  // Render cards
  function renderCards() {
    const filtered = filterEnvironments(window.environmentsData || []);
    
    if (filtered.length === 0) {
      cardsContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>Nincs talalat a megadott szurok alapjan</p>
        </div>
      `;
      return;
    }
    
    cardsContainer.innerHTML = filtered.map(env => createCardHTML(env)).join('');
    
    // Add screenshot click handlers
    document.querySelectorAll('.card-screenshot').forEach(img => {
      img.addEventListener('click', () => openModal(img.src));
    });
  }

  // Create card HTML
  function createCardHTML(env) {
    const categoryBadge = env.category === 'desktop-environment' 
      ? '<span class="badge badge-de">DE</span>'
      : '<span class="badge badge-wm">WM</span>';
    
    const displayBadge = env.displayServer === 'wayland' 
      ? '<span class="badge badge-wayland">Wayland</span>'
      : env.displayServer === 'both'
      ? '<span class="badge badge-wayland">X11/Wayland</span>'
      : '<span class="badge badge-x11">X11</span>';
    
    const features = env.features.slice(0, 5).map(f => 
      `<span class="feature-chip">${f}</span>`
    ).join('');
    
    const moreFeatures = env.features.length > 5 
      ? `<span class="feature-chip">+${env.features.length - 5}</span>` 
      : '';

    return `
      <article class="card">
        <img src="${env.screenshot}" alt="${env.name} kepernyokep" class="card-screenshot" loading="lazy">
        <div class="card-content">
          <div class="card-header">
            <img src="${env.logo}" alt="${env.name} logo" class="card-logo">
            <div class="card-title-section">
              <h3 class="card-title">${env.name}</h3>
              <div class="card-badges">
                ${categoryBadge}
                ${displayBadge}
              </div>
            </div>
          </div>
          <p class="card-description">${env.description}</p>
          <div class="card-stats">
            <div class="stat">
              <div class="stat-value">${env.memoryUsageMB} MB</div>
              <div class="stat-label">RAM</div>
            </div>
            <div class="stat">
              <div class="stat-value">${env.cpuUsagePercent}%</div>
              <div class="stat-label">CPU</div>
            </div>
            <div class="stat">
              <div class="stat-value">${env.diskSpaceMB} MB</div>
              <div class="stat-label">Tarhely</div>
            </div>
          </div>
          <div class="card-features">
            <div class="features-label">Fobb funkciok:</div>
            <div class="feature-chips">${features}${moreFeatures}</div>
          </div>
          <div class="card-actions">
            <a href="${env.website}" target="_blank" rel="noopener" class="btn btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Weboldal
            </a>
            <button class="btn btn-primary btn-disabled" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Letoltes
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // Modal functions
  function openModal(src) {
    modalImage.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value;
      renderCards();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.filterType;
      const value = chip.dataset.filterValue;
      handleFilterChange(type, value);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Initial render
  updateFilterChips();
  renderCards();
});
