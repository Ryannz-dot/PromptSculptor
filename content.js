/**
 * PromptSculptor - Content Script
 * Detects LLM input fields and injects the improvement UI
 */

(function() {
  'use strict';

  let currentInputField = null;
  let sculptorWidget = null;
  let improverModal = null;
  let dropdownMenu = null;
  const storage = new StorageManager();
  const improver = new PromptImprover();

  // Configuration for different LLM sites
  const SITE_CONFIGS = {
    'chat.openai.com': {
      selectors: [
        '#prompt-textarea',
        'textarea[data-id]',
        'textarea.m-0',
        'textarea[placeholder*="Message"]'
      ],
      name: 'ChatGPT'
    },
    'claude.ai': {
      selectors: [
        'div[contenteditable="true"]',
        'textarea',
        'div.ProseMirror'
      ],
      name: 'Claude'
    },
    'gemini.google.com': {
      selectors: [
        'rich-textarea',
        'div[contenteditable="true"]',
        'textarea'
      ],
      name: 'Gemini'
    },
    'perplexity.ai': {
      selectors: [
        'textarea',
        'div[contenteditable="true"]'
      ],
      name: 'Perplexity'
    },
    'poe.com': {
      selectors: [
        'textarea',
        'div[contenteditable="true"]'
      ],
      name: 'Poe'
    }
  };

  /**
   * Initialize the content script
   */
  function init() {
    console.log('PromptSculptor: Initializing...');

    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
      setupObserver();
    }
  }

  /**
   * Setup mutation observer to detect input fields
   */
  function setupObserver() {
    // Initial scan
    findAndAttachToInputs();

    // Watch for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      findAndAttachToInputs();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('PromptSculptor: Observer setup complete');
  }

  /**
   * Find input fields and attach the widget
   */
  function findAndAttachToInputs() {
    const hostname = window.location.hostname;
    const config = SITE_CONFIGS[hostname];

    if (!config) {
      console.log('PromptSculptor: Unsupported site');
      return;
    }

    for (const selector of config.selectors) {
      const inputs = document.querySelectorAll(selector);

      inputs.forEach(input => {
        if (!input.dataset.promptSculptorAttached) {
          attachWidget(input);
          input.dataset.promptSculptorAttached = 'true';
        }
      });
    }
  }

  /**
   * Attach the PromptSculptor widget to an input field
   */
  function attachWidget(inputElement) {
    currentInputField = inputElement;

    // Create the widget button
    const widget = createWidget();
    sculptorWidget = widget;

    // Position the widget near the input
    positionWidget(widget, inputElement);

    // Add event listeners
    setupEventListeners(inputElement);

    console.log('PromptSculptor: Widget attached to input');
  }

  /**
   * Create the widget UI
   */
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'promptsculptor-widget';
    widget.className = 'ps-widget';
    widget.innerHTML = `
      <div class="ps-widget-container">
        <button class="ps-main-button" id="ps-improve-btn" title="Improve Prompt (PromptSculptor)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </button>
        <button class="ps-library-button" id="ps-library-btn" title="Prompt Library">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
          </svg>
        </button>
        <button class="ps-history-button" id="ps-history-btn" title="History">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(widget);
    return widget;
  }

  /**
   * Position the widget near the input field
   */
  function positionWidget(widget, inputElement) {
    const rect = inputElement.getBoundingClientRect();

    // Position at bottom-right of input field
    widget.style.position = 'fixed';
    widget.style.right = `${window.innerWidth - rect.right + 10}px`;
    widget.style.bottom = `${window.innerHeight - rect.bottom + 10}px`;
    widget.style.zIndex = '999999';

    // Update position on scroll/resize
    const updatePosition = () => {
      const newRect = inputElement.getBoundingClientRect();
      widget.style.right = `${window.innerWidth - newRect.right + 10}px`;
      widget.style.bottom = `${window.innerHeight - newRect.bottom + 10}px`;
    };

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(inputElement) {
    // Improve button
    document.getElementById('ps-improve-btn')?.addEventListener('click', () => {
      handleImproveClick(inputElement);
    });

    // Library button
    document.getElementById('ps-library-btn')?.addEventListener('click', () => {
      handleLibraryClick(inputElement);
    });

    // History button
    document.getElementById('ps-history-btn')?.addEventListener('click', () => {
      handleHistoryClick();
    });

    // Focus tracking
    inputElement.addEventListener('focus', () => {
      if (sculptorWidget) {
        sculptorWidget.classList.add('ps-active');
      }
    });

    inputElement.addEventListener('blur', (e) => {
      setTimeout(() => {
        if (sculptorWidget && !sculptorWidget.contains(e.relatedTarget)) {
          sculptorWidget.classList.remove('ps-active');
        }
      }, 100);
    });
  }

  /**
   * Handle improve button click
   */
  function handleImproveClick(inputElement) {
    const currentText = getInputText(inputElement);

    if (!currentText || currentText.trim().length === 0) {
      showNotification('Please enter a prompt first!', 'warning');
      return;
    }

    // Show improvement modal
    showImprovementModal(currentText, inputElement);
  }

  /**
   * Show improvement modal
   */
  function showImprovementModal(originalText, inputElement) {
    // Create modal if it doesn't exist
    if (!improverModal) {
      improverModal = createImprovementModal();
      document.body.appendChild(improverModal);
    }

    // Improve the prompt
    const result = improver.improvePrompt(originalText);

    if (!result.success) {
      showNotification(result.error, 'error');
      return;
    }

    // Populate modal
    const originalTextarea = improverModal.querySelector('#ps-modal-original');
    const improvedTextarea = improverModal.querySelector('#ps-modal-improved');
    const improvementsList = improverModal.querySelector('#ps-improvements-list');

    originalTextarea.value = result.original;
    improvedTextarea.value = result.improved;

    // Show improvements
    improvementsList.innerHTML = result.improvements.map(imp =>
      `<li class="ps-improvement-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        ${imp}
      </li>`
    ).join('');

    // Show modal
    improverModal.style.display = 'flex';

    // Setup modal actions
    setupModalActions(improverModal, result, inputElement);

    // Add to history
    storage.addToHistory({
      original: result.original,
      improved: result.improved,
      improvements: result.improvements
    });
  }

  /**
   * Create improvement modal
   */
  function createImprovementModal() {
    const modal = document.createElement('div');
    modal.id = 'ps-improvement-modal';
    modal.className = 'ps-modal';
    modal.innerHTML = `
      <div class="ps-modal-content">
        <div class="ps-modal-header">
          <h2>✨ Prompt Improvement</h2>
          <button class="ps-modal-close" id="ps-modal-close">&times;</button>
        </div>
        <div class="ps-modal-body">
          <div class="ps-comparison">
            <div class="ps-comparison-section">
              <h3>Original Prompt</h3>
              <textarea id="ps-modal-original" readonly></textarea>
            </div>
            <div class="ps-comparison-arrow">→</div>
            <div class="ps-comparison-section">
              <h3>Improved Prompt</h3>
              <textarea id="ps-modal-improved"></textarea>
            </div>
          </div>
          <div class="ps-improvements-section">
            <h3>Improvements Made:</h3>
            <ul id="ps-improvements-list"></ul>
          </div>
          <div class="ps-modal-actions">
            <button class="ps-btn ps-btn-secondary" id="ps-modal-copy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copy
            </button>
            <button class="ps-btn ps-btn-secondary" id="ps-modal-save">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <path d="M17 21v-8H7v8M7 3v5h8"/>
              </svg>
              Save to Library
            </button>
            <button class="ps-btn ps-btn-primary" id="ps-modal-use">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Use This Prompt
            </button>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  /**
   * Setup modal action buttons
   */
  function setupModalActions(modal, result, inputElement) {
    // Close button
    modal.querySelector('#ps-modal-close').onclick = () => {
      modal.style.display = 'none';
    };

    // Copy button
    modal.querySelector('#ps-modal-copy').onclick = () => {
      const improvedText = modal.querySelector('#ps-modal-improved').value;
      copyToClipboard(improvedText);
      showNotification('Copied to clipboard!', 'success');
    };

    // Save button
    modal.querySelector('#ps-modal-save').onclick = async () => {
      const title = prompt('Enter a title for this prompt:', storage.generateTitle(result.improved));
      if (title) {
        await storage.savePrompt({
          title,
          original: result.original,
          improved: result.improved,
          improvements: result.improvements
        });
        showNotification('Saved to library!', 'success');
      }
    };

    // Use button
    modal.querySelector('#ps-modal-use').onclick = () => {
      const improvedText = modal.querySelector('#ps-modal-improved').value;
      setInputText(inputElement, improvedText);
      modal.style.display = 'none';
      showNotification('Prompt applied!', 'success');
    };

    // Click outside to close
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

  /**
   * Handle library button click
   */
  async function handleLibraryClick(inputElement) {
    const library = await storage.getPromptLibrary();

    if (library.length === 0) {
      showNotification('Your library is empty. Improve and save some prompts!', 'info');
      return;
    }

    showLibraryDropdown(library, inputElement);
  }

  /**
   * Show library dropdown
   */
  function showLibraryDropdown(library, inputElement) {
    // Remove existing dropdown
    if (dropdownMenu) {
      dropdownMenu.remove();
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'ps-dropdown';
    dropdown.innerHTML = `
      <div class="ps-dropdown-header">
        <h3>Prompt Library</h3>
        <input type="text" id="ps-library-search" placeholder="Search prompts..." />
      </div>
      <div class="ps-dropdown-content" id="ps-library-content"></div>
    `;

    document.body.appendChild(dropdown);
    dropdownMenu = dropdown;

    // Position near widget
    const widgetRect = sculptorWidget.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.right = `${window.innerWidth - widgetRect.right}px`;
    dropdown.style.bottom = `${window.innerHeight - widgetRect.top + 10}px`;

    // Populate library
    populateLibrary(library, inputElement);

    // Search functionality
    document.getElementById('ps-library-search').addEventListener('input', async (e) => {
      const results = await storage.searchPrompts(e.target.value);
      populateLibrary(results, inputElement);
    });

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !sculptorWidget.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 100);
  }

  /**
   * Populate library list
   */
  function populateLibrary(prompts, inputElement) {
    const content = document.getElementById('ps-library-content');

    if (prompts.length === 0) {
      content.innerHTML = '<div class="ps-empty">No prompts found</div>';
      return;
    }

    content.innerHTML = prompts.map(prompt => `
      <div class="ps-library-item" data-id="${prompt.id}">
        <div class="ps-library-item-header">
          <span class="ps-library-item-title">${escapeHtml(prompt.title)}</span>
          <button class="ps-favorite-btn ${prompt.favorite ? 'active' : ''}" data-id="${prompt.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${prompt.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </button>
        </div>
        <div class="ps-library-item-preview">${escapeHtml(prompt.improved.substring(0, 100))}...</div>
        <div class="ps-library-item-actions">
          <button class="ps-btn-small ps-use-btn" data-id="${prompt.id}">Use</button>
          <button class="ps-btn-small ps-copy-btn" data-id="${prompt.id}">Copy</button>
          <button class="ps-btn-small ps-delete-btn" data-id="${prompt.id}">Delete</button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    content.querySelectorAll('.ps-use-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const prompt = await storage.getPrompt(id);
        if (prompt) {
          setInputText(inputElement, prompt.improved);
          await storage.incrementUseCount(id);
          dropdownMenu.remove();
          showNotification('Prompt applied!', 'success');
        }
      });
    });

    content.querySelectorAll('.ps-copy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const prompt = await storage.getPrompt(id);
        if (prompt) {
          copyToClipboard(prompt.improved);
          showNotification('Copied to clipboard!', 'success');
        }
      });
    });

    content.querySelectorAll('.ps-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm('Delete this prompt from library?')) {
          await storage.deletePrompt(id);
          const updatedLibrary = await storage.getPromptLibrary();
          populateLibrary(updatedLibrary, inputElement);
          showNotification('Prompt deleted', 'success');
        }
      });
    });

    content.querySelectorAll('.ps-favorite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        await storage.toggleFavorite(id);
        const updatedLibrary = await storage.getPromptLibrary();
        populateLibrary(updatedLibrary, inputElement);
      });
    });
  }

  /**
   * Handle history button click
   */
  async function handleHistoryClick() {
    const history = await storage.getHistory();

    if (history.length === 0) {
      showNotification('No history yet. Start improving prompts!', 'info');
      return;
    }

    showHistoryDropdown(history);
  }

  /**
   * Show history dropdown
   */
  function showHistoryDropdown(history) {
    // Remove existing dropdown
    if (dropdownMenu) {
      dropdownMenu.remove();
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'ps-dropdown';
    dropdown.innerHTML = `
      <div class="ps-dropdown-header">
        <h3>Improvement History</h3>
        <button class="ps-btn-small" id="ps-clear-history">Clear All</button>
      </div>
      <div class="ps-dropdown-content" id="ps-history-content">
        ${history.map((item, index) => `
          <div class="ps-history-item">
            <div class="ps-history-item-time">${formatDate(item.timestamp)}</div>
            <div class="ps-history-item-text">${escapeHtml(item.improved.substring(0, 100))}...</div>
            <div class="ps-history-item-improvements">
              ${item.improvements.slice(0, 2).map(imp => `<span class="ps-tag">${escapeHtml(imp)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(dropdown);
    dropdownMenu = dropdown;

    // Position near widget
    const widgetRect = sculptorWidget.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.right = `${window.innerWidth - widgetRect.right}px`;
    dropdown.style.bottom = `${window.innerHeight - widgetRect.top + 10}px`;

    // Clear history button
    document.getElementById('ps-clear-history').addEventListener('click', async () => {
      if (confirm('Clear all history?')) {
        await storage.clearHistory();
        dropdown.remove();
        showNotification('History cleared', 'success');
      }
    });

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !sculptorWidget.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 100);
  }

  /**
   * Get text from input element
   */
  function getInputText(element) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      return element.value;
    } else if (element.contentEditable === 'true') {
      return element.innerText || element.textContent;
    }
    return '';
  }

  /**
   * Set text in input element
   */
  function setInputText(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element.contentEditable === 'true') {
      element.innerText = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  }

  /**
   * Show notification
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `ps-notification ps-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('ps-show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('ps-show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  // Initialize when script loads
  init();
})();
