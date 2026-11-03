import { createApp } from 'vue';
import App from './App.vue';
import { preloadRoute } from './preload';
import './style.css';

preloadRoute().finally(() => createApp(App).mount('#app'));
