<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { browser } from '$app/environment'
  import { processPDFInBrowser } from '$lib/client/pdf-client-processor.js'
  import { generateClientSummary, generateLocalSummary } from '$lib/client/claude-client-api.js'

  // Only import PDF libraries in browser context
  let pdfjsLib
  let parsePdf

  // Define types
  type ExtractedData = {
    text: string
    tables: any[]
    metadata: any
    keywords: string[]
    entities: any[]
    structure: {
      headings: any[]
      sections: any[]
    }
    summary: {
      summary: string
      insights: string[]
      visualizationSuggestions: any[]
      dataGaps: string[]
    }
    pages: any[]
    images: any[]
    usedClaude?: boolean
  }

  type PDFData = {
    buffer: ArrayBuffer
    name: string
    size: number
    type: string
  }

  export let pdfData: PDFData
  export let claudeApiKey: string = ''

  let progress = 0
  let currentStep = 'initializing'
  let processingError: string | null = null
  let isClient = true // For browser-only mode, always true

  const dispatch = createEventDispatcher<{
    processingComplete: ExtractedData
  }>()

  onMount(async () => {
    if (browser) {
      try {
        // Skip server-side processing attempt to avoid errors
        await processDocumentInBrowser()
      } catch (error) {
        processingError = `Error processing document: ${error instanceof Error ? error.message : String(error)}`
        console.error('PDF processing error:', error)
      }
    }
  })

  async function processDocumentInBrowser() {
    isClient = true
    // Step 1: Initialize
    currentStep = 'initializing'
    progress = 5

    // Step 2: Process PDF using client-side libraries
    currentStep = 'extracting'
    progress = 20

    try {
      // Process the PDF in the browser
      const extractedData = await processPDFInBrowser(pdfData.buffer)
      progress = 60

      // Step 3: Generate summary
      currentStep = 'analyzing'
      progress = 70

      // Try to use Claude API if key is provided, otherwise use local summary generation
      let usedClaude = false

      if (claudeApiKey) {
        try {
          // Generate summary using Claude API
          const summaryData = await generateClientSummary(extractedData, claudeApiKey)
          extractedData.summary = summaryData
          usedClaude = true
        } catch (error) {
          console.warn('Claude API unavailable, using local summary generation:', error)
          extractedData.summary = generateLocalSummary(extractedData)
        }
      } else {
        // Use local summary generation
        extractedData.summary = generateLocalSummary(extractedData)
      }

      extractedData.usedClaude = usedClaude

      // Step 4: Finalize
      currentStep = 'finalizing'
      progress = 90

      // Complete processing
      progress = 100

      // Dispatch the event with the extracted data
      setTimeout(() => {
        dispatch('processingComplete', extractedData as ExtractedData)
      }, 500) // Small delay for UI smoothness
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Helper functions for extraction
  async function extractTables(text: string) {
    // In a real app, this would use a more sophisticated algorithm
    // For now, we'll just identify potential tables based on patterns
    const tablePattern = /\|(.+)\|/g
    const potentialTables = []

    const lines = text.split('\n')
    let currentTable = []
    let inTable = false

    for (const line of lines) {
      if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) {
          inTable = true
          currentTable = []
        }

        // Extract cells from the table row
        const cells = line
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell !== '')

        if (cells.length > 0) {
          currentTable.push(cells)
        }
      } else if (inTable) {
        // End of table
        inTable = false
        if (currentTable.length > 1) {
          // At least a header and one row
          potentialTables.push(currentTable)
        }
        currentTable = []
      }
    }

    // Add any remaining table
    if (inTable && currentTable.length > 1) {
      potentialTables.push(currentTable)
    }

    return potentialTables
  }

  async function extractKeywords(text: string) {
    // Simple keyword extraction based on word frequency
    // In a real app, this would use NLP libraries
    const words = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)

    const stopWords = new Set([
      'a',
      'an',
      'the',
      'and',
      'or',
      'but',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'to',
      'of',
      'for',
      'with',
      'by',
      'about',
      'against',
      'between',
      'into',
      'through',
      'during',
      'before',
      'after',
      'above',
      'below',
      'from',
      'up',
      'down',
      'in',
      'out',
      'on',
      'off',
      'over',
      'under',
      'again',
      'further',
      'then',
      'once',
      'here',
      'there',
      'when',
      'where',
      'why',
      'how',
      'all',
      'any',
      'both',
      'each',
      'few',
      'more',
      'most',
      'other',
      'some',
      'such',
      'no',
      'nor',
      'not',
      'only',
      'own',
      'same',
      'so',
      'than',
      'too',
      'very',
      's',
      't',
      'can',
      'will',
      'just',
      'don',
      'should',
      'now'
    ])

    const wordFreq = {}

    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    }

    // Sort by frequency and take top 20
    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(entry => entry[0])

    return keywords
  }

  async function extractEntities(text: string) {
    // Simplified entity extraction
    // In a real app, this would use a named entity recognition (NER) model
    const entities = []

    // Basic patterns for some entity types
    const patterns = [
      { type: 'date', regex: /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g },
      { type: 'percentage', regex: /\b\d+(\.\d+)?%\b/g },
      { type: 'money', regex: /\$\d+(\.\d+)?(\ ?(million|billion|thousand))?/gi },
      { type: 'email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
      { type: 'url', regex: /https?:\/\/[^\s]+/g }
    ]

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern.regex)]

      for (const match of matches) {
        entities.push({
          type: pattern.type,
          value: match[0],
          position: match.index
        })
      }
    }

    return entities
  }

  async function generateSummary(text: string) {
    // Simple summary by extracting first few paragraphs
    // In a real app, this would use a summarization model or API
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)

    let summary = ''
    let wordCount = 0
    const targetWordCount = 250

    for (const paragraph of paragraphs) {
      const words = paragraph.split(/\s+/)

      if (wordCount + words.length <= targetWordCount) {
        summary += paragraph + '\n\n'
        wordCount += words.length
      } else {
        const remainingWords = targetWordCount - wordCount
        if (remainingWords > 10) {
          // Only add if we can get a meaningful chunk
          summary += words.slice(0, remainingWords).join(' ') + '...'
        }
        break
      }

      if (wordCount >= targetWordCount) {
        break
      }
    }

    return summary.trim()
  }
</script>

<div class="w-full max-w-2xl mx-auto">
  <div class="bg-base-200 p-6 rounded-lg">
    <h2 class="text-xl font-semibold mb-6">Processing Document: {pdfData.name}</h2>

    {#if processingError}
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{processingError}</span>
      </div>
    {:else}
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <span class="capitalize">{currentStep}</span>
          <span class="text-sm">{progress}%</span>
        </div>

        <progress class="progress progress-primary w-full" value={progress} max="100"></progress>

        <div class="flex justify-between items-center">
          <div class="text-sm text-base-content/70 mt-2">
            {#if currentStep === 'initializing'}
              Setting up PDF processing engine...
            {:else if currentStep === 'extracting'}
              Extracting text and data from document...
            {:else if currentStep === 'analyzing'}
              Analyzing document structure and generating insights...
            {:else if currentStep === 'finalizing'}
              Preparing visualization data and summary...
            {/if}
          </div>

          <div class="badge badge-sm badge-outline">Browser Processing</div>
        </div>
      </div>
    {/if}
  </div>
</div>
