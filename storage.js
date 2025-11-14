/**
 * PromptSculptor - Storage Manager
 * Handles all Chrome storage operations for prompts, history, and settings
 */

class StorageManager {
  constructor() {
    this.STORAGE_KEYS = {
      PROMPT_LIBRARY: 'promptLibrary',
      PROMPT_HISTORY: 'promptHistory',
      SETTINGS: 'settings',
      FAVORITES: 'favorites'
    };

    this.MAX_HISTORY_ITEMS = 100;
  }

  /**
   * Save a prompt to the library
   */
  async savePrompt(promptData) {
    try {
      const library = await this.getPromptLibrary();

      const newPrompt = {
        id: this.generateId(),
        title: promptData.title || this.generateTitle(promptData.improved),
        original: promptData.original,
        improved: promptData.improved,
        improvements: promptData.improvements || [],
        category: promptData.category || 'General',
        tags: promptData.tags || [],
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        useCount: 0
      };

      library.push(newPrompt);

      await chrome.storage.local.set({
        [this.STORAGE_KEYS.PROMPT_LIBRARY]: library
      });

      return { success: true, prompt: newPrompt };
    } catch (error) {
      console.error('Error saving prompt:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all prompts from library
   */
  async getPromptLibrary() {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.PROMPT_LIBRARY);
      return result[this.STORAGE_KEYS.PROMPT_LIBRARY] || [];
    } catch (error) {
      console.error('Error getting prompt library:', error);
      return [];
    }
  }

  /**
   * Update a prompt in the library
   */
  async updatePrompt(promptId, updates) {
    try {
      const library = await this.getPromptLibrary();
      const index = library.findIndex(p => p.id === promptId);

      if (index === -1) {
        return { success: false, error: 'Prompt not found' };
      }

      library[index] = {
        ...library[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await chrome.storage.local.set({
        [this.STORAGE_KEYS.PROMPT_LIBRARY]: library
      });

      return { success: true, prompt: library[index] };
    } catch (error) {
      console.error('Error updating prompt:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a prompt from library
   */
  async deletePrompt(promptId) {
    try {
      const library = await this.getPromptLibrary();
      const filtered = library.filter(p => p.id !== promptId);

      await chrome.storage.local.set({
        [this.STORAGE_KEYS.PROMPT_LIBRARY]: filtered
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting prompt:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a single prompt by ID
   */
  async getPrompt(promptId) {
    try {
      const library = await this.getPromptLibrary();
      const prompt = library.find(p => p.id === promptId);
      return prompt || null;
    } catch (error) {
      console.error('Error getting prompt:', error);
      return null;
    }
  }

  /**
   * Search prompts by query
   */
  async searchPrompts(query) {
    try {
      const library = await this.getPromptLibrary();
      const lowerQuery = query.toLowerCase();

      return library.filter(prompt =>
        prompt.title.toLowerCase().includes(lowerQuery) ||
        prompt.improved.toLowerCase().includes(lowerQuery) ||
        prompt.category.toLowerCase().includes(lowerQuery) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching prompts:', error);
      return [];
    }
  }

  /**
   * Get prompts by category
   */
  async getPromptsByCategory(category) {
    try {
      const library = await this.getPromptLibrary();
      return library.filter(p => p.category === category);
    } catch (error) {
      console.error('Error getting prompts by category:', error);
      return [];
    }
  }

  /**
   * Get all categories
   */
  async getCategories() {
    try {
      const library = await this.getPromptLibrary();
      const categories = [...new Set(library.map(p => p.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return ['General'];
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(promptId) {
    try {
      const library = await this.getPromptLibrary();
      const index = library.findIndex(p => p.id === promptId);

      if (index === -1) {
        return { success: false, error: 'Prompt not found' };
      }

      library[index].favorite = !library[index].favorite;

      await chrome.storage.local.set({
        [this.STORAGE_KEYS.PROMPT_LIBRARY]: library
      });

      return { success: true, favorite: library[index].favorite };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get favorite prompts
   */
  async getFavorites() {
    try {
      const library = await this.getPromptLibrary();
      return library.filter(p => p.favorite);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Increment use count for a prompt
   */
  async incrementUseCount(promptId) {
    try {
      const library = await this.getPromptLibrary();
      const index = library.findIndex(p => p.id === promptId);

      if (index !== -1) {
        library[index].useCount = (library[index].useCount || 0) + 1;
        library[index].lastUsed = new Date().toISOString();

        await chrome.storage.local.set({
          [this.STORAGE_KEYS.PROMPT_LIBRARY]: library
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error incrementing use count:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add to history
   */
  async addToHistory(promptData) {
    try {
      const history = await this.getHistory();

      const historyItem = {
        id: this.generateId(),
        original: promptData.original,
        improved: promptData.improved,
        improvements: promptData.improvements || [],
        timestamp: new Date().toISOString()
      };

      history.unshift(historyItem);

      // Keep only last MAX_HISTORY_ITEMS
      const trimmedHistory = history.slice(0, this.MAX_HISTORY_ITEMS);

      await chrome.storage.local.set({
        [this.STORAGE_KEYS.PROMPT_HISTORY]: trimmedHistory
      });

      return { success: true, item: historyItem };
    } catch (error) {
      console.error('Error adding to history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get history
   */
  async getHistory() {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.PROMPT_HISTORY);
      return result[this.STORAGE_KEYS.PROMPT_HISTORY] || [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * Clear history
   */
  async clearHistory() {
    try {
      await chrome.storage.local.set({
        [this.STORAGE_KEYS.PROMPT_HISTORY]: []
      });
      return { success: true };
    } catch (error) {
      console.error('Error clearing history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get settings
   */
  async getSettings() {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.SETTINGS);
      return result[this.STORAGE_KEYS.SETTINGS] || this.getDefaultSettings();
    } catch (error) {
      console.error('Error getting settings:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Save settings
   */
  async saveSettings(settings) {
    try {
      await chrome.storage.local.set({
        [this.STORAGE_KEYS.SETTINGS]: settings
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get default settings
   */
  getDefaultSettings() {
    return {
      autoDetect: true,
      showSuggestions: true,
      autoImprove: false,
      theme: 'light',
      position: 'bottom-right'
    };
  }

  /**
   * Export all data
   */
  async exportData() {
    try {
      const library = await this.getPromptLibrary();
      const history = await this.getHistory();
      const settings = await this.getSettings();

      return {
        version: '1.0',
        exportDate: new Date().toISOString(),
        library,
        history,
        settings
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Import data
   */
  async importData(data) {
    try {
      if (data.library) {
        await chrome.storage.local.set({
          [this.STORAGE_KEYS.PROMPT_LIBRARY]: data.library
        });
      }

      if (data.history) {
        await chrome.storage.local.set({
          [this.STORAGE_KEYS.PROMPT_HISTORY]: data.history
        });
      }

      if (data.settings) {
        await chrome.storage.local.set({
          [this.STORAGE_KEYS.SETTINGS]: data.settings
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate title from prompt
   */
  generateTitle(prompt) {
    const cleaned = prompt.trim().split('\n')[0];
    const truncated = cleaned.length > 50 ? cleaned.substring(0, 50) + '...' : cleaned;
    return truncated || 'Untitled Prompt';
  }

  /**
   * Get storage usage stats
   */
  async getStorageStats() {
    try {
      const bytesInUse = await chrome.storage.local.getBytesInUse();
      const library = await this.getPromptLibrary();
      const history = await this.getHistory();

      return {
        bytesInUse,
        promptCount: library.length,
        historyCount: history.length,
        favoriteCount: library.filter(p => p.favorite).length
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
