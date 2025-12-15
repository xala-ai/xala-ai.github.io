<script lang="ts">
  import { onMount } from 'svelte'
  import UploadSection from '$lib/components/pdf-distiller/UploadSection.svelte'
  import ProcessingSection from '$lib/components/pdf-distiller/ProcessingSection.svelte'
  import VisualizationSection from '$lib/components/pdf-distiller/VisualizationSection.svelte'
  import SummarySection from '$lib/components/pdf-distiller/SummarySection.svelte'

  type PDFData = {
    buffer: ArrayBuffer
    name: string
    size: number
    type: string
  }

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

  type Visualization = {
    type: string
    title: string
    description: string
    data: any
  }

  let currentStep = 'upload' // upload, processing, visualization, summary
  let pdfData: PDFData | null = null
  let extractedData: ExtractedData | null = null
  let visualizations: Visualization[] = []
  let summary: any = null
  let claudeApiKey: string = ''
  let showClaudeSettings: boolean = false

  // Load Claude API key from localStorage if available
  onMount(() => {
    if (typeof localStorage !== 'undefined') {
      const savedApiKey = localStorage.getItem('claude_api_key')
      if (savedApiKey) {
        claudeApiKey = savedApiKey
      }
    }
  })

  function handleFileUploaded(event: CustomEvent<PDFData>) {
    pdfData = event.detail
    currentStep = 'processing'
  }

  function handleProcessingComplete(event: CustomEvent<ExtractedData>) {
    extractedData = event.detail

    // Store Claude API key if used successfully
    if (extractedData.usedClaude && claudeApiKey && typeof localStorage !== 'undefined') {
      localStorage.setItem('claude_api_key', claudeApiKey)
    }

    // Prepare visualizations from extracted data
    prepareVisualizations()

    currentStep = 'visualization'
  }

  function prepareVisualizations() {
    visualizations = []

    if (!extractedData) return

    // Extract suggested visualizations from Claude/local summary
    if (extractedData.summary && extractedData.summary.visualizationSuggestions) {
      extractedData.summary.visualizationSuggestions.forEach(suggestion => {
        const vizType = suggestion.type.toLowerCase()

        if (vizType.includes('bar') || vizType.includes('column')) {
          // Add bar chart
          addBarChartVisualization(suggestion)
        } else if (vizType.includes('pie') || vizType.includes('donut')) {
          // Add pie chart
          addPieChartVisualization(suggestion)
        } else if (vizType.includes('table')) {
          // Add table visualization
          addTableVisualization(suggestion)
        } else if (vizType.includes('word') || vizType.includes('cloud')) {
          // Add word cloud
          addWordCloudVisualization(suggestion)
        } else if (vizType.includes('line') || vizType.includes('trend')) {
          // Add line chart
          addLineChartVisualization(suggestion)
        }
      })
    }

    // Ensure we have at least some basic visualizations
    addDefaultVisualizations()
  }

  function addBarChartVisualization(suggestion: any) {
    if (!extractedData) return

    let data = []

    // Generate data based on what's available
    if (extractedData.entities && extractedData.entities.length > 0) {
      // Group entities by type and count
      const entityCounts: Record<string, number> = {}
      extractedData.entities.forEach(entity => {
        entityCounts[entity.type] = (entityCounts[entity.type] || 0) + 1
      })

      // Convert to array for D3
      data = Object.entries(entityCounts).map(([type, count]) => {
        return { type, count }
      })

      visualizations.push({
        type: 'entityChart',
        title: suggestion.description || 'Entity Distribution',
        description: 'Types of entities found in the document',
        data
      })
    }
  }

  function addPieChartVisualization(suggestion: any) {
    if (!extractedData) return

    // Similar to bar chart, but for pie chart visualization
    let data = []

    // Generate data based on what's available
    if (extractedData.entities && extractedData.entities.length > 0) {
      // Group entities by type and count
      const entityCounts: Record<string, number> = {}
      extractedData.entities.forEach(entity => {
        entityCounts[entity.type] = (entityCounts[entity.type] || 0) + 1
      })

      // Convert to array for D3
      data = Object.entries(entityCounts).map(([type, count]) => {
        return { type, count }
      })

      visualizations.push({
        type: 'pieChart',
        title: suggestion.description || 'Entity Distribution',
        description: 'Proportional breakdown of entity types',
        data
      })
    }
  }

  function addTableVisualization(suggestion: any) {
    if (!extractedData) return

    // Table visualization
    if (extractedData.tables && extractedData.tables.length > 0) {
      const table = extractedData.tables[0] // Just show the first table for simplicity

      visualizations.push({
        type: 'table',
        title: suggestion.description || 'Table Data',
        description: 'Tables extracted from the document',
        data: table.rows || table
      })
    }
  }

  function addWordCloudVisualization(suggestion: any) {
    if (!extractedData) return

    // Word cloud based on keywords
    if (extractedData.keywords && extractedData.keywords.length > 0) {
      const data = extractedData.keywords.map((keyword: string, index: number) => {
        return {
          text: keyword,
          size: 30 - index * 0.8 // Size decreases with index
        }
      })

      visualizations.push({
        type: 'wordcloud',
        title: suggestion.description || 'Key Terms',
        description: 'Most frequently occurring terms in the document',
        data
      })
    }
  }

  function addLineChartVisualization(suggestion: any) {
    // Line chart visualization - only add if appropriate data exists
    // This would typically be time-series data or sequential data
    // In a real implementation, we would need to extract this type of data from the document
    // For now, we'll skip this if there's no suitable data
  }

  function addDefaultVisualizations() {
    if (!extractedData) return

    // Add a default word cloud if we don't have any visualizations yet
    if (visualizations.length === 0 && extractedData.keywords && extractedData.keywords.length > 0) {
      addWordCloudVisualization({ type: 'wordcloud', description: 'Key Terms' })
    }

    // Add a default entity chart if we have entities but no chart
    if (!visualizations.some(v => v.type === 'entityChart') && extractedData.entities && extractedData.entities.length > 0) {
      addBarChartVisualization({ type: 'bar chart', description: 'Entity Distribution' })
    }

    // Add a default table if we have tables but no table viz
    if (!visualizations.some(v => v.type === 'table') && extractedData.tables && extractedData.tables.length > 0) {
      addTableVisualization({ type: 'table', description: 'Table Data' })
    }
  }

  function handleVisualizationsCreated(event: CustomEvent<Visualization[]>) {
    visualizations = event.detail
    currentStep = 'summary'
  }

  function handleSummaryCreated(event: CustomEvent<any>) {
    summary = event.detail
  }

  function resetProcess() {
    pdfData = null
    extractedData = null
    visualizations = []
    summary = null
    currentStep = 'upload'
  }

  function toggleClaudeSettings() {
    showClaudeSettings = !showClaudeSettings
  }

  function handleApiKeyChange(event: Event) {
    claudeApiKey = (event.target as HTMLInputElement).value
  }
