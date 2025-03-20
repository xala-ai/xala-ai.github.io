/**
 * Table extraction from PDF pages
 * Uses heuristics to identify and extract tables from PDF content
 */

/**
 * Extract tables from a PDF page
 * @param {Object} page - The PDF page object from pdf.js-extract
 * @returns {Array} - Array of tables with their data
 */
export async function extractTables(page) {
    const tables = [];

    try {
        // Group content items by y-position (rows)
        const rowGroups = groupContentByRows(page.content);

        // Identify potential tables based on content alignment
        const potentialTables = findPotentialTables(rowGroups, page);

        // Process and structure each identified table
        for (const tableData of potentialTables) {
            const processedTable = processTableData(tableData, page);
            if (processedTable && processedTable.rows.length > 1) {
                tables.push(processedTable);
            }
        }
    } catch (error) {
        console.error('Error extracting tables:', error);
    }

    return tables;
}

/**
 * Group page content items by their y-position to identify rows
 * @param {Array} content - PDF page content items
 * @returns {Object} - Content grouped by y-position
 */
function groupContentByRows(content) {
    const rowGroups = {};
    const yPositionTolerance = 3; // Tolerance for considering items on the same row

    // Group by y-position
    for (const item of content) {
        if (!item.str.trim()) continue;

        // Find existing row within tolerance
        let foundRow = false;
        for (const y in rowGroups) {
            if (Math.abs(parseFloat(y) - item.y) <= yPositionTolerance) {
                rowGroups[y].push(item);
                foundRow = true;
                break;
            }
        }

        // Create new row if needed
        if (!foundRow) {
            rowGroups[item.y] = [item];
        }
    }

    return rowGroups;
}

/**
 * Find potential tables based on content alignment patterns
 * @param {Object} rowGroups - Content grouped by y-position
 * @param {Object} page - The PDF page object
 * @returns {Array} - Potential tables identified
 */
function findPotentialTables(rowGroups, page) {
    const potentialTables = [];
    let currentTable = null;
    let consecutiveStructuredRows = 0;

    // Sort rows by y-position (top to bottom)
    const sortedYPositions = Object.keys(rowGroups)
        .map(y => parseFloat(y))
        .sort((a, b) => a - b);

    for (const y of sortedYPositions) {
        const row = rowGroups[y];

        // Skip rows with too few items
        if (row.length < 2) {
            if (currentTable && consecutiveStructuredRows >= 3) {
                // End current table if we have enough structured rows
                potentialTables.push(currentTable);
            }
            currentTable = null;
            consecutiveStructuredRows = 0;
            continue;
        }

        // Sort row items by x-position (left to right)
        const sortedRow = [...row].sort((a, b) => a.x - b.x);

        // Check if row has a table-like structure
        const isTableRow = hasTableStructure(sortedRow);

        if (isTableRow) {
            consecutiveStructuredRows++;

            if (!currentTable) {
                // Start a new potential table
                currentTable = {
                    rows: [sortedRow],
                    startY: y,
                    columnPositions: getColumnPositions(sortedRow)
                };
            } else {
                // Add to current table
                currentTable.rows.push(sortedRow);

                // Update column positions based on this row
                const newColumnPositions = getColumnPositions(sortedRow);
                currentTable.columnPositions = mergeColumnPositions(
                    currentTable.columnPositions,
                    newColumnPositions
                );
            }
        } else if (currentTable) {
            // Check if this might be part of the table despite not having perfect structure
            const compatibleWithTable = isCompatibleWithTable(sortedRow, currentTable.columnPositions);

            if (compatibleWithTable) {
                currentTable.rows.push(sortedRow);
            } else {
                // End current table if we have enough structured rows
                if (consecutiveStructuredRows >= 3) {
                    currentTable.endY = y;
                    potentialTables.push(currentTable);
                }
                currentTable = null;
                consecutiveStructuredRows = 0;
            }
        }
    }

    // Add the last table if it exists
    if (currentTable && consecutiveStructuredRows >= 3) {
        potentialTables.push(currentTable);
    }

    return potentialTables;
}

