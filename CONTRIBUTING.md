# Contributing to PromptSculptor

First off, thank you for considering contributing to PromptSculptor! It's people like you that make PromptSculptor such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by respect, kindness, and constructive collaboration.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your browser version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Test your changes thoroughly
4. Update documentation if needed
5. Ensure your code follows the existing style
6. Submit your pull request

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/PromptSculptor.git
   cd PromptSculptor
   ```

2. Generate icons (see SETUP.md)

3. Load the extension in Chrome (see SETUP.md)

4. Make your changes

5. Test thoroughly:
   - Test on multiple LLM platforms
   - Test all features (improve, save, library, history)
   - Check console for errors
   - Test with different prompt lengths
   - Verify storage operations work correctly

## Coding Standards

### JavaScript Style

- Use ES6+ features where appropriate
- Use meaningful variable and function names
- Add comments for complex logic
- Use `const` by default, `let` when reassignment is needed
- Avoid `var`

### Code Organization

- Keep functions small and focused
- Use async/await for asynchronous operations
- Handle errors appropriately
- Add JSDoc comments for public functions

Example:
```javascript
/**
 * Improve a user's prompt using best practices
 * @param {string} originalPrompt - The user's original prompt
 * @param {Object} options - Improvement options
 * @returns {Object} - Improved prompt with metadata
 */
function improvePrompt(originalPrompt, options = {}) {
  // Implementation
}
```

### CSS Style

- Use meaningful class names
- Prefix extension classes with `ps-` to avoid conflicts
- Use CSS custom properties for colors and common values
- Keep styles modular and organized

### File Structure

```
New features should fit into the existing structure:
- Content script logic → content.js
- UI styles → content.css or popup.css
- Storage operations → storage.js
- Prompt improvement → prompt-improver.js
- Popup UI → popup.html, popup.js, popup.css
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Extension loads without errors
- [ ] Widget appears on all supported LLM sites
- [ ] Prompt improvement works correctly
- [ ] Prompts can be saved to library
- [ ] Library search works
- [ ] History is tracked correctly
- [ ] Settings are saved and applied
- [ ] Export/import functionality works
- [ ] No console errors
- [ ] UI is responsive and looks good
- [ ] Copy to clipboard works
- [ ] Favorites work correctly

### Browser Testing

Test your changes in:
- Chrome (latest)
- Chrome (one version back)
- Edge (Chromium-based)

## Adding New LLM Platform Support

To add support for a new LLM platform:

1. Update `SITE_CONFIGS` in `content.js`:
   ```javascript
   'example.com': {
     selectors: [
       'textarea',
       'div[contenteditable="true"]'
     ],
     name: 'Example LLM'
   }
   ```

2. Update `manifest.json` permissions:
   ```json
   "host_permissions": [
     "https://example.com/*"
   ]
   ```

3. Test thoroughly on the new platform

4. Update README.md to list the new platform

## Improving the Prompt Engine

To enhance the prompt improvement logic:

1. Edit `prompt-improver.js`
2. Add or modify improvement strategies
3. Test with various prompt types
4. Document new improvement types in README.md

## Documentation

- Update README.md for user-facing changes
- Update SETUP.md for setup-related changes
- Add inline comments for complex code
- Update JSDoc comments when changing function signatures

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:
```
Add support for Anthropic Claude
Fix widget positioning on mobile screens
Update prompt improvement algorithm
```

## Questions?

Feel free to open an issue with the tag `question`.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to PromptSculptor! 🎉
