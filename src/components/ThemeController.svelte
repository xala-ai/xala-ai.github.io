<script lang="ts">
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  // Export theme as a store
  export const theme = writable('vice-city'); // Default theme

  function setTheme(newTheme: string) {
    theme.set(newTheme);
    document.body.className = `theme-${newTheme}`;
    localStorage.setItem('xalamander-theme', newTheme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('xalamander-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('vice-city');
    }
  }

  // Initialize theme when component mounts
  onMount(() => {
    initTheme();
  });
</script>

<div class="flex items-center space-x-2">
  <button
    class="relative p-2 rounded-full transition-all duration-300 hover:bg-opacity-20 hover:bg-vc-pink {$theme === 'vice-city' ? 'bg-vc-pink bg-opacity-20' : ''}"
    on:click={() => setTheme('vice-city')}
    aria-label="Vice City Theme"
    title="Vice City Theme"
  >
    <Icon 
      icon="material-symbols:nightlight-rounded" 
      class="text-lg {$theme === 'vice-city' ? 'text-vc-pink' : 'text-gray-400'}" 
      style={$theme === 'vice-city' ? 'filter: drop-shadow(0 0 3px rgba(255, 65, 180, 0.7))' : ''}
    />
  </button>
  
  <button
    class="relative p-2 rounded-full transition-all duration-300 hover:bg-opacity-20 hover:bg-vc-blue {$theme === 'light' ? 'bg-vc-blue bg-opacity-20' : ''}"
    on:click={() => setTheme('light')}
    aria-label="Light Theme"
    title="Light Theme"
  >
    <Icon 
      icon="material-symbols:wb-sunny-rounded" 
      class="text-lg {$theme === 'light' ? 'text-vc-blue' : 'text-gray-400'}" 
      style={$theme === 'light' ? 'filter: drop-shadow(0 0 3px rgba(0, 184, 255,.7))' : ''}
    />
  </button>
  
  <button
    class="relative p-2 rounded-full transition-all duration-300 hover:bg-opacity-20 hover:bg-exec-gold {$theme === 'executive' ? 'bg-exec-primary bg-opacity-20' : ''}"
    on:click={() => setTheme('executive')}
    aria-label="Executive Theme"
    title="Executive Theme"
  >
    <Icon 
      icon="material-symbols:diamond-rounded" 
      class="text-lg {$theme === 'executive' ? 'text-exec-secondary' : 'text-gray-400'}" 
      style={$theme === 'executive' ? 'filter: drop-shadow(0 0 3px rgba(215, 185, 142, 0.7))' : ''}
    />
  </button>
</div> 