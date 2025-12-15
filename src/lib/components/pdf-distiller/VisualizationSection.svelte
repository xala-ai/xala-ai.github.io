<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import * as d3 from 'd3'
  import PieChartViz from './PieChartViz.svelte'

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

  interface WordCloudItem {
    text: string
    size: number
  }

  interface EntityCount {
    type: string
    count: number
  }

  export let extractedData: ExtractedData

  let visualizations: Visualization[] = []
  let selectedVisualization: Visualization | null = null
  let wordcloudSvg: SVGSVGElement
  let entityChartSvg: SVGSVGElement
  let tablePreview: HTMLDivElement

  const dispatch = createEventDispatcher<{
    visualizationsCreated: Visualization[]
  }>()

  onMount(async () => {
    // Check if we already have visualizations from parent component
    if (extractedData && extractedData.summary && extractedData.summary.visualizationSuggestions) {
      await generateVisualizations()
    } else {
      // Use the old method
      await generateVisualizations()
    }

    // Dispatch event with visualizations
    dispatch('visualizationsCreated', visualizations)

    // Set the first visualization as selected
    if (visualizations.length > 0) {
      selectedVisualization = visualizations[0]
      renderSelectedVisualization()
    }
  })

  async function generateVisualizations() {
    // Add visualizations based on available data

    // 1. Word Cloud based on keywords
    if (extractedData.keywords && extractedData.keywords.length > 0) {
      visualizations.push({
        type: 'wordcloud',
        title: 'Key Terms',
        description: 'Most frequently occurring terms in the document',
        data: prepareWordCloudData(extractedData.keywords)
      })
    }

    // 2. Entity Chart based on extracted entities
    if (extractedData.entities && extractedData.entities.length > 0) {
      const entityData = prepareEntityChartData(extractedData.entities)

      // Add bar chart
      visualizations.push({
        type: 'entityChart',
        title: 'Entity Distribution',
        description: 'Types of entities found in the document',
        data: entityData
      })

      // Add pie chart
      visualizations.push({
        type: 'pieChart',
        title: 'Entity Breakdown',
        description: 'Proportional breakdown of entity types',
        data: entityData
      })
    }

    // 3. Table Visualization
    if (extractedData.tables && extractedData.tables.length > 0) {
      visualizations.push({
        type: 'table',
        title: 'Table Data',
        description: 'Tables extracted from the document',
        data: extractedData.tables[0].rows // Just showing the first table for simplicity
      })
    }

    // Force a UI update
    visualizations = [...visualizations]
  }

  function prepareWordCloudData(keywords: string[]): WordCloudItem[] {
    // For simplicity, we'll use the keyword list directly
    // In a real app, we would include frequency data
    const data = keywords.map((keyword, index) => {
      return {
        text: keyword,
        size: 30 - index * 0.8 // Size decreases with index
      }
    })

    return data
  }

  function prepareEntityChartData(entities: any[]): EntityCount[] {
    // Group entities by type and count
    const entityCounts: Record<string, number> = {}

    for (const entity of entities) {
      if (!entityCounts[entity.type]) {
        entityCounts[entity.type] = 0
      }
      entityCounts[entity.type]++
    }

    // Convert to array for D3
    const data = Object.entries(entityCounts).map(([type, count]) => {
      return { type, count }
    })

    return data
  }

  function selectVisualization(viz: Visualization) {
    selectedVisualization = viz
    renderSelectedVisualization()
  }

  function renderSelectedVisualization() {
    if (!selectedVisualization) return

    // Clear previous visualizations
    if (wordcloudSvg) d3.select(wordcloudSvg).selectAll('*').remove()
    if (entityChartSvg) d3.select(entityChartSvg).selectAll('*').remove()
    if (tablePreview) tablePreview.innerHTML = ''

    // Render based on visualization type
    switch (selectedVisualization.type) {
      case 'wordcloud':
        renderWordCloud()
        break
      case 'entityChart':
        renderEntityChart()
        break
      case 'pieChart':
        // Rendered by the PieChartViz component
        break
      case 'table':
        renderTablePreview()
        break
    }
  }

  function renderWordCloud() {
    if (!wordcloudSvg || !selectedVisualization) return

    const svg = d3.select(wordcloudSvg)
    const width = wordcloudSvg.clientWidth
    const height = 400

    // Clear previous content
    svg.selectAll('*').remove()

    const data = selectedVisualization.data as WordCloudItem[]

    // Create a simple word cloud layout
    // Place words in the center with varying font sizes

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

    // Add each word
    const fontScale = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.size) || 0, d3.max(data, d => d.size) || 30])
      .range([12, 40])

    // Create a spiral arrangement
    const wordAngles: Record<string, number> = {}
    const placeWord = (d: WordCloudItem, i: number) => {
      // Calculate angle based on index
      const angle = (i % 12) * ((Math.PI * 2) / 12)
      // Calculate distance from center based on index
      const distance = 5 + Math.floor(i / 12) * 45
      wordAngles[d.text] = angle

      return `translate(${Math.cos(angle) * distance},${Math.sin(angle) * distance})`
    }

    g.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', (d: WordCloudItem) => `${fontScale(d.size)}px`)
      .style('fill', (_d: WordCloudItem, i: number) => d3.schemeCategory10[i % 10])
      .style('font-family', 'Impact')
      .attr('text-anchor', 'middle')
      .attr('transform', placeWord)
      .text((d: WordCloudItem) => d.text)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay((_d: WordCloudItem, i: number) => i * 50)
      .style('opacity', 1)
  }

  function renderEntityChart() {
    if (!entityChartSvg || !selectedVisualization) return

    const svg = d3.select(entityChartSvg)
    const width = entityChartSvg.clientWidth
    const height = 400
    const margin = { top: 30, right: 30, bottom: 60, left: 60 }

    // Clear previous content
    svg.selectAll('*').remove()

    const data = selectedVisualization.data as EntityCount[]

    // Create X and Y scales
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.type))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .nice()
      .range([height - margin.bottom, margin.top])

    // Create and add bars
    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d: EntityCount) => x(d.type) || 0)
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (_d: EntityCount, i: number) => d3.schemeCategory10[i % 10])
      .transition()
      .duration(800)
      .delay((_d: EntityCount, i: number) => i * 100)
      .attr('y', (d: EntityCount) => y(d.count))
      .attr('height', (d: EntityCount) => height - margin.bottom - y(d.count))

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')

    // Add Y axis
    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y))

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Entity Distribution')
  }

  function renderTablePreview() {
    if (!tablePreview || !selectedVisualization) return

    const data = selectedVisualization.data

    if (!data || data.length === 0) {
      tablePreview.innerHTML = '<p class="text-center py-4">No table data available</p>'
      return
    }

    // Create HTML table from data
    let tableHtml = '<div class="overflow-x-auto"><table class="table table-zebra w-full">'

    // Add header row
    tableHtml += '<thead><tr>'
    for (const cell of data[0]) {
      tableHtml += `<th>${cell}</th>`
    }
    tableHtml += '</tr></thead>'

    // Add body rows
    tableHtml += '<tbody>'
    for (let i = 1; i < data.length; i++) {
      tableHtml += '<tr>'
      for (const cell of data[i]) {
        tableHtml += `<td>${cell}</td>`
      }
      tableHtml += '</tr>'
    }
    tableHtml += '</tbody></table></div>'

    tablePreview.innerHTML = tableHtml
  }