/**
 * Check if a row has a table-like structure
 * @param {Array} row - Row of content items
 * @returns {boolean} - Whether the row likely belongs to a table
 */
function hasTableStructure(row) {
    if (row.length < 2) return false;

    // Check for consistent spacing between items
    const spacings = [];
    for (let i = 1; i < row.length; i++) {
        spacings.push(row[i].x - (row[i - 1].x + row[i - 1].width));
    }

    // Calculate average and standard deviation of spacings
    const avgSpacing = spacings.reduce((sum, val) => sum + val, 0) / spacings.length;
    const stdDevSpacing = Math.sqrt(
        spacings.reduce((sum, val) => sum + Math.pow(val - avgSpacing, 2), 0) / spacings.length
    );

    // If standard deviation is low relative to average spacing, it's likely a table row
    return stdDevSpacing / avgSpacing < 0.5 || stdDevSpacing < 10;
}

/**
 * Get column positions from a row
 * @param {Array} row - Row of content items
 * @returns {Array} - X-positions of columns
 */
function getColumnPositions(row) {
    return row.map(item => ({
        start: item.x,
        end: item.x + item.width,
        center: item.x + (item.width / 2)
    }));
}

/**
 * Merge column positions from multiple rows
 * @param {Array} existingColumns - Existing column positions
 * @param {Array} newColumns - New column positions to merge
 * @returns {Array} - Merged column positions
 */
function mergeColumnPositions(existingColumns, newColumns) {
    // Simple case: if no existing columns, use new ones
    if (!existingColumns || existingColumns.length === 0) {
        return newColumns;
    }

    // If different number of columns, use the one with more columns
    if (existingColumns.length !== newColumns.length) {
        return existingColumns.length > newColumns.length ? existingColumns : newColumns;
    }

    // Average the positions
    return existingColumns.map((col, i) => ({
        start: (col.start + newColumns[i].start) / 2,
        end: (col.end + newColumns[i].end) / 2,
        center: (col.center + newColumns[i].center) / 2
    }));
}

/**
 * Check if a row is compatible with a table structure
 * @param {Array} row - Row of content items
 * @param {Array} columnPositions - Column positions to check against
 * @returns {boolean} - Whether the row is compatible with the table
 */
function isCompatibleWithTable(row, columnPositions) {
    if (!columnPositions || columnPositions.length === 0) return false;

    // For each item, check if it falls within a column
    let matchedColumns = 0;

    for (const item of row) {
        const itemCenter = item.x + (item.width / 2);

        // Check if this item aligns with any column
        for (const column of columnPositions) {
            if (itemCenter >= column.start - 10 && itemCenter <= column.end + 10) {
                matchedColumns++;
                break;
            }
        }
    }

    // Row is compatible if a sufficient percentage of items align with columns
    return matchedColumns / row.length > 0.5;
}

/**
 * Process table data into a structured format
 * @param {Object} tableData - Raw table data with rows and column positions
 * @param {Object} page - The PDF page object
 * @returns {Object} - Structured table data
 */
function processTableData(tableData, page) {
    try {
        const { rows, columnPositions } = tableData;

        // Initialize structured data
        const processedTable = {
            position: {
                startY: tableData.startY,
                endY: tableData.endY || rows[rows.length - 1][0].y
            },
            columns: columnPositions.length,
            rows: [],
            headerRow: null
        };

        // Process each row
        for (const row of rows) {
            const processedRow = [];

            // For each column position, find the closest content item
            for (const column of columnPositions) {
                let bestMatch = null;
                let bestDistance = Infinity;

                for (const item of row) {
                    const itemCenter = item.x + (item.width / 2);
                    const distance = Math.abs(itemCenter - column.center);

                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestMatch = item;
                    }
                }

                // Add the cell content
                processedRow.push(bestMatch ? bestMatch.str.trim() : '');
            }

            processedTable.rows.push(processedRow);
        }

        // Try to identify the header row (usually first row, sometimes has different styling)
        processedTable.headerRow = processedTable.rows[0];

        return processedTable;
    } catch (error) {
        console.error('Error processing table data:', error);
        return null;
    }
} 