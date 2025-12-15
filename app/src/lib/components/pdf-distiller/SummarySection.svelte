<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'

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

  type VisualizationType = 'wordcloud' | 'entityChart' | 'pieChart' | 'table'

  type Visualization = {
    type: VisualizationType
    title: string
    description: string
    data: any
    svgContent?: string
  }

  export let extractedData: ExtractedData
  export let visualizations: Visualization[]

  let executiveSummary = ''
  let pdfTitle = ''
  let pdfDate = ''
  let keyInsights: string[] = []
  let dataGaps: string[] = []
  let selectedTab = 'summary' // summary, details, export
  let isAiGenerated = false

  const dispatch = createEventDispatcher<{
    summaryCreated: {
      title: string
      summary: string
      insights: string[]
      date: string
      dataGaps: string[]
      isAiGenerated: boolean
    }
  }>()

  onMount(() => {
    processExtractedData()
  })

  function processExtractedData() {
    // Extract title from metadata or use a default
    pdfTitle = extractedData.metadata?.Title || extractedData.metadata?.title || 'Document Analysis'

    // Extract or create date information
    const dateObj = new Date()
    pdfDate =
      extractedData.metadata?.CreationDate ||
      extractedData.metadata?.creationDate ||
      `Analysis generated on ${dateObj.toLocaleDateString()}`

    // Use the AI-generated or extracted summary if available
    if (extractedData.summary && extractedData.summary.summary) {
      executiveSummary = extractedData.summary.summary
      keyInsights = extractedData.summary.insights || []
      dataGaps = extractedData.summary.dataGaps || []
      isAiGenerated = extractedData.usedClaude || false
    } else {
      // Fallback to generating a basic summary
      generateBasicSummary()
    }

    // Dispatch the summary event
    dispatch('summaryCreated', {
      title: pdfTitle,
      summary: executiveSummary,
      insights: keyInsights,
      date: pdfDate,
      dataGaps,
      isAiGenerated
    })
  }

  function generateBasicSummary() {
    // Extract the first few paragraphs
    const paragraphs = extractedData.text.split('\n\n').filter(p => p.trim().length > 20)
    executiveSummary = paragraphs.slice(0, 3).join('\n\n')

    // Basic insights from metadata and content
    keyInsights = []

    // Add metadata insights
    if (extractedData.metadata && extractedData.metadata.Title) {
      keyInsights.push(`The document is titled "${extractedData.metadata.Title}".`)
    }

    // Add content insights
    if (extractedData.tables && extractedData.tables.length > 0) {
      keyInsights.push(`The document contains ${extractedData.tables.length} tables.`)
    }

    if (extractedData.structure && extractedData.structure.headings && extractedData.structure.headings.length > 0) {
      keyInsights.push(`The document contains ${extractedData.structure.headings.length} sections.`)
    }

    // Add data gaps
    dataGaps = ['AI-based content analysis was unavailable.']
  }

  function saveAsPDF() {
    alert('PDF export functionality would be implemented here')
    // In a real implementation, we would:
    // 1. Use libraries like jsPDF to generate a PDF document
    // 2. Add the summary, insights, and visualizations
    // 3. Let the user download it
  }

  function saveAsHTML() {
    alert('HTML export functionality would be implemented here')
    // In a real implementation, we would:
    // 1. Generate an HTML representation of the summary
    // 2. Let the user download it as an HTML file
  }

  function copyToClipboard() {
    const summaryText = `${pdfTitle}
    
${pdfDate}

Executive Summary:
${executiveSummary}

Key Insights:
${keyInsights.map(insight => `- ${insight}`).join('\n')}

${dataGaps.length > 0 ? `Data Gaps:\n${dataGaps.map(gap => `- ${gap}`).join('\n')}` : ''}`

    navigator.clipboard
      .writeText(summaryText)
      .then(() => {
        alert('Summary copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy summary: ', err)
        alert('Failed to copy summary to clipboard')
      })
  }
</script>

