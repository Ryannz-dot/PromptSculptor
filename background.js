/**
 * PromptSculptor - Background Service Worker
 * Handles extension lifecycle and background tasks
 */

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('PromptSculptor installed!');

    // Set default settings
    chrome.storage.local.set({
      settings: {
        autoDetect: true,
        showSuggestions: true,
        autoImprove: false,
        theme: 'light',
        position: 'bottom-right'
      }
    });

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html')
    });
  } else if (details.reason === 'update') {
    console.log('PromptSculptor updated!');
  }

  // Create context menu for quick actions
  chrome.contextMenus.create({
    id: 'improveSelection',
    title: 'Improve with PromptSculptor',
    contexts: ['selection']
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.local.get('settings', (result) => {
      sendResponse(result.settings || {
        autoDetect: true,
        showSuggestions: true,
        autoImprove: false,
        theme: 'light',
        position: 'bottom-right'
      });
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'improvePrompt') {
    // This could be extended to call an API in the future
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'openPopup') {
    chrome.action.openPopup();
    sendResponse({ success: true });
    return true;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // The popup will open automatically due to manifest configuration
  console.log('Extension icon clicked');
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'improveSelection' && info.selectionText) {
    // Send message to content script to improve selected text
    chrome.tabs.sendMessage(tab.id, {
      action: 'improveSelection',
      text: info.selectionText
    });
  }
});

// Keep service worker alive (if needed)
chrome.runtime.onStartup.addListener(() => {
  console.log('PromptSculptor service worker started');
});

// Listen for storage changes to sync across tabs
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    // Broadcast changes to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'storageChanged',
          changes: changes
        }).catch(() => {
          // Tab might not have content script loaded
        });
      });
    });
  }
});

console.log('PromptSculptor background script loaded');
