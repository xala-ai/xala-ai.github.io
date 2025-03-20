<script lang="ts">
  import { writable } from 'svelte/store';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  
  // Local theme store
  const theme = writable('vice-city');
  
  // Initialize theme when component mounts
  onMount(() => {
    const savedTheme = localStorage.getItem('xalamander-theme');
    if (savedTheme) {
      theme.set(savedTheme);
    }
  });
  
  // Load and parse markdown
  let storyHtml = '';
  
  onMount(async () => {
    try {
      const response = await fetch('/story.md');
      const text = await response.text();
      // Since 'marked' might cause issues, let's use a simple markdown parser
      storyHtml = simpleMarkdown(text);
    } catch (error) {
      console.error('Error loading story:', error);
      // Fallback content
      storyHtml = `
        <h1>The Xalamander Story</h1>
        <p>In the world of information, there exists a fascinating amphibian known as the Xalamander...</p>
      `;
    }
  });
  
  // Simple markdown parser function
  function simpleMarkdown(text: string): string {
    // Replace headers
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Replace paragraphs (empty lines between text)
    text = text.replace(/\n\n(.*?)\n\n/gs, '\n\n<p>$1</p>\n\n');
    
    // Clean up empty p tags
    text = text.replace(/<p><\/p>/g, '');
    
    // If no paragraphs were added (e.g., at the end of the document)
    const paragraphs = text.split('\n');
    text = paragraphs.map((p: string) => {
      p = p.trim();
      if (p && !p.startsWith('<h') && !p.startsWith('<p') && !p.startsWith('<ul') && !p.startsWith('<li'))
        return `<p>${p}</p>`;
      return p;
    }).join('\n');
    
    return text;
  }
  
  // Computed class strings for conditional styling
  $: bgClass = $theme === 'vice-city' ? 'bg-vc-dark' : 
               $theme === 'light' ? 'bg-light-bg' : 
               'bg-exec-bg';
               
  $: cardBgClass = $theme === 'vice-city' ? 'bg-vc-dark bg-opacity-40 border-vc-pink border-opacity-20' : 
                   $theme === 'light' ? 'bg-white bg-opacity-30 border-vc-blue border-opacity-20' : 
                   'bg-exec-bg bg-opacity-50 border-exec-primary border-opacity-20';
                   
  $: accentColorClass = $theme === 'vice-city' ? 'text-vc-pink' : 
                        $theme === 'light' ? 'text-vc-blue' : 
                        'text-exec-primary';
                        
  $: dotColorClass = $theme === 'vice-city' ? 'bg-vc-blue' : 
                     $theme === 'light' ? 'bg-vc-pink' : 
                     'bg-exec-secondary';
                     
  $: gradientBgClass = $theme === 'vice-city' ? 'bg-vc-gradient' : 
                       $theme === 'light' ? 'bg-light-gradient' : 
                       'bg-exec-gradient';
</script>

<section class="relative overflow-hidden transition-all duration-700 pt-32 pb-24 {bgClass}">
  <!-- Abstract background patterns -->
  <div class="absolute inset-0 opacity-20">
    <div class="absolute top-0 right-0 w-3/4 h-3/4 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 {gradientBgClass}"></div>
    <div class="absolute bottom-0 left-0 w-3/4 h-3/4 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 {gradientBgClass}"></div>
  </div>

  <div class="container mx-auto px-4 relative z-10">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-light mb-6">
        <span class="bg-clip-text text-transparent font-semibold {gradientBgClass}">
          Xalamander
        </span>
        <span class="text-theme"> by Xala AI</span>
      </h1>
      <p class="text-xl max-w-3xl mx-auto text-theme opacity-80">
        Where text meets visualization to create perfect information harmony
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <!-- Illustration side -->
      <div class="relative">
        <div class="aspect-square rounded-3xl overflow-hidden p-8 backdrop-blur-md border {cardBgClass}">
          <div class="relative h-full w-full flex items-center justify-center">
            <!-- Animated salamander illustration -->
            <div class="absolute inset-0 flex items-center justify-center">
              <Icon 
                icon="game-icons:lizard-tongue" 
                class="text-[12rem] animate-pulse-slow {accentColorClass}" 
              />
            </div>
            
            <!-- Data orbit animation -->
            <div class="absolute w-full h-full animate-spin-slow" style="animation-duration: 20s;">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full {dotColorClass}"></div>
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full {dotColorClass}"></div>
              <div class="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full {dotColorClass}"></div>
              <div class="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full {dotColorClass}"></div>
            </div>
            
            <!-- Text particles -->
            <div class="absolute inset-0">
              {#each Array(15) as _, i}
                <div class="absolute text-xs opacity-50 animate-pulse-slow {accentColorClass}"
                  style="top: {Math.random() * 100}%; left: {Math.random() * 100}%; animation-delay: {Math.random() * 2}s">
                  {['data', 'text', 'viz', 'info', 'insight'][Math.floor(Math.random() * 5)]}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Content side -->
      <div class="prose prose-lg max-w-none"
        class:prose-invert={$theme === 'vice-city'}
        class:text-theme={true}>
        <div class="rounded-3xl p-8 backdrop-blur-md border h-full overflow-auto {cardBgClass}">
          <div class="prose-headings:text-theme prose-p:text-theme">
            {@html storyHtml}
          </div>
            
          <!-- Call to action -->
          <div class="mt-8 flex justify-center">
            <button class="px-6 py-3 rounded-full text-white shadow-lg flex items-center space-x-2 transition-transform duration-300 hover:scale-105 {gradientBgClass}">
              <span>Try Xalamander Now</span>
              <Icon icon="material-symbols:arrow-forward-rounded" class="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section> 