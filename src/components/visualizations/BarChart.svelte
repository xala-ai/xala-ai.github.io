<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data: { category: string; value: number }[];
  
  let chartElement: HTMLDivElement;
  
  onMount(() => {
    if (!chartElement || !data || data.length === 0) return;
    
    // Clear any existing chart
    d3.select(chartElement).selectAll('*').remove();
    
    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    const width = chartElement.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartElement)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, width])
      .padding(0.3);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height, 0]);
    
    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '12px');
    
    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));
    
    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.category) || 0)
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', '#3b82f6')
        .on('mouseover', function() {
          d3.select(this).attr('fill', '#60a5fa');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', '#3b82f6');
        });
    
    // Add bar values
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
        .attr('class', 'label')
        .attr('x', d => (x(d.category) || 0) + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(d => d.value);
  });
</script>

<div bind:this={chartElement} class="w-full h-[300px]"></div> 