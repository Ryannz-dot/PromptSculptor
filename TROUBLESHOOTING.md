# PromptSculptor Troubleshooting Guide

## Widget Not Appearing

### Check Extension is Loaded
1. Navigate to `chrome://extensions/`
2. Ensure PromptSculptor is enabled (toggle switch is blue)
3. Check that there are no errors displayed
4. Try clicking the "Reload" button on the extension

### Refresh the Page
1. Navigate to ChatGPT or Claude
2. Press `F5` or `Ctrl+R` / `Cmd+R` to refresh
3. Wait 3-5 seconds for the widget to appear
4. The widget should appear near the input field

### Check Console for Errors
1. Press `F12` to open DevTools
2. Click the "Console" tab
3. Look for messages starting with "PromptSculptor:"
4. Check if there are any errors (red text)
5. Share errors in a GitHub issue if needed

### Verify You're on a Supported Site
Currently supported:
- ✅ chat.openai.com (ChatGPT)
- ✅ claude.ai (Claude)
- ✅ gemini.google.com (Gemini)

### Manual Widget Detection
If the widget doesn't appear automatically:
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `document.querySelector('textarea')`
4. If it returns `null`, the page structure may have changed
5. Report this as an issue on GitHub

## Widget Appears But Improve Button Doesn't Work

### Check for JavaScript Errors
1. Open DevTools console (F12)
2. Click the "Improve" button
3. Watch for error messages
4. Common issues:
   - "Could not find send button" - Page structure changed
   - "Timeout waiting for response" - LLM took too long to respond

### Ensure You Have an Active Session
- Make sure you're logged into ChatGPT/Claude/Gemini
- The extension uses your active browser session
- Try chatting manually first to verify your session works

### Check Prompt Length
- Prompts must be at least 10 characters long
- Very short prompts will show a warning

## Improvement Takes Too Long

### Normal Behavior
- The extension sends your prompt to the LLM
- It waits for the AI to generate an improved version
- This typically takes 5-15 seconds
- You'll see a spinning icon while it's working

### If It Times Out
The extension waits up to 30 seconds. If it times out:
1. Try again with a shorter prompt
2. Check if the LLM is responding slowly in general
3. Refresh the page and retry
4. Check your internet connection

## Improved Prompt Looks Wrong

### The AI Might Have Misunderstood
Since we're using the LLM itself to improve prompts:
- The AI interprets your prompt and tries to enhance it
- Sometimes it may add unwanted details
- You can edit the improved prompt before using it
- The textarea in the modal is editable!

### Tips for Better Results
- Write clearer initial prompts
- Be specific about what you want
- If the AI adds too much, you can manually edit it
- Try clicking "Improve" again for a different version

## Modal Won't Close

### Try These Steps
1. Click the X button in the top-right
2. Click outside the modal (on the dark overlay)
3. Press `Escape` key
4. Refresh the page if needed

## Library/History Not Loading

### Check Storage Permissions
1. Go to `chrome://extensions/`
2. Find PromptSculptor
3. Check that it has "Storage" permission
4. If not, uninstall and reinstall the extension

### Clear and Restart
1. Open the extension popup
2. Go to Settings tab
3. Try exporting your data first (backup)
4. Then refresh the page
5. If still broken, report the issue

## Icons Missing

### You Need to Generate Icons
1. Navigate to `/icons/` folder
2. Open `generate-icons.html` in your browser
3. Download all three icon sizes
4. Save them in the `/icons/` directory as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
5. Go to `chrome://extensions/`
6. Click the reload button on PromptSculptor

## Extension Conflicts

### Disable Other Extensions
Sometimes other extensions can interfere:
1. Go to `chrome://extensions/`
2. Temporarily disable other AI/prompt extensions
3. Refresh ChatGPT/Claude
4. Test if PromptSculptor works
5. Re-enable other extensions one by one

## Still Having Issues?

### Report on GitHub
1. Go to https://github.com/yourusername/PromptSculptor/issues
2. Click "New Issue"
3. Include:
   - Browser version (chrome://version/)
   - Which LLM site (ChatGPT, Claude, etc.)
   - Console errors (F12 → Console tab)
   - Steps to reproduce
   - Screenshots if helpful

### Quick Fixes to Try
- ✅ Refresh the page
- ✅ Reload the extension
- ✅ Restart Chrome
- ✅ Clear browser cache
- ✅ Uninstall and reinstall extension
- ✅ Check Chrome version is up to date

## Debugging Mode

### Enable Verbose Logging
1. Open DevTools (F12)
2. Go to Console tab
3. The extension logs everything with "PromptSculptor:" prefix
4. Watch the logs as you click buttons
5. This will help diagnose issues

### Common Log Messages

**"PromptSculptor: Initializing..."**
- Good! Extension is loading

**"PromptSculptor: Found input field: textarea 0"**
- Good! Widget should appear

**"PromptSculptor: Unsupported site"**
- You're on a site that's not supported yet

**"PromptSculptor: Using ChatGPT session"**
- Extension is sending the meta-prompt

**"PromptSculptor: Got improved prompt from ChatGPT"**
- Success! The improvement worked

**"PromptSculptor: Error improving prompt"**
- Something went wrong, check the error details

## Performance Issues

### Extension Slowing Down Browser
- The extension is lightweight and shouldn't cause slowdowns
- If you experience issues, try:
  - Disabling other extensions
  - Clearing browser cache
  - Restarting Chrome

### Memory Usage
- The extension uses minimal memory
- History is capped at 100 items
- You can clear history from the popup → History tab

## Privacy & Security

### What Data is Collected?
- **Nothing!** All data stays local
- Your prompts are stored only in Chrome's local storage
- No analytics or tracking
- No data sent to external servers
- The extension only communicates with the LLM you're already using

### Can I Verify This?
- Yes! The code is open source
- Check the source code in content.js, storage.js, etc.
- No network requests except to the LLM you're using
- All storage is via Chrome's storage API

---

## Advanced Troubleshooting

### For Developers

#### Inspect the Widget
```javascript
// In DevTools console
document.getElementById('promptsculptor-widget')
```

#### Check Storage
```javascript
// View stored prompts
chrome.storage.local.get(null, (data) => console.log(data))
```

#### Force Reattach Widget
```javascript
// Remove the widget
document.getElementById('promptsculptor-widget')?.remove()

// Refresh page to reattach
location.reload()
```

#### Manually Test Improvement
1. Type a prompt in ChatGPT
2. Open console
3. Watch for "PromptSculptor: Improving prompt using ChatGPT"
4. Follow the log messages to see where it fails

---

**Still stuck? Open an issue on GitHub with detailed information!**
