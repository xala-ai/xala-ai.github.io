import { PDFExtract } from 'pdf.js-extract';
import { createCanvas } from 'canvas';
// Replace static import with dynamic import
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { extractTables } from './table-extractor.js';

// Will be loaded dynamically
let pdfjsLib = null;

// Load PDF.js dynamically
async function loadPdfJs() {
    if (!pdfjsLib) {
        try {
            // Dynamic import
            pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
            // Configure the worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
        } catch (error) {
            console.error('Error loading PDF.js:', error);
            throw new Error(`Failed to load PDF.js: ${error.message}`);
        }
    }
    return pdfjsLib;
}

/**
 * Comprehensive PDF processor that extracts text, images, tables, and metadata
 */
export async function processPDF(buffer) {
    try {
        // Initialize PDF extraction
        const pdfExtract = new PDFExtract();
        const options = {};

        // Extract text and basic data
        const data = await pdfExtract.extractBuffer(buffer, options);

        // Process the data into a more usable format
        const processedData = {
            metadata: data.metadata || {},
            text: '',
            pages: [],
            tables: [],
            images: [],
            entities: [],
            structure: {
                sections: [],
                headings: []
            }
        };

        // Process each page
        for (let i = 0; i < data.pages.length; i++) {
            const page = data.pages[i];
            const pageNum = i + 1;
            const pageText = page.content.map(item => item.str).join(' ');

            // Add to the full text
            processedData.text += pageText + '\n\n';

            // Extract tables from the page content
            const pageTables = await extractTables(page);
            if (pageTables.length > 0) {
                processedData.tables.push(...pageTables.map(table => ({
                    ...table,
                    pageNum
                })));
            }

            // Add page info
            processedData.pages.push({
                pageNum,
                text: pageText,
                dimensions: {
                    width: page.width,
                    height: page.height
                }
            });
        }

        // Extract images
        try {
            const images = await extractImagesFromPDF(buffer);
            processedData.images = images;
        } catch (error) {
            console.warn('Error extracting images:', error);
            processedData.images = [];
        }

        // Extract structure (headings, sections)
        processedData.structure = extractDocumentStructure(data.pages);

        // Extract entities (dates, amounts, etc.)
        processedData.entities = extractEntities(processedData.text);

        return processedData;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw new Error(`PDF processing failed: ${error.message}`);
    }
}

/**
 * Extract images from PDF
 */
async function extractImagesFromPDF(buffer) {
    const images = [];

    try {
        // Load PDF.js dynamically
        const pdfjsLib = await loadPdfJs();

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

        // Process each page
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const operatorList = await page.getOperatorList();

            // Iterate through operations looking for images
            for (let j = 0; j < operatorList.fnArray.length; j++) {
                if (operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
                    const imgIndex = operatorList.argsArray[j][0];
                    const imgData = await extractImageData(page, imgIndex);

                    if (imgData) {
                        images.push({
                            pageNum: i,
                            dataUrl: imgData,
                            index: images.length
                        });
                    }
                }
            }
        }

        return images;
    } catch (error) {
        console.error('Error extracting images:', error);
        return [];
    }
}

/**
 * Extract image data from a specific reference
 */
async function extractImageData(page, imgIndex) {
    try {
        // Ensure PDF.js is loaded
        const pdfjsLib = await loadPdfJs();

        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');

        // Create a clipping region for this image
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render just this image
        const operatorList = await page.getOperatorList();
        const imgOps = [];
        let foundTarget = false;

        for (let i = 0; i < operatorList.fnArray.length; i++) {
            if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject &&
                operatorList.argsArray[i][0] === imgIndex) {
                imgOps.push({
                    fnArray: [operatorList.fnArray[i]],
                    argsArray: [operatorList.argsArray[i]]
                });
                foundTarget = true;
                break;
            }

            if (foundTarget) break;
        }

        if (imgOps.length > 0) {
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            // Render the image
            await page.render(renderContext).promise;

            // Convert to data URL
            return canvas.toDataURL('image/png');
        }

        return null;
    } catch (error) {
        console.error('Error extracting image data:', error);
        return null;
    }
}

/**
 * Extract document structure (headings, sections)
 */
function extractDocumentStructure(pages) {
    const structure = {
        headings: [],
        sections: []
    };

    let currentPageNum = 0;

    // Simple heuristics for heading detection
    for (const page of pages) {
        currentPageNum++;

        // Process content, looking for potential headings
        let lastY = -1;
        let lastFontSize = -1;

        for (const item of page.content) {
            // Check for potential headings based on font size and positioning
            if (item.str.trim().length > 0) {
                const fontSize = item.height;

                // If font size is significantly larger than average text, treat as heading
                if (fontSize > 14) {
                    structure.headings.push({
                        text: item.str.trim(),
                        level: fontSize > 18 ? 1 : (fontSize > 16 ? 2 : 3),
                        pageNum: currentPageNum,
                        position: {
                            x: item.x,
                            y: item.y
                        }
                    });

                    // Add as section if it's not already there
                    if (!structure.sections.some(s => s.title === item.str.trim())) {
                        structure.sections.push({
                            title: item.str.trim(),
                            pageNum: currentPageNum,
                            content: ''
                        });
                    }
                } else {
                    // Add content to the last section if exists
                    if (structure.sections.length > 0) {
                        const lastSection = structure.sections[structure.sections.length - 1];
                        lastSection.content += item.str + ' ';
                    }
                }

                lastY = item.y;
                lastFontSize = fontSize;
            }
        }
    }

    return structure;
}

/**
 * Extract entities from text (dates, currencies, percentages, etc.)
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
        const matches = [...text.matchAll(pattern.regex)];

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