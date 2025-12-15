<script>
  import { onMount } from 'svelte'

  let isLoaded = false

  // Use Miami Vice theme
  onMount(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'xalamander-vice')
      document.documentElement.setAttribute('data-theme', 'xalamander-vice')
    }

    setTimeout(() => {
      isLoaded = true
      drawFlowchart()
    }, 300)
  })

  function drawFlowchart() {
    if (typeof window === 'undefined') return

    const svg = document.getElementById('process-flowchart')
    if (!svg) return

    // SVG is already populated in the markup
    // This function could be used for animations or dynamic updates
  }
</script>

<svelte:head>
  <title>Process Flowchart | Xalamander</title>
  <meta name="description" content="Understand the PDF distillation process with an interactive flowchart visualization." />
</svelte:head>

<div class="relative min-h-screen">
  <div class="absolute top-0 left-0 w-full h-full bg-[url('/images/decorative-pattern.svg')] opacity-10 pointer-events-none">
  </div>

  <div class="container mx-auto px-4 py-12 relative z-10">
    <h1 class="text-4xl font-light mb-8 text-center flex justify-center items-center gap-4">
      <img src="/images/salamander-icon.svg" alt="Salamander Icon" class="h-12 w-auto" />
      <span class="gradient-text font-bold">Xalamander</span>
      Process
    </h1>

    <p class="max-w-3xl mx-auto text-center mb-10 opacity-80">
      Our distillation process transforms complex documents into clear, actionable insights through a multi-stage approach.
      Follow the flowchart below to understand each step of the journey.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-4 mb-4">
          <i class="bx bx-bulb text-4xl gradient-text"></i>
          <h2 class="text-2xl font-light">
            Why <span class="gradient-text font-bold">Distillation?</span>
          </h2>
        </div>
        <p class="mb-4">
          Just as a salamander navigates between water and land, Xalamander moves between text and visualization to create the
          perfect information environment.
        </p>
        <p>
          Our automated process extracts the essential elements from complex documents and transforms them into digestible,
          visually-engaging content that highlights the most important insights.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-4 mb-4">
          <i class="bx bx-brain text-4xl gradient-text"></i>
          <h2 class="text-2xl font-light">
            The <span class="gradient-text font-bold">Science</span>
          </h2>
        </div>
        <p class="mb-4">
          Cognitive science shows that humans process visual information 60,000 times faster than text. Yet context and
          narrative require textual explanation.
        </p>
        <p>
          Xalamander's process combines sophisticated AI extraction with data visualization best practices to create the optimal
          balance between text and visuals.
        </p>
      </div>
    </div>

    <!-- Data Flow Section -->
    <div class="card-gradient p-6 rounded-xl mb-16">
      <h2 class="text-2xl font-light mb-4 text-center">
        The <span class="gradient-text font-bold">Data Transformation</span>
        Flow
      </h2>
      <p class="text-center mb-6 opacity-80">
        This diagram shows how information flows through our system, from raw document input to refined visual output.
      </p>
      <div class="flex justify-center">
        <img src="/images/data-flow-diagram.svg" alt="Data Flow Diagram" class="w-full max-w-xl" />
      </div>
    </div>

    <!-- Flowchart Section -->
    <div class="card-gradient p-8 rounded-xl mb-16 overflow-hidden">
      <h2 class="text-3xl font-light mb-6 text-center">
        The <span class="gradient-text font-bold">Distillation</span>
        Process
      </h2>

      <div class="flowchart-container relative overflow-x-auto">
        <svg id="process-flowchart" class="w-full" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
          <!-- Main flow path -->
          <path d="M500,50 L500,550" stroke="url(#gradient-path)" stroke-width="10" stroke-dasharray="10,5" fill="none" />

          <!-- Left and right branches -->
          <path d="M500,100 L200,100 L200,200" stroke="url(#gradient-path)" stroke-width="4" fill="none" />
          <path d="M500,200 L800,200 L800,300" stroke="url(#gradient-path)" stroke-width="4" fill="none" />
          <path d="M500,300 L200,300 L200,400" stroke="url(#gradient-path)" stroke-width="4" fill="none" />
          <path d="M500,400 L800,400 L800,500" stroke="url(#gradient-path)" stroke-width="4" fill="none" />

          <!-- Reconnections to main path -->
          <path d="M200,200 L200,300" stroke="url(#gradient-path)" stroke-width="4" fill="none" />
          <path d="M800,300 L800,400" stroke="url(#gradient-path)" stroke-width="4" fill="none" />
          <path d="M200,400 L500,500" stroke="url(#gradient-path)" stroke-width="4" fill="none" />
          <path d="M800,500 L500,500" stroke="url(#gradient-path)" stroke-width="4" fill="none" />

          <!-- Gradients -->
          <defs>
            <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="hsl(326, 100%, 60%)" />
              <stop offset="100%" stop-color="hsl(187, 100%, 69%)" />
            </linearGradient>
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stop-color="hsl(326, 100%, 60%)" />
              <stop offset="100%" stop-color="hsl(187, 100%, 69%)" />
            </radialGradient>
          </defs>

          <!-- Nodes -->
          <!-- Upload -->
          <circle cx="500" cy="50" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="500" y="55" text-anchor="middle" fill="white" font-weight="bold">1</text>
          <foreignObject x="520" y="30" width="200" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Upload PDF</div>
          </foreignObject>

          <!-- Text Extraction -->
          <circle cx="200" cy="100" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="200" y="105" text-anchor="middle" fill="white" font-weight="bold">2</text>
          <foreignObject x="50" y="80" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Text Extraction</div>
          </foreignObject>

          <!-- Structure Analysis -->
          <circle cx="200" cy="200" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="200" y="205" text-anchor="middle" fill="white" font-weight="bold">3</text>
          <foreignObject x="50" y="180" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Structure Analysis</div>
          </foreignObject>

          <!-- Entity Recognition -->
          <circle cx="800" cy="200" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="800" y="205" text-anchor="middle" fill="white" font-weight="bold">4</text>
          <foreignObject x="850" y="180" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Entity Recognition</div>
          </foreignObject>

          <!-- Table Extraction -->
          <circle cx="800" cy="300" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="800" y="305" text-anchor="middle" fill="white" font-weight="bold">5</text>
          <foreignObject x="850" y="280" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Table Extraction</div>
          </foreignObject>

          <!-- AI Analysis -->
          <circle cx="200" cy="300" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="200" y="305" text-anchor="middle" fill="white" font-weight="bold">6</text>
          <foreignObject x="50" y="280" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">AI Analysis</div>
          </foreignObject>

          <!-- Visualization Creation -->
          <circle cx="200" cy="400" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="200" y="405" text-anchor="middle" fill="white" font-weight="bold">7</text>
          <foreignObject x="50" y="380" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Visualization Creation</div>
          </foreignObject>

          <!-- Summary Generation -->
          <circle cx="800" cy="400" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="800" y="405" text-anchor="middle" fill="white" font-weight="bold">8</text>
          <foreignObject x="850" y="380" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Summary Generation</div>
          </foreignObject>

          <!-- Insights Compilation -->
          <circle cx="800" cy="500" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="800" y="505" text-anchor="middle" fill="white" font-weight="bold">9</text>
          <foreignObject x="850" y="480" width="140" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Insights Compilation</div>
          </foreignObject>

          <!-- Final Output -->
          <circle cx="500" cy="550" r="40" fill="url(#node-gradient)" class="node-glow" />
          <text x="500" y="555" text-anchor="middle" fill="white" font-weight="bold">10</text>
          <foreignObject x="520" y="530" width="200" height="40">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-white font-bold">Interactive Report</div>
          </foreignObject>
        </svg>
      </div>
    </div>

    <!-- Process Explanations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            1
          </div>
          <h3 class="text-xl font-bold">Upload PDF</h3>
        </div>
        <p class="opacity-80">
          The journey begins when you upload your PDF document. Our system accepts files up to 50MB and processes them securely
          in your browser.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            2
          </div>
          <h3 class="text-xl font-bold">Text Extraction</h3>
        </div>
        <p class="opacity-80">
          Our PDF processing engine extracts all textual content while preserving formatting and structure, ensuring no
          information is lost.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            3
          </div>
          <h3 class="text-xl font-bold">Structure Analysis</h3>
        </div>
        <p class="opacity-80">
          We identify headings, sections, paragraphs, and organizational elements to understand the document's hierarchical
          structure.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            4
          </div>
          <h3 class="text-xl font-bold">Entity Recognition</h3>
        </div>
        <p class="opacity-80">
          Our algorithms detect important entities such as dates, names, organizations, amounts, percentages, and key terms.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            5
          </div>
          <h3 class="text-xl font-bold">Table Extraction</h3>
        </div>
        <p class="opacity-80">
          Tables containing valuable structured data are identified and extracted, preserving their rows, columns, and
          relationships.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            6
          </div>
          <h3 class="text-xl font-bold">AI Analysis</h3>
        </div>
        <p class="opacity-80">
          Claude AI (if enabled) analyzes the extracted content to identify key themes, insights, and relationships between
          concepts.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            7
          </div>
          <h3 class="text-xl font-bold">Visualization Creation</h3>
        </div>
        <p class="opacity-80">
          Based on the data extracted, we generate appropriate visualizations like bar charts, pie charts, and word clouds using
          D3.js.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            8
          </div>
          <h3 class="text-xl font-bold">Summary Generation</h3>
        </div>
        <p class="opacity-80">
          A concise executive summary is created that captures the essence of the document, highlighting key findings and
          takeaways.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            9
          </div>
          <h3 class="text-xl font-bold">Insights Compilation</h3>
        </div>
        <p class="opacity-80">
          We compile data gaps, actionable suggestions, and additional insights that might not be explicitly stated in the
          document.
        </p>
      </div>

      <div class="card-gradient p-6 rounded-xl">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            10
          </div>
          <h3 class="text-xl font-bold">Interactive Report</h3>
        </div>
        <p class="opacity-80">
          The final output is an interactive report combining text summaries and data visualizations that you can explore,
          share, or export.
        </p>
      </div>
    </div>

    <div class="mt-16 text-center">
      <a href="/pdf-distiller" class="btn btn-gradient btn-lg">
        <i class="bx bx-rocket mr-2"></i>
        Try It Yourself
      </a>
    </div>
  </div>
