/**
 * PromptSculptor - Prompt Improvement Engine
 * This module contains the core logic for improving prompts based on LLM best practices
 */

class PromptImprover {
  constructor() {
    this.improvementStrategies = [
      'clarity',
      'structure',
      'context',
      'specificity',
      'constraints',
      'examples',
      'format'
    ];
  }

  /**
   * Main method to improve a prompt
   * @param {string} originalPrompt - The user's original prompt
   * @param {Object} options - Improvement options
   * @returns {Object} - Improved prompt with metadata
   */
  improvePrompt(originalPrompt, options = {}) {
    if (!originalPrompt || originalPrompt.trim().length === 0) {
      return {
        success: false,
        error: 'Prompt cannot be empty'
      };
    }

    const analysis = this.analyzePrompt(originalPrompt);
    const improved = this.generateImprovedPrompt(originalPrompt, analysis, options);

    return {
      success: true,
      original: originalPrompt,
      improved: improved.text,
      improvements: improved.improvements,
      analysis: analysis,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Analyze the prompt to identify areas for improvement
   */
  analyzePrompt(prompt) {
    const analysis = {
      length: prompt.length,
      hasContext: this.checkForContext(prompt),
      hasConstraints: this.checkForConstraints(prompt),
      hasFormat: this.checkForFormat(prompt),
      hasExamples: this.checkForExamples(prompt),
      specificity: this.assessSpecificity(prompt),
      clarity: this.assessClarity(prompt),
      structure: this.assessStructure(prompt)
    };

    return analysis;
  }

  /**
   * Generate an improved version of the prompt
   */
  generateImprovedPrompt(originalPrompt, analysis, options) {
    let improvedText = originalPrompt.trim();
    const improvements = [];

    // Add role/context if missing
    if (!analysis.hasContext && options.addContext !== false) {
      const contextAddition = this.addContext(improvedText);
      if (contextAddition) {
        improvedText = contextAddition;
        improvements.push('Added context and role definition');
      }
    }

    // Improve structure
    if (analysis.structure < 0.6) {
      improvedText = this.improveStructure(improvedText);
      improvements.push('Enhanced structure and organization');
    }

    // Add specificity
    if (analysis.specificity < 0.5) {
      improvedText = this.addSpecificity(improvedText);
      improvements.push('Increased specificity and detail');
    }

    // Add output format if missing
    if (!analysis.hasFormat && options.addFormat !== false) {
      improvedText = this.addOutputFormat(improvedText);
      improvements.push('Added output format specification');
    }

    // Add constraints/guidelines if beneficial
    if (!analysis.hasConstraints && improvedText.length > 50) {
      improvedText = this.addConstraints(improvedText);
      improvements.push('Added helpful constraints and guidelines');
    }

    // Enhance clarity
    if (analysis.clarity < 0.7) {
      improvedText = this.enhanceClarity(improvedText);
      improvements.push('Enhanced clarity and precision');
    }

    return {
      text: improvedText,
      improvements: improvements
    };
  }

  /**
   * Check if prompt has contextual information
   */
  checkForContext(prompt) {
    const contextIndicators = [
      /you are (a|an)/i,
      /act as/i,
      /imagine you/i,
      /your role/i,
      /as (a|an) expert/i,
      /context:/i,
      /background:/i
    ];

    return contextIndicators.some(pattern => pattern.test(prompt));
  }

  /**
   * Check if prompt has constraints
   */
  checkForConstraints(prompt) {
    const constraintIndicators = [
      /must/i,
      /should/i,
      /don't/i,
      /avoid/i,
      /ensure/i,
      /requirements?:/i,
      /constraints?:/i,
      /guidelines?:/i,
      /limit/i
    ];

    return constraintIndicators.some(pattern => pattern.test(prompt));
  }

  /**
   * Check if prompt specifies output format
   */
  checkForFormat(prompt) {
    const formatIndicators = [
      /format:/i,
      /structure:/i,
      /output:/i,
      /provide.*in.*format/i,
      /list/i,
      /table/i,
      /json/i,
      /markdown/i,
      /step[- ]by[- ]step/i,
      /numbered/i,
      /bullet points?/i
    ];

    return formatIndicators.some(pattern => pattern.test(prompt));
  }

  /**
   * Check if prompt includes examples
   */
  checkForExamples(prompt) {
    const exampleIndicators = [
      /for example/i,
      /such as/i,
      /e\.g\./i,
      /like:/i,
      /example:/i,
      /instance:/i
    ];

    return exampleIndicators.some(pattern => pattern.test(prompt));
  }

  /**
   * Assess specificity of the prompt (0-1 scale)
   */
  assessSpecificity(prompt) {
    let score = 0;

    // Longer prompts tend to be more specific
    if (prompt.length > 100) score += 0.2;
    if (prompt.length > 200) score += 0.2;

    // Check for specific details
    if (/\d+/.test(prompt)) score += 0.1; // Contains numbers
    if (/["'].*["']/.test(prompt)) score += 0.1; // Contains quoted text
    if (prompt.split(/[.!?]/).length > 2) score += 0.2; // Multiple sentences

    // Check for specific question words
    const specificWords = ['how', 'what', 'why', 'when', 'where', 'which'];
    if (specificWords.some(word => prompt.toLowerCase().includes(word))) score += 0.2;

    return Math.min(score, 1);
  }

  /**
   * Assess clarity of the prompt (0-1 scale)
   */
  assessClarity(prompt) {
    let score = 0.5; // Base score

    // Good indicators
    if (prompt.includes('?')) score += 0.1; // Has question
    if (!/\b(um|uh|like|maybe|perhaps|kinda|sorta)\b/i.test(prompt)) score += 0.2; // No filler words
    if (prompt.split(/\s+/).length > 5) score += 0.1; // Adequate length
    if (prompt.split(/\s+/).length < 200) score += 0.1; // Not too long

    return Math.min(score, 1);
  }

  /**
   * Assess structure of the prompt (0-1 scale)
   */
  assessStructure(prompt) {
    let score = 0;

    // Check for structured elements
    if (/^[-*]\s/m.test(prompt)) score += 0.3; // Has bullet points
    if (/^\d+\./m.test(prompt)) score += 0.3; // Has numbered list
    if (prompt.includes('\n\n')) score += 0.2; // Has paragraphs
    if (/[A-Z][^.!?]*:/m.test(prompt)) score += 0.2; // Has sections with headers

    return Math.min(score, 1);
  }

  /**
   * Add context to the prompt
   */
  addContext(prompt) {
    // Detect the type of request to provide appropriate context
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('code') || promptLower.includes('program') || promptLower.includes('function')) {
      return `As an expert software developer, help me with the following task:\n\n${prompt}\n\nPlease provide clear, well-commented code following best practices.`;
    } else if (promptLower.includes('write') && (promptLower.includes('article') || promptLower.includes('essay') || promptLower.includes('blog'))) {
      return `As an expert writer and content creator, help me with:\n\n${prompt}\n\nPlease create engaging, well-structured content.`;
    } else if (promptLower.includes('analyze') || promptLower.includes('explain')) {
      return `As an expert analyst, please help me understand:\n\n${prompt}\n\nProvide a thorough, clear analysis.`;
    } else {
      return `Please help me with the following:\n\n${prompt}\n\nProvide a comprehensive and well-structured response.`;
    }
  }

  /**
   * Improve the structure of the prompt
   */
  improveStructure(prompt) {
    // If prompt is a simple sentence, enhance it with structure
    if (!prompt.includes('\n') && prompt.length > 50) {
      const sentences = prompt.split(/[.!?]+/).filter(s => s.trim());

      if (sentences.length > 1) {
        return `Objective:\n${sentences[0].trim()}.\n\nDetails:\n${sentences.slice(1).join('. ').trim()}.`;
      }
    }

    return prompt;
  }

  /**
   * Add specificity to vague prompts
   */
  addSpecificity(prompt) {
    const promptLower = prompt.toLowerCase();

    // Add clarifying questions or suggestions
    if (prompt.length < 50) {
      if (promptLower.includes('help')) {
        return `${prompt}\n\nPlease provide:\n- Detailed step-by-step guidance\n- Relevant examples\n- Best practices to follow`;
      } else if (promptLower.includes('what') || promptLower.includes('how')) {
        return `${prompt}\n\nPlease include:\n- A comprehensive explanation\n- Key concepts and principles\n- Practical examples`;
      }
    }

    return prompt;
  }

  /**
   * Add output format specification
   */
  addOutputFormat(prompt) {
    const promptLower = prompt.toLowerCase();

    // Determine appropriate format based on content
    if (promptLower.includes('list') || promptLower.includes('options')) {
      return `${prompt}\n\nFormat: Please provide your response as a clear, organized list.`;
    } else if (promptLower.includes('compare') || promptLower.includes('differences')) {
      return `${prompt}\n\nFormat: Please structure your response with clear comparisons and distinctions.`;
    } else if (promptLower.includes('step')) {
      return `${prompt}\n\nFormat: Please provide a numbered, step-by-step guide.`;
    } else {
      return `${prompt}\n\nFormat: Please provide a well-organized response with clear sections.`;
    }
  }

  /**
   * Add helpful constraints
   */
  addConstraints(prompt) {
    const promptLower = prompt.toLowerCase();

    // Add relevant constraints based on content
    if (promptLower.includes('code')) {
      return `${prompt}\n\nConstraints:\n- Use clear, descriptive variable names\n- Include comments explaining key logic\n- Follow industry-standard best practices`;
    } else if (promptLower.includes('write')) {
      return `${prompt}\n\nGuidelines:\n- Use clear, concise language\n- Maintain consistent tone\n- Ensure logical flow of ideas`;
    } else {
      return `${prompt}\n\nGuidelines:\n- Be comprehensive yet concise\n- Use clear examples where helpful\n- Ensure accuracy and relevance`;
    }
  }

  /**
   * Enhance clarity of the prompt
   */
  enhanceClarity(prompt) {
    let enhanced = prompt;

    // Remove filler words
    const fillers = ['um', 'uh', 'like', 'kinda', 'sorta'];
    fillers.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      enhanced = enhanced.replace(regex, '');
    });

    // Clean up multiple spaces
    enhanced = enhanced.replace(/\s+/g, ' ').trim();

    return enhanced;
  }

  /**
   * Generate improvement suggestions without modifying the prompt
   */
  getSuggestions(prompt) {
    const analysis = this.analyzePrompt(prompt);
    const suggestions = [];

    if (!analysis.hasContext) {
      suggestions.push({
        type: 'context',
        title: 'Add Context',
        description: 'Define the role or context for better responses',
        example: 'Start with "As an expert in..." or "You are a..."'
      });
    }

    if (!analysis.hasFormat) {
      suggestions.push({
        type: 'format',
        title: 'Specify Output Format',
        description: 'Tell the AI how to structure the response',
        example: 'Add "Provide response as..." or "Format: ..."'
      });
    }

    if (analysis.specificity < 0.5) {
      suggestions.push({
        type: 'specificity',
        title: 'Be More Specific',
        description: 'Add more details about what you want',
        example: 'Include specific requirements, examples, or constraints'
      });
    }

    if (!analysis.hasConstraints) {
      suggestions.push({
        type: 'constraints',
        title: 'Add Guidelines',
        description: 'Specify what to include or avoid',
        example: 'Use "Please ensure..." or "Avoid..."'
      });
    }

    if (analysis.structure < 0.6) {
      suggestions.push({
        type: 'structure',
        title: 'Improve Structure',
        description: 'Organize your prompt with sections',
        example: 'Use headings, bullet points, or numbered lists'
      });
    }

    return suggestions;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptImprover;
}
