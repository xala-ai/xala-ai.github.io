<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data: { label: string; value: number }[];
  
  let chartElement: HTMLDivElement;
  
  onMount(() => {
    if (!chartElement || !data || data.length === 0) return;
    
    // Clear any existing chart
    d3.select(chartElement).selectAll('*').remove();
    
    // Set dimensions
    const width = chartElement.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    
    // Create SVG
    const svg = d3.select(chartElement)
      .append('svg')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(d3.schemeBlues[Math.max(9, data.length)]);
    
    // Compute the position of each group on the pie
    const pie = d3.pie<{ label: string; value: number }>()
      .sort(null)
      .value(d => d.value);
    
    const arcData = pie(data);
    
    // Build the pie chart
    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius * 0.8);
    
    // Build the outer arc for labels
    const outerArc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
    
    // Add the arcs
    svg.selectAll('allSlices')
      .data(arcData)
      .enter()
      .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label) as string)
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)
        .on('mouseover', function() {
          d3.select(this).style('opacity', 1);
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 0.7);
        });
    
    // Add labels
    svg.selectAll('allLabels')
      .data(arcData)
      .enter()
      .append('text')
        .text(d => `${d.data.label} (${d.data.value})`)
        .attr('transform', d => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style('text-anchor', d => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midAngle < Math.PI ? 'start' : 'end';
        })
        .style('font-size', '12px');
    
    // Add lines connecting slices to labels
    svg.selectAll('allPolylines')
      .data(arcData)
      .enter()
      .append('polyline')
        .attr('points', d => {
          const posA = arc.centroid(d);
          const posB = outerArc.centroid(d);
          const posC = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          return [posA, posB, posC].map(p => p.join(',')).join(' ');
        })
        .style('fill', 'none')
        .style('stroke', 'grey')
        .style('stroke-width', '1px');
  });
</script>

<div bind:this={chartElement} class="w-full h-[300px]"></div> 