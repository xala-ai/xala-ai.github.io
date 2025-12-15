<script lang="ts">
  import { onMount } from 'svelte'

  let isLoaded = false
  let activeSection: string = 'intro'

  onMount(() => {
    // Set theme to xalamander-vice if browser available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'xalamander-vice')
      document.documentElement.setAttribute('data-theme', 'xalamander-vice')
    }

    // Animation delay for content
    setTimeout(() => {
      isLoaded = true
    }, 300)
  })

  function setActiveSection(section: string): void {
    activeSection = section
  }
</script>

<svelte:head>
  <title>Xalamander | Information Distillation by Xala AI</title>
  <meta
    name="description"
    content="Transform complex documents into beautiful, data-rich visualizations and executive summaries with Xalamander by Xala AI." />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Hero Section -->
  <header class="gradient-animated relative overflow-hidden pt-20 pb-32 px-4 md:px-8">
    <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-20"></div>

    <div class="container mx-auto relative z-10 slide-up">
      <nav class="flex justify-between items-center mb-16">
        <div class="flex items-center">
          <img src="/images/xala-logo.svg" alt="Xala AI Logo" class="h-10 w-auto mr-2" />
          <h1 class="text-2xl font-light gradient-text">XALAMANDER</h1>
        </div>

        <div class="flex items-center gap-4">
          <a href="/pdf-distiller" class="btn btn-gradient btn-sm">Try PDF Distiller</a>
          <a href="#about" class="btn btn-ghost btn-sm">About</a>
        </div>
      </nav>

      <div class="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div class="md:w-1/2 text-center md:text-left">
          <div class="mb-6 float-element">
            <h2 class="text-5xl md:text-7xl font-extralight mb-4">
              <span class="gradient-text font-bold">Where Text Meets</span>
              <span class="neon-text block">Visualization</span>
            </h2>
            <p class="text-xl opacity-80 mb-8">
              Transform complex documents into beautiful, data-rich visualizations and executive summaries.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="/pdf-distiller" class="btn btn-gradient btn-lg">
              <i class="bx bx-file-find mr-2"></i>
              Try PDF Distiller
            </a>
            <a href="#story" class="btn btn-outline btn-lg">
              <i class="bx bx-book-open mr-2"></i>
              Our Story
            </a>
          </div>
        </div>

        <div class="md:w-1/2 relative">
          <div class="w-full h-full rounded-xl overflow-hidden gradient-border relative float-element">
            <img src="/images/salamander-hero.webp" alt="Xalamander Visualization" class="w-full h-auto rounded-xl" />
            <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div class="absolute bottom-4 left-4">
              <span class="badge badge-secondary">AI-Powered</span>
              <span class="badge badge-primary ml-2">Beautiful Visuals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Story Section -->
  <section id="story" class="py-20 px-4 md:px-8 bg-base-100">
    <div class="container mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-light mb-4">
          The <span class="gradient-text font-bold">Salamander Story</span>
        </h2>
        <p class="max-w-3xl mx-auto opacity-70">
          Why text and visuals need to work as one, just like the amphibious salamander thrives in both water and land.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button
          class="card-gradient p-8 rounded-xl {activeSection === 'intro' ? 'ring-2 ring-primary' : ''}"
          on:click={() => setActiveSection('intro')}>
          <div class="flex items-center gap-4 mb-4">
            <i class="bx bx-water text-4xl text-primary"></i>
            <h3 class="text-xl font-bold">The Amphibian Dilemma</h3>
          </div>
          <p class="opacity-70">
            Just as a salamander cannot thrive in water or land alone, information cannot be fully understood with only text or
            only visuals.
          </p>
        </button>

        <button
          class="card-gradient p-8 rounded-xl {activeSection === 'challenge' ? 'ring-2 ring-primary' : ''}"
          on:click={() => setActiveSection('challenge')}>
          <div class="flex items-center gap-4 mb-4">
            <i class="bx bx-book-content text-4xl text-primary"></i>
            <h3 class="text-xl font-bold">The Text Problem</h3>
          </div>
          <p class="opacity-70">
            Text alone can be dense, monotonous, and difficult to digest, causing important details to be lost in the noise.
          </p>
        </button>

        <button
          class="card-gradient p-8 rounded-xl {activeSection === 'solution' ? 'ring-2 ring-primary' : ''}"
          on:click={() => setActiveSection('solution')}>
          <div class="flex items-center gap-4 mb-4">
            <i class="bx bx-line-chart text-4xl text-primary"></i>
            <h3 class="text-xl font-bold">The Visual Gap</h3>
          </div>
          <p class="opacity-70">
            Visuals by themselves can lack context, depth, and the narrative structure needed for true comprehension.
          </p>
        </button>
      </div>

      <div class="mt-12 card-gradient rounded-xl p-8 slide-up">
        {#if activeSection === 'intro'}
          <div class="flex flex-col md:flex-row gap-8 items-center">
            <div class="md:w-1/2">
              <h3 class="text-2xl font-bold mb-4 gradient-text">Living in Two Worlds</h3>
              <p class="mb-4">
                The salamander is a remarkable creature that lives a dual existence - thriving both in water and on land.
                Neither fully aquatic nor fully terrestrial, it masters both environments through adaptation.
              </p>
              <p>
                In the same way, modern information consumption requires a dual approach. We need the depth and detail of text
                combined with the immediate impact and pattern recognition of visual elements.
              </p>
            </div>
            <div class="md:w-1/2">
              <img src="/images/salamander-both-worlds.webp" alt="Salamander in dual environments" class="rounded-xl w-full" />
            </div>
          </div>
        {:else if activeSection === 'challenge'}
          <div class="flex flex-col md:flex-row gap-8 items-center">
            <div class="md:w-1/2">
              <h3 class="text-2xl font-bold mb-4 gradient-text">The Limitations of Text</h3>
              <p class="mb-4">
                When a salamander is restricted to only water, it cannot fully express its capabilities. Similarly, text-only
                information has significant limitations:
              </p>
              <ul class="list-disc pl-5 space-y-2">
                <li>Cognitive overload from dense paragraphs</li>
                <li>Difficulty identifying patterns and relationships</li>
                <li>Time-consuming to extract key insights</li>
                <li>Challenge of conveying complex data efficiently</li>
              </ul>
            </div>
            <div class="md:w-1/2">
              <img src="/images/text-only-docs.webp" alt="Dense text documents" class="rounded-xl w-full" />
            </div>
          </div>
        {:else if activeSection === 'solution'}
          <div class="flex flex-col md:flex-row gap-8 items-center">
            <div class="md:w-1/2">
              <h3 class="text-2xl font-bold mb-4 gradient-text">The Synergy of Text and Visuals</h3>
              <p class="mb-4">
                Just as the salamander needs both water and land to flourish, Xalamander creates the perfect ecosystem where
                text and visuals work together:
              </p>
              <ul class="list-disc pl-5 space-y-2">
                <li>Concise, contextual text provides the narrative</li>
                <li>Beautiful data visualizations highlight patterns</li>
                <li>Interactive elements for deeper exploration</li>
                <li>AI-powered insights that connect the dots</li>
              </ul>
              <p class="mt-4">This perfect blend allows for rapid understanding and deep insights - the best of both worlds.</p>
            </div>
            <div class="md:w-1/2">
              <img src="/images/xalamander-blend.webp" alt="Xalamander's blend of text and visuals" class="rounded-xl w-full" />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-20 px-4 md:px-8 bg-gradient-to-b from-base-200 to-base-100">
    <div class="container mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-light mb-4">
          Xalamander <span class="gradient-text font-bold">Features</span>
        </h2>
        <p class="max-w-3xl mx-auto opacity-70">
          Powerful tools to transform your complex documents into digestible, visually stunning insights.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="card-gradient p-8 rounded-xl slide-up" style="animation-delay: 100ms;">
          <i class="bx bx-file-find text-5xl gradient-text mb-4"></i>
          <h3 class="text-xl font-bold mb-2">PDF Document Analysis</h3>
          <p class="opacity-70">Extract text, tables, and structure from any PDF document with powerful AI-driven analysis.</p>
        </div>

        <div class="card-gradient p-8 rounded-xl slide-up" style="animation-delay: 200ms;">
          <i class="bx bx-line-chart text-5xl gradient-text mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Beautiful Visualizations</h3>
          <p class="opacity-70">
            Transform data into stunning charts, graphs, and visual representations that illuminate patterns.
          </p>
        </div>

        <div class="card-gradient p-8 rounded-xl slide-up" style="animation-delay: 300ms;">
          <i class="bx bx-brain text-5xl gradient-text mb-4"></i>
          <h3 class="text-xl font-bold mb-2">AI-Powered Summaries</h3>
          <p class="opacity-70">
            Generate concise executive summaries that capture the essence and key insights of any document.
          </p>
        </div>

        <div class="card-gradient p-8 rounded-xl slide-up" style="animation-delay: 400ms;">
          <i class="bx bx-table text-5xl gradient-text mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Table Extraction</h3>
          <p class="opacity-70">Automatically detect and extract tables from documents, preserving their structure and data.</p>
        </div>

        <div class="card-gradient p-8 rounded-xl slide-up" style="animation-delay: 500ms;">
          <i class="bx bx-search-alt text-5xl gradient-text mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Entity Recognition</h3>
          <p class="opacity-70">Identify key entities like dates, amounts, percentages, and more for deeper analysis.</p>
        </div>

        <div class="card-gradient p-8 rounded-xl slide-up" style="animation-delay: 600ms;">
          <i class="bx bx-export text-5xl gradient-text mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Export & Share</h3>
          <p class="opacity-70">Easily export your summaries and visualizations to share with colleagues and stakeholders.</p>
        </div>
      </div>

      <div class="text-center mt-12">
        <a href="/pdf-distiller" class="btn btn-gradient btn-lg">
          <i class="bx bx-rocket mr-2"></i>
          Try Xalamander Now
        </a>
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="py-20 px-4 md:px-8 gradient-animated relative">
    <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-10"></div>

    <div class="container mx-auto relative z-10">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-4xl font-light mb-6">
          Ready to <span class="neon-text font-bold">Transform</span>
          Your Documents?
        </h2>
        <p class="mb-8 text-lg opacity-80">
          Experience the power of Xalamander's information distillation. Upload your first PDF and see the magic happen.
        </p>

        <a href="/pdf-distiller" class="btn btn-gradient btn-lg px-8">
          <i class="bx bx-file-find mr-2"></i>
          Start Distilling
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-base-300 py-10 px-4 md:px-8">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-6 md:mb-0">
          <img src="/images/xala-logo.svg" alt="Xala AI Logo" class="h-8 w-auto mr-2" />
          <span class="text-xl font-light gradient-text">XALAMANDER</span>
        </div>

        <div class="flex flex-col md:flex-row gap-4 md:gap-8">
          <a href="/pdf-distiller" class="link link-hover">PDF Distiller</a>
          <a href="#story" class="link link-hover">Our Story</a>
          <a href="#" class="link link-hover">About Xala AI</a>
          <a href="#" class="link link-hover">Contact</a>
        </div>

        <div class="mt-6 md:mt-0">
          <div class="flex gap-4">
            <a href="#" class="btn btn-circle btn-ghost">
              <i class="bx bxl-twitter text-xl"></i>
            </a>
            <a href="#" class="btn btn-circle btn-ghost">
              <i class="bx bxl-linkedin text-xl"></i>
            </a>
            <a href="#" class="btn btn-circle btn-ghost">
              <i class="bx bxl-github text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="divider my-6"></div>

      <div class="text-center text-sm opacity-60">
        <p>© 2023 Xala AI. All rights reserved. Xalamander is a product of Xala AI.</p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Add custom styles for this page */
  :global(body) {
    overflow-x: hidden;
  }

  .slide-up {
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.6s ease forwards;
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Apply animations with different delays for children */
  .slide-up:nth-child(2) {
    animation-delay: 200ms;
  }
  .slide-up:nth-child(3) {
    animation-delay: 300ms;
  }
  .slide-up:nth-child(4) {
    animation-delay: 400ms;
  }
  .slide-up:nth-child(5) {
    animation-delay: 500ms;
  }
  .slide-up:nth-child(6) {
    animation-delay: 600ms;
  }
</style>
