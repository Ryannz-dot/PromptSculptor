/**
 * PromptSculptor - Popup Script
 * Handles the extension popup UI and interactions
 */

const storage = new StorageManager();
let currentFilter = 'all';

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadLibrary();
  await loadHistory();
  await loadStats();
  setupEventListeners();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Library search
  document.getElementById('library-search').addEventListener('input', handleLibrarySearch);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
  });

  // Clear history
  document.getElementById('clear-history').addEventListener('click', handleClearHistory);

  // Settings
  document.getElementById('setting-auto-detect').addEventListener('change', handleSettingChange);
  document.getElementById('setting-show-suggestions').addEventListener('change', handleSettingChange);

  // Data management
  document.getElementById('export-data').addEventListener('click', handleExportData);
  document.getElementById('import-data').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
  });
  document.getElementById('import-file-input').addEventListener('change', handleImportData);

  // Tutorial
  document.getElementById('view-tutorial').addEventListener('click', (e) => {
    e.preventDefault();
    showTutorial();
  });
}

/**
 * Switch tabs
 */
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `${tabName}-panel`);
  });

  // Reload content if needed
  if (tabName === 'library') {
    loadLibrary();
  } else if (tabName === 'history') {
    loadHistory();
  } else if (tabName === 'settings') {
    loadStats();
  }
}

/**
 * Load library
 */
async function loadLibrary(prompts = null) {
  const libraryList = document.getElementById('library-list');
  const emptyState = document.getElementById('library-empty');

  if (prompts === null) {
    prompts = await storage.getPromptLibrary();
  }

  // Apply current filter
  if (currentFilter === 'favorites') {
    prompts = prompts.filter(p => p.favorite);
  } else if (currentFilter === 'recent') {
    prompts = prompts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  }

  if (prompts.length === 0) {
    libraryList.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  libraryList.style.display = 'block';
  emptyState.style.display = 'none';

  libraryList.innerHTML = prompts.map(prompt => createPromptCard(prompt)).join('');

  // Add event listeners to cards
  setupPromptCardListeners();
}

/**
 * Create prompt card HTML
 */
function createPromptCard(prompt) {
  return `
    <div class="prompt-card" data-id="${prompt.id}">
      <div class="prompt-card-header">
        <h4 class="prompt-card-title">${escapeHtml(prompt.title)}</h4>
        <button class="favorite-btn ${prompt.favorite ? 'active' : ''}" data-id="${prompt.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${prompt.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </button>
      </div>
      <div class="prompt-card-preview">${escapeHtml(prompt.improved.substring(0, 120))}...</div>
      <div class="prompt-card-meta">
        <span class="meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          ${formatDate(prompt.createdAt)}
        </span>
        ${prompt.useCount > 0 ? `<span class="meta-item">Used ${prompt.useCount}x</span>` : ''}
      </div>
      <div class="prompt-card-actions">
        <button class="btn-action btn-copy" data-id="${prompt.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copy
        </button>
        <button class="btn-action btn-view" data-id="${prompt.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          View
        </button>
        <button class="btn-action btn-delete" data-id="${prompt.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  `;
}

/**
 * Setup prompt card listeners
 */
function setupPromptCardListeners() {
  // Favorite buttons
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', handleToggleFavorite);
  });

  // Copy buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', handleCopyPrompt);
  });

  // View buttons
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', handleViewPrompt);
  });

  // Delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', handleDeletePrompt);
  });
}

/**
 * Handle library search
 */
async function handleLibrarySearch(e) {
  const query = e.target.value;
  if (query.trim().length === 0) {
    await loadLibrary();
    return;
  }

  const results = await storage.searchPrompts(query);
  await loadLibrary(results);
}

/**
 * Handle filter
 */
async function handleFilter(filter) {
  currentFilter = filter;

  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  await loadLibrary();
}

/**
 * Handle toggle favorite
 */
async function handleToggleFavorite(e) {
  e.stopPropagation();
  const id = e.currentTarget.dataset.id;
  await storage.toggleFavorite(id);
  await loadLibrary();
  await loadStats();
}

/**
 * Handle copy prompt
 */
async function handleCopyPrompt(e) {
  const id = e.target.closest('button').dataset.id;
  const prompt = await storage.getPrompt(id);

  if (prompt) {
    await navigator.clipboard.writeText(prompt.improved);
    showNotification('Copied to clipboard!');
  }
}

/**
 * Handle view prompt
 */
async function handleViewPrompt(e) {
  const id = e.target.closest('button').dataset.id;
  const prompt = await storage.getPrompt(id);

  if (prompt) {
    showPromptModal(prompt);
  }
}

/**
 * Handle delete prompt
 */
