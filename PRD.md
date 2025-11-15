# PromptSculptor - Product Requirements Document

**Version:** 1.0.0
**Created by:** Rehan Nawaz (https://rehannawaz.info)
**Last Updated:** November 2025
**Status:** Production Ready

---

## 📋 Executive Summary

PromptSculptor is a Chrome extension that transforms user prompts into optimized versions designed to elicit the best possible responses from Large Language Models (LLMs). By leveraging each LLM's own session for improvement, the extension provides real-time, context-aware prompt enhancement without requiring external API calls or hardcoded rules.

---

## 🎯 Product Vision

**Mission:** Empower users to communicate more effectively with AI by providing intelligent, platform-specific prompt optimization that adapts to each LLM's unique strengths.

**Value Proposition:**
- Zero learning curve - works automatically on supported LLM platforms
- No API keys or external services required
- Platform-specific optimization leveraging each LLM's strengths
- Non-intrusive, aesthetic UI that enhances rather than disrupts workflow

---

## 👥 Target Audience

### Primary Users
1. **AI Researchers & Engineers** - Frequent LLM users needing optimal results
2. **Content Creators** - Writers, marketers using AI for content generation
3. **Developers** - Using AI coding assistants and technical LLMs
4. **Professionals** - Business analysts, consultants leveraging AI tools
5. **Students & Educators** - Learning and teaching with AI assistance

### User Personas

**Persona 1: Sarah - AI Researcher**
- Uses multiple LLMs daily for experimentation
- Needs precise, well-structured prompts
- Values efficiency and platform-specific optimization

**Persona 2: Mike - Content Creator**
- Uses ChatGPT and Claude for content ideation
- Wants better, more creative outputs
- Appreciates non-intrusive tools

**Persona 3: Lisa - Software Developer**
- Uses AI coding assistants frequently
- Needs technical precision in prompts
- Values clean, minimal interfaces

---

## 🌟 Core Features

### 1. **Intelligent Prompt Detection**

**Feature ID:** F-001
**Priority:** P0 (Critical)

**Description:**
Automatically detects LLM input fields across supported platforms using advanced selector algorithms.

**Technical Specifications:**
- Multi-selector fallback system for reliability
- Mutation observer for dynamic content detection
- Support for both `textarea` and `contenteditable` elements
- Visibility checking to avoid false positives

**Supported Platforms:**
- ChatGPT (chat.openai.com, chatgpt.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com, gemini.google.com/app)
- Perplexity AI (perplexity.ai)
- Extensible architecture for future platforms

**User Experience:**
- Widget appears 60px above input field, 20% inward from right edge
- Automatic repositioning on scroll/resize
- Smart positioning when input is at screen bottom/top

---

### 2. **Floating Widget Interface**

**Feature ID:** F-002
**Priority:** P0 (Critical)

**Description:**
A sleek, modern floating widget that provides access to all extension features without obstructing the user's workflow.

**Design Specifications:**

**Collapsed State (Inactive):**
- Dimensions: 40px × 32px
- Shape: Rectangular (8px border-radius)
- Background: White `rgba(255, 255, 255, 0.98)`
- Border: 1px purple `rgba(139, 92, 246, 0.3)`
- Only star icon visible
- Shadow: `0 3px 14px rgba(0, 0, 0, 0.12)`

**Expanded State (Active/Hover):**
- Dimensions: 204px × 32px
- Background: Black `rgba(0, 0, 0, 0.95)`
- Slides left with smooth animation (350ms cubic-bezier)
- Reveals: Extension name + Star button + Dropdown toggle
- Shadow: `0 5px 20px rgba(0, 0, 0, 0.25)`

**Components:**
1. **Star Icon Button** (32px × 32px)
   - Purple `#8b5cf6` when inactive
   - Lighter purple `#a78bfa` when active
   - White icon → Black icon transition
   - 12° rotation animation on hover

2. **Extension Name Label** (11px font, bold 700)
   - Text: "PromptSculptor"
   - Purple `#8b5cf6` when inactive
   - Second tone `#a78bfa` when active
   - Clickable - triggers prompt improvement
   - Modern font: SF Pro Display fallback

3. **Dropdown Toggle** (24px × 24px)
   - Chevron down icon
   - Same color scheme as star button
   - Opens menu with library/history options

**Interaction States:**
- `:hover` - Widget expands, background turns black
- `:active` - Scale animation (0.98)
- `focus` on input - Widget becomes active
- `blur` from input - Auto-collapse after 200ms delay

---

### 3. **AI-Powered Prompt Enhancement**

**Feature ID:** F-003
**Priority:** P0 (Critical)

**Description:**
Uses each LLM's own session to improve prompts through sophisticated meta-prompting, eliminating need for external APIs.

**Enhancement Framework:**

**For ChatGPT:**
```
6-Point Enhancement Framework:
1. Role & Expertise Assignment
2. Clarity & Precision Optimization
3. Context & Constraints Definition
4. Output Structure Specification
5. Quality Signal Integration
6. Task Decomposition (multi-step)
```

**For Claude:**
```
Claude Optimization Protocol:
- Leverage extended context understanding
- Structured thinking emphasis
- Chain-of-thought reasoning
- Edge case handling
- Explicit success criteria
- Quality markers (comprehensive, detailed)
```

**For Google Gemini:**
```
Gemini Optimization Framework:
1. Precision Engineering
2. Structural Clarity
3. Contextual Richness
4. Format Specification
5. Quality Amplifiers
6. Constraint Definition
```

**For Perplexity AI:**
```
Research Query Enhancement Matrix:
1. Search Intent Precision
2. Scope & Depth Definition
3. Source Quality Specifications
4. Temporal Constraints
5. Output Structure Requirements
6. Multi-Perspective Requests
7. Specificity Boosters
```

**Technical Implementation:**
- Injects meta-prompt into LLM input
- Clicks submit button programmatically
- Waits for response completion (max 30 seconds)
- Extracts improved prompt via DOM selectors
- Restores original prompt to input field
- Displays comparison in modal

**Response Extraction:**
- Platform-specific selectors for response detection
- Checks for completion (no generating indicator)
- Minimum 20 character validation
- Automatic retry on timeout

---

### 4. **Comparison Modal**

**Feature ID:** F-004
**Priority:** P1 (High)

**Description:**
Side-by-side comparison interface showing original and AI-improved prompts with action buttons.

**Modal Specifications:**

**Layout:**
- Glassmorphism design with backdrop blur
- 900px max width, 90vh max height
- Purple gradient header `#8b5cf6 → #7c3aed`
- White content area with rounded corners (16px)

**Content Sections:**
1. **Header**
   - Title: "✨ AI-Improved Prompt"
   - Close button (×)

2. **Comparison Grid**
   - Left: Original Prompt (readonly textarea)
   - Center: Arrow indicator (→)
   - Right: Improved Prompt (editable textarea)
   - Both textareas: Min 200px height, auto-resize

3. **Action Buttons**
   - **Copy** - Copies improved prompt to clipboard
   - **Save to Library** - Prompts for title, saves to storage
   - **Use This Prompt** - Applies to input, closes modal

**Behavior:**
- Click outside to close
- ESC key to close
- Auto-collapse widget when "Use This Prompt" clicked
- Editable improved prompt allows manual tweaks

---

### 5. **Prompt Library System**

**Feature ID:** F-005
**Priority:** P1 (High)

**Description:**
Local storage-based system for saving, organizing, and retrieving improved prompts.

**Storage Architecture:**
```javascript
{
  id: String (UUID),
  title: String,
  original: String,
  improved: String,
  improvements: Array<String>,
  timestamp: ISO8601,
  favorite: Boolean,
  useCount: Number,
  platform: String
}
```

**Features:**
- Unlimited storage (Chrome local storage limit: ~5MB)
- Search functionality with real-time filtering
- Favorite marking with toggle
- Use count tracking
- Platform identification
- Title-based organization

**Library Interface:**
- Accessible via extension popup
- Search bar with instant results
- Filter options: All, Favorites, Recent
- Grid/List view of saved prompts
- Actions per prompt: Use, Copy, Delete, Favorite

**Dropdown Quick Access:**
- Click "Prompt Library" in widget dropdown
- Overlay dropdown near widget
- Compact view with search
- Quick actions: Use, Copy, Delete

---

### 6. **Improvement History**

**Feature ID:** F-006
**Priority:** P2 (Medium)

**Description:**
Chronological log of all prompt improvements with platform tracking.

**History Entry Structure:**
```javascript
{
  original: String,
  improved: String,
  improvements: Array<String>,
  timestamp: ISO8601,
  platform: String (ChatGPT, Claude, Gemini, Perplexity)
}
```

**Features:**
- Automatic tracking of every improvement
- Platform badge on each entry
- Timestamp display (relative and absolute)
- Preview of first 100 characters
- Clear all functionality
- Export to JSON

**History Interface:**
- Accessible via extension popup History tab
- Reverse chronological order
- Platform color coding
- Expandable entries to view full prompts

---

### 7. **Smart Dropdown Menu**

**Feature ID:** F-007
**Priority:** P1 (High)

**Description:**
Context-aware dropdown menu with intelligent positioning.

**Menu Items:**
1. **Prompt Library** (Grid icon)
   - Opens library overlay

2. **History** (Clock icon)
   - Opens history overlay

3. **--- Divider ---**

4. **Hide for 30 minutes** (Eye-slash icon)
   - Hides widget for 30 minutes
   - Persists across page refreshes
   - Auto-reveals after timeout

**Smart Positioning:**
- Detects available screen space
- Opens downward when space available below
- Opens upward when near bottom of screen
- Always fully visible
- 200px min width, 250px max width

**Styling:**
- White background with subtle shadow
- Rounded corners (12px)
- Hover effects on items
- Purple accent on hover `#8b5cf6`
- SVG icons for each menu item

---

### 8. **Hide Widget Feature**

**Feature ID:** F-008
**Priority:** P2 (Medium)

**Description:**
Temporary widget hiding with automatic restoration.

**Functionality:**
- Click "Hide for 30 minutes" in dropdown
- Widget disappears immediately
- Timestamp stored in Chrome storage
- Checks on page load/reload
- Auto-reveals after 30 minutes expire
- Manual clear via extension settings

**Storage:**
```javascript
{
  hideUntil: ISO8601 timestamp
}
```

**User Feedback:**
- Success notification: "Widget hidden for 30 minutes"
- Console log with resume time
- Settings page shows remaining time

---

### 9. **Extension Popup Interface**

**Feature ID:** F-009
**Priority:** P1 (High)

**Description:**
Comprehensive management interface accessible via browser toolbar icon.

**Tab Structure:**

**1. Library Tab** (Default)
- Search bar
- Filter buttons (All, Favorites, Recent)
- Grid of saved prompts
- Empty state with helpful message

**2. History Tab**
- Reverse chronological list
- Platform badges
- Clear all button
- Export functionality
- Empty state

**3. Settings Tab**
- **General Settings**
  - Auto-detect LLM fields (toggle)
  - Show improvement suggestions (toggle)

- **Data Management**
  - Export Data (JSON download)
  - Import Data (JSON upload)

- **Statistics**
  - Saved Prompts count
  - History Items count
  - Favorites count

- **About**
  - Version information
  - Description
  - Creator credit: "Built by Rehan Nawaz"
  - Links: Website, Tutorial

**Styling:**
- Modern, clean interface
- Purple accent color `#8b5cf6`
- Smooth transitions
- Responsive design (300px min width)

---

### 10. **Keyboard Shortcuts & Accessibility**

**Feature ID:** F-010
**Priority:** P2 (Medium)

**Planned Shortcuts:**
- `Ctrl/Cmd + Shift + P` - Trigger improvement
- `Ctrl/Cmd + Shift + L` - Open library
- `Ctrl/Cmd + Shift + H` - Open history
- `ESC` - Close modals/dropdowns

**Accessibility Features:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader compatible
- High contrast mode support
- Reduced motion respect

---

## 🛠 Technical Architecture

### Technology Stack
- **Framework:** Vanilla JavaScript (ES6+)
- **Manifest:** Chrome Extension Manifest V3
- **Storage:** Chrome Storage API (Local)
- **UI:** Custom CSS with modern properties
- **Icons:** Inline SVG for performance

### File Structure
```
PromptSculptor/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js             # Main content script (5MB+ context aware)
├── content.css            # Widget and modal styles
├── storage.js             # Storage management class
├── prompt-improver.js     # Fallback improvement logic
├── popup.html             # Extension popup
├── popup.css              # Popup styles
├── popup.js               # Popup functionality
└── icons/                 # Extension icons (16, 48, 128)
```

### Key Classes & Components

**StorageManager Class:**
```javascript
Methods:
- savePrompt(data)
- getPromptLibrary()
- searchPrompts(query)
- addToHistory(entry)
- getHistory()
- toggleFavorite(id)
- deletePrompt(id)
- incrementUseCount(id)
- exportData()
- importData(json)
```

**Content Script Architecture:**
```javascript
Components:
- SITE_CONFIGS object (platform definitions)
- Widget creation and positioning
- Event listeners and handlers
- LLM-specific improvement functions
- Modal and dropdown management
- Notification system
```

### Browser Compatibility
- Chrome: 88+ (Manifest V3 requirement)
- Edge: 88+ (Chromium-based)
- Brave: Latest
- Opera: Latest (Chromium-based)

**NOT Compatible:**
- Firefox (uses different extension API)
- Safari (different extension architecture)

---

## 🎨 UI/UX Design Principles

### Design Philosophy
1. **Non-Intrusive** - Widget stays out of the way until needed
2. **Fast** - All operations feel instant (<100ms feedback)
3. **Modern** - Clean, aesthetic design matching 2025 trends
4. **Consistent** - Purple brand color throughout
5. **Responsive** - Adapts to any screen size
6. **Accessible** - Usable by everyone

### Color Palette
```css
Primary Purple:     #8b5cf6
Secondary Purple:   #a78bfa
Dark Purple:        #7c3aed
Deep Purple:        #6d28d9

Text Dark:          #111827
Text Medium:        #374151
Text Light:         #6b7280

Background White:   rgba(255,255,255,0.98)
Background Black:   rgba(0,0,0,0.95)
Background Gray:    #f9fafb

Border Light:       #e5e7eb
Border Medium:      #d1d5db
```

### Typography
```css
Primary Font: 'SF Pro Display', -apple-system, BlinkMacSystemFont
Fallback: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell'

Sizes:
- Label: 11px (bold 700)
- Body: 13-14px
- Headers: 16-24px
```

### Animation Timing
```css
Fast:    150ms - Hover effects, color changes
Medium:  250ms - Button interactions
Slow:    350ms - Widget expand/collapse
Smooth:  cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 📊 User Workflows

### Workflow 1: First-Time User
1. Install extension from Chrome Web Store
2. Visit supported LLM website (e.g., ChatGPT)
3. Widget automatically appears above input field
4. Type a basic prompt: "write a blog post"
5. Hover over widget → it expands showing "PromptSculptor"
6. Click extension name or star icon
7. Wait 3-5 seconds while AI improves prompt
8. See side-by-side comparison in modal
9. Click "Use This Prompt" to apply
10. Original input replaced with improved version
11. Widget auto-collapses, ready to send

### Workflow 2: Power User
1. Type complex prompt in Claude
2. Click widget label "PromptSculptor"
3. Review improved version
4. Make manual edits in modal
5. Click "Save to Library"
6. Enter title: "Technical Documentation Template"
7. Mark as favorite
8. Click "Use This Prompt"
9. Later: Open widget dropdown → Library
10. Search for "documentation"
11. Click "Use" on saved prompt
12. Instant insertion into new chat

### Workflow 3: Cross-Platform User
1. Saves optimized prompt on ChatGPT
2. Switches to Claude
3. Opens extension popup → Library tab
4. Finds saved prompt
5. Clicks "Use" (or copies it)
6. Prompt adapts to Claude's input format
7. Widget provides Claude-specific re-optimization
8. Saves Claude version separately

---

## 🔒 Privacy & Security

### Data Privacy
- **100% Local** - All data stored locally in browser
- **No Telemetry** - Zero data sent to external servers
- **No Account Required** - Fully functional offline
- **User Control** - Export/delete data anytime

### Security Measures
- Manifest V3 compliance
- CSP (Content Security Policy) headers
- XSS prevention via sanitization
- No eval() or inline scripts
- Secure HTTPS-only operation

### Permissions Justification
```json
"storage": "Required for saving prompts and settings locally"
"activeTab": "Required to detect and interact with LLM input fields"
```

### Host Permissions
Only requested for supported LLM platforms:
- chat.openai.com, chatgpt.com
- claude.ai
- gemini.google.com
- perplexity.ai

---

## 📈 Success Metrics (Proposed)

### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average prompts improved per user/day
- Widget interaction rate

### Feature Usage
- Improvement acceptance rate (% users click "Use")
- Library save rate
- Favorite marking frequency
- History access rate

### Quality Indicators
- Average improvement session duration
- Manual edits to improved prompts (%)
- Re-improvement rate
- Platform distribution

### Retention
- 7-day retention rate
- 30-day retention rate
- Uninstall rate
- Return visit frequency

---

## 🚀 Future Enhancements

### Phase 2 Features (Q1 2026)

**F-011: Custom Templates**
- User-created prompt templates
- Variables/placeholders support
- Template sharing (optional)

**F-012: Prompt Versioning**
- Track iterations of same prompt
- A/B testing support
- Rollback to previous versions

**F-013: Batch Processing**
- Improve multiple prompts at once
- CSV import/export
- Bulk operations

**F-014: Analytics Dashboard**
- Usage statistics visualization
- Platform comparison graphs
- Improvement trends over time

**F-015: Team Collaboration** (Premium)
- Shared prompt libraries
- Team workspace
- Comment threads on prompts

### Phase 3 Features (Q2 2026)

**F-016: AI Model Selection**
- Choose which LLM to use for improvement
- Cross-platform optimization
- Model comparison mode

**F-017: Custom Improvement Rules**
- User-defined enhancement criteria
- Industry-specific templates (Legal, Medical, Technical)
- Language-specific optimizations

**F-018: Browser Extension (Other Browsers)**
- Firefox port
- Safari version
- Mobile browser support

**F-019: Advanced Search**
- Tag-based organization
- Full-text search in prompts
- Date range filtering
- Platform filtering

**F-020: Integration APIs**
- Zapier integration
- Notion connector
- Google Docs add-on

---

## 🐛 Known Limitations

### Current Constraints

1. **Browser Compatibility**
   - Chrome/Edge/Brave only (Manifest V3)
   - No Firefox or Safari support yet

2. **Platform Coverage**
   - Limited to 4 LLM platforms currently
   - No support for POE, HuggingFace Chat, etc.

3. **Response Extraction**
   - May fail if platform UI changes significantly
   - Requires platform-specific selectors
   - 30-second timeout for slow responses

4. **Storage Limits**
   - Chrome local storage ~5MB limit
   - Approximately 1000-2000 prompts max
   - No cloud backup

5. **Language Support**
   - UI only in English currently
   - Prompt improvement works in any language

6. **Network Dependency**
   - Requires active LLM session
   - Won't work if LLM is down
   - No offline mode

---

## 📝 Version History

### v1.0.0 (November 2025) - Initial Release
- ✅ Core prompt improvement functionality
- ✅ Support for ChatGPT, Claude, Gemini, Perplexity
- ✅ Floating widget interface
- ✅ Prompt library system
- ✅ Improvement history
- ✅ Smart dropdown menu
- ✅ Hide widget feature
- ✅ Extension popup with 3 tabs
- ✅ Modern rectangular design
- ✅ Purple color scheme
- ✅ Auto-collapse behavior
- ✅ Creator attribution

---

## 🤝 Credits

**Creator:** Rehan Nawaz
**Website:** https://rehannawaz.info
**License:** MIT (Proposed)
**Repository:** GitHub (TBD)

**Built With:**
- Chrome Extension APIs
- Modern JavaScript (ES6+)
- CSS3 with custom properties
- Manifest V3 architecture

---

## 📞 Support & Feedback

### Bug Reports
- GitHub Issues (when public)
- Email: contact@rehannawaz.info (proposed)

### Feature Requests
- GitHub Discussions (when public)
- Community voting system (planned)

### Documentation
- README.md (installation & usage)
- CHANGELOG.md (version history)
- This PRD (product overview)
- API documentation (for developers)

---

## 🎓 Glossary

**LLM** - Large Language Model (ChatGPT, Claude, etc.)
**Meta-prompt** - A prompt that instructs an LLM to improve another prompt
**Widget** - The floating UI element that appears on LLM websites
**Content Script** - JavaScript that runs in webpage context
**Service Worker** - Background script in Manifest V3 extensions
**Storage API** - Chrome API for local data persistence
**Mutation Observer** - Web API for detecting DOM changes

---

**Document End**

*Last Updated: November 15, 2025*
*Status: Production Ready - v1.0.0*
*Next Review: December 2025*
