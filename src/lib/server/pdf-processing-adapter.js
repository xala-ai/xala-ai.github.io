/**
 * PDF Processing Adapter
 * 
 * This adapter redirects server-side PDF processing to use the client-side implementation
 * to avoid Node.js dependencies like canvas and pdf.js-extract during build
 */
import { browser } from '$app/environment';
import { processPDFInBrowser } from '$lib/client/pdf-client-processor.js';

/**
 * Process PDF using the appropriate method
 * @param {ArrayBuffer} buffer - PDF file buffer
 * @returns {Promise<Object>} - Extracted data
 */
export async function processPDF(buffer) {
    // Always use browser processing to avoid server-side dependencies
    if (browser) {
        return processPDFInBrowser(buffer);
    } else {
        // If somehow called from server, throw helpful error
        throw new Error('Server-side PDF processing is disabled. Use client-side processing instead.');
    }
}

// Export the same interface as the original processor
export default {
    processPDF
}; 