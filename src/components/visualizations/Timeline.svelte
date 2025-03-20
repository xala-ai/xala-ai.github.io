<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data: { date: string; value: number }[];
  
  let chartElement: HTMLDivElement;
  
  onMount(() => {
    if (!chartElement || !data || data.length === 0) return;
    
    // Clear any existing chart
    d3.select(chartElement).selectAll('*').remove();
    
    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
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
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height, 0]);
    
    // Add the x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
    
    // Add the y-axis
    svg.append('g')
      .call(d3.axisLeft(y));
    
    // Add a grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);
    
    // Create the line generator
    const line = d3.line<{ date: string; value: number }>()
      .x(d => (x(d.date) || 0) + x.bandwidth() / 2)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add the line path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Add circles for each data point
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => (x(d.date) || 0) + x.bandwidth() / 2)
        .attr('cy', d => y(d.value))
        .attr('r', 5)
        .attr('fill', '#60a5fa')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 7);
          
          svg.append('text')
            .attr('class', 'value-label')
            .attr('x', (x(d.date) || 0) + x.bandwidth() / 2)
            .attr('y', y(d.value) - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(d.value);
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 5);
          svg.selectAll('.value-label').remove();
        });
    
    // Add x-axis label
    svg.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Year');
    
    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Value');
  });
</script>

<div bind:this={chartElement} class="w-full h-[300px]"></div> 