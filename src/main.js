import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIcons from '@element-plus/icons';
import axios from 'axios';
import './assets/style.css';
import * as d3 from 'd3';

axios.defaults.baseURL = 'http://localhost:8080';

// 创建 Vue 应用
const app = createApp(App);

// 在挂载之前设置全局属性
app.config.globalProperties.$icons = ElementPlusIcons;
app.config.globalProperties.$d3 = d3;

// 使用插件
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

// 挂载应用
app.mount('#app');
