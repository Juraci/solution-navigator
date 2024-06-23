import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ConfirmationService from 'primevue/confirmationservice';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router';

import './assets/app.css';

// PrimeVue
import 'primevue/resources/themes/aura-dark-noir/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(pinia);

app.mount('#app');
