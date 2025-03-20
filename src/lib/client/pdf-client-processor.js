/**
 * Client-side PDF processor for browser environments
 * This is a simplified version that works in the browser without Node.js dependencies
 */
import { browser } from '$app/environment';

// Only import PDF.js dynamically in browser environment
async function getPdfJs() {
    if (browser) {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs-dist/build/pdf.worker.min.js';
        return pdfjs;
    }
    throw new Error('PDF processing requires browser environment');
}

/**
 * Process a PDF file in the browser
 * @param {ArrayBuffer} buffer - PDF file as ArrayBuffer
 * @returns {Promise<Object>} - Extracted data
 */
export async function processPDFInBrowser(buffer) {
    if (!browser) {
        throw new Error('PDF processing can only be done in browser environment');
    }

    try {
        // Get PDF.js dynamically
        const pdfjs = await getPdfJs();

        // Load the PDF document
        const pdf = await pdfjs.getDocument({ data: buffer }).promise;
        const numPages = pdf.numPages;

        // Initialize data structure
        const extractedData = {
            text: '',
            metadata: {},
            tables: [],
            entities: [],
            keywords: [],
            structure: {
                headings: [],
                sections: []
            },
            pages: []
        };

        // Get metadata
        try {
            const metadata = await pdf.getMetadata();
            extractedData.metadata = metadata.info || {};
        } catch (error) {
            console.warn('Error extracting metadata:', error);
        }

        // Process each page
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Process text content safely - make sure to handle different versions
            const pageText = textContent.items
                .map(item => {
                    // Handle different item types
                    if ('str' in item) {
                        return item.str;
                    }
                    return '';
                })
                .join(' ');

            // Add to full text
            extractedData.text += pageText + '\n\n';

            // Add page info
            extractedData.pages.push({
                pageNum: i,
                text: pageText,
                dimensions: {
                    width: page.view[2],
                    height: page.view[3]
                }
            });

            try {
                const headings = findHeadings(textContent.items, i);
                extractedData.structure.headings.push(...headings);
            } catch (error) {
                console.warn('Error extracting headings:', error);
            }
        }

        // Extract tables, entities and keywords
        extractedData.tables = findTables(extractedData.text);
        extractedData.entities = extractEntities(extractedData.text);
        extractedData.keywords = extractKeywords(extractedData.text);

        return extractedData;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Find potential headings in text content
 * @param {Array} textItems - Text items from PDF.js
 * @param {number} pageNum - Page number
 * @returns {Array} - Detected headings
 */
function findHeadings(textItems, pageNum) {
    const headings = [];
    let lastY = -1;

    // Group items by their y-position
    const lineItems = {};

    for (const item of textItems) {
        const y = Math.round(item.transform[5]); // y-position

        if (!lineItems[y]) {
            lineItems[y] = [];
        }

        lineItems[y].push(item);
    }

    // Sort line positions from top to bottom
    const sortedYPositions = Object.keys(lineItems).map(Number).sort((a, b) => b - a);

    // Find potential headings based on font size and content
    for (const y of sortedYPositions) {
        const line = lineItems[y];

        // Skip empty lines
        if (line.length === 0) continue;

        // Get the line text
        const text = line.map(item => item.str).join('').trim();

        // Skip lines that are too short or don't look like headings
        if (text.length < 2 || text.length > 100) continue;

        // Check if this might be a heading based on font properties
        const fontHeight = line[0].height || line[0].transform[3] || 0;

        // Use font size to determine if it's a heading
        if (fontHeight > 12 && /^[A-Z0-9]/.test(text) && text.length < 100) {
            // Determine heading level based on font size
            let level = 3;
            if (fontHeight > 16) level = 1;
            else if (fontHeight > 14) level = 2;

            headings.push({
                text,
                level,
                pageNum,
                position: {
                    x: line[0].transform[4],
                    y: line[0].transform[5]
                }
            });
        }
    }

    return headings;
}

/**
 * Find potential tables in text
 * @param {string} text - Document text
 * @returns {Array} - Detected tables
 */
function findTables(text) {
    const tables = [];

    // Split by lines
    const lines = text.split('\n');

    // Look for patterns that might indicate tables
    let currentTable = null;

    for (const line of lines) {
        // Check if line has multiple columns separated by consistent delimiters
        const isTabular = (
            // Check for pipe-delimited format
            (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) ||
            // Check for multi-space delimited columns (crude approximation)
            (line.includes('  ') && line.trim().length > 0 && line.split(/\s{2,}/).length > 2)
        );

        if (isTabular) {
            // Start a new table or add to existing
            if (!currentTable) {
                currentTable = {
                    rows: []
                };
            }

            // Parse the row based on delimiter type
            let cells;
            if (line.includes('|')) {
                cells = line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell !== '');
            } else {
                cells = line.split(/\s{2,}/).map(cell => cell.trim());
            }

            if (cells.length > 1) {
                currentTable.rows.push(cells);
            }
        } else if (currentTable && currentTable.rows.length > 0) {
            // End of table
            if (currentTable.rows.length > 1) { // Only include if we have at least two rows
                tables.push(currentTable);
            }
            currentTable = null;
        }
    }

    // Add the last table if needed
    if (currentTable && currentTable.rows.length > 1) {
        tables.push(currentTable);
    }

    return tables;
}

/**
 * Extract entities from text (dates, currencies, percentages, etc.)
 * @param {string} text - Document text
 * @returns {Array} - Extracted entities
 */
function extractEntities(text) {
    const entities = [];

    // Define regex patterns for different entity types
    const patterns = [
        { type: 'date', regex: /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g },
        { type: 'percentage', regex: /\b\d+(\.\d+)?%\b/g },
        { type: 'money', regex: /\$\d+(,\d{3})*(\.\d+)?(\ ?(million|billion|thousand))?/gi },
        { type: 'email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
        { type: 'url', regex: /https?:\/\/[^\s]+/g },
        { type: 'phone', regex: /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g }
    ];

    // Extract entities with each pattern
    for (const pattern of patterns) {
        const matches = Array.from(text.matchAll(pattern.regex));

        for (const match of matches) {
            entities.push({
                type: pattern.type,
                value: match[0],
                position: match.index
            });
        }
    }

    return entities;
}

/**
 * Extract keywords from text
 * @param {string} text - Document text
 * @returns {Array} - Extracted keywords
 */
function extractKeywords(text) {
    // Simple keyword extraction based on word frequency
    // In a real app, this would use more sophisticated NLP
    const words = text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/);

    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
        'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'about', 'against', 'between',
        'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down',
        'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
        'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
        'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
        'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);

    const wordFreq = {};

    for (const word of words) {
        if (word.length > 3 && !stopWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    }

    // Sort by frequency and take top 20
    const keywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(entry => entry[0]);

    return keywords;
} 