<div class="w-full max-w-4xl mx-auto">
  <div class="bg-base-200 p-6 rounded-lg">
    <div class="mb-6">
      <div class="flex justify-between items-end">
        <h1 class="text-2xl font-bold">{pdfTitle}</h1>
        {#if isAiGenerated}
          <div class="badge badge-primary">AI Enhanced</div>
        {/if}
      </div>
      <p class="text-sm text-base-content/70 mt-1">{pdfDate}</p>
    </div>

    <div class="tabs tabs-boxed mb-6">
      <button class="tab {selectedTab === 'summary' ? 'tab-active' : ''}" on:click={() => (selectedTab = 'summary')}>
        Executive Summary
      </button>
      <button class="tab {selectedTab === 'details' ? 'tab-active' : ''}" on:click={() => (selectedTab = 'details')}>
        Details & Visualizations
      </button>
      <button class="tab {selectedTab === 'export' ? 'tab-active' : ''}" on:click={() => (selectedTab = 'export')}>
        Export
      </button>
    </div>

    <!-- Executive Summary Tab -->
    {#if selectedTab === 'summary'}
      <div class="summary-section">
        <div class="bg-base-100 p-6 rounded-lg mb-6">
          <h2 class="text-xl font-semibold mb-4">Executive Summary</h2>
          <div class="prose max-w-none">
            <p>{executiveSummary}</p>
          </div>
        </div>

        <div class="bg-base-100 p-6 rounded-lg mb-6">
          <h2 class="text-xl font-semibold mb-4">Key Insights</h2>
          <ul class="list-disc pl-6 space-y-2">
            {#each keyInsights as insight}
              <li>{insight}</li>
            {/each}
          </ul>
        </div>

        {#if dataGaps.length > 0}
          <div class="bg-base-100 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Data Gaps</h2>
            <ul class="list-disc pl-6 space-y-2">
              {#each dataGaps as gap}
                <li>{gap}</li>
              {/each}
            </ul>
            <p class="mt-4 text-sm text-base-content/70">
              These represent areas where additional information or data would improve the analysis.
            </p>
          </div>
        {/if}
      </div>

      <!-- Details Tab -->
    {:else if selectedTab === 'details'}
      <div class="details-section space-y-6">
        <!-- Keywords Section -->
        {#if extractedData.keywords && extractedData.keywords.length > 0}
          <div class="bg-base-100 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Keywords</h2>
            <div class="flex flex-wrap gap-2">
              {#each extractedData.keywords as keyword}
                <span class="badge badge-lg">{keyword}</span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Visualizations -->
        {#if visualizations && visualizations.length > 0}
          <div class="bg-base-100 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Visualizations</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each visualizations as viz}
                <div class="border rounded-lg p-4">
                  <h3 class="font-medium mb-2">{viz.title}</h3>
                  <p class="text-sm text-base-content/70 mb-2">{viz.description}</p>
                  <!-- Placeholder for visualization preview -->
                  <div class="aspect-[4/3] bg-base-200 rounded flex items-center justify-center">
                    <p class="text-sm text-base-content/50">Visualization Preview</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Document Structure -->
        {#if extractedData.structure && extractedData.structure.headings && extractedData.structure.headings.length > 0}
          <div class="bg-base-100 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-4">Document Structure</h2>
            <ul class="list-disc pl-6">
              {#each extractedData.structure.headings as heading}
                <li class="mb-2">
                  <span class="font-medium">{heading.text}</span>
                  <span class="text-sm text-base-content/70">(Page {heading.pageNum})</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Metadata -->
        <div class="bg-base-100 p-6 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Document Metadata</h2>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <tbody>
                {#each Object.entries(extractedData.metadata || {}) as [key, value]}
                  <tr>
                    <td class="font-medium">{key}</td>
                    <td>{value}</td>
                  </tr>
                {/each}

                <!-- Fallback for empty metadata -->
                {#if !extractedData.metadata || Object.keys(extractedData.metadata).length === 0}
                  <tr>
                    <td colspan="2" class="text-center">No metadata available</td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Export Tab -->
    {:else if selectedTab === 'export'}
      <div class="export-section">
        <div class="bg-base-100 p-6 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Export Options</h2>
          <div class="space-y-4">
            <div class="flex gap-4">
              <button class="btn btn-primary" on:click={saveAsPDF}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save as PDF
              </button>

              <button class="btn btn-outline" on:click={saveAsHTML}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Save as HTML
              </button>

              <button class="btn btn-outline" on:click={copyToClipboard}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </button>
            </div>

            <div class="bg-base-300 p-4 rounded-lg">
              <h3 class="font-medium mb-2">Preview</h3>
              <div class="preview-container border border-base-content/10 rounded-lg p-4 bg-white text-black">
                <h1 class="text-xl font-bold">{pdfTitle}</h1>
                <p class="text-sm text-black/70 mb-4">{pdfDate}</p>

                <h2 class="text-lg font-semibold mb-2">Executive Summary</h2>
                <p class="mb-4">
                  {executiveSummary.length > 150 ? executiveSummary.substring(0, 150) + '...' : executiveSummary}
                </p>

                <h2 class="text-lg font-semibold mb-2">Key Insights</h2>
                <ul class="list-disc pl-6">
                  {#each keyInsights.slice(0, 3) as insight}
                    <li>{insight}</li>
                  {/each}
                  {#if keyInsights.length > 3}
                    <li>...</li>
                  {/if}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
