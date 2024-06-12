import { createApp } from 'vue';
import { createPinia } from 'pinia';
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
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(createPinia());

app.mount('#app');
