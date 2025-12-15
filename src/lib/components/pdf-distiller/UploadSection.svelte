<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    fileUploaded: {
      buffer: ArrayBuffer
      name: string
      size: number
      type: string
    }
  }>()

  let fileInput: HTMLInputElement
  let isDragging = false
  let selectedFile: File | null = null
  let error: string | null = null
  let isLoading = false

  function handleFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files
    if (files && files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault()
    isDragging = true
  }

  function handleDragLeave(): void {
    isDragging = false
  }

  function handleDrop(event: DragEvent): void {
    event.preventDefault()
    isDragging = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  function validateAndSetFile(file: File): void {
    error = null

    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      error = 'Please upload a PDF file.'
      return
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      error = 'File size exceeds the 10MB limit.'
      return
    }

    selectedFile = file
  }

  async function uploadFile(): Promise<void> {
    if (!selectedFile) return

    isLoading = true

    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as ArrayBuffer)
        reader.onerror = reject
        if (selectedFile) {
          reader.readAsArrayBuffer(selectedFile)
        } else {
          reject(new Error('No file selected'))
        }
      })

      // Dispatch the file uploaded event with the ArrayBuffer and file metadata
      dispatch('fileUploaded', {
        buffer: arrayBuffer,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      })
    } catch (err) {
      error = 'Error reading the file. Please try again.'
      console.error('Error reading file:', err)
    } finally {
      isLoading = false
    }
  }

  function triggerFileInput(): void {
    fileInput.click()
  }
</script>

<div class="w-full max-w-2xl mx-auto">
  <div
    class="border-2 border-dashed rounded-lg p-10 text-center {isDragging ? 'border-primary bg-primary/5' : 'border-base-300'}"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}>
    <input type="file" accept="application/pdf" class="hidden" bind:this={fileInput} on:change={handleFileChange} />

    {#if !selectedFile}
      <div class="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-16 w-16 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold mb-2">Drag & Drop your PDF here</h3>
      <p class="mb-4 text-base-content/70">or</p>
      <button class="btn btn-primary" on:click={triggerFileInput}>Select PDF File</button>
      <p class="mt-2 text-sm text-base-content/70">Maximum file size: 10MB</p>

      <!-- Sample PDF resources -->
      <div class="mt-6 text-sm">
        <div class="dropdown dropdown-hover">
          <label tabindex="0" class="link link-primary cursor-pointer">Need a sample PDF?</label>
          <div tabindex="0" class="dropdown-content z-[1] card card-compact p-2 shadow bg-base-200 w-72 text-left">
            <div class="card-body">
              <h3 class="card-title text-sm">Sample PDFs</h3>
              <ul class="list-disc list-inside space-y-1">
                <li>
                  <a
                    href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link link-primary text-xs">
                    W3C Sample PDF
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link link-primary text-xs">
                    Adobe Sample PDF
                  </a>
                </li>
                <li>
                  <a href="/sample-pdf-instructions.txt" target="_blank" class="link link-primary text-xs">
                    PDF Creation Instructions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-success" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold mb-2">{selectedFile.name}</h3>
      <p class="text-base-content/70 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
      <div class="flex items-center justify-center gap-4">
        <button class="btn btn-outline btn-sm" on:click={triggerFileInput}>Change File</button>
        <button class="btn btn-primary" on:click={uploadFile} disabled={isLoading}>
          {#if isLoading}
            <span class="loading loading-spinner loading-sm mr-2"></span>
            Processing...
          {:else}
            Process PDF
          {/if}
        </button>
      </div>
    {/if}
  </div>

  {#if error}
    <div class="alert alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}
</div>
