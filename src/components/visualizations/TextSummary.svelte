<script lang="ts">
  export let summary: string;
  export let keyPoints: string[];
</script>

<div>
  <h3 class="text-lg font-medium text-gray-900 mb-4">Executive Summary</h3>
  
  <div class="prose max-w-none mb-6">
    <p class="text-gray-700">{summary}</p>
  </div>
  
  <h4 class="text-md font-medium text-gray-800 mb-3">Key Points</h4>
  <ul class="space-y-2">
    {#each keyPoints as point}
      <li class="flex items-start">
        <svg class="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-gray-700">{point}</span>
      </li>
    {/each}
  </ul>
</div> 