</div>

<style>
  .flowchart-container {
    min-height: 600px;
    overflow-x: auto;
  }

  .node-glow {
    filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.6));
  }

  @media (max-width: 768px) {
    #process-flowchart {
      min-width: 1000px;
    }
  }

  /* Animation for the SVG elements */
  #process-flowchart path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 3s ease-in-out forwards;
  }

  #process-flowchart circle {
    opacity: 0;
    animation: fadeIn 0.5s ease-in-out forwards;
  }

  #process-flowchart text,
  #process-flowchart foreignObject {
    opacity: 0;
    animation: fadeIn 0.5s ease-in-out forwards;
  }

  /* Apply sequential delays to elements */
  #process-flowchart circle:nth-child(5) {
    animation-delay: 0.5s;
  }
  #process-flowchart circle:nth-child(7) {
    animation-delay: 0.8s;
  }
  #process-flowchart circle:nth-child(9) {
    animation-delay: 1.1s;
  }
  #process-flowchart circle:nth-child(11) {
    animation-delay: 1.4s;
  }
  #process-flowchart circle:nth-child(13) {
    animation-delay: 1.7s;
  }
  #process-flowchart circle:nth-child(15) {
    animation-delay: 2s;
  }
  #process-flowchart circle:nth-child(17) {
    animation-delay: 2.3s;
  }
  #process-flowchart circle:nth-child(19) {
    animation-delay: 2.6s;
  }
  #process-flowchart circle:nth-child(21) {
    animation-delay: 2.9s;
  }
  #process-flowchart circle:nth-child(23) {
    animation-delay: 3.2s;
  }

  #process-flowchart text:nth-of-type(1),
  #process-flowchart foreignObject:nth-of-type(1) {
    animation-delay: 0.5s;
  }
  #process-flowchart text:nth-of-type(2),
  #process-flowchart foreignObject:nth-of-type(2) {
    animation-delay: 0.8s;
  }
  #process-flowchart text:nth-of-type(3),
  #process-flowchart foreignObject:nth-of-type(3) {
    animation-delay: 1.1s;
  }
  #process-flowchart text:nth-of-type(4),
  #process-flowchart foreignObject:nth-of-type(4) {
    animation-delay: 1.4s;
  }
  #process-flowchart text:nth-of-type(5),
  #process-flowchart foreignObject:nth-of-type(5) {
    animation-delay: 1.7s;
  }
  #process-flowchart text:nth-of-type(6),
  #process-flowchart foreignObject:nth-of-type(6) {
    animation-delay: 2s;
  }
  #process-flowchart text:nth-of-type(7),
  #process-flowchart foreignObject:nth-of-type(7) {
    animation-delay: 2.3s;
  }
  #process-flowchart text:nth-of-type(8),
  #process-flowchart foreignObject:nth-of-type(8) {
    animation-delay: 2.6s;
  }
  #process-flowchart text:nth-of-type(9),
  #process-flowchart foreignObject:nth-of-type(9) {
    animation-delay: 2.9s;
  }
  #process-flowchart text:nth-of-type(10),
  #process-flowchart foreignObject:nth-of-type(10) {
    animation-delay: 3.2s;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
</style>
