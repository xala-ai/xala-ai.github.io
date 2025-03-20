<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  
  // Import our visualization components
  import TextSummary from './visualizations/TextSummary.svelte';
  import KeyMetrics from './visualizations/KeyMetrics.svelte';
  import BarChart from './visualizations/BarChart.svelte';
  import PieChart from './visualizations/PieChart.svelte';
  import Timeline from './visualizations/Timeline.svelte';

  export let data: ArrayBuffer;
  
  let pdfText = '';
  let extractedData: {
    title: string;
    summary: string;
    keyPoints: string[];
    metrics: {
      dataPoints: number;
      pagesAnalyzed: number;
      topicsIdentified: number;
      confidence: number;
    };
    barData: { category: string; value: number }[];
    pieData: { label: string; value: number }[];
    timelineData: { date: string; value: number }[];
  } | null = null;
  let processingComplete = false;
  let activeTab = 'summary';

  onMount(async () => {
    try {
      // We would normally use pdf.js directly, but for simplicity we'll use a wrapper
      const pdfParse = await import('pdf-parse');
      
      // Parse the PDF
      const pdfData = await pdfParse.default(new Uint8Array(data));
      pdfText = pdfData.text;
      
      // Mock data extraction and processing
      // In a real application, this would be done with AI/ML processing
      extractedData = {
        title: "Sample Report Analysis",
        summary: "This report discusses the impact of climate change on global economies, highlighting key trends in renewable energy adoption and policy changes across different regions.",
        keyPoints: [
          "Global temperatures have risen by 1.1°C since pre-industrial times",
          "Renewable energy capacity increased by 45% between 2015-2020",
          "Carbon pricing mechanisms are now implemented in 64 countries",
          "Climate-related financial disclosures have become mandatory in major economies"
        ],
        metrics: {
          dataPoints: 423,
          pagesAnalyzed: 24,
          topicsIdentified: 8,
          confidence: 0.89
        },
        barData: [
          { category: "North America", value: 45 },
          { category: "Europe", value: 72 },
          { category: "Asia", value: 53 },
          { category: "Africa", value: 14 },
          { category: "South America", value: 28 },
          { category: "Oceania", value: 19 }
        ],
        pieData: [
          { label: "Solar", value: 38 },
          { label: "Wind", value: 27 },
          { label: "Hydro", value: 21 },
          { label: "Biomass", value: 9 },
          { label: "Geothermal", value: 5 }
        ],
        timelineData: [
          { date: "2015", value: 100 },
          { date: "2016", value: 120 },
          { date: "2017", value: 135 },
          { date: "2018", value: 160 },
          { date: "2019", value: 185 },
          { date: "2020", value: 210 }
        ]
      };
      
      processingComplete = true;
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  });

  function setActiveTab(tab: string) {
    activeTab = tab;
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  {#if !processingComplete}
    <div class="p-8 flex justify-center items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="ml-4 text-gray-600">Analyzing document...</p>
    </div>
  {:else if extractedData}
    <!-- Dashboard header -->
    <div class="bg-primary-700 text-white p-6">
      <h2 class="text-2xl font-bold">{extractedData.title}</h2>
    </div>
    
    <!-- Tab navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex -mb-px">
        <button 
          class="px-6 py-3 border-b-2 font-medium text-sm {activeTab === 'summary' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          class="px-6 py-3 border-b-2 font-medium text-sm {activeTab === 'metrics' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('metrics')}
        >
          Key Metrics
        </button>
        <button 
          class="px-6 py-3 border-b-2 font-medium text-sm {activeTab === 'charts' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('charts')}
        >
          Visualizations
        </button>
        <button 
          class="px-6 py-3 border-b-2 font-medium text-sm {activeTab === 'timeline' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </nav>
    </div>
    
    <!-- Tab content -->
    <div class="p-6">
      {#if activeTab === 'summary'}
        <TextSummary 
          summary={extractedData.summary} 
          keyPoints={extractedData.keyPoints} 
        />
      {:else if activeTab === 'metrics'}
        <KeyMetrics metrics={extractedData.metrics} />
      {:else if activeTab === 'charts'}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Regional Adoption</h3>
            <BarChart data={extractedData.barData} />
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Energy Sources</h3>
            <PieChart data={extractedData.pieData} />
          </div>
        </div>
      {:else if activeTab === 'timeline'}
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Trend Analysis</h3>
          <Timeline data={extractedData.timelineData} />
        </div>
      {/if}
    </div>
    
    <!-- Export options -->
    <div class="bg-gray-50 px-6 py-4 flex justify-end">
      <button class="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
        Export PDF
      </button>
      <button class="ml-3 px-4 py-2 bg-primary-600 text-white rounded shadow-sm text-sm font-medium hover:bg-primary-700">
        Share
      </button>
    </div>
  {/if}
</div> 