</script>

<div class="w-full max-w-4xl mx-auto">
  <div class="bg-base-200 p-6 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Visualize Data</h2>
    <p class="mb-6 text-base-content/70">Select a visualization to view and customize it.</p>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Visualization selector -->
      <div class="md:w-1/4">
        <h3 class="font-medium mb-3">Available Visualizations</h3>

        <div class="flex flex-col gap-2">
          {#each visualizations as viz, i}
            <button
              class="btn btn-sm {selectedVisualization === viz ? 'btn-primary' : 'btn-ghost'} justify-start"
              on:click={() => selectVisualization(viz)}>
              {viz.title}
            </button>
          {/each}
        </div>

        <div class="divider my-4"></div>

        <button class="btn btn-outline btn-sm w-full" on:click={() => dispatch('visualizationsCreated', visualizations)}>
          Continue to Summary
        </button>
      </div>

      <!-- Visualization display area -->
      <div class="md:w-3/4 bg-base-100 p-4 rounded-lg">
        {#if selectedVisualization}
          <div class="mb-4">
            <h3 class="text-lg font-semibold">{selectedVisualization.title}</h3>
            <p class="text-sm text-base-content/70">{selectedVisualization.description}</p>
          </div>

          <div class="visualization-container h-[400px]">
            {#if selectedVisualization.type === 'wordcloud'}
              <svg bind:this={wordcloudSvg} width="100%" height="400" class="visualization"></svg>
            {:else if selectedVisualization.type === 'entityChart'}
              <svg bind:this={entityChartSvg} width="100%" height="400" class="visualization"></svg>
            {:else if selectedVisualization.type === 'pieChart'}
              <PieChartViz data={selectedVisualization.data} title={selectedVisualization.title} />
            {:else if selectedVisualization.type === 'table'}
              <div bind:this={tablePreview} class="h-full overflow-auto"></div>
            {/if}
          </div>

          <div class="mt-4 flex justify-end">
            <button class="btn btn-sm btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        {:else}
          <div class="flex flex-col items-center justify-center h-full text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Select a visualization from the sidebar</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
