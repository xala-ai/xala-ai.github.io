<script lang="ts">
  export let metrics: {
    dataPoints: number;
    pagesAnalyzed: number;
    topicsIdentified: number;
    confidence: number;
  };
</script>

<div>
  <h3 class="text-lg font-medium text-gray-900 mb-6">Document Analysis Metrics</h3>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <div class="text-center">
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Data Points</h4>
        <p class="mt-2 text-3xl font-extrabold text-gray-900">{metrics.dataPoints}</p>
        <p class="mt-1 text-sm text-gray-500">Extracted from document</p>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <div class="text-center">
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Pages Analyzed</h4>
        <p class="mt-2 text-3xl font-extrabold text-gray-900">{metrics.pagesAnalyzed}</p>
        <p class="mt-1 text-sm text-gray-500">Total document length</p>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <div class="text-center">
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Topics Identified</h4>
        <p class="mt-2 text-3xl font-extrabold text-gray-900">{metrics.topicsIdentified}</p>
        <p class="mt-1 text-sm text-gray-500">Key themes in document</p>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <div class="text-center">
        <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Confidence</h4>
        <p class="mt-2 text-3xl font-extrabold text-gray-900">{Math.round(metrics.confidence * 100)}%</p>
        <p class="mt-1 text-sm text-gray-500">Analysis accuracy</p>
      </div>
    </div>
  </div>
</div> 