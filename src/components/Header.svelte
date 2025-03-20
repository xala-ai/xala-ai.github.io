<script lang="ts">
  import { writable } from 'svelte/store';
  import Icon from '@iconify/svelte';
  import ThemeController from './ThemeController.svelte';
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
  
  // Animated logo icon based on theme
  $: logoIcon = $theme === 'executive' 
    ? 'ri:turtle-fill' 
    : 'fa-solid:dragon';
</script>

<header class="py-4 backdrop-blur-md bg-opacity-80 shadow-md transition-all duration-300
  theme-vice-city:bg-vc-dark theme-vice-city:border-b theme-vice-city:border-vc-pink/30
  theme-light:bg-white theme-light:border-b theme-light:border
  theme-executive:bg-exec-bg theme-executive:border-b theme-executive:border-exec-primary/30">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="relative w-10 h-10 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full animate-pulse-slow"
            class:bg-vc-gradient={$theme === 'vice-city'}
            class:bg-light-gradient={$theme === 'light'}
            class:bg-exec-gradient={$theme === 'executive'}
          ></div>
          <Icon 
            icon={logoIcon} 
            class="text-2xl z-10 text-white drop-shadow-lg transform transition-transform duration-700 hover:scale-110" 
          />
        </div>
        <div>
          <h1 class="text-xl font-light tracking-wide">
            <span class="font-semibold bg-clip-text text-transparent"
              class:bg-vc-gradient={$theme === 'vice-city'}
              class:bg-light-gradient={$theme === 'light'}
              class:bg-exec-gradient={$theme === 'executive'}
            >Xala</span>
            <span class="text-theme">AI</span>
          </h1>
          <p class="text-xs opacity-70 -mt-1 text-theme">Information Distillation</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-6">
        <nav class="hidden md:flex space-x-6 text-sm font-light">
          <a href="#" class="transition-all duration-300 hover:opacity-100 opacity-80 relative group text-theme">
            Home
            <span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              class:bg-vc-pink={$theme === 'vice-city'}
              class:bg-vc-blue={$theme === 'light'}
              class:bg-exec-primary={$theme === 'executive'}></span>
          </a>
          <a href="#story" class="transition-all duration-300 hover:opacity-100 opacity-80 relative group text-theme">
            Our Story
            <span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              class:bg-vc-pink={$theme === 'vice-city'}
              class:bg-vc-blue={$theme === 'light'}
              class:bg-exec-primary={$theme === 'executive'}></span>
          </a>
          <a href="#features" class="transition-all duration-300 hover:opacity-100 opacity-80 relative group text-theme">
            Features
            <span class="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              class:bg-vc-pink={$theme === 'vice-city'}
              class:bg-vc-blue={$theme === 'light'}
              class:bg-exec-primary={$theme === 'executive'}></span>
          </a>
        </nav>
        
        <ThemeController />
        
        <button class="px-4 py-2 rounded-full shadow-lg transition-all duration-300 text-white text-sm"
          class:bg-vc-gradient={$theme === 'vice-city'}
          class:bg-light-gradient={$theme === 'light'}
          class:bg-exec-gradient={$theme === 'executive'}>
          <span class="flex items-center space-x-1">
            <Icon icon="material-symbols:upload-file" />
            <span>Upload PDF</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</header> 