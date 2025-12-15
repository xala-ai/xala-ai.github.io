<script lang="ts">
  import { onMount } from 'svelte'
  import * as d3 from 'd3'

  interface DataItem {
    type: string
    count: number
  }

  export let data: DataItem[]
  export let title: string = 'Pie Chart'

  let svgElement: SVGSVGElement
  let width = 300
  let height = 300
  let legendWidth = 100

  onMount(() => {
    if (data && data.length > 0) {
      renderPieChart()
    }
  })

  function renderPieChart() {
    if (!svgElement) return

    const svg = d3.select(svgElement)
    svg.selectAll('*').remove()

    const radius = Math.min(width, height) / 2

    // Create group element for pie chart
    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // Pie layout
    const pie = d3
      .pie<DataItem>()
      .value(d => d.count)
      .sort(null)

    // Arc generator
    const arc = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(0)
      .outerRadius(radius * 0.8)

    // Arc for labels
    const labelArc = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.5)

    // Generate the pie chart
    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc')

    // Add segments
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(d.data.type))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', 1)
      })
      .on('mouseout', function (event, d) {
        d3.select(this).style('opacity', 0.8)
      })

    // Add labels for large segments
    arcs
      .filter(d => d.endAngle - d.startAngle > 0.25)
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white')
      .text(d => d.data.type)

    // Add legend
    const legend = svg.append('g').attr('transform', `translate(${width + 20}, 50)`)

    data.forEach((d, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 25})`)

      legendRow.append('rect').attr('width', 15).attr('height', 15).attr('fill', color(d.type))

      legendRow
        .append('text')
        .attr('x', 25)
        .attr('y', 12.5)
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .text(`${d.type} (${d.count})`)
    })
  }
</script>

<div class="pie-chart-container">
  <h3 class="text-lg font-semibold mb-3">{title}</h3>
  <div class="relative">
    <svg bind:this={svgElement} width={width + legendWidth} {height}></svg>
  </div>
</div>

<style>
  .pie-chart-container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }
</style>
