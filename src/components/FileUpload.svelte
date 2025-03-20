<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    fileUploaded: ArrayBuffer;
  }>();

  let fileInput: HTMLInputElement;
  let dragActive = false;
  let selectedFile: File | null = null;
  let error = '';

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      processFile(input.files[0]);
    }
  }

  function handleDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragActive = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragActive = false;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragActive = true;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragActive = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
    }
  }

  function processFile(file: File) {
    error = '';
    
    if (file.type !== 'application/pdf') {
      error = 'Please upload a PDF file';
      selectedFile = null;
      return;
    }
    
    selectedFile = file;
  }

  function handleUpload() {
    if (!selectedFile) {
      error = 'Please select a file first';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        dispatch('fileUploaded', e.target.result as ArrayBuffer);
      }
    };
    reader.onerror = () => {
      error = 'Error reading file';
    };
    reader.readAsArrayBuffer(selectedFile);
  }
</script>

<div 
  class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors {dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}"
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:dragover={handleDragOver}
  on:drop={handleDrop}
  on:click={() => fileInput.click()}
>
  <input 
    type="file" 
    bind:this={fileInput}
    on:change={handleFileChange} 
    accept=".pdf"
    class="hidden" 
  />
  
  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
  </svg>
  
  {#if selectedFile}
    <p class="mt-2 text-sm font-medium text-gray-900">{selectedFile.name}</p>
    <p class="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
  {:else}
    <p class="mt-2 text-sm font-medium text-gray-900">Drop your PDF file here, or click to browse</p>
    <p class="text-xs text-gray-500">PDF files only (max 10MB)</p>
  {/if}
  
  {#if error}
    <p class="mt-2 text-sm text-red-600">{error}</p>
  {/if}
</div>

{#if selectedFile}
  <div class="mt-4 flex justify-center">
    <button 
      class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
      on:click={handleUpload}
    >
      Process Document
    </button>
  </div>
{/if} 