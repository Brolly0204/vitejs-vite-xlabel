import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import echarts from './plugins/echarts';
import antd from './plugins/antd';

const app = createApp(App);
app.use(router);
app.use(echarts).use(antd);
app.mount('#app');
