# PDF Distiller

A modern web application for distilling complex PDF documents into executive summaries with beautiful data visualizations.

## Features

- **AI-Powered PDF Processing**: Extract text, tables, images, and structure from PDF documents
- **Advanced Data Visualization**: Auto-generate appropriate visualizations using D3.js
- **Smart Summarization**: Generate concise executive summaries using Claude AI
- **Context Enhancement**: Identify data gaps and suggest additional information
- **Export Options**: Share or save summaries in various formats

## Technology Stack

- **Frontend**: Svelte + TypeScript + TailwindCSS + DaisyUI
- **Visualization**: D3.js
- **PDF Processing**: pdf.js + pdf-parse + custom extraction algorithms
- **AI Integration**: Claude API (Anthropic)
- **Deployment**: Netlify from GitHub

## Getting Started

### Prerequisites

- Node.js (v14+)
- pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file with your Claude API key:
   ```
   CLAUDE_API_KEY=your_api_key_here
   ```
   (You can also enter this in the application UI)

4. Start the development server:
   ```bash
   pnpm dev
   ```

## How to Use

1. **Upload**: Drag and drop a PDF file or select one from your device
2. **Process**: The system will automatically extract text, tables, and other data
3. **Visualize**: Review and customize generated visualizations
4. **Summarize**: Get an AI-generated executive summary with key insights

## PDF Processing Features

- **Text Extraction**: Full text content with formatting preserved
- **Table Detection**: Automatically identifies and extracts tabular data
- **Structure Analysis**: Identifies headings, sections, and document structure
- **Entity Recognition**: Detects dates, amounts, percentages, and other entities
- **Image Extraction**: Pulls out images from the PDF (where possible)

## Visualization Types

The application automatically suggests appropriate visualizations based on the content:

- **Bar Charts**: For comparing categories or showing distributions
- **Pie Charts**: For showing proportions and percentages
- **Word Clouds**: For highlighting key terms and concepts
- **Tables**: For structured data presentation
- **Line Charts**: For time series or trend data (where applicable)

## API Integration

The application uses Claude AI to generate intelligent summaries and insights. The integration:

1. Extracts key information from the PDF
2. Sends relevant content to Claude API
3. Parses the response to generate summaries and visualization suggestions
4. Falls back to local processing if API is unavailable

## Project Structure

- `/src/lib/components/pdf-distiller` - UI components
- `/src/lib/server` - Server-side PDF processing and API integration
- `/src/routes/api/process-pdf` - API endpoint for PDF processing
- `/src/routes/pdf-distiller` - Main application page

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE). 