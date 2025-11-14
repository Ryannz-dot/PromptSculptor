# ✨ PromptSculptor

**Transform your prompts into masterpieces**

PromptSculptor is a powerful Chrome extension that automatically improves your prompts for AI language models, helping you get better, more comprehensive responses from ChatGPT, Claude, Gemini, and other LLMs.

## 🌟 Features

### Intelligent Prompt Improvement
- **Automatic Enhancement**: Analyzes and improves your prompts using industry best practices
- **Structure Optimization**: Adds clear organization, context, and formatting to your prompts
- **Smart Suggestions**: Provides actionable tips for better prompt engineering
- **Before/After Comparison**: See exactly how your prompt was improved

### Prompt Library
- **Save & Organize**: Store your best prompts for quick reuse
- **Smart Search**: Find prompts instantly with powerful search
- **Categories & Tags**: Organize prompts by topic or use case
- **Favorites**: Mark frequently used prompts for easy access
- **Usage Tracking**: See which prompts you use most often

### Seamless Integration
- **Auto-Detection**: Automatically appears on LLM input fields
- **One-Click Access**: Floating widget for instant improvements
- **Multi-Platform**: Works on ChatGPT, Claude, Gemini, Perplexity, and more
- **Non-Intrusive**: Clean, minimal UI that stays out of your way

### History & Analytics
- **Improvement History**: Track all your enhanced prompts
- **Statistics**: View your prompt engineering progress
- **Export/Import**: Backup and share your prompt library

## 🚀 Installation