</script>

<svelte:head>
  <title>PDF Distiller - Information Visualization App</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <div class="flex items-center">
      <img src="/images/pdf-distiller-icon.svg" alt="PDF Distiller" class="h-10 w-auto mr-3" />
      <h1 class="text-3xl font-bold">PDF Distiller</h1>
    </div>

    <!-- Claude API Settings button -->
    <button class="btn btn-ghost btn-sm" on:click={toggleClaudeSettings}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Settings
    </button>
  </div>

  <p class="mb-8">Upload a PDF document to extract insights, create visualizations, and generate an executive summary.</p>

  <!-- Claude API Settings -->
  {#if showClaudeSettings}
    <div class="bg-base-200 p-4 rounded-lg mb-8 animate-fadeIn">
      <h2 class="text-lg font-semibold mb-2">AI Settings</h2>
      <div class="form-control">
        <label class="label" for="claude-api-key">
          <span class="label-text">Claude API Key</span>
        </label>
        <div class="flex gap-2">
          <input
            id="claude-api-key"
            type="password"
            placeholder="Enter your Claude API key"
            class="input input-bordered flex-1"
            value={claudeApiKey}
            on:input={handleApiKeyChange} />
          <div class="tooltip" data-tip="The API key is stored locally in your browser">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-base-content/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <label class="label" for="claude-api-key">
          <span class="label-text-alt">
            With a Claude API key, you'll get enhanced summaries and visualization suggestions.
          </span>
        </label>
      </div>
    </div>
  {/if}

  <div class="steps steps-vertical lg:steps-horizontal w-full mb-8">
    <div
      class="step {currentStep === 'upload' ||
      currentStep === 'processing' ||
      currentStep === 'visualization' ||
      currentStep === 'summary'
        ? 'step-primary'
        : ''}">
      Upload
    </div>
    <div
      class="step {currentStep === 'processing' || currentStep === 'visualization' || currentStep === 'summary'
        ? 'step-primary'
        : ''}">
      Process
    </div>
    <div class="step {currentStep === 'visualization' || currentStep === 'summary' ? 'step-primary' : ''}">Visualize</div>
    <div class="step {currentStep === 'summary' ? 'step-primary' : ''}">Summary</div>
  </div>

  {#if currentStep === 'upload'}
    <UploadSection on:fileUploaded={handleFileUploaded} />
  {:else if currentStep === 'processing' && pdfData}
    <ProcessingSection {pdfData} {claudeApiKey} on:processingComplete={handleProcessingComplete} />
  {:else if currentStep === 'visualization' && extractedData}
    <VisualizationSection {extractedData} on:visualizationsCreated={handleVisualizationsCreated} />
  {:else if currentStep === 'summary' && extractedData}
    <SummarySection {extractedData} {visualizations} on:summaryCreated={handleSummaryCreated} />
  {:else}
    <div class="alert alert-warning">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>Something went wrong with the document processing. Please try again.</span>
    </div>
  {/if}

  {#if currentStep !== 'upload'}
    <div class="mt-8">
      <button class="btn btn-outline" on:click={resetProcess}>Start Over</button>
    </div>
  {/if}
</div>

<style>
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
