# PromptSculptor - Setup Guide

## Quick Start (5 minutes)

### Step 1: Generate Icons

Before loading the extension, you need to generate icon files. Choose one of these methods:

#### Method A: Using the HTML Generator (Easiest)
1. Open `icons/generate-icons.html` in your web browser
2. Click "Download" under each icon (16x16, 48x48, 128x128)
3. Save the downloaded files in the `icons/` folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

#### Method B: Using Python Script
```bash
cd icons
python3 generate-icons.py
```

#### Method C: Using ImageMagick (if installed)
```bash
cd icons
# Generate 16x16 icon
convert -size 16x16 xc:"#8b5cf6" -fill white -draw "circle 8,8 8,4" icon16.png

# Generate 48x48 icon
convert -size 48x48 xc:"#8b5cf6" -fill white -draw "circle 24,24 24,12" icon48.png

# Generate 128x128 icon
convert -size 128x128 xc:"#8b5cf6" -fill white -draw "circle 64,64 64,32" icon128.png
```

#### Method D: Use Placeholder Images
For quick testing, you can use any square PNG images. Just rename them to:
- `icon16.png`
- `icon48.png`
- `icon128.png`

And place them in the `icons/` folder.

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `PromptSculptor` folder
5. Done! The extension is now loaded.

### Step 3: Test the Extension

1. Visit https://chat.openai.com or https://claude.ai
2. Look for the PromptSculptor widget near the input field
3. Type a prompt and click the star icon to improve it
4. Enjoy better prompts! ✨

## Troubleshooting

### Icons Not Found Error
- Make sure you've generated the icons (Step 1)
- Verify the files are named exactly: `icon16.png`, `icon48.png`, `icon128.png`
- Check that the files are in the `icons/` directory

### Widget Not Appearing
- Refresh the page (F5)
- Check that the extension is enabled in `chrome://extensions/`
- Make sure you're on a supported LLM website
- Check browser console for errors (F12)

### Extension Not Loading
- Verify all required files are present:
  - manifest.json
  - background.js
  - content.js
  - content.css
  - popup.html, popup.js, popup.css
  - storage.js
  - prompt-improver.js
  - icons/icon16.png, icon48.png, icon128.png

## File Checklist

Before loading the extension, ensure these files exist:

```
✓ manifest.json
✓ background.js
✓ content.js
✓ content.css
✓ popup.html
✓ popup.js
✓ popup.css
✓ storage.js
✓ prompt-improver.js
✓ icons/icon16.png
✓ icons/icon48.png
✓ icons/icon128.png
✓ README.md
✓ LICENSE
```

## Development Mode

The extension is currently set up for development. Here's what you can do:

### Hot Reload Changes
After making code changes:
1. Go to `chrome://extensions/`
2. Click the refresh icon on the PromptSculptor card
3. Reload any open LLM website pages

### View Logs
- **Background script logs**: chrome://extensions/ → PromptSculptor → "Inspect views: service worker"
- **Content script logs**: F12 on any LLM website → Console tab
- **Popup logs**: Right-click extension icon → Inspect popup

### Debugging
- Use `console.log()` liberally in your development
- Check the browser console on LLM websites for content script issues
- Use Chrome DevTools for inspecting injected elements

## Next Steps

Once the extension is loaded:

1. **Customize Settings**: Click the extension icon → Settings tab
2. **Build Your Library**: Start improving and saving prompts
3. **Explore Features**: Try the library, history, and favorites
4. **Share Feedback**: Report issues or suggest features

## Support

Need help?

- Check the [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Review common issues in the Troubleshooting section above

---

Happy prompt sculpting! ✨