### Method 1: Install from Chrome Web Store (Coming Soon)
1. Visit the [PromptSculptor page](https://chrome.google.com/webstore) on Chrome Web Store
2. Click "Add to Chrome"
3. Confirm the installation

### Method 2: Install as Developer Extension (Current)

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/PromptSculptor.git
   cd PromptSculptor
   ```

2. **Generate Icons** (Required for first-time setup)
   - Open `icons/generate-icons.html` in your browser
   - Download all three icon sizes (16x16, 48x48, 128x128)
   - Save them in the `icons/` directory

   OR use the provided icon generator or any square PNG images as placeholders.

3. **Load the Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `PromptSculptor` directory
   - The extension should now appear in your extensions list!

4. **Pin the Extension** (Optional but Recommended)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "PromptSculptor" and click the pin icon
   - The extension icon will now appear in your toolbar

## 📖 How to Use

### Basic Usage

1. **Visit an LLM Website**
   - Navigate to ChatGPT, Claude, Gemini, or any supported platform
   - The PromptSculptor widget will automatically appear near the input field

2. **Type Your Prompt**
   - Start typing your question or instruction in the chat input

3. **Improve Your Prompt**
   - Click the star icon ✨ in the PromptSculptor widget
   - Review the improved version with highlighted changes
   - See what improvements were made and why
   - Click "Use This Prompt" to apply it to the input field

4. **Save to Library** (Optional)
   - If you like the improved prompt, click "Save to Library"
   - Give it a descriptive title
   - Optionally add categories or tags
   - Access it anytime from the library

### Widget Buttons

- **✨ Star Icon**: Improve the current prompt
- **📚 Grid Icon**: Open prompt library
- **🕐 Clock Icon**: View improvement history

### Using Saved Prompts

1. Click the library icon (📚) in the widget
2. Search or browse your saved prompts
3. Click "Use" to insert the prompt
4. Click "Copy" to copy to clipboard
5. Click the star to mark as favorite

### Managing Your Library

1. Click the extension icon in your Chrome toolbar
2. Navigate through the tabs:
   - **Library**: Browse, search, and manage saved prompts
   - **History**: View all improved prompts
   - **Settings**: Configure extension preferences

### Keyboard Shortcuts (Coming Soon)

- `Ctrl/Cmd + Shift + I`: Improve current prompt
- `Ctrl/Cmd + Shift + L`: Open library
- `Ctrl/Cmd + Shift + H`: Open history

## 🎯 Supported Platforms

PromptSculptor works seamlessly on:

- ✅ ChatGPT (chat.openai.com)
- ✅ Claude (claude.ai)
- ✅ Google Gemini (gemini.google.com)
- ✅ Perplexity AI (perplexity.ai)
- ✅ Poe (poe.com)
- ✅ HuggingFace Chat (huggingface.co)

More platforms coming soon!

## 💡 Prompt Improvement Features

PromptSculptor enhances your prompts by:

### 1. Adding Context
Defines the role or perspective for better responses:
```
Before: "Write a marketing email"
After: "As an expert marketing copywriter, write a marketing email..."
```

### 2. Improving Structure
Organizes prompts with clear sections:
```
Before: "Help me with Python code for data analysis"
After:
Objective: Create Python code for data analysis
Details: [Your specifics]
Requirements: [Clear bullet points]
```

### 3. Adding Specificity
Includes details for more accurate responses:
```
Before: "Explain databases"
After: "Provide a comprehensive explanation of relational databases, including:
- Key concepts and principles
- Common use cases
- Best practices for design"
```

### 4. Specifying Output Format
Defines how the response should be structured:
```
Before: "List programming languages"
After: "List programming languages
Format: Provide response as a table with columns for Name, Use Case, and Difficulty Level"
```

### 5. Adding Constraints
Sets guidelines for the response:
```
Before: "Write code"
After: "Write code
Guidelines:
- Use clear, descriptive variable names
- Include comments explaining key logic
- Follow industry-standard best practices"
```

## ⚙️ Settings

### General Settings
- **Auto-detect LLM input fields**: Automatically show widget on supported sites
- **Show improvement suggestions**: Display tips for better prompts

### Data Management
- **Export Data**: Download your entire library and history as JSON
- **Import Data**: Restore from a previous backup

### Privacy
- **All data stored locally**: Your prompts never leave your browser
- **No tracking**: We don't collect any usage data
- **No external API calls**: All processing happens locally

## 🔒 Privacy & Security

PromptSculptor takes your privacy seriously:

- ✅ **100% Local Processing**: All prompt improvements happen in your browser
- ✅ **No Data Collection**: We don't track, store, or transmit your prompts
- ✅ **No External APIs**: No data sent to external servers
- ✅ **Local Storage Only**: All data stays on your device
- ✅ **Open Source**: Full transparency - review the code yourself

## 🛠️ Development

### Tech Stack
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No framework dependencies for maximum performance
- **Chrome Storage API**: Efficient local data storage
- **Content Scripts**: Seamless integration with LLM websites

### Project Structure
```
PromptSculptor/
├── manifest.json           # Extension configuration
├── background.js          # Service worker
├── content.js            # Main content script
├── content.css           # Content styles
├── popup.html            # Extension popup
├── popup.js              # Popup functionality
├── popup.css             # Popup styles
├── prompt-improver.js    # Core improvement engine
├── storage.js            # Storage management
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/PromptSculptor.git
cd PromptSculptor

# Generate icons (open in browser)
open icons/generate-icons.html

# Load in Chrome as described in Installation section
```

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Add keyboard shortcuts
- [ ] Support for more LLM platforms
- [ ] Prompt templates for common use cases
- [ ] AI-powered prompt analysis with scoring
- [ ] Team collaboration features
- [ ] Prompt sharing community
- [ ] Custom improvement rules
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced search and filters
- [ ] Prompt versioning
- [ ] Chrome Sync support

## 🐛 Known Issues

- On some sites with complex dynamic content, the widget may need a page refresh to appear
- Very long prompts (>10,000 characters) may take longer to process

Report issues on [GitHub Issues](https://github.com/yourusername/PromptSculptor/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the prompt engineering community
- Built for the AI enthusiast community
- Thanks to all contributors and users!

## 📧 Contact

- **GitHub**: [yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

## ⭐ Show Your Support

If you find PromptSculptor helpful, please:
- ⭐ Star this repository
- 🐛 Report bugs and request features
- 📢 Share with your friends and colleagues
- 💝 Consider contributing

---

**Made with ❤️ for the AI community**

Transform your prompts. Get better responses. Work smarter.
