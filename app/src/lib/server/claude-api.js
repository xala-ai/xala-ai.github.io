import fetch from 'node-fetch';

/**
 * Claude API service for text generation
 */
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-haiku-20240307'; // Using a smaller model for faster responses and cost efficiency

/**
 * Generate a summary from PDF text using Claude AI
 * @param {Object} pdfData - Extracted PDF data
 * @param {string} apiKey - Claude API key
 * @returns {Promise<Object>} - Generated summary and insights
 */
export async function generateSummary(pdfData, apiKey) {
    if (!apiKey) {
        throw new Error('Claude API key is required');
    }

    try {
        const prompt = createSummaryPrompt(pdfData);

        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Claude API Error: ${error}`);
        }

        const result = await response.json();
        return parseSummaryResponse(result.content[0].text);
    } catch (error) {
        console.error('Claude API Error:', error);

        // Fallback to local summary generation
        return generateLocalSummary(pdfData);
    }
}

/**
 * Create a prompt for Claude to generate a summary
 * @param {Object} pdfData - Extracted PDF data
 * @returns {string} - Formatted prompt for Claude
 */
function createSummaryPrompt(pdfData) {
    // Extract important sections of the document to include in prompt
    const text = pdfData.text.substring(0, 8000); // Limit text length to avoid token limits
    const tablesInfo = pdfData.tables.length > 0
        ? `The document contains ${pdfData.tables.length} tables. Here's the first one: ${JSON.stringify(pdfData.tables[0].rows.slice(0, 5))}`
        : 'The document does not contain any tables.';

    const headingsInfo = pdfData.structure.headings.length > 0
        ? `The document contains these headings: ${pdfData.structure.headings.map(h => h.text).join(', ')}`
        : 'No clear headings were detected.';

    return `
I need you to analyze this PDF document content and create an executive summary. 
Focus on the main points, insights, and key data.

Document content:
${text}

${tablesInfo}

${headingsInfo}

Please provide:
1. A concise executive summary (3-4 paragraphs)
2. 5-7 key insights or takeaways
3. Suggest 3-5 data visualization types that would best represent this information and why
4. Identify any gaps in the data that would benefit from additional information

Format your response in JSON like this:
{
  "summary": "The executive summary...",
  "insights": ["Insight 1", "Insight 2", ...],
  "visualizationSuggestions": [
    {"type": "visualization type", "description": "what it would show", "dataRequired": "what data it needs"}
  ],
  "dataGaps": ["Gap 1", "Gap 2", ...]
}
`;
}

/**
 * Parse the response from Claude
 * @param {string} responseText - Raw response from Claude
 * @returns {Object} - Parsed summary data
 */
function parseSummaryResponse(responseText) {
    try {
        // Extract JSON from response if needed
        let jsonStart = responseText.indexOf('{');
        let jsonEnd = responseText.lastIndexOf('}');

        if (jsonStart >= 0 && jsonEnd >= 0) {
            const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
            return JSON.parse(jsonString);
        }

        // If not JSON or parsing fails, return structured error
        return {
            summary: "Could not generate summary from API response.",
            insights: ["API response was not in the expected format."],
            visualizationSuggestions: [],
            dataGaps: ["Unable to identify data gaps due to processing error."]
        };
    } catch (error) {
        console.error('Error parsing Claude response:', error);

        // Return a friendly error
        return {
            summary: "Could not generate summary from API response.",
            insights: ["Error parsing the AI response."],
            visualizationSuggestions: [],
            dataGaps: ["Unable to identify data gaps due to processing error."]
        };
    }
}

/**
 * Generate a summary locally as fallback
 * @param {Object} pdfData - Extracted PDF data
 * @returns {Object} - Generated summary and insights
 */
function generateLocalSummary(pdfData) {
    // Extract the first few paragraphs as summary
    const paragraphs = pdfData.text.split('\n\n').filter(p => p.trim().length > 20);
    const summary = paragraphs.slice(0, 3).join('\n\n');

    // Generate simple insights from metadata and content
    const insights = [];

    // Add metadata insights
    if (pdfData.metadata.Title) {
        insights.push(`The document is titled "${pdfData.metadata.Title}".`);
    }

    if (pdfData.metadata.Author) {
        insights.push(`The document was created by ${pdfData.metadata.Author}.`);
    }

    // Add content insights
    if (pdfData.tables.length > 0) {
        insights.push(`The document contains ${pdfData.tables.length} tables.`);
    }

    if (pdfData.structure.headings.length > 0) {
        insights.push(`The document contains ${pdfData.structure.headings.length} sections.`);
    }

    if (pdfData.entities.length > 0) {
        const entityTypes = {};
        pdfData.entities.forEach(entity => {
            entityTypes[entity.type] = (entityTypes[entity.type] || 0) + 1;
        });

        const entityInsights = Object.entries(entityTypes)
            .map(([type, count]) => `${count} ${type} references`);

        insights.push(`The document contains ${entityInsights.join(', ')}.`);
    }

    // Default visualization suggestions
    const visualizationSuggestions = [
        {
            type: "bar chart",
            description: "Frequency of key terms",
            dataRequired: "Word frequency data from document text"
        },
        {
            type: "pie chart",
            description: "Distribution of entity types",
            dataRequired: "Entity counts by type"
        }
    ];

    if (pdfData.tables.length > 0) {
        visualizationSuggestions.push({
            type: "table visualization",
            description: "Interactive representation of table data",
            dataRequired: "Table content from the document"
        });
    }

    return {
        summary,
        insights: insights.length > 0 ? insights : ["No clear insights could be automatically generated."],
        visualizationSuggestions,
        dataGaps: ["AI-based content analysis was unavailable."]
    };
} 