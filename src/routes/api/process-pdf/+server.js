import { json } from '@sveltejs/kit';
import { processPDF } from '$lib/server/pdf-processor.js';
import { generateSummary } from '$lib/server/claude-api.js';

/**
 * API endpoint to process a PDF file
 * Accepts a buffer and returns extracted data with generated summary
 */
export async function POST({ request, fetch }) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const claudeApiKey = formData.get('apiKey') || process.env.CLAUDE_API_KEY || '';

        if (!file || !(file instanceof File)) {
            return json({ error: 'No PDF file provided' }, { status: 400 });
        }

        // Convert file to ArrayBuffer
        const buffer = await file.arrayBuffer();

        // Process the PDF
        const extractedData = await processPDF(buffer);

        // Generate summary using Claude API
        let summaryData;
        let usedClaude = false;

        try {
            if (claudeApiKey) {
                summaryData = await generateSummary(extractedData, claudeApiKey);
                usedClaude = true;
            } else {
                // Fallback to local generation if no API key provided
                throw new Error('No Claude API key provided');
            }
        } catch (error) {
            console.error('Error generating summary with Claude:', error);
            // Fallback to local generation
            summaryData = generateLocalSummary(extractedData);
        }

        // Return combined data
        return json({
            success: true,
            data: {
                ...extractedData,
                summary: summaryData,
                usedClaude
            }
        });
    } catch (error) {
        console.error('PDF processing error:', error);
        return json({
            error: 'Error processing PDF',
            message: error.message
        }, { status: 500 });
    }
}

/**
 * Generate a basic summary locally as a fallback
 * @param {Object} extractedData - The extracted PDF data
 * @returns {Object} - Basic summary data
 */
function generateLocalSummary(extractedData) {
    // Extract the first few paragraphs
    const paragraphs = extractedData.text.split('\n\n').filter(p => p.trim().length > 20);
    const summary = paragraphs.slice(0, 3).join('\n\n');

    // Basic insights
    const insights = [];

    // Add metadata insights
    if (extractedData.metadata && extractedData.metadata.Title) {
        insights.push(`The document is titled "${extractedData.metadata.Title}".`);
    }

    // Add content insights
    if (extractedData.tables && extractedData.tables.length > 0) {
        insights.push(`The document contains ${extractedData.tables.length} tables.`);
    }

    if (extractedData.structure && extractedData.structure.headings && extractedData.structure.headings.length > 0) {
        insights.push(`The document contains ${extractedData.structure.headings.length} sections.`);
    }

    // Create default visualization suggestions
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

    // Add table visualization if tables exist
    if (extractedData.tables && extractedData.tables.length > 0) {
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