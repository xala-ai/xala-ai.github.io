<script lang="ts">
  import { writable } from 'svelte/store';
  import Icon from '@iconify/svelte';
  
  // Local theme store
  const theme = writable('vice-city');
  
  // Initialize theme when component mounts
  import { onMount } from 'svelte';
  
  onMount(() => {
    const savedTheme = localStorage.getItem('xalamander-theme');
    if (savedTheme) {
      theme.set(savedTheme);
    }
  });
  
  const year = new Date().getFullYear();
</script>

<footer class="py-12 transition-all duration-300"
  class:bg-vc-dark={$theme === 'vice-city'}
  class:bg-white={$theme === 'light'}
  class:bg-exec-bg={$theme === 'executive'}>
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between items-start gap-8">
      <div class="max-w-xs">
        <div class="flex items-center space-x-2 mb-4">
          <div class="relative w-8 h-8 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full"
              class:bg-vc-gradient={$theme === 'vice-city'}
              class:bg-light-gradient={$theme === 'light'}
              class:bg-exec-gradient={$theme === 'executive'}
            ></div>
            <Icon 
              icon={$theme === 'executive' ? 'ri:turtle-fill' : 'fa-solid:dragon'} 
              class="text-xl z-10 text-white drop-shadow-lg" 
            />
          </div>
          <div>
            <h2 class="text-lg font-light">
              <span class="font-semibold bg-clip-text text-transparent"
                class:bg-vc-gradient={$theme === 'vice-city'}
                class:bg-light-gradient={$theme === 'light'}
                class:bg-exec-gradient={$theme === 'executive'}
              >Xala</span>
              <span class="text-theme">AI</span>
            </h2>
          </div>
        </div>
        <p class="text-sm text-theme opacity-70 mb-4">
          Transforming complex information into beautiful insights through our powerful AI-driven distillation technology.
        </p>
        <div class="flex space-x-4">
          <a href="#" class="text-theme opacity-60 hover:opacity-100 transition-opacity">
            <Icon icon="mdi:twitter" class="text-xl" />
          </a>
          <a href="#" class="text-theme opacity-60 hover:opacity-100 transition-opacity">
            <Icon icon="mdi:linkedin" class="text-xl" />
          </a>
          <a href="#" class="text-theme opacity-60 hover:opacity-100 transition-opacity">
            <Icon icon="mdi:github" class="text-xl" />
          </a>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-sm font-semibold mb-4 text-theme">Product</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Features</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Pricing</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Use Cases</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Roadmap</a></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold mb-4 text-theme">Company</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">About</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Team</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Careers</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-sm font-semibold mb-4 text-theme">Resources</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Documentation</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">API</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Blog</a></li>
            <li><a href="#" class="text-sm text-theme opacity-70 hover:opacity-100 transition-opacity">Support</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="mt-12 pt-8 border-t border-theme border-opacity-10">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-xs text-theme opacity-60">
          &copy; {year} Xala AI. All rights reserved.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-xs text-theme opacity-60 hover:opacity-100 transition-opacity">Terms</a>
          <a href="#" class="text-xs text-theme opacity-60 hover:opacity-100 transition-opacity">Privacy</a>
          <a href="#" class="text-xs text-theme opacity-60 hover:opacity-100 transition-opacity">Cookies</a>
        </div>
      </div>
    </div>
  </div>
</footer> 