<script lang="ts">
  import { onMount } from 'svelte';
  import FileUpload from './components/FileUpload.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import Hero from './components/Hero.svelte';
  import ThemeController from './components/ThemeController.svelte';
  import { writable } from 'svelte/store';

  // Create a local theme store in case the import doesn't work
  const theme = writable('vice-city');
  
  // Subscribe to theme changes from ThemeController if available
  onMount(() => {
    if (ThemeController.theme) {
      const unsub = ThemeController.theme.subscribe(value => {
        theme.set(value);
      });
      return unsub;
    }
  });

  let fileData: ArrayBuffer | null = null;
  let isLoading = false;
  let hasData = false;
  let showUploadSection = false;

  function handleFileUpload(event: CustomEvent<ArrayBuffer>) {
    isLoading = true;
    fileData = event.detail;
    
    // Simulate processing time
    setTimeout(() => {
      isLoading = false;
      hasData = true;
    }, 1500);
  }

  function toggleUploadSection() {
    showUploadSection = !showUploadSection;
  }
  
  // Initialize theme
  onMount(() => {
    const savedTheme = localStorage.getItem('xalamander-theme');
    if (savedTheme) {
      document.body.classList.add(`theme-${savedTheme}`);
      theme.set(savedTheme);
    } else {
      document.body.classList.add('theme-vice-city');
      theme.set('vice-city');
    }
  });
  
  // Computed class strings for conditional styling
  $: bgClass = $theme === 'vice-city' ? 'bg-vc-dark/90' : 
               $theme === 'light' ? 'bg-white/90' : 
               'bg-exec-bg/90';
               
  $: borderClass = $theme === 'vice-city' ? 'border-vc-pink/20' : 
                   $theme === 'light' ? 'border-vc-blue/20' : 
                   'border-exec-primary/20';
                   
  $: accentClass = $theme === 'vice-city' ? 'bg-vc-pink' : 
                   $theme === 'light' ? 'bg-vc-blue' : 
                   'bg-exec-primary';
                   
  $: gradientClass = $theme === 'vice-city' ? 'bg-vc-gradient' : 
                     $theme === 'light' ? 'bg-light-gradient' : 
                     'bg-exec-gradient';
</script>

<main class="min-h-screen flex flex-col transition-colors duration-500"
  class:bg-vc-dark={$theme === 'vice-city'}
  class:bg-light-bg={$theme === 'light'}
  class:bg-exec-bg={$theme === 'executive'}>
  <Header />
  
  {#if !hasData}
    <!-- Landing page with hero section -->
    <Hero />
    
    <!-- File upload section (hidden by default, shown when user clicks upload button) -->
    {#if showUploadSection}
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-2xl mx-auto">
          <div class="rounded-xl p-8 shadow-lg border backdrop-blur-md {bgClass} {borderClass}">
            <h2 class="text-2xl font-light mb-6 text-theme">
              <span class="font-semibold">Upload</span> your document
            </h2>
            <p class="text-theme opacity-70 mb-8">
              Upload a PDF document and let our AI create a beautifully crafted executive summary
              with data visualizations that highlight key insights.
            </p>
            
            <FileUpload on:fileUploaded={handleFileUpload} />
            
            {#if isLoading}
              <div class="mt-8 flex flex-col items-center">
                <div class="w-16 h-16 relative">
                  <div class="absolute inset-0 rounded-full animate-ping opacity-20 {accentClass}"></div>
                  <div class="absolute inset-2 rounded-full animate-spin border-2 border-transparent" 
                    style="border-top-color: {$theme === 'vice-city' ? 'var(--primary-color)' : 
                                             $theme === 'light' ? 'var(--secondary-color)' : 
                                             'var(--exec-primary)'};">
                  </div>
                </div>
                <p class="mt-4 text-theme opacity-70">Processing your document...</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {:else if fileData}
    <!-- Dashboard view when document is processed -->
    <Dashboard data={fileData} />
  {/if}
  
  <Footer />
  
  <!-- Fixed upload button -->
  {#if !hasData && !showUploadSection}
    <button 
      on:click={toggleUploadSection}
      class="fixed bottom-8 right-8 px-6 py-3 rounded-full shadow-lg text-white flex items-center space-x-2 transition-transform duration-300 hover:scale-105 z-50 {gradientClass}">
      <span>Upload Document</span>
      <span class="ml-2">↑</span>
    </button>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
  }
</style>