async function handleDeletePrompt(e) {
  const id = e.target.closest('button').dataset.id;

  if (confirm('Are you sure you want to delete this prompt?')) {
    await storage.deletePrompt(id);
    await loadLibrary();
    await loadStats();
    showNotification('Prompt deleted');
  }
}

/**
 * Show prompt modal
 */
function showPromptModal(prompt) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${escapeHtml(prompt.title)}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-section">
          <h3>Original Prompt</h3>
          <div class="prompt-text">${escapeHtml(prompt.original)}</div>
        </div>
        <div class="modal-section">
          <h3>Improved Prompt</h3>
          <div class="prompt-text highlight">${escapeHtml(prompt.improved)}</div>
        </div>
        ${prompt.improvements && prompt.improvements.length > 0 ? `
          <div class="modal-section">
            <h3>Improvements Made</h3>
            <ul class="improvements-list">
              ${prompt.improvements.map(imp => `<li>${escapeHtml(imp)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" id="modal-copy">Copy Improved Prompt</button>
        <button class="btn-primary modal-close">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  modal.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => modal.remove());
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Copy handler
  document.getElementById('modal-copy').addEventListener('click', async () => {
    await navigator.clipboard.writeText(prompt.improved);
    showNotification('Copied to clipboard!');
  });
}

/**
 * Load history
 */
async function loadHistory() {
  const historyList = document.getElementById('history-list');
  const emptyState = document.getElementById('history-empty');
  const history = await storage.getHistory();

  if (history.length === 0) {
    historyList.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  historyList.style.display = 'block';
  emptyState.style.display = 'none';

  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-item-header">
        <span class="history-time">${formatDate(item.timestamp)}</span>
      </div>
      <div class="history-item-content">
        <div class="history-prompt">${escapeHtml(item.improved.substring(0, 150))}...</div>
      </div>
      <div class="history-improvements">
        ${item.improvements.slice(0, 3).map(imp =>
          `<span class="improvement-tag">${escapeHtml(imp)}</span>`
        ).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Handle clear history
 */
async function handleClearHistory() {
  if (confirm('Are you sure you want to clear all history?')) {
    await storage.clearHistory();
    await loadHistory();
    await loadStats();
    showNotification('History cleared');
  }
}

/**
 * Load settings
 */
async function loadSettings() {
  const settings = await storage.getSettings();

  document.getElementById('setting-auto-detect').checked = settings.autoDetect;
  document.getElementById('setting-show-suggestions').checked = settings.showSuggestions;
}

/**
 * Handle setting change
 */
async function handleSettingChange() {
  const settings = {
    autoDetect: document.getElementById('setting-auto-detect').checked,
    showSuggestions: document.getElementById('setting-show-suggestions').checked
  };

  await storage.saveSettings(settings);
  showNotification('Settings saved');
}

/**
 * Load statistics
 */
async function loadStats() {
  const stats = await storage.getStorageStats();

  if (stats) {
    document.getElementById('stat-prompts').textContent = stats.promptCount;
    document.getElementById('stat-history').textContent = stats.historyCount;
    document.getElementById('stat-favorites').textContent = stats.favoriteCount;
  }
}

/**
 * Handle export data
 */
async function handleExportData() {
  const data = await storage.exportData();

  if (data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptsculptor-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully');
  }
}

/**
 * Handle import data
 */
async function handleImportData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);
      await storage.importData(data);
      await loadLibrary();
      await loadHistory();
      await loadStats();
      showNotification('Data imported successfully');
    } catch (error) {
      alert('Error importing data: ' + error.message);
    }
  };

  reader.readAsText(file);
  e.target.value = ''; // Reset file input
}

/**
 * Show tutorial
 */
function showTutorial() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal tutorial-modal">
      <div class="modal-header">
        <h2>How to Use PromptSculptor</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="tutorial-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Visit an LLM Website</h3>
            <p>Go to ChatGPT, Claude, Gemini, or any supported LLM platform</p>
          </div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Type Your Prompt</h3>
            <p>Start typing in the chat input field and you'll see the PromptSculptor widget appear</p>
          </div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Click Improve</h3>
            <p>Click the star icon to see an improved version of your prompt with better structure and clarity</p>
          </div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3>Save to Library</h3>
            <p>Save prompts you like to your library for quick access later</p>
          </div>
        </div>
        <div class="tutorial-step">
          <div class="step-number">5</div>
          <div class="step-content">
            <h3>Access Anytime</h3>
            <p>Click the library icon to access your saved prompts on any LLM website</p>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary modal-close">Got it!</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => modal.remove());
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

/**
 * Show notification
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Format date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
