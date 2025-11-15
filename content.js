/**
 * PromptSculptor - Content Script
 * Detects LLM input fields and uses the LLM's own session to improve prompts
 *
 * Built by Rehan Nawaz - https://rehannawaz.info
 */

(function() {
  'use strict';

  let currentInputField = null;
  let sculptorWidget = null;
  let improverModal = null;
  let dropdownMenu = null;
  const storage = new StorageManager();
  let isImproving = false;

  // Configuration for different LLM sites
  const SITE_CONFIGS = {
    'chat.openai.com': {
      selectors: [
        '#prompt-textarea',
        'textarea[placeholder*="Message"]',
        'textarea[placeholder*="message"]',
        'textarea[data-id]',
        'textarea',
        'div[contenteditable="true"][role="textbox"]'
      ],
      name: 'ChatGPT',
      type: 'chatgpt',
      submitSelector: 'button[data-testid="send-button"], button[aria-label*="Send"], button[aria-label*="send"]',
      improvementPrompt: (userPrompt) => `You are an elite prompt engineering specialist with expertise in cognitive linguistics, instructional design, and AI model behavior. Your mission: Transform this prompt into an optimized masterpiece that extracts maximum value from ChatGPT.

PROMPT ENHANCEMENT FRAMEWORK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ROLE & EXPERTISE
   - Assign specific expertise/persona when beneficial
   - Define domain knowledge level needed

2. CLARITY & PRECISION
   - Eliminate ambiguity
   - Define technical terms
   - Specify exact requirements

3. CONTEXT & CONSTRAINTS
   - Provide relevant background
   - Set boundaries (length, style, tone, format)
   - Specify what to include/exclude

4. OUTPUT STRUCTURE
   - Define exact format (markdown, JSON, code, table)
   - Specify organization (sections, headers, numbering)
   - Request step-by-step when appropriate

5. QUALITY SIGNALS
   - Add phrases like "detailed", "comprehensive", "with examples"
   - Request explanations of reasoning
   - Ask for multiple perspectives when relevant

6. TASK DECOMPOSITION
   - Break complex tasks into logical sub-tasks
   - Number steps for multi-part requests

ORIGINAL USER PROMPT:
━━━━━━━━━━━━━━━━━━━━
${userPrompt}
━━━━━━━━━━━━━━━━━━━━

OUTPUT INSTRUCTIONS:
Return ONLY the enhanced prompt. NO preamble, NO "Here's the improved prompt:", NO explanations. Begin immediately with the improved prompt text.`
    },
    'chatgpt.com': {
      selectors: [
        '#prompt-textarea',
        'textarea[placeholder*="Message"]',
        'textarea[placeholder*="message"]',
        'textarea[data-id]',
        'textarea',
        'div[contenteditable="true"][role="textbox"]'
      ],
      name: 'ChatGPT',
      type: 'chatgpt',
      submitSelector: 'button[data-testid="send-button"], button[aria-label*="Send"], button[aria-label*="send"]',
      improvementPrompt: (userPrompt) => `You are an elite prompt engineering specialist with expertise in cognitive linguistics, instructional design, and AI model behavior. Your mission: Transform this prompt into an optimized masterpiece that extracts maximum value from ChatGPT.

PROMPT ENHANCEMENT FRAMEWORK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ROLE & EXPERTISE
   - Assign specific expertise/persona when beneficial
   - Define domain knowledge level needed

2. CLARITY & PRECISION
   - Eliminate ambiguity
   - Define technical terms
   - Specify exact requirements

3. CONTEXT & CONSTRAINTS
   - Provide relevant background
   - Set boundaries (length, style, tone, format)
   - Specify what to include/exclude

4. OUTPUT STRUCTURE
   - Define exact format (markdown, JSON, code, table)
   - Specify organization (sections, headers, numbering)
   - Request step-by-step when appropriate

5. QUALITY SIGNALS
   - Add phrases like "detailed", "comprehensive", "with examples"
   - Request explanations of reasoning
   - Ask for multiple perspectives when relevant

6. TASK DECOMPOSITION
   - Break complex tasks into logical sub-tasks
   - Number steps for multi-part requests

ORIGINAL USER PROMPT:
━━━━━━━━━━━━━━━━━━━━
${userPrompt}
━━━━━━━━━━━━━━━━━━━━

OUTPUT INSTRUCTIONS:
Return ONLY the enhanced prompt. NO preamble, NO "Here's the improved prompt:", NO explanations. Begin immediately with the improved prompt text.`
    },
    'claude.ai': {
      selectors: [
        'div[contenteditable="true"]',
        'div.ProseMirror',
        'textarea'
      ],
      name: 'Claude',
      type: 'claude',
      submitSelector: 'button[aria-label*="Send"]',
      improvementPrompt: (userPrompt) => `You are a master prompt engineer specializing in Claude's architecture. Claude excels with detailed instructions, structured thinking, and explicit expectations. Your task: Craft an exceptional prompt that leverages Claude's unique capabilities.

CLAUDE OPTIMIZATION PROTOCOL:
═════════════════════════════════

⚡ STRENGTHS TO LEVERAGE:
- Extended context understanding
- Nuanced reasoning and analysis
- Step-by-step logical thinking
- Handling complex multi-part tasks
- Thoughtful, balanced responses

📋 ENHANCEMENT CHECKLIST:

✓ ROLE DEFINITION
  Assign expert persona with specific domain knowledge

✓ TASK CLARITY
  Crystal-clear objectives with zero ambiguity
  Define success criteria explicitly

✓ THINKING STRUCTURE
  Request chain-of-thought reasoning when complex
  Break multi-step tasks into numbered stages

✓ OUTPUT FORMATTING
  Specify exact structure (markdown, bullets, sections)
  Define organization and hierarchy

✓ CONTEXT & CONSTRAINTS
  Provide essential background
  Set explicit boundaries (tone, length, style, scope)

✓ QUALITY MARKERS
  Use phrases: "comprehensive", "detailed", "well-reasoned"
  Request examples, citations, or evidence when relevant

✓ EDGE CASES
  Address potential ambiguities
  Specify handling of special cases

USER'S ORIGINAL PROMPT:
═════════════════════
${userPrompt}
═════════════════════

CRITICAL OUTPUT RULE:
Respond with ONLY the optimized prompt. Zero preamble. Zero meta-commentary. Direct prompt text only.`
    },
    'gemini.google.com': {
      selectors: [
        'rich-textarea .ql-editor',
        'div[contenteditable="true"][aria-label*="prompt"]',
        'div[contenteditable="true"][aria-label*="message"]',
        'div[contenteditable="true"][data-placeholder]',
        'div[contenteditable="true"]',
        'textarea[placeholder*="Ask"]',
        'textarea[placeholder*="Enter"]',
        'textarea'
      ],
      name: 'Gemini',
      type: 'gemini',
      submitSelector: 'button[aria-label*="Send"], button[aria-label*="send"], button[type="submit"]',
      improvementPrompt: (userPrompt) => `You are a Gemini prompt optimization specialist. Google Gemini excels at multimodal understanding, creative tasks, and detailed analysis. Engineer a prompt that maximizes Gemini's capabilities.

GEMINI OPTIMIZATION FRAMEWORK:
╔════════════════════════════════╗

🎯 CORE OPTIMIZATION STRATEGIES:

1. PRECISION ENGINEERING
   → Eliminate ALL ambiguity
   → Define technical terms explicitly
   → Specify exact requirements and deliverables

2. STRUCTURAL CLARITY
   → Organize multi-part requests with clear sections
   → Use numbered steps for sequential tasks
   → Employ bullet points for parallel requirements

3. CONTEXTUAL RICHNESS
   → Provide sufficient background information
   → Include relevant constraints and assumptions
   → Specify domain knowledge required

4. FORMAT SPECIFICATION
   → Define output structure (markdown/JSON/code/tables)
   → Request specific organization patterns
   → Specify level of detail needed

5. QUALITY AMPLIFIERS
   → Add descriptors: "thorough", "detailed", "comprehensive"
   → Request examples and explanations
   → Ask for multiple approaches when applicable

6. CONSTRAINT DEFINITION
   → Set boundaries: length, style, tone, complexity
   → Define what to include AND exclude
   → Specify target audience if relevant

ORIGINAL USER PROMPT:
────────────────────────────────
${userPrompt}
────────────────────────────────

╚════════════════════════════════╝

OUTPUT DIRECTIVE: Return ONLY the optimized prompt. No preamble, no explanations, no wrapper text. Begin directly with enhanced prompt content.`
    },
    'perplexity.ai': {
      selectors: [
        'textarea[placeholder*="Ask"]',
        'textarea[placeholder*="follow"]',
        'textarea',
        'div[contenteditable="true"]'
      ],
      name: 'Perplexity',
      type: 'perplexity',
      submitSelector: 'button[aria-label*="Submit"], button[type="submit"]',
      improvementPrompt: (userPrompt) => `You are a Perplexity AI search optimization expert. Perplexity excels at research, fact-finding, and synthesizing information from multiple sources with citations. Transform this query into a research powerhouse prompt.

PERPLEXITY OPTIMIZATION MATRIX:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

🔍 RESEARCH QUERY ENHANCEMENT:

① SEARCH INTENT PRECISION
   • Clarify EXACTLY what information is sought
   • Define the specific question or problem
   • Specify the end goal of the research

② SCOPE & DEPTH DEFINITION
   • Breadth: How wide should the search be?
   • Depth: How detailed should answers be?
   • Coverage: Which aspects to prioritize?

③ SOURCE QUALITY SPECIFICATIONS
   • Academic papers / peer-reviewed sources
   • Recent news / current events (specify timeframe)
   • Technical documentation / official sources
   • Industry reports / expert analyses
   • Specify credibility requirements

④ TEMPORAL CONSTRAINTS
   • "Recent" → Specify: last week/month/year
   • Historical context needed?
   • Evolution over time relevant?
   • Latest developments critical?

⑤ OUTPUT STRUCTURE REQUIREMENTS
   • Summary format: bullet points / paragraphs / tables
   • Citation style: inline / footnotes / bibliography
   • Comparison structure if evaluating options
   • Pros/cons analysis if applicable

⑥ MULTI-PERSPECTIVE REQUESTS
   • Multiple viewpoints needed?
   • Contrasting opinions required?
   • Expert consensus vs. debates?
   • Different domain perspectives?

⑦ SPECIFICITY BOOSTERS
   • Geographic focus if relevant
   • Industry/domain specificity
   • Technical level (beginner/expert)
   • Use case or application context

USER'S ORIGINAL QUERY:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
${userPrompt}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

STRICT OUTPUT RULE:
Deliver ONLY the optimized search query. Zero commentary. Zero preamble. Pure enhanced prompt only.`
    },
    'www.perplexity.ai': {
      selectors: [
        'textarea[placeholder*="Ask"]',
        'textarea[placeholder*="follow"]',
        'textarea',
        'div[contenteditable="true"]'
      ],
      name: 'Perplexity',
      type: 'perplexity',
      submitSelector: 'button[aria-label*="Submit"], button[type="submit"]',
      improvementPrompt: (userPrompt) => `You are a Perplexity AI search optimization expert. Perplexity excels at research, fact-finding, and synthesizing information from multiple sources with citations. Transform this query into a research powerhouse prompt.

PERPLEXITY OPTIMIZATION MATRIX:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

🔍 RESEARCH QUERY ENHANCEMENT:

① SEARCH INTENT PRECISION
   • Clarify EXACTLY what information is sought
   • Define the specific question or problem
   • Specify the end goal of the research

② SCOPE & DEPTH DEFINITION
   • Breadth: How wide should the search be?
   • Depth: How detailed should answers be?
   • Coverage: Which aspects to prioritize?

③ SOURCE QUALITY SPECIFICATIONS
   • Academic papers / peer-reviewed sources
   • Recent news / current events (specify timeframe)
   • Technical documentation / official sources
   • Industry reports / expert analyses
   • Specify credibility requirements

④ TEMPORAL CONSTRAINTS
   • "Recent" → Specify: last week/month/year
   • Historical context needed?
   • Evolution over time relevant?
   • Latest developments critical?

⑤ OUTPUT STRUCTURE REQUIREMENTS
   • Summary format: bullet points / paragraphs / tables
   • Citation style: inline / footnotes / bibliography
   • Comparison structure if evaluating options
   • Pros/cons analysis if applicable

⑥ MULTI-PERSPECTIVE REQUESTS
   • Multiple viewpoints needed?
   • Contrasting opinions required?
   • Expert consensus vs. debates?
   • Different domain perspectives?

⑦ SPECIFICITY BOOSTERS
   • Geographic focus if relevant
   • Industry/domain specificity
   • Technical level (beginner/expert)
   • Use case or application context

USER'S ORIGINAL QUERY:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
${userPrompt}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

STRICT OUTPUT RULE:
Deliver ONLY the optimized search query. Zero commentary. Zero preamble. Pure enhanced prompt only.`
    }
  };

  /**
   * Initialize the content script
   */
  function init() {
    console.log('PromptSculptor: Initializing...');
    console.log('PromptSculptor: Current URL:', window.location.href);
    console.log('PromptSculptor: Hostname:', window.location.hostname);
    console.log('PromptSculptor: Document ready state:', document.readyState);

    // Check if dependencies loaded
    if (typeof StorageManager === 'undefined') {
      console.error('PromptSculptor: StorageManager not loaded!');
      return;
    }
    if (typeof PromptImprover === 'undefined') {
      console.error('PromptSculptor: PromptImprover not loaded!');
      return;
    }
    console.log('PromptSculptor: Dependencies loaded successfully');

    // Inject styles
    injectStyles();

    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
      setupObserver();
    }
  }

  /**
   * Inject custom styles
   */
  function injectStyles() {
    // CSS is already injected via manifest, but ensure it's loaded
    if (!document.getElementById('promptsculptor-styles')) {
      const link = document.createElement('link');
      link.id = 'promptsculptor-styles';
      link.rel = 'stylesheet';
      link.href = chrome.runtime.getURL('content.css');
      document.head.appendChild(link);
    }
  }

  /**
   * Setup mutation observer to detect input fields
   */
  function setupObserver() {
    console.log('PromptSculptor: Setting up observer...');

    // Initial scan
    setTimeout(() => findAndAttachToInputs(), 1000);
    setTimeout(() => findAndAttachToInputs(), 3000);

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
      console.log('PromptSculptor: Unsupported site:', hostname);
      console.log('PromptSculptor: Available sites:', Object.keys(SITE_CONFIGS));
      return;
    }

    console.log('PromptSculptor: Searching for input fields on', config.name);
    console.log('PromptSculptor: Trying selectors:', config.selectors);

    let foundAny = false;
    for (const selector of config.selectors) {
      try {
        const inputs = document.querySelectorAll(selector);
        console.log(`PromptSculptor: Selector "${selector}" found ${inputs.length} element(s)`);

        inputs.forEach((input, index) => {
          const alreadyAttached = input.dataset.promptSculptorAttached;
          const visible = isVisible(input);
          console.log(`PromptSculptor: Element ${index} - attached: ${alreadyAttached}, visible: ${visible}`);

          // Check if it's visible and not already attached
          if (!alreadyAttached && visible) {
            console.log('PromptSculptor: ✓ Attaching to input field:', selector, index);
            attachWidget(input, config);
            input.dataset.promptSculptorAttached = 'true';
            foundAny = true;
          }
        });

        if (foundAny) break; // Found and attached, stop searching
      } catch (e) {
        console.error('PromptSculptor: Error with selector', selector, e);
      }
    }

    if (!foundAny) {
      console.log('PromptSculptor: No suitable input fields found yet. Will try again...');
    }
  }

  /**
   * Check if element is visible
   */
  function isVisible(element) {
    return element.offsetWidth > 0 &&
           element.offsetHeight > 0 &&
           window.getComputedStyle(element).display !== 'none' &&
           window.getComputedStyle(element).visibility !== 'hidden';
  }

  /**
   * Check if widget should be hidden
   */
  async function shouldHideWidget() {
    try {
      const result = await chrome.storage.local.get('hideUntil');
      if (result.hideUntil) {
        const hideUntil = new Date(result.hideUntil);
        const now = new Date();
        if (now < hideUntil) {
          const minutes = Math.ceil((hideUntil - now) / 60000);
          console.log(`PromptSculptor: Widget hidden for ${minutes} more minutes`);
          return true;
        } else {
          // Hide period expired, clear it
          await chrome.storage.local.remove('hideUntil');
        }
      }
      return false;
    } catch (error) {
      console.error('PromptSculptor: Error checking hide status:', error);
      return false;
    }
  }

  /**
   * Handle hide widget for 30 minutes
   */
  async function handleHideWidget() {
    const hideUntil = new Date();
    hideUntil.setMinutes(hideUntil.getMinutes() + 30);

    try {
      await chrome.storage.local.set({ hideUntil: hideUntil.toISOString() });

      // Hide the widget
      if (sculptorWidget) {
        sculptorWidget.style.display = 'none';
      }

      showNotification('Widget hidden for 30 minutes', 'success');
      console.log('PromptSculptor: Widget hidden until', hideUntil.toLocaleTimeString());
    } catch (error) {
      console.error('PromptSculptor: Error hiding widget:', error);
      showNotification('Error hiding widget', 'error');
    }
  }

  /**
   * Attach the PromptSculptor widget to an input field
   */
  async function attachWidget(inputElement, config) {
    console.log('PromptSculptor: Attaching widget to input');

    // Check if widget should be hidden
    if (await shouldHideWidget()) {
      console.log('PromptSculptor: Widget is hidden, skipping attachment');
      return;
    }

    currentInputField = inputElement;

    // Create the widget button if it doesn't exist
    if (!sculptorWidget) {
      const widget = createWidget();
      sculptorWidget = widget;
      document.body.appendChild(widget);
    }

    // Position the widget near the input
    positionWidget(sculptorWidget, inputElement);

    // Add event listeners
    setupEventListeners(inputElement, config);

    // Update position on scroll/resize
    const updatePosition = () => {
      if (sculptorWidget && inputElement && isVisible(inputElement)) {
        positionWidget(sculptorWidget, inputElement);
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    // Show widget on focus
    inputElement.addEventListener('focus', () => {
      if (sculptorWidget) {
        sculptorWidget.classList.add('ps-active');
        positionWidget(sculptorWidget, inputElement);
      }
    });

    // Optionally collapse widget on blur (after a delay to allow clicks)
    inputElement.addEventListener('blur', () => {
      setTimeout(() => {
        if (sculptorWidget && !document.getElementById('ps-dropdown-menu')?.classList.contains('ps-show')) {
          // Only collapse if dropdown is not open
          if (!improverModal || improverModal.style.display === 'none') {
            // Only collapse if modal is not showing
            const widget = document.getElementById('promptsculptor-widget');
            if (widget && !widget.matches(':hover')) {
              sculptorWidget.classList.remove('ps-active');
            }
          }
        }
      }, 200);
    });

    console.log('PromptSculptor: Widget attached successfully');
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
        <button class="ps-widget-label" id="ps-label-btn" title="Click to improve prompt">PromptSculptor</button>
        <button class="ps-main-button" id="ps-improve-btn" title="Improve Prompt with AI">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </button>
        <button class="ps-dropdown-toggle" id="ps-dropdown-toggle" title="Library & History">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>
      <div class="ps-dropdown-menu" id="ps-dropdown-menu">
        <button class="ps-dropdown-item" id="ps-menu-library">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
          </svg>
          <span>Prompt Library</span>
        </button>
        <button class="ps-dropdown-item" id="ps-menu-history">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>History</span>
        </button>
        <div class="ps-dropdown-divider"></div>
        <button class="ps-dropdown-item" id="ps-menu-hide">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
          <span>Hide for 30 minutes</span>
        </button>
      </div>
    `;

    return widget;
  }

  /**
   * Position the widget near the input field
   */
  function positionWidget(widget, inputElement) {
    const rect = inputElement.getBoundingClientRect();

    // Position 20% more to the right from the right edge
    const rightOffset = window.innerWidth - rect.right;
    const adjustedRight = rightOffset * 0.8; // 20% more to the right (reduce offset by 20%)

    widget.style.position = 'fixed';
    widget.style.right = `${adjustedRight}px`; // 20% more to the right
    widget.style.top = `${rect.top - 60}px`; // 60px above the input
    widget.style.zIndex = '999999';

    // If widget would be off-screen at the top, position it at the top with margin
    if (rect.top < 70) {
      widget.style.top = '10px';
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners(inputElement, config) {
    const labelBtn = document.getElementById('ps-label-btn');
    const improveBtn = document.getElementById('ps-improve-btn');
    const dropdownToggle = document.getElementById('ps-dropdown-toggle');
    const dropdownMenu = document.getElementById('ps-dropdown-menu');
    const menuLibrary = document.getElementById('ps-menu-library');
    const menuHistory = document.getElementById('ps-menu-history');
    const menuHide = document.getElementById('ps-menu-hide');

    // Label button (main trigger for improvement)
    if (labelBtn) {
      const newLabelBtn = labelBtn.cloneNode(true);
      labelBtn.parentNode.replaceChild(newLabelBtn, labelBtn);

      newLabelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleImproveClick(inputElement, config);
      });
    }

    // Improve button (star icon)
    if (improveBtn) {
      const newImproveBtn = improveBtn.cloneNode(true);
      improveBtn.parentNode.replaceChild(newImproveBtn, improveBtn);

      newImproveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleImproveClick(inputElement, config);
      });
    }

    // Dropdown toggle
    if (dropdownToggle && dropdownMenu) {
      const newToggle = dropdownToggle.cloneNode(true);
      dropdownToggle.parentNode.replaceChild(newToggle, dropdownToggle);

      newToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const menu = document.getElementById('ps-dropdown-menu');

        // Check if dropdown should open upward
        if (sculptorWidget) {
          const widgetRect = sculptorWidget.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const spaceBelow = windowHeight - widgetRect.bottom;
          const menuHeight = 200; // Estimated menu height

          // If not enough space below, open upward
          if (spaceBelow < menuHeight && widgetRect.top > menuHeight) {
            menu.classList.add('ps-dropdown-up');
          } else {
            menu.classList.remove('ps-dropdown-up');
          }
        }

        menu.classList.toggle('ps-show');
      });
    }

    // Library menu item
    if (menuLibrary) {
      const newMenuLibrary = menuLibrary.cloneNode(true);
      menuLibrary.parentNode.replaceChild(newMenuLibrary, menuLibrary);

      newMenuLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('ps-dropdown-menu').classList.remove('ps-show');
        handleLibraryClick(inputElement);
      });
    }

    // History menu item
    if (menuHistory) {
      const newMenuHistory = menuHistory.cloneNode(true);
      menuHistory.parentNode.replaceChild(newMenuHistory, menuHistory);

      newMenuHistory.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('ps-dropdown-menu').classList.remove('ps-show');
        handleHistoryClick();
      });
    }

    // Hide for 30 minutes menu item
    if (menuHide) {
      const newMenuHide = menuHide.cloneNode(true);
      menuHide.parentNode.replaceChild(newMenuHide, menuHide);

      newMenuHide.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('ps-dropdown-menu').classList.remove('ps-show');
        handleHideWidget();
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('ps-dropdown-menu');
      const widget = document.getElementById('promptsculptor-widget');
      if (menu && widget && !widget.contains(e.target)) {
        menu.classList.remove('ps-show');
      }
    });
  }

  /**
   * Handle improve button click - Uses LLM's own session
   */
  async function handleImproveClick(inputElement, config) {
    if (isImproving) {
      showNotification('Already improving a prompt...', 'info');
      return;
    }

    const currentText = getInputText(inputElement);

    if (!currentText || currentText.trim().length === 0) {
      showNotification('Please enter a prompt first!', 'warning');
      return;
    }

    if (currentText.trim().length < 10) {
      showNotification('Prompt is too short to improve', 'warning');
      return;
    }

    isImproving = true;
    showLoadingIndicator();

    try {
      console.log('PromptSculptor: Improving prompt using', config.name);

      // Use the LLM's own session to improve the prompt
      const improvedPrompt = await improvePromptWithLLM(currentText, config, inputElement);

      if (improvedPrompt && improvedPrompt !== currentText) {
        // Show improvement modal
        showImprovementModal(currentText, improvedPrompt, inputElement);

        // Add to history
        await storage.addToHistory({
          original: currentText,
          improved: improvedPrompt,
          improvements: ['AI-powered improvement via ' + config.name],
          platform: config.name
        });
      } else {
        showNotification('Could not improve prompt. Try again or check console for errors.', 'error');
      }
    } catch (error) {
      console.error('PromptSculptor: Error improving prompt:', error);
      showNotification('Error: ' + error.message, 'error');
    } finally {
      isImproving = false;
      hideLoadingIndicator();
    }
  }

  /**
   * Improve prompt using the LLM's own session
   */
  async function improvePromptWithLLM(userPrompt, config, inputElement) {
    console.log('PromptSculptor: Starting LLM-based improvement');

    // Get the improvement meta-prompt
    const metaPrompt = config.improvementPrompt(userPrompt);

    // Save current prompt
    const originalPrompt = getInputText(inputElement);

    try {
      // Method 1: Try to use the site's API directly
      if (config.type === 'chatgpt') {
        return await improvewithChatGPT(metaPrompt, inputElement, config);
      } else if (config.type === 'claude') {
        return await improveWithClaude(metaPrompt, inputElement, config);
      } else if (config.type === 'gemini') {
        return await improveWithGemini(metaPrompt, inputElement, config);
      }
    } catch (error) {
      console.error('PromptSculptor: LLM improvement failed:', error);
      throw error;
    } finally {
      // Restore original prompt
      setInputText(inputElement, originalPrompt);
    }
  }

  /**
   * Improve with ChatGPT by simulating a request
   */
  async function improvewithChatGPT(metaPrompt, inputElement, config) {
    return new Promise((resolve, reject) => {
      console.log('PromptSculptor: Using ChatGPT session');

      // Set the meta-prompt
      setInputText(inputElement, metaPrompt);

      // Wait a bit for input to register
      setTimeout(() => {
        // Find and click send button
        const sendButton = document.querySelector(config.submitSelector);

        if (!sendButton) {
          reject(new Error('Could not find send button'));
          return;
        }

        // Click send
        sendButton.click();

        // Wait for response
        let attempts = 0;
        const maxAttempts = 60; // 30 seconds max

        const checkForResponse = setInterval(() => {
          attempts++;

          // Look for the latest response
          const responseElements = document.querySelectorAll('[data-message-author-role="assistant"]');

          if (responseElements.length > 0) {
            const latestResponse = responseElements[responseElements.length - 1];
            const responseText = latestResponse.textContent || latestResponse.innerText;

            // Check if response is complete (no generating indicator)
            const isGenerating = document.querySelector('[data-testid*="stop"], button[aria-label*="Stop"]');

            if (!isGenerating && responseText && responseText.length > 20) {
              clearInterval(checkForResponse);

              // Clean up the response
              const improved = responseText.trim();

              console.log('PromptSculptor: Got improved prompt from ChatGPT');
              resolve(improved);
            }
          }

          if (attempts >= maxAttempts) {
            clearInterval(checkForResponse);
            reject(new Error('Timeout waiting for ChatGPT response'));
          }
        }, 500);
      }, 500);
    });
  }

  /**
   * Improve with Claude by simulating a request
   */
  async function improveWithClaude(metaPrompt, inputElement, config) {
    return new Promise((resolve, reject) => {
      console.log('PromptSculptor: Using Claude session');

      // Set the meta-prompt
      setInputText(inputElement, metaPrompt);

      setTimeout(() => {
        const sendButton = document.querySelector(config.submitSelector);

        if (!sendButton) {
          reject(new Error('Could not find send button'));
          return;
        }

        sendButton.click();

        let attempts = 0;
        const maxAttempts = 60;

        const checkForResponse = setInterval(() => {
          attempts++;

          // Look for Claude's response
          const responseElements = document.querySelectorAll('div[data-is-streaming="false"]');

          if (responseElements.length > 0) {
            const latestResponse = responseElements[responseElements.length - 1];
            const responseText = latestResponse.textContent || latestResponse.innerText;

            if (responseText && responseText.length > 20) {
              clearInterval(checkForResponse);
              console.log('PromptSculptor: Got improved prompt from Claude');
              resolve(responseText.trim());
            }
          }

          if (attempts >= maxAttempts) {
            clearInterval(checkForResponse);
            reject(new Error('Timeout waiting for Claude response'));
          }
        }, 500);
      }, 500);
    });
  }

  /**
   * Improve with Gemini by simulating a request
   */
  async function improveWithGemini(metaPrompt, inputElement, config) {
    return new Promise((resolve, reject) => {
      console.log('PromptSculptor: Using Gemini session');

      setInputText(inputElement, metaPrompt);

      setTimeout(() => {
        const sendButton = document.querySelector(config.submitSelector);

        if (!sendButton) {
          reject(new Error('Could not find send button'));
          return;
        }

        sendButton.click();

        let attempts = 0;
        const maxAttempts = 60;

        const checkForResponse = setInterval(() => {
          attempts++;

          const responseElements = document.querySelectorAll('message-content model-response');

          if (responseElements.length > 0) {
            const latestResponse = responseElements[responseElements.length - 1];
            const responseText = latestResponse.textContent || latestResponse.innerText;

            if (responseText && responseText.length > 20) {
              clearInterval(checkForResponse);
              console.log('PromptSculptor: Got improved prompt from Gemini');
              resolve(responseText.trim());
            }
          }

          if (attempts >= maxAttempts) {
            clearInterval(checkForResponse);
            reject(new Error('Timeout waiting for Gemini response'));
          }
        }, 500);
      }, 500);
    });
  }

  /**
   * Show loading indicator
   */
  function showLoadingIndicator() {
    const btn = document.getElementById('ps-improve-btn');
    if (btn) {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ps-spinner">
          <circle cx="12" cy="12" r="10" opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
        </svg>
      `;
      btn.disabled = true;
    }
    showNotification('Improving your prompt with AI...', 'info');
  }

  /**
   * Hide loading indicator
   */
  function hideLoadingIndicator() {
    const btn = document.getElementById('ps-improve-btn');
    if (btn) {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      `;
      btn.disabled = false;
    }
  }

  /**
   * Show improvement modal
   */
  function showImprovementModal(originalText, improvedText, inputElement) {
    // Create modal if it doesn't exist
    if (!improverModal) {
      improverModal = createImprovementModal();
      document.body.appendChild(improverModal);
    }

    // Populate modal
    const originalTextarea = improverModal.querySelector('#ps-modal-original');
    const improvedTextarea = improverModal.querySelector('#ps-modal-improved');

    originalTextarea.value = originalText;
    improvedTextarea.value = improvedText;

    // Show modal
    improverModal.style.display = 'flex';

    // Setup modal actions
    setupModalActions(improverModal, originalText, improvedText, inputElement);
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
          <h2>✨ AI-Improved Prompt</h2>
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
              <h3>AI-Improved Prompt</h3>
              <textarea id="ps-modal-improved"></textarea>
            </div>
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
  function setupModalActions(modal, original, improved, inputElement) {
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
      const title = prompt('Enter a title for this prompt:', 'AI-Improved Prompt');
      if (title) {
        const improvedText = modal.querySelector('#ps-modal-improved').value;
        await storage.savePrompt({
          title,
          original: original,
          improved: improvedText,
          improvements: ['AI-powered improvement']
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

      // Auto-collapse widget back to icon state
      if (sculptorWidget) {
        sculptorWidget.classList.remove('ps-active');
      }
    };

    // Click outside to close
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

  // ... Rest of the functions (handleLibraryClick, handleHistoryClick, etc.) remain the same
  // Copying from original implementation

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
            ${item.platform ? `<div class="ps-history-platform">via ${item.platform}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(dropdown);
    dropdownMenu = dropdown;

    const widgetRect = sculptorWidget.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.right = `${window.innerWidth - widgetRect.right}px`;
    dropdown.style.bottom = `${window.innerHeight - widgetRect.top + 10}px`;

    document.getElementById('ps-clear-history').addEventListener('click', async () => {
      if (confirm('Clear all history?')) {
        await storage.clearHistory();
        dropdown.remove();
        showNotification('History cleared', 'success');
      }
    });

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
    } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
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
    } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
      element.innerText = text;
      element.textContent = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Trigger focus to ensure input is recognized
    element.focus();
  }

  /**
   * Copy text to clipboard
   */
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
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
