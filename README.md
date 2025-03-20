# Xalamander - AI-Driven Data Visualization & Information Distillation

Xalamander is a powerful web application that uses AI to transform complex documents into beautifully crafted executive summaries with insightful data visualizations.

## Features

- **PDF Document Processing**: Upload any PDF document to extract and analyze its content
- **AI-Driven Analysis**: Automatically extracts key information, identifies data points, and distills core insights
- **Beautiful Visualizations**: Presents data using interactive charts and graphs powered by D3.js
- **Executive Summaries**: Creates concise summaries that highlight the most important information
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: Svelte with TypeScript
- **Styling**: TailwindCSS for responsive design
- **Visualizations**: D3.js for interactive data visualizations
- **PDF Processing**: pdf-parse for extracting text from PDFs
- **Build Tool**: Vite for fast development and optimized production builds
- **Deployment**: GitHub repositories served through Netlify

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/xalamander.git
   cd xalamander
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Build for production
   ```bash
   pnpm build
   ```

## Usage

1. Navigate to the application in your browser
2. Upload a PDF document using the file uploader
3. Wait for the AI to process and analyze the document
4. Explore the generated summary, key metrics, and visualizations
5. Export or share the results as needed

## Project Structure

```
xalamander/
├── src/
│   ├── components/         # UI components
│   │   ├── visualizations/ # D3.js visualization components
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Static assets
│   ├── App.svelte          # Main application component
│   └── main.ts             # Application entry point
├── public/                 # Public static files
└── index.html              # HTML entry point
```

## Development Roadmap

- Enhance PDF text extraction with more advanced algorithms
- Add support for additional document formats (Word, Excel, etc.)
- Implement user accounts and saved analyses
- Add collaborative features for team-based document analysis
- Expand visualization options with more chart types and customization

## License

MIT

## Acknowledgments

- D3.js for the amazing visualization library
- Svelte team for the reactive UI framework
- TailwindCSS for the utility-first CSS